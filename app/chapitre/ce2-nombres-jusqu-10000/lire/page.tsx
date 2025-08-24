'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, Play, Pause, CheckCircle, XCircle, RotateCcw, Volume2 } from 'lucide-react';

export default function LireNombresCE2Page() {
  const [selectedNumber, setSelectedNumber] = useState('2345');
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentExercise, setCurrentExercise] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [exerciseResults, setExerciseResults] = useState<boolean[]>([]);
  const [showExercises, setShowExercises] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredCorrectly, setAnsweredCorrectly] = useState<Set<number>>(new Set());
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [finalScore, setFinalScore] = useState(0);

  // États pour le système audio et animations
  const [isPlayingVocal, setIsPlayingVocal] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [characterSizeExpanded, setCharacterSizeExpanded] = useState(false);
  const [highlightedElement, setHighlightedElement] = useState<string | null>(null);

  // États pour le mini-jeu du "S"
  const [gameStarted, setGameStarted] = useState(false);
  const [gameScore, setGameScore] = useState(0);
  const [gameStreak, setGameStreak] = useState(0);
  const [currentGameNumber, setCurrentGameNumber] = useState<any>(null);

  const [gameAnswer, setGameAnswer] = useState<boolean | null>(null);
  const [showGameResult, setShowGameResult] = useState(false);
  const [gameLevel, setGameLevel] = useState(1);
  
  // Refs pour contrôler les vocaux
  const stopSignalRef = useRef(false);
  const currentAudioRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Helper function pour trouver un nombre dans les deux listes
  const findNumber = (value: string) => {
    return numbers.find(n => n.value === value) || numbersWithS.find(n => n.value === value);
  };

  // Fonction pour arrêter tous les vocaux et animations
  const stopAllVocalsAndAnimations = () => {
    stopSignalRef.current = true;
    if (currentAudioRef.current) {
      speechSynthesis.cancel();
      currentAudioRef.current = null;
    }
    setIsPlayingVocal(false);
    setIsAnimating(false); // Arrêter aussi l'animation visuelle
    setHighlightedElement(null); // Arrêter la mise en évidence
  };

  // Fonction pour scroller vers un élément
  const scrollToElement = (elementId: string) => {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center',
        inline: 'nearest'
      });
    }
  };

  // Fonction pour mettre en évidence un élément
  const highlightElement = (elementId: string, duration: number = 3000) => {
    setHighlightedElement(elementId);
    setTimeout(() => {
      if (!stopSignalRef.current) {
        setHighlightedElement(null);
      }
    }, duration);
  };

  // Fonction pour faire clignoter plusieurs éléments un par un
  const highlightElementsSequentially = async (elementIds: string[], delayBetween: number = 800) => {
    for (const elementId of elementIds) {
      if (stopSignalRef.current) break;
      setHighlightedElement(elementId);
      await new Promise(resolve => setTimeout(resolve, delayBetween));
    }
    if (!stopSignalRef.current) {
      setHighlightedElement(null);
    }
  };

  // Fonction pour jouer un audio
  const playAudio = (text: string): Promise<void> => {
    return new Promise((resolve) => {
      if (stopSignalRef.current) {
        resolve();
        return;
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'fr-FR';
      utterance.rate = 0.9; // Un peu plus lent pour les explications
      utterance.pitch = 1.1; // Un peu plus aigu pour le style Minecraft
      
      currentAudioRef.current = utterance;

      utterance.onend = () => {
        resolve();
      };

      utterance.onerror = () => {
        console.error('Erreur synthèse vocale');
        resolve();
      };

      if (!stopSignalRef.current) {
        speechSynthesis.speak(utterance);
      } else {
        resolve();
      }
    });
  };

  // Animation spéciale pour les règles du "s" - PURE ANIMATION FLUIDE
  const animateCentsRule = async () => {
    setIsAnimating(true);
    
    // Scroll vers la section avec animation douce
    scrollToElement('cents-rule-section');
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Sélectionner tous les éléments à animer
    const centsElements = document.querySelectorAll('.cents-s-highlight');
    const vingtsElements = document.querySelectorAll('.vingts-s-highlight');
    const centsNoSElements = document.querySelectorAll('.cents-no-s-highlight');
    const vingtsNoSElements = document.querySelectorAll('.vingts-no-s-highlight');
    
    const allSElements = [...Array.from(centsElements), ...Array.from(vingtsElements)];
    const allNoSElements = [...Array.from(centsNoSElements), ...Array.from(vingtsNoSElements)];
    
    // Phase 1: Révélation progressive des éléments AVEC S (mouvement de vague)
    for (let i = 0; i < allSElements.length; i++) {
      if (stopSignalRef.current) break;
      
      const el = allSElements[i] as HTMLElement;
      
      // Animation fluide d'apparition
      el.style.transition = 'all 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)';
      el.style.transform = 'scale(2) translateY(-15px)';
      el.style.color = '#059669'; // vert émeraude
      el.style.fontWeight = '900';
      el.style.textShadow = '0 0 20px #10b981, 0 0 40px #34d399';
      el.style.backgroundColor = 'rgba(16, 185, 129, 0.1)';
      el.style.borderRadius = '12px';
      el.style.padding = '6px 12px';
      el.style.border = '2px solid #10b981';
      
      await new Promise(resolve => setTimeout(resolve, 400)); // Délai entre chaque S
    }
    
    // Pause pour admirer
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Phase 2: Animation des éléments SANS S (contraste)
    for (let i = 0; i < allNoSElements.length; i++) {
      if (stopSignalRef.current) break;
      
      const el = allNoSElements[i] as HTMLElement;
      
      el.style.transition = 'all 1s ease-out';
      el.style.transform = 'scale(1.8) translateY(-8px)';
      el.style.color = '#f59e0b'; // orange
      el.style.fontWeight = '900';
      el.style.textShadow = '0 0 15px #fbbf24, 0 0 30px #f59e0b';
      el.style.backgroundColor = 'rgba(245, 158, 11, 0.1)';
      el.style.borderRadius = '8px';
      el.style.padding = '4px 8px';
      el.style.border = '2px solid #f59e0b';
      
      await new Promise(resolve => setTimeout(resolve, 350));
    }
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Phase 3: Animation de danse synchronisée (mouvement de vague)
    for (let cycle = 0; cycle < 3; cycle++) {
      if (stopSignalRef.current) break;
      
      // Vague montante - S en premier
      for (let i = 0; i < allSElements.length; i++) {
        if (stopSignalRef.current) break;
        const el = allSElements[i] as HTMLElement;
        el.style.transform = 'scale(2.5) translateY(-25px) rotate(10deg)';
        el.style.textShadow = '0 0 25px #10b981, 0 0 50px #34d399';
        await new Promise(resolve => setTimeout(resolve, 200));
      }
      
      // Puis les tirets
      for (let i = 0; i < allNoSElements.length; i++) {
        if (stopSignalRef.current) break;
        const el = allNoSElements[i] as HTMLElement;
        el.style.transform = 'scale(2.2) translateY(-20px) rotate(-8deg)';
        el.style.textShadow = '0 0 20px #fbbf24, 0 0 40px #f59e0b';
        await new Promise(resolve => setTimeout(resolve, 180));
      }
      
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Vague descendante
      const allElements = [...allSElements, ...allNoSElements];
      for (let i = allElements.length - 1; i >= 0; i--) {
        if (stopSignalRef.current) break;
        const el = allElements[i] as HTMLElement;
        el.style.transform = el.style.transform.includes('scale(2.5)') 
          ? 'scale(2) translateY(-15px) rotate(0deg)'
          : 'scale(1.8) translateY(-8px) rotate(0deg)';
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      await new Promise(resolve => setTimeout(resolve, 400));
    }
    
    // Phase 4: Animation finale en spirale
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Créer un effet de spirale avec tous les éléments
    const allElements = [...allSElements, ...allNoSElements];
    for (let i = 0; i < allElements.length; i++) {
      if (stopSignalRef.current) break;
      
      const el = allElements[i] as HTMLElement;
      const angle = (i * 45) % 360; // Rotation différente pour chaque élément
      
      el.style.transition = 'all 1.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
      el.style.transform = `scale(2.8) translateY(-30px) rotate(${angle}deg)`;
      
      // Couleur dynamique selon la position
      if (allSElements.includes(el)) {
        el.style.color = i % 2 === 0 ? '#dc2626' : '#059669';
        el.style.textShadow = i % 2 === 0 ? '0 0 30px #dc2626' : '0 0 30px #059669';
      } else {
        el.style.color = '#f59e0b';
        el.style.textShadow = '0 0 25px #fbbf24';
      }
      
      await new Promise(resolve => setTimeout(resolve, 250));
    }
    
    // Maintenir la spirale pendant un moment
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Phase 5: Retour gracieux à la normale
    for (let i = 0; i < allElements.length; i++) {
      if (stopSignalRef.current) break;
      
      const el = allElements[i] as HTMLElement;
      el.style.transition = 'all 2s ease-out';
      el.style.transform = '';
      el.style.color = '';
      el.style.fontWeight = '';
      el.style.textShadow = '';
      el.style.backgroundColor = '';
      el.style.borderRadius = '';
      el.style.padding = '';
      el.style.border = '';
      
      await new Promise(resolve => setTimeout(resolve, 150));
    }
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsAnimating(false);
  };









  // 🎮 DONNÉES ET FONCTIONS DU MINI-JEU DU "S"
  const gameNumbers = [
    // Cas simples
    { value: '80', reading: 'quatre-vingts', hasS: true, explanation: 'Quatre-vingt exact = S' },
    { value: '83', reading: 'quatre-vingt-trois', hasS: false, explanation: 'Suivi de "trois" = pas de S' },
    { value: '200', reading: 'deux-cents', hasS: true, explanation: 'Centaine exacte = S' },
    { value: '205', reading: 'deux-cent-cinq', hasS: false, explanation: 'Suivi de "cinq" = pas de S' },
    
    // Cas avec milliers
    { value: '1080', reading: 'mille-quatre-vingts', hasS: true, explanation: 'Quatre-vingt exact après mille = S' },
    { value: '1083', reading: 'mille-quatre-vingt-trois', hasS: false, explanation: 'Suivi de "trois" après mille = pas de S' },
    { value: '1200', reading: 'mille-deux-cents', hasS: true, explanation: 'Centaine exacte après mille = S' },
    { value: '1205', reading: 'mille-deux-cent-cinq', hasS: false, explanation: 'Suivi de "cinq" après mille = pas de S' },
    
    // Cas complexes avec milliers
    { value: '2080', reading: 'deux-mille-quatre-vingts', hasS: true, explanation: 'Quatre-vingt exact après deux-mille = S' },
    { value: '2083', reading: 'deux-mille-quatre-vingt-trois', hasS: false, explanation: 'Suivi de "trois" après deux-mille = pas de S' },
    { value: '3200', reading: 'trois-mille-deux-cents', hasS: true, explanation: 'Centaine exacte après trois-mille = S' },
    { value: '3205', reading: 'trois-mille-deux-cent-cinq', hasS: false, explanation: 'Suivi de "cinq" après trois-mille = pas de S' },
    
    // Cas très complexes
    { value: '4480', reading: 'quatre-mille-quatre-cent-quatre-vingts', hasS: true, explanation: 'Quatre-vingt exact à la fin = S' },
    { value: '4483', reading: 'quatre-mille-quatre-cent-quatre-vingt-trois', hasS: false, explanation: 'Suivi de "trois" à la fin = pas de S' },
    { value: '5580', reading: 'cinq-mille-cinq-cent-quatre-vingts', hasS: true, explanation: 'Quatre-vingt exact à la fin = S' },
    { value: '5590', reading: 'cinq-mille-cinq-cent-quatre-vingt-dix', hasS: false, explanation: 'Suivi de "dix" à la fin = pas de S' }
  ];

  const getRandomGameNumber = () => {
    const availableNumbers = gameNumbers.filter(num => !currentGameNumber || num.value !== currentGameNumber.value);
    return availableNumbers[Math.floor(Math.random() * availableNumbers.length)];
  };

  const startGame = () => {
    setGameStarted(true);
    setGameScore(0);
    setGameStreak(0);
    setGameLevel(1);
    setCurrentGameNumber(getRandomGameNumber());
    setGameAnswer(null);
    setShowGameResult(false);
  };

  const submitGameAnswer = async (playerAnswer: boolean) => {
    setGameAnswer(playerAnswer);
    setShowGameResult(true);
    
    const isCorrect = playerAnswer === currentGameNumber.hasS;
    
    if (isCorrect) {
      setGameScore(prev => prev + 1);
      setGameStreak(prev => prev + 1);
      
      // Niveau up tous les 5 bonnes réponses
      if ((gameScore + 1) % 5 === 0) {
        setGameLevel(prev => prev + 1);
      }
      
      // Animation de succès
      await playAudio("Bravo ! C'est exact !");
    } else {
      setGameStreak(0);
      await playAudio("Oups ! Pas tout à fait...");
    }
    
    // Attendre un peu puis proposer un nouveau nombre
    setTimeout(() => {
      setCurrentGameNumber(getRandomGameNumber());
      setGameAnswer(null);
      setShowGameResult(false);
    }, 2500);
  };

  const resetGame = () => {
    setGameStarted(false);
    setGameScore(0);
    setGameStreak(0);
    setGameLevel(1);
    setCurrentGameNumber(null);
    setGameAnswer(null);
    setShowGameResult(false);
  };

  // Fonction pour expliquer le chapitre au démarrage - SELON READMEANIM
  const explainChapter = async () => {
    stopSignalRef.current = false;
    setIsPlayingVocal(true);
    setHasStarted(true);
    setCharacterSizeExpanded(true);

    try {
      if (showExercises) {
        // TUTORIEL EXERCICES - READMEANIM
        await playAudio("Salut petit mineur ! Bienvenue dans l'arène de lecture des nombres jusqu'à 10000 !");
        if (stopSignalRef.current) return;
        await new Promise(resolve => setTimeout(resolve, 500));
        
        await playAudio("Objectif de ta quête : maîtriser la lecture des grands nombres !");
        if (stopSignalRef.current) return;
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Parcourir les éléments d'exercices
        scrollToElement('score-section');
        await playAudio("Voici ton tableau de score ! Tes points s'affichent ici !");
        highlightElement('score-display', 3000);
        if (stopSignalRef.current) return;
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        scrollToElement('exercise-question');
        await playAudio("Ici apparaît le nombre mystère que tu dois lire !");
        highlightElement('mystery-number', 3000);
        if (stopSignalRef.current) return;
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        await playAudio("Tu écris ta réponse dans cette zone de saisie !");
        highlightElement('answer-input', 3000);
        if (stopSignalRef.current) return;
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        await playAudio("Le bouton effacer, c'est pour recommencer si tu te trompes !");
        highlightElement('erase-button', 2500);
        if (stopSignalRef.current) return;
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        scrollToElement('navigation-buttons');
        // Détection dynamique des boutons
        const hasNextButton = document.getElementById('next-button');
        const hasPreviousButton = document.getElementById('previous-button');
        
        if (hasNextButton && hasPreviousButton) {
          await playAudio("Les boutons Précédent et Suivant, c'est pour naviguer entre les exercices !");
          await highlightElementsSequentially(['previous-button', 'next-button'], 1000);
        }
        if (stopSignalRef.current) return;
        await new Promise(resolve => setTimeout(resolve, 500));
        
        scrollToElement('tab-navigation');
        await playAudio("Et voici les onglets : Cours pour apprendre, Exercices pour t'entraîner !");
        await highlightElementsSequentially(['tab-cours', 'tab-exercices'], 1000);
        
      } else {
        // TUTORIEL COURS - READMEANIM
        await playAudio("Salut petit crafteur ! Bienvenue dans l'atelier des nombres jusqu'à 10000 !");
        if (stopSignalRef.current) return;
        await new Promise(resolve => setTimeout(resolve, 500));
        
        await playAudio("Objectif : découvrir comment lire et écrire tous les nombres jusqu'à 10000 !");
        if (stopSignalRef.current) return;
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Parcourir les éléments du cours
        scrollToElement('number-selector');
        await playAudio("Voici le sélecteur de nombres ! Clique sur un nombre pour l'explorer !");
        highlightElement('number-selector', 3000);
        if (stopSignalRef.current) return;
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Animation non agressive des boutons de nombres
        await playAudio("Regarde tous ces nombres disponibles !");
        const numberButtonIds = ['number-btn-0', 'number-btn-1', 'number-btn-2', 'number-btn-3', 'number-btn-4', 'number-btn-5'];
        await highlightElementsSequentially(numberButtonIds, 600); // Non agressif : 600ms entre chaque
        if (stopSignalRef.current) return;
        await new Promise(resolve => setTimeout(resolve, 800));
        
        scrollToElement('animation-section');
        // Pour CE2, on mentionne les milliers
        await playAudio("Cette zone montre la décomposition du nombre en milliers, centaines, dizaines et unités !");
        highlightElement('animation-section', 3000);
        if (stopSignalRef.current) return;
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        await playAudio("Le bouton Animer, c'est pour voir la décomposition en mouvement !");
        highlightElement('animation-button', 2500);
        if (stopSignalRef.current) return;
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        scrollToElement('reading-section');
        await playAudio("Ici tu découvres comment se lit le nombre en français !");
        highlightElement('reading-section', 3000);
        if (stopSignalRef.current) return;
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        await playAudio("Le bouton écouter, c'est pour entendre la prononciation !");
        highlightElement('listen-button', 2500);
        if (stopSignalRef.current) return;
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        scrollToElement('traps-selector');
        await playAudio("Et voici les pièges du S ! La règle magique des nombres français !");
        highlightElement('traps-selector', 3000);
        if (stopSignalRef.current) return;
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        await playAudio("80 et 200 prennent un S car ils sont exacts, mais 83 et 205 n'en prennent pas !");
        await highlightElementsSequentially(['paire-80-83', 'paire-200-205', 'paire-300-305'], 1200);
        if (stopSignalRef.current) return;
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Section défi du S
        await playAudio("Et tu peux tester tes connaissances avec le défi du S !");
        highlightElement('start-game-button', 2500);
        if (stopSignalRef.current) return;
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        await playAudio("Appuie sur le bouton Commencer le Défi pour choisir un nombre à découvrir !");
        highlightElement('start-game-button', 2500);
        if (stopSignalRef.current) return;
        await new Promise(resolve => setTimeout(resolve, 500));
        
        scrollToElement('tab-navigation');
        await playAudio("N'oublie pas : onglet Cours pour apprendre, onglet Exercices pour t'entraîner !");
        await highlightElementsSequentially(['tab-cours', 'tab-exercices'], 1000);
      }

    } catch (error) {
      console.error('Erreur dans explainChapter:', error);
    } finally {
      setIsPlayingVocal(false);
    }
  };

  // Sauvegarder les progrès dans localStorage
  const saveProgress = (score: number, maxScore: number) => {
    const progress = {
      sectionId: 'lire',
      completed: true,
      score: score,
      maxScore: maxScore,
      completedAt: new Date().toISOString(),
      attempts: 1
    };

    const existingProgress = localStorage.getItem('ce2-nombres-progress');
    let allProgress = [];
    
    if (existingProgress) {
      allProgress = JSON.parse(existingProgress);
      const existingIndex = allProgress.findIndex((p: any) => p.sectionId === 'lire');
      
      if (existingIndex >= 0) {
        if (score > allProgress[existingIndex].score) {
          allProgress[existingIndex] = {
            ...progress,
            attempts: allProgress[existingIndex].attempts + 1
          };
        } else {
          allProgress[existingIndex].attempts += 1;
        }
      } else {
        allProgress.push(progress);
      }
    } else {
      allProgress = [progress];
    }

    localStorage.setItem('ce2-nombres-progress', JSON.stringify(allProgress));
  };

  const numbers = [
    { value: '2345', label: '2345', reading: 'Deux-mille-trois-cent-quarante-cinq', hasS: false },
    { value: '1089', label: '1089', reading: 'Mille-quatre-vingt-neuf', hasS: false },
    { value: '5678', label: '5678', reading: 'Cinq-mille-six-cent-soixante-dix-huit', hasS: false },
    { value: '4123', label: '4123', reading: 'Quatre-mille-cent-vingt-trois', hasS: false },
    { value: '7694', label: '7694', reading: 'Sept-mille-six-cent-quatre-vingt-quatorze', hasS: false },
    { value: '9978', label: '9978', reading: 'Neuf-mille-neuf-cent-soixante-dix-huit', hasS: false }
  ];

  const numbersWithS = [
    // Cas simples
    { value: '80', label: '80', reading: 'Quatre-vingts', hasS: true },
    { value: '83', label: '83', reading: 'Quatre-vingt-trois', hasS: false },
    { value: '200', label: '200', reading: 'Deux-cents', hasS: true },
    { value: '205', label: '205', reading: 'Deux-cent-cinq', hasS: false },
    // Cas avec milliers
    { value: '1080', label: '1080', reading: 'Mille-quatre-vingts', hasS: true },
    { value: '1083', label: '1083', reading: 'Mille-quatre-vingt-trois', hasS: false },
    { value: '2200', label: '2200', reading: 'Deux-mille-deux-cents', hasS: true },
    { value: '2205', label: '2205', reading: 'Deux-mille-deux-cent-cinq', hasS: false },
    { value: '3080', label: '3080', reading: 'Trois-mille-quatre-vingts', hasS: true },
    { value: '3083', label: '3083', reading: 'Trois-mille-quatre-vingt-trois', hasS: false }
  ];

  const exercises = [
    // Mélange de cas simples et complexes
    { number: '1080', reading: 'Mille-quatre-vingts' },                    // avec S (quatre-vingts)
    { number: '2345', reading: 'Deux-mille-trois-cent-quarante-cinq' },    // sans S (suivi de cinq)
    { number: '3200', reading: 'Trois-mille-deux-cents' },                 // avec S (cents exact)
    { number: '1083', reading: 'Mille-quatre-vingt-trois' },              // sans S (quatre-vingt-trois)
    { number: '4580', reading: 'Quatre-mille-cinq-cent-quatre-vingts' },   // avec S (quatre-vingts)
    { number: '2091', reading: 'Deux-mille-quatre-vingt-onze' },          // sans S (quatre-vingt-onze)
    { number: '6400', reading: 'Six-mille-quatre-cents' },                // avec S (cents exact)
    { number: '3180', reading: 'Trois-mille-cent-quatre-vingts' },        // avec S (quatre-vingts)
    { number: '5283', reading: 'Cinq-mille-deux-cent-quatre-vingt-trois' }, // sans S (quatre-vingt-trois)
    { number: '7600', reading: 'Sept-mille-six-cents' },                  // avec S (cents exact)
    { number: '8090', reading: 'Huit-mille-quatre-vingt-dix' },          // sans S (quatre-vingt-dix)
    { number: '1480', reading: 'Mille-quatre-cent-quatre-vingts' },       // avec S (quatre-vingts)
    { number: '9205', reading: 'Neuf-mille-deux-cent-cinq' },            // sans S (cent-cinq)
    { number: '4800', reading: 'Quatre-mille-huit-cents' },              // avec S (cents exact)
    { number: '2380', reading: 'Deux-mille-trois-cent-quatre-vingts' },   // avec S (quatre-vingts)
    { number: '6083', reading: 'Six-mille-quatre-vingt-trois' },         // sans S (quatre-vingt-trois)
    { number: '7300', reading: 'Sept-mille-trois-cents' },               // avec S (cents exact)
    { number: '5480', reading: 'Cinq-mille-quatre-cent-quatre-vingts' },  // avec S (quatre-vingts)
    { number: '8191', reading: 'Huit-mille-cent-quatre-vingt-onze' },    // sans S (quatre-vingt-onze)
    { number: '9900', reading: 'Neuf-mille-neuf-cents' }                 // avec S (cents exact)
  ];

  const formatNumber = (num: string) => {
    return num;
  };

  const speakNumber = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'fr-FR';
      utterance.rate = 1.0;
      speechSynthesis.speak(utterance);
    }
  };

  const animateNumber = async () => {
    setIsAnimating(true);
    stopSignalRef.current = false; // Réinitialiser le signal d'arrêt
    
    // Nettoyer d'abord le tableau
    const tableElements = {
      unites: document.getElementById('unites-value'),
      dizaines: document.getElementById('dizaines-value'),
      centaines: document.getElementById('centaines-value')
    };

    // Masquer temporairement les chiffres dans le tableau
    Object.values(tableElements).forEach(el => {
      if (el) {
        el.style.opacity = '0';
      }
    });

    await new Promise(resolve => setTimeout(resolve, 500));

    // Créer l'animation de glissement pour chaque chiffre
    const animateDigit = async (digitIndex: number, targetId: string, delay: number) => {
      const sourceElement = document.getElementById(`source-digit-${digitIndex}`);
      const targetElement = document.getElementById(targetId);
      
      if (!sourceElement || !targetElement) return;

      // Créer un chiffre volant
      const flyingDigit = sourceElement.cloneNode(true) as HTMLElement;
      flyingDigit.id = `flying-digit-${digitIndex}`;
      flyingDigit.style.position = 'absolute';
      flyingDigit.style.zIndex = '1000';
      flyingDigit.style.backgroundColor = '#FEF3C7'; // bg-yellow-100
      flyingDigit.style.transform = 'scale(1.2)';
      flyingDigit.style.boxShadow = '0 10px 25px rgba(0,0,0,0.3)';
      
      // Positionner le chiffre volant à la position source
      const sourceRect = sourceElement.getBoundingClientRect();
      const containerRect = document.body.getBoundingClientRect();
      flyingDigit.style.left = `${sourceRect.left - containerRect.left}px`;
      flyingDigit.style.top = `${sourceRect.top - containerRect.top}px`;
      
      document.body.appendChild(flyingDigit);

      // Attendre le délai
      await new Promise(resolve => setTimeout(resolve, delay));

      // Mettre en surbrillance le chiffre source
      sourceElement.classList.add('animate-pulse', 'bg-yellow-200', 'scale-110');

      await new Promise(resolve => setTimeout(resolve, 500));

      // Calculer la position de destination
      const targetRect = targetElement.getBoundingClientRect();
      const deltaX = targetRect.left - sourceRect.left;
      const deltaY = targetRect.top - sourceRect.top;

      // Animer le déplacement
      flyingDigit.style.transition = 'transform 1.5s ease-in-out';
      flyingDigit.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(1.5)`;

      // Attendre que l'animation soit terminée
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Révéler le chiffre dans le tableau avec animation
      const targetValueElement = document.getElementById(targetId);
      if (targetValueElement) {
        targetValueElement.style.opacity = '1';
        targetValueElement.style.transform = 'scale(1.2)';
        targetValueElement.style.color = '#059669'; // text-green-600
        
        // Mettre en surbrillance la cellule
        const cellId = targetId.replace('-value', '-cell');
        const targetCell = document.getElementById(cellId);
        if (targetCell) {
          targetCell.classList.add('bg-yellow-200', 'animate-pulse');
        }
      }

      // Supprimer le chiffre volant
      document.body.removeChild(flyingDigit);

      // Remettre le chiffre source normal
      sourceElement.classList.remove('animate-pulse', 'bg-yellow-200', 'scale-110');

      await new Promise(resolve => setTimeout(resolve, 800));

      // Remettre les styles normaux
      if (targetValueElement) {
        targetValueElement.style.transform = 'scale(1)';
        targetValueElement.style.color = '#065F46'; // text-green-900
      }
      
      const cellId = targetId.replace('-value', '-cell');
      const targetCell = document.getElementById(cellId);
      if (targetCell) {
        targetCell.classList.remove('bg-yellow-200', 'animate-pulse');
      }
    };

    // Animer dans l'ordre : unités, dizaines, centaines
    const digits = selectedNumber.split('');
    
    // Fonction pour convertir les chiffres en français
    const digitToFrench = (digit: string) => {
      const map: {[key: string]: string} = {
        '0': 'zéro', '1': 'un', '2': 'deux', '3': 'trois', '4': 'quatre',
        '5': 'cinq', '6': 'six', '7': 'sept', '8': 'huit', '9': 'neuf'
      };
      return map[digit] || digit;
    };

    // Fonction pour convertir les dizaines en français
    const tensToFrench = (digit: string) => {
      const map: {[key: string]: string} = {
        '0': 'zéro', '1': 'dix', '2': 'vingt', '3': 'trente', '4': 'quarante',
        '5': 'cinquante', '6': 'soixante', '7': 'soixante-dix', '8': 'quatre-vingts', '9': 'quatre-vingt-dix'
      };
      return map[digit] || digit;
    };

    // Fonction pour l'explication des dizaines
    const getTensExplanation = (digit: string) => {
      if (digit === '0') return 'zéro dizaine égale zéro';
      if (digit === '1') return '1 dizaine égale dix';
      return `${digit} dizaines égale ${tensToFrench(digit)}`;
    };

    // Fonction pour convertir les centaines en français
    const hundredsToFrench = (digit: string) => {
      if (digit === '1') return 'cent';
      if (digit === '0') return 'zéro cent';
      return digitToFrench(digit) + ' cents';
    };

    // Fonction pour convertir les milliers en français
    const thousandsToFrench = (digit: string) => {
      if (digit === '1') return 'mille';
      if (digit === '0') return 'zéro mille';
      return digitToFrench(digit) + ' mille';
    };

    // Fonction pour l'explication des unités
    const getUnitsExplanation = (digit: string) => {
      const unitText = digitToFrench(digit);
      if (digit === '1') return '1 unité égale un';
      return `${digit} unités égale ${unitText}`;
    };

    // Fonction pour l'explication des centaines
    const getHundredsExplanation = (digit: string) => {
      if (digit === '0') return 'zéro centaine égale zéro cent';
      if (digit === '1') return '1 centaine égale cent';
      const hundredText = hundredsToFrench(digit);
      return `${digit} centaines égale ${hundredText}`;
    };

    // Fonction pour l'explication des milliers
    const getThousandsExplanation = (digit: string) => {
      if (digit === '0') return 'zéro millier égale zéro mille';
      if (digit === '1') return '1 millier égale mille';
      const thousandText = thousandsToFrench(digit);
      return `${digit} milliers égale ${thousandText}`;
    };
    
    // 1. Unités (dernier chiffre)
    await animateDigit(digits.length - 1, 'unites-value', 0);
    if (!stopSignalRef.current) {
      setIsPlayingVocal(true);
      const unitDigit = digits[digits.length - 1];
      const explanation = getUnitsExplanation(unitDigit);
      await playAudio(explanation);
      setIsPlayingVocal(false);
      if (!stopSignalRef.current) {
        await new Promise(resolve => setTimeout(resolve, 300));
      }
    }
    
    // 2. Dizaines (avant-dernier chiffre)
    if (digits.length >= 2 && !stopSignalRef.current) {
      await animateDigit(digits.length - 2, 'dizaines-value', 0);
      if (!stopSignalRef.current) {
        setIsPlayingVocal(true);
        const tenDigit = digits[digits.length - 2];
        const explanation = getTensExplanation(tenDigit);
        await playAudio(explanation);
        setIsPlayingVocal(false);
        if (!stopSignalRef.current) {
          await new Promise(resolve => setTimeout(resolve, 300));
        }
      }
    }
    
    // 3. Centaines (troisième chiffre en partant de la droite)
    if (digits.length >= 3 && !stopSignalRef.current) {
      await animateDigit(digits.length - 3, 'centaines-value', 0);
      if (!stopSignalRef.current) {
        setIsPlayingVocal(true);
        const hundredDigit = digits[digits.length - 3];
        const explanation = getHundredsExplanation(hundredDigit);
        await playAudio(explanation);
        setIsPlayingVocal(false);
        if (!stopSignalRef.current) {
          await new Promise(resolve => setTimeout(resolve, 300));
        }
      }
    }

    // 4. Milliers (premier chiffre)
    if (digits.length >= 4 && !stopSignalRef.current) {
      await animateDigit(digits.length - 4, 'milliers-value', 0);
      if (!stopSignalRef.current) {
        setIsPlayingVocal(true);
        const thousandDigit = digits[digits.length - 4];
        const explanation = getThousandsExplanation(thousandDigit);
        await playAudio(explanation);
        setIsPlayingVocal(false);
        if (!stopSignalRef.current) {
          await new Promise(resolve => setTimeout(resolve, 300));
        }
      }
    }

    // Conclusion vocale avec le nombre complet
    if (!stopSignalRef.current) {
      setIsPlayingVocal(true);
      const completeReading = findNumber(selectedNumber)?.reading || selectedNumber;
      const conclusionText = `Et donc, ${selectedNumber} se lit ${completeReading} !`;
      await playAudio(conclusionText);
      setIsPlayingVocal(false);
    }

    // Remettre l'opacité normale pour tous les chiffres
    Object.values(tableElements).forEach(el => {
      if (el) {
        el.style.opacity = '1';
      }
    });
    
    setIsAnimating(false);
  };

  const handleNext = () => {
    // Si aucune réponse vérifiée encore, on vérifie
    if (isCorrect === null) {
      const normalizeText = (text: string) => {
        // Supprimer les espaces en début et fin, mettre en minuscules
        return text.toLowerCase().trim().replace(/\s+/g, ' ');
      };

      const createVariants = (text: string) => {
        const normalized = normalizeText(text);
        // Version avec tirets (nouvelle orthographe)
        const withDashes = normalized.replace(/\s/g, '-');
        // Version sans tirets (ancienne orthographe)  
        const withoutDashes = normalized.replace(/-/g, ' ').replace(/\s+/g, ' ');
        return [normalized, withDashes, withoutDashes];
      };

      const userNormalized = normalizeText(userAnswer);
      const correctVariants = createVariants(exercises[currentExercise].reading);
      
      // Accepter si la réponse correspond à l'une des variantes officielles
      const correct = correctVariants.some(variant => 
        userNormalized === variant || 
        userNormalized === variant.replace(/-/g, ' ').replace(/\s+/g, ' ')
      );
      setIsCorrect(correct);
      
      if (correct && !answeredCorrectly.has(currentExercise)) {
        setScore(prevScore => prevScore + 1);
        setAnsweredCorrectly(prev => {
          const newSet = new Set(prev);
          newSet.add(currentExercise);
          return newSet;
        });
        const newResults = [...exerciseResults];
        newResults[currentExercise] = true;
        setExerciseResults(newResults);
      } else {
        const newResults = [...exerciseResults];
        newResults[currentExercise] = false;
        setExerciseResults(newResults);
      }

      // Si bonne réponse → passage automatique après 1.5s
      if (correct) {
        setTimeout(() => {
          if (currentExercise + 1 < exercises.length) {
            setCurrentExercise(Math.min(currentExercise + 1, exercises.length - 1));
            setUserAnswer('');
            setIsCorrect(null);
          } else {
            // Dernier exercice terminé, afficher la modale
            const finalScoreValue = score + (!answeredCorrectly.has(currentExercise) ? 1 : 0);
            setFinalScore(finalScoreValue);
            setShowCompletionModal(true);
            
            // Sauvegarder les progrès
            saveProgress(finalScoreValue, exercises.length);
          }
        }, 1500);
      }
      // Si mauvaise réponse, on affiche la correction et on attend le clic suivant
    } else {
      // Réponse déjà vérifiée, on passe au suivant
      if (currentExercise + 1 < exercises.length) {
        setCurrentExercise(Math.min(currentExercise + 1, exercises.length - 1));
        setUserAnswer('');
        setIsCorrect(null);
      } else {
        // Dernier exercice, afficher la modale
        setFinalScore(score);
        setShowCompletionModal(true);
        
        // Sauvegarder les progrès
        saveProgress(score, exercises.length);
      }
    }
  };

  const nextExercise = () => {
    if (currentExercise < exercises.length - 1) {
      setCurrentExercise(currentExercise + 1);
      setUserAnswer('');
      setIsCorrect(null);
    }
  };

  const resetExercise = () => {
    setUserAnswer('');
    setIsCorrect(null);
  };

  const resetAll = () => {
    setCurrentExercise(0);
    setUserAnswer('');
    setIsCorrect(null);
    setExerciseResults([]);
    setScore(0);
    setAnsweredCorrectly(new Set());
    setShowCompletionModal(false);
    setFinalScore(0);
  };

  // Effet pour arrêter les vocaux lors du changement cours ↔ exercices
  useEffect(() => {
    stopAllVocalsAndAnimations();
  }, [showExercises]);

  return (
    <>
      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateX(-100px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        @keyframes pulseGlow {
          0%, 100% {
            box-shadow: 0 0 8px rgba(59, 130, 246, 0.3), 0 0 16px rgba(59, 130, 246, 0.1);
            transform: scale(1);
          }
          50% {
            box-shadow: 0 0 12px rgba(59, 130, 246, 0.5), 0 0 24px rgba(59, 130, 246, 0.2);
            transform: scale(1.02);
          }
        }
        
        @keyframes pulseGlowGreen {
          0%, 100% {
            box-shadow: 0 0 8px rgba(34, 197, 94, 0.3), 0 0 16px rgba(34, 197, 94, 0.1);
            transform: scale(1);
          }
          50% {
            box-shadow: 0 0 12px rgba(34, 197, 94, 0.5), 0 0 24px rgba(34, 197, 94, 0.2);
            transform: scale(1.02);
          }
        }
        
        @keyframes pulseGlowYellow {
          0%, 100% {
            box-shadow: 0 0 8px rgba(234, 179, 8, 0.3), 0 0 16px rgba(234, 179, 8, 0.1);
            transform: scale(1);
          }
          50% {
            box-shadow: 0 0 12px rgba(234, 179, 8, 0.5), 0 0 24px rgba(234, 179, 8, 0.2);
            transform: scale(1.02);
          }
        }
        
        @keyframes pulseGlowGray {
          0%, 100% {
            box-shadow: 0 0 8px rgba(107, 114, 128, 0.3), 0 0 16px rgba(107, 114, 128, 0.1);
            transform: scale(1);
          }
          50% {
            box-shadow: 0 0 12px rgba(107, 114, 128, 0.5), 0 0 24px rgba(107, 114, 128, 0.2);
            transform: scale(1.02);
          }
        }
        
        .pulse-interactive {
          animation: pulseGlow 2.5s ease-in-out infinite;
          transition: all 0.3s ease;
        }
        
        .pulse-interactive-green {
          animation: pulseGlowGreen 2.5s ease-in-out infinite;
          transition: all 0.3s ease;
        }
        
        .pulse-interactive-yellow {
          animation: pulseGlowYellow 2.5s ease-in-out infinite;
          transition: all 0.3s ease;
        }
        
        .pulse-interactive-gray {
          animation: pulseGlowGray 2.5s ease-in-out infinite;
          transition: all 0.3s ease;
        }
        
        .flying-digit {
          animation: slideIn 0.5s ease-out;
        }
        
        .pulse-interactive:hover,
        .pulse-interactive-green:hover,
        .pulse-interactive-yellow:hover,
        .pulse-interactive-gray:hover {
          animation-duration: 1.5s;
        }
      `}</style>
      
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100">
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <Link href="/chapitre/ce2-nombres-jusqu-10000" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-4" onClick={stopAllVocalsAndAnimations}>
              <ArrowLeft className="w-4 h-4" />
              <span>Retour au chapitre</span>
            </Link>
            
            <div className="bg-white rounded-xl p-6 shadow-lg text-center">
                          <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-2 sm:mb-4">
              📚 Apprendre à lire et écrire des nombres
            </h1>
              <p className="text-sm sm:text-lg text-gray-600 hidden sm:block">
                Découvre comment lire tous les nombres jusqu'à 10000 !
              </p>
            </div>
          </div>

          {/* Navigation entre cours et exercices */}
          <div id="tab-navigation" className="flex justify-center mb-4 sm:mb-8">
            <div className="bg-white rounded-lg p-1 shadow-md">
              <button
                id="tab-cours"
                onClick={() => setShowExercises(false)}
                className={`px-3 sm:px-6 py-2 sm:py-3 text-sm sm:text-base rounded-lg font-bold transition-all pulse-interactive-yellow ${
                  !showExercises 
                    ? 'bg-orange-500 text-white shadow-md' 
                    : 'text-gray-600 hover:bg-gray-100'
                } ${highlightedElement === 'tab-cours' ? 'ring-4 ring-yellow-400 bg-yellow-200 scale-105' : ''}`}
              >
                📖 Cours
              </button>
              <button
                id="tab-exercices"
                onClick={() => setShowExercises(true)}
                className={`px-3 sm:px-6 py-2 sm:py-3 text-sm sm:text-base rounded-lg font-bold transition-all pulse-interactive-yellow ${
                  showExercises 
                    ? 'bg-orange-500 text-white shadow-md' 
                    : 'text-gray-600 hover:bg-gray-100'
                } ${highlightedElement === 'tab-exercices' ? 'ring-4 ring-yellow-400 bg-yellow-200 scale-105' : ''}`}
              >
                ✏️ Exercices ({score}/{exercises.length})
              </button>
            </div>
          </div>

          {!showExercises ? (
            /* COURS */
            <div className="space-y-3 sm:space-y-8">
              {/* Personnage Minecraft avec bouton DÉMARRER */}
              <div className="flex flex-row items-center justify-center gap-2 sm:gap-6 p-2 sm:p-4 mb-3 sm:mb-6">
                {/* Image du personnage Minecraft */}
                <div className={`relative transition-all duration-500 border-4 border-green-300 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 shadow-lg ${
                  isPlayingVocal
                    ? 'w-20 sm:w-24 h-20 sm:h-24' // When speaking - encore plus gros
                    : characterSizeExpanded
                      ? 'w-16 sm:w-20 h-16 sm:h-20' // After start - taille normale
                      : 'w-12 sm:w-16 h-12 sm:h-16' // Initial - plus petit
                }`}>
                  <img 
                    src="/image/Minecraftstyle.png" 
                    alt="Personnage Minecraft" 
                    className="w-full h-full rounded-full object-cover"
                  />
                  {/* Megaphone animé quand il parle */}
                  {isPlayingVocal && (
                    <div className="absolute -top-1 -right-1 bg-red-500 text-white p-1 rounded-full shadow-lg">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.77L4.916 14H2a1 1 0 01-1-1V7a1 1 0 011-1h2.916l3.467-2.77a1 1 0 011.617.77zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.983 5.983 0 01-1.757 4.243 1 1 0 01-1.415-1.414A3.983 3.983 0 0013 10a3.983 3.983 0 00-1.172-2.829 1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
                
                            {/* Bouton DÉMARRER */}
            <div className="text-center">
              <button
                onClick={explainChapter}
                disabled={isPlayingVocal}
                className={`bg-gradient-to-r from-green-500 to-blue-500 text-white px-3 sm:px-8 py-2 sm:py-4 rounded-md sm:rounded-xl font-bold text-xs sm:text-xl shadow-md sm:shadow-2xl hover:shadow-lg sm:hover:shadow-3xl transition-all transform hover:scale-105 min-h-[2.5rem] sm:min-h-[3rem] pulse-interactive ${
                  isPlayingVocal ? 'opacity-75 cursor-not-allowed' : 'hover:from-green-600 hover:to-blue-600'
                }`}
              >
                <Play className="inline w-3 h-3 sm:w-6 sm:h-6 mr-1 sm:mr-2" />
                {isPlayingVocal ? '🎤 JE PARLE...' : '🎯 DÉMARRER'}
              </button>
              

            </div>
              </div>

              {/* Sélecteur de nombre */}
              <div id="number-selector" className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-6 shadow-lg">
                <h2 className="text-base sm:text-2xl font-bold text-center mb-2 sm:mb-4 text-gray-900">
                  🎯 Choisis un nombre à découvrir
                </h2>
                
                
                <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-3 sm:mb-6">
                  {numbers.map((num, index) => (
                    <button
                      key={num.value}
                      id={`number-btn-${index}`}
                      onClick={() => {
                        setSelectedNumber(num.value);
                        // Scroll automatique vers l'animation
                        setTimeout(() => scrollToElement('animation-section'), 100);
                      }}
                      className={`p-2 sm:p-4 rounded-md sm:rounded-xl font-bold transition-all pulse-interactive flex flex-col items-center justify-center min-h-[4rem] sm:min-h-[6rem] relative ${
                        selectedNumber === num.value
                          ? 'bg-green-500 text-white shadow-lg scale-105'
                          : num.hasS 
                            ? 'bg-gradient-to-br from-yellow-100 to-orange-100 text-gray-800 hover:from-yellow-200 hover:to-orange-200 border-2 border-orange-300 shadow-md'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      } ${highlightedElement === `number-btn-${index}` ? 'ring-4 ring-yellow-400 bg-yellow-200 scale-110 animate-pulse' : ''}`}
                    >
                      {num.hasS && (
                        <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full animate-bounce">
                          S !
                        </div>
                      )}
                      <div className="text-base sm:text-2xl font-bold mb-1">
                        {num.label}
                      </div>
                      <div className="text-xs sm:text-sm font-semibold leading-tight text-center">
                        {num.hasS ? (
                          <span dangerouslySetInnerHTML={{ 
                            __html: num.reading
                              .replace(/cents/g, 'cent<span style="color: #dc2626; font-weight: 900; font-size: 1.3em; text-shadow: 0 0 8px #dc2626, 0 0 15px #fbbf24; animation: pulse 2s infinite; background: linear-gradient(45deg, #fef3c7, #fed7aa); padding: 1px 3px; border-radius: 3px; border: 1px solid #dc2626;">s</span>')
                              .replace(/vingts/g, 'vingt<span style="color: #dc2626; font-weight: 900; font-size: 1.3em; text-shadow: 0 0 8px #dc2626, 0 0 15px #fbbf24; animation: pulse 2s infinite; background: linear-gradient(45deg, #fef3c7, #fed7aa); padding: 1px 3px; border-radius: 3px; border: 1px solid #dc2626;">s</span>')
                          }} />
                        ) : (
                          num.reading
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Affichage du nombre */}
              <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-8 shadow-lg text-center">
                <h3 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 text-gray-900">
                  📊 Regardons le nombre {selectedNumber}
                </h3>
                
                {/* Nombre avec animation */}
                <div className="flex justify-center items-center space-x-1 sm:space-x-2 mb-4 sm:mb-8">
                  {selectedNumber.split('').map((digit, index) => (
                    <div
                      key={index}
                      id={`digit-${index}`}
                      className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 rounded-md sm:rounded-lg flex items-center justify-center text-lg sm:text-3xl font-bold text-blue-900 transition-all duration-300"
                    >
                      {digit}
                    </div>
                  ))}
                </div>

                {/* Décomposition avec vrai tableau */}
                <div id="animation-section" className="bg-green-50 rounded-lg p-2 sm:p-6 mb-3 sm:mb-6">
                  <h4 className="text-sm sm:text-lg font-bold mb-2 sm:mb-4 text-green-800">
                    🧩 Décomposition dans un tableau :
                  </h4>
                  <p className="text-xs sm:text-sm text-green-700 mb-2 sm:mb-4 font-semibold">
                    📝 On commence toujours par placer les unités, puis les dizaines, puis les centaines !
                  </p>
                  
                  {/* Nombre source pour l'animation */}
                  <div className="flex justify-center mb-3 sm:mb-6">
                    <div className="bg-white rounded-lg p-2 sm:p-4 shadow-lg border-2 border-blue-300">
                      <p className="text-xs sm:text-sm text-blue-700 font-semibold mb-1 sm:mb-2 text-center">Nombre à décomposer :</p>
                      
                      {/* Conteneur pour centrer les chiffres par rapport au bouton */}
                      <div className="flex flex-col items-center">
                        <div className="flex space-x-1 sm:space-x-2 mb-2 sm:mb-4 justify-center">
                          {selectedNumber.split('').map((digit, index) => (
                            <div
                              key={index}
                              id={`source-digit-${index}`}
                              className="w-8 h-8 sm:w-12 sm:h-12 bg-blue-100 rounded-md sm:rounded-lg flex items-center justify-center text-lg sm:text-2xl font-bold text-blue-900 transition-all duration-1000"
                            >
                              {digit}
                            </div>
                          ))}
                        </div>
                        
                        {/* Bouton d'animation */}
                        <button
                          id="animation-button"
                          onClick={() => {
                            animateNumber();
                            // Scroll automatique vers l'animation
                            setTimeout(() => scrollToElement('animation-section'), 100);
                          }}
                          disabled={isAnimating || isPlayingVocal}
                          className={`bg-blue-500 text-white px-3 sm:px-6 py-1 sm:py-3 rounded-md sm:rounded-lg font-bold text-xs sm:text-sm hover:bg-blue-600 transition-colors disabled:opacity-50 mb-2 sm:mb-3 pulse-interactive flex items-center justify-center min-h-[2rem] sm:min-h-[3rem] ${
                            highlightedElement === 'animation-button' ? 'ring-4 ring-yellow-400 bg-blue-400 scale-110 animate-pulse' : ''
                          }`}
                        >
                          {isAnimating ? (
                            <>
                              <Pause className="inline w-4 h-4 mr-2" />
                              {isPlayingVocal ? 'J\'explique...' : 'Placement en cours...'}
                            </>
                          ) : (
                            <>
                              <Play className="inline w-4 h-4 mr-2" />
                              Voir le placement dans le tableau
                            </>
                          )}
                        </button>
                        

                        
                        {/* Explication pour l'animation */}
                        <div className="bg-blue-50 rounded-lg p-2 sm:p-3 border-2 border-blue-300">
                          <p className="text-xs sm:text-xs text-blue-700 font-semibold text-center">
                            💡 Clique sur le bouton pour voir comment on place les chiffres un par un !
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Vrai tableau HTML */}
                  <div className="flex justify-center mb-2 sm:mb-4 overflow-x-auto">
                    <table className="border-collapse border-2 border-green-600 bg-white rounded-md sm:rounded-lg overflow-hidden shadow-lg w-full max-w-sm sm:max-w-full sm:min-w-0">
                      <thead>
                        <tr className="bg-green-200">
                          <th className="border-2 border-green-600 px-2 sm:px-6 py-1 sm:py-3 text-green-800 font-bold text-xs sm:text-lg">
                            Milliers
                          </th>
                          <th className="border-2 border-green-600 px-2 sm:px-6 py-1 sm:py-3 text-green-800 font-bold text-xs sm:text-lg">
                            Centaines
                          </th>
                          <th className="border-2 border-green-600 px-2 sm:px-6 py-1 sm:py-3 text-green-800 font-bold text-xs sm:text-lg">
                            Dizaines
                          </th>
                          <th className="border-2 border-green-600 px-2 sm:px-6 py-1 sm:py-3 text-green-800 font-bold text-xs sm:text-lg">
                            Unités
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border-2 border-green-600 px-2 sm:px-6 py-2 sm:py-4 text-center bg-green-100 transition-all duration-300" id="milliers-cell">
                            <div className="text-lg sm:text-3xl font-bold text-green-900" id="milliers-value">
                              {selectedNumber.length >= 4 ? selectedNumber[selectedNumber.length - 4] : '0'}
                            </div>
                          </td>
                          <td className="border-2 border-green-600 px-2 sm:px-6 py-2 sm:py-4 text-center bg-green-100 transition-all duration-300" id="centaines-cell">
                            <div className="text-lg sm:text-3xl font-bold text-green-900" id="centaines-value">
                              {selectedNumber.length >= 3 ? selectedNumber[selectedNumber.length - 3] : '0'}
                            </div>
                          </td>
                          <td className="border-2 border-green-600 px-2 sm:px-6 py-2 sm:py-4 text-center bg-green-100 transition-all duration-300" id="dizaines-cell">
                            <div className="text-lg sm:text-3xl font-bold text-green-900" id="dizaines-value">
                              {selectedNumber.length >= 2 ? selectedNumber[selectedNumber.length - 2] : '0'}
                            </div>
                          </td>
                          <td className="border-2 border-green-600 px-2 sm:px-6 py-2 sm:py-4 text-center bg-green-100 transition-all duration-300" id="unites-cell">
                            <div className="text-lg sm:text-3xl font-bold text-green-900" id="unites-value">
                              {selectedNumber[selectedNumber.length - 1]}
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  
                  {/* Explication du placement */}
                  <div className="bg-white rounded-lg p-2 sm:p-4 border-2 border-green-300">
                    <h5 className="font-bold text-green-800 mb-1 sm:mb-2 text-xs sm:text-base">
                      📍 Comment placer les chiffres :
                    </h5>
                    <div className="space-y-0.5 sm:space-y-2 text-xs sm:text-sm text-green-700">
                      <p><span className="font-bold text-blue-600">1.</span> On place le chiffre des <span className="font-bold text-green-800">unités</span> (dernier à droite)</p>
                      <p><span className="font-bold text-blue-600">2.</span> Puis le chiffre des <span className="font-bold text-green-800">dizaines</span> (avant-dernier)</p>
                      <p><span className="font-bold text-blue-600">3.</span> Puis le chiffre des <span className="font-bold text-green-800">centaines</span> (deuxième en partant de la gauche)</p>
                      <p><span className="font-bold text-blue-600">4.</span> Enfin le chiffre des <span className="font-bold text-green-800">milliers</span> (premier à gauche)</p>
                    </div>
                  </div>
                </div>

                {/* Lecture du nombre - maintenant à la fin */}
                <div id="reading-section" className="bg-yellow-50 rounded-lg p-2 sm:p-6 mb-3 sm:mb-6">
                  <h4 className="text-xs sm:text-lg font-bold mb-2 sm:mb-3 text-yellow-800">
                    🗣️ Comment le lire :
                  </h4>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
                    <p className="text-sm sm:text-2xl font-bold text-yellow-900 text-center">
                      {findNumber(selectedNumber)?.reading}
                    </p>
                    <button
                      id="listen-button"
                      onClick={() => speakNumber(findNumber(selectedNumber)?.reading || '')}
                      disabled={isPlayingVocal}
                      className={`bg-yellow-500 text-white px-2 sm:px-4 py-1 sm:py-3 rounded-md sm:rounded-lg font-bold text-xs sm:text-base hover:bg-yellow-600 transition-colors disabled:opacity-50 pulse-interactive-yellow flex items-center justify-center ${
                        highlightedElement === 'listen-button' ? 'ring-4 ring-yellow-400 bg-yellow-400 scale-110 animate-pulse' : ''
                      }`}
                    >
                      <Volume2 className="inline w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                      Écouter
                    </button>
                  </div>
                </div>
              </div>

              {/* Conseils */}
              <div className="bg-gradient-to-r from-purple-400 to-pink-400 rounded-lg sm:rounded-xl p-3 sm:p-6 text-white">
                <h3 className="text-sm sm:text-xl font-bold mb-2 sm:mb-3">💡 Astuces pour bien lire</h3>
                <ul className="space-y-1 sm:space-y-2 text-xs sm:text-base">
                  <li>• Commence toujours par les centaines</li>
                  <li>• Puis les dizaines</li>
                  <li>• Et enfin les unités</li>
                  <li>• N'oublie pas de dire "cent" quand il y en a !</li>
                </ul>
              </div>

              {/* SECTION LES PIÈGES - Nombres avec S */}  
              <div id="traps-selector" className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-md border border-gray-200 mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-center mb-6 text-gray-800">
                  Avec ou sans S pour vingt et cent
                </h2>
                
                {/* Boîtes résumé des règles */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <div className="bg-green-100 border-2 border-green-300 rounded-lg p-4 text-center">
                    <div className="flex items-center justify-center mb-2">
                      <span className="text-green-600 text-xl font-bold mr-2">✅</span>
                      <span className="font-bold text-green-800">Avec S</span>
                    </div>
                    <p className="text-sm text-green-700">
                      nombre exact (80, 200, 300...)
                    </p>
                  </div>
                  <div className="bg-red-100 border-2 border-red-300 rounded-lg p-4 text-center">
                    <div className="flex items-center justify-center mb-2">
                      <span className="text-red-600 text-xl font-bold mr-2">❌</span>
                      <span className="font-bold text-red-800">Sans S</span>
                    </div>
                    <p className="text-sm text-red-700">
                      suivi d'autre chose (83, 205, 305...)
                    </p>
                  </div>
                </div>
                
                {/* Titre simple */}
                <div className="text-center mb-6">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">
                    Observe les différences :
                  </h3>
                  <p className="text-sm text-gray-600">
                    Compare chaque paire pour comprendre la règle
                  </p>
                </div>

                                  {/* Paires colorées */}
                <div className="space-y-4 mb-4">
                  {/* Section 1: Cas simples */}
                  <h4 className="text-lg font-bold text-gray-800 mb-2 bg-yellow-100 p-2 rounded-lg">
                    📌 Cas simples (nombres jusqu'à 1000)
                  </h4>

                  {/* Paire 1 - Rose/Bleu */}
                  <div id="paire-80-83" className="bg-gradient-to-r from-pink-100 to-blue-100 rounded-lg p-4 border-2 border-pink-200 shadow-md">
                    <div className="flex items-center justify-center gap-3 sm:gap-6 mb-3">
                      <button
                        onClick={() => {
                          setSelectedNumber('80');
                          setTimeout(() => scrollToElement('paire-80-83'), 100);
                        }}
                        className="group relative bg-gradient-to-br from-green-400 to-green-500 text-white border-2 border-green-300 rounded-lg p-3 sm:p-4 hover:from-green-500 hover:to-green-600 hover:shadow-xl transform hover:scale-105 transition-all min-w-[90px] sm:min-w-[110px]"
                      >
                        <div className="text-xl sm:text-2xl font-bold mb-1">80</div>
                        <div className="text-xs sm:text-sm">
                          quatre-vingt<span id="s-80" className="text-yellow-200 font-extrabold text-lg sm:text-xl bg-green-700 px-1 rounded">s</span>
                        </div>
                        <div className="absolute -top-2 -right-2 bg-yellow-400 text-green-800 text-xs font-bold px-2 py-1 rounded-full border-2 border-yellow-300">
                          ✓ S
                        </div>
                      </button>

                      <div className="text-xl sm:text-2xl font-bold text-white bg-gradient-to-r from-pink-500 to-blue-500 px-3 py-1 rounded-full shadow-md">VS</div>

                      <button
                        onClick={() => {
                          setSelectedNumber('83');
                          setTimeout(() => scrollToElement('paire-80-83'), 100);
                        }}
                        className="group relative bg-gradient-to-br from-red-400 to-red-500 text-white border-2 border-red-300 rounded-lg p-3 sm:p-4 hover:from-red-500 hover:to-red-600 hover:shadow-xl transform hover:scale-105 transition-all min-w-[90px] sm:min-w-[110px]"
                      >
                        <div className="text-xl sm:text-2xl font-bold mb-1">83</div>
                        <div className="text-xs sm:text-sm">quatre-vingt-trois</div>
                        <div id="badge-83" className="absolute -top-2 -right-2 bg-yellow-400 text-red-800 text-xs font-bold px-2 py-1 rounded-full border-2 border-yellow-300">
                          ✗ pas S
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Paire 2 - Vert/Orange */}
                  <div id="paire-200-205" className="bg-gradient-to-r from-green-100 to-orange-100 rounded-lg p-4 border-2 border-green-200 shadow-md">
                    <div className="flex items-center justify-center gap-3 sm:gap-6 mb-3">
                      <button
                        onClick={() => {
                          setSelectedNumber('200');
                          setTimeout(() => scrollToElement('paire-200-205'), 100);
                        }}
                        className="group relative bg-gradient-to-br from-emerald-400 to-emerald-500 text-white border-2 border-emerald-300 rounded-lg p-3 sm:p-4 hover:from-emerald-500 hover:to-emerald-600 hover:shadow-xl transform hover:scale-105 transition-all min-w-[90px] sm:min-w-[110px]"
                      >
                        <div className="text-xl sm:text-2xl font-bold mb-1">200</div>
                        <div className="text-xs sm:text-sm">
                          deux-cent<span id="s-200" className="text-yellow-200 font-extrabold text-lg sm:text-xl bg-emerald-700 px-1 rounded">s</span>
                        </div>
                        <div className="absolute -top-2 -right-2 bg-yellow-400 text-emerald-800 text-xs font-bold px-2 py-1 rounded-full border-2 border-yellow-300">
                          ✓ S
                        </div>
                      </button>

                      <div className="text-xl sm:text-2xl font-bold text-white bg-gradient-to-r from-green-500 to-orange-500 px-3 py-1 rounded-full shadow-md">VS</div>

                      <button
                        onClick={() => {
                          setSelectedNumber('205');
                          setTimeout(() => scrollToElement('paire-200-205'), 100);
                        }}
                        className="group relative bg-gradient-to-br from-orange-400 to-orange-500 text-white border-2 border-orange-300 rounded-lg p-3 sm:p-4 hover:from-orange-500 hover:to-orange-600 hover:shadow-xl transform hover:scale-105 transition-all min-w-[90px] sm:min-w-[110px]"
                      >
                        <div className="text-xl sm:text-2xl font-bold mb-1">205</div>
                        <div className="text-xs sm:text-sm">deux-cent-cinq</div>
                        <div id="badge-205" className="absolute -top-2 -right-2 bg-yellow-400 text-orange-800 text-xs font-bold px-2 py-1 rounded-full border-2 border-yellow-300">
                          ✗ pas S
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Section 2: Cas avec milliers */}
                  <h4 className="text-lg font-bold text-gray-800 mt-8 mb-2 bg-blue-100 p-2 rounded-lg">
                    🔥 Nouveaux cas avec les milliers
                  </h4>

                  {/* Paire 3 - Milliers avec quatre-vingts */}
                  <div id="paire-1080-1083" className="bg-gradient-to-r from-indigo-100 to-purple-100 rounded-lg p-4 border-2 border-indigo-200 shadow-md">
                    <div className="flex items-center justify-center gap-3 sm:gap-6 mb-3">
                      <button
                        onClick={() => {
                          setSelectedNumber('1080');
                          setTimeout(() => scrollToElement('paire-1080-1083'), 100);
                        }}
                        className="group relative bg-gradient-to-br from-indigo-400 to-indigo-500 text-white border-2 border-indigo-300 rounded-lg p-3 sm:p-4 hover:from-indigo-500 hover:to-indigo-600 hover:shadow-xl transform hover:scale-105 transition-all min-w-[120px] sm:min-w-[140px]"
                      >
                        <div className="text-xl sm:text-2xl font-bold mb-1">1080</div>
                        <div className="text-xs sm:text-sm">
                          mille-quatre-vingt<span id="s-1080" className="text-yellow-200 font-extrabold text-lg sm:text-xl bg-indigo-700 px-1 rounded">s</span>
                        </div>
                        <div className="absolute -top-2 -right-2 bg-yellow-400 text-indigo-800 text-xs font-bold px-2 py-1 rounded-full border-2 border-yellow-300">
                          ✓ S
                        </div>
                      </button>

                      <div className="text-xl sm:text-2xl font-bold text-white bg-gradient-to-r from-indigo-500 to-purple-500 px-3 py-1 rounded-full shadow-md">VS</div>

                      <button
                        onClick={() => {
                          setSelectedNumber('1083');
                          setTimeout(() => scrollToElement('paire-1080-1083'), 100);
                        }}
                        className="group relative bg-gradient-to-br from-purple-400 to-purple-500 text-white border-2 border-purple-300 rounded-lg p-3 sm:p-4 hover:from-purple-500 hover:to-purple-600 hover:shadow-xl transform hover:scale-105 transition-all min-w-[120px] sm:min-w-[140px]"
                      >
                        <div className="text-xl sm:text-2xl font-bold mb-1">1083</div>
                        <div className="text-xs sm:text-sm">mille-quatre-vingt-trois</div>
                        <div id="badge-1083" className="absolute -top-2 -right-2 bg-yellow-400 text-purple-800 text-xs font-bold px-2 py-1 rounded-full border-2 border-yellow-300">
                          ✗ pas S
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Paire 4 - Milliers avec cents */}
                  <div id="paire-2200-2205" className="bg-gradient-to-r from-blue-100 to-teal-100 rounded-lg p-4 border-2 border-blue-200 shadow-md">
                    <div className="flex items-center justify-center gap-3 sm:gap-6 mb-3">
                      <button
                        onClick={() => {
                          setSelectedNumber('2200');
                          setTimeout(() => scrollToElement('paire-2200-2205'), 100);
                        }}
                        className="group relative bg-gradient-to-br from-blue-400 to-blue-500 text-white border-2 border-blue-300 rounded-lg p-3 sm:p-4 hover:from-blue-500 hover:to-blue-600 hover:shadow-xl transform hover:scale-105 transition-all min-w-[120px] sm:min-w-[140px]"
                      >
                        <div className="text-xl sm:text-2xl font-bold mb-1">2200</div>
                        <div className="text-xs sm:text-sm">
                          deux-mille-deux-cent<span id="s-2200" className="text-yellow-200 font-extrabold text-lg sm:text-xl bg-blue-700 px-1 rounded">s</span>
                        </div>
                        <div className="absolute -top-2 -right-2 bg-yellow-400 text-blue-800 text-xs font-bold px-2 py-1 rounded-full border-2 border-yellow-300">
                          ✓ S
                        </div>
                      </button>

                      <div className="text-xl sm:text-2xl font-bold text-white bg-gradient-to-r from-blue-500 to-teal-500 px-3 py-1 rounded-full shadow-md">VS</div>

                      <button
                        onClick={() => {
                          setSelectedNumber('2205');
                          setTimeout(() => scrollToElement('paire-2200-2205'), 100);
                        }}
                        className="group relative bg-gradient-to-br from-teal-400 to-teal-500 text-white border-2 border-teal-300 rounded-lg p-3 sm:p-4 hover:from-teal-500 hover:to-teal-600 hover:shadow-xl transform hover:scale-105 transition-all min-w-[120px] sm:min-w-[140px]"
                      >
                        <div className="text-xl sm:text-2xl font-bold mb-1">2205</div>
                        <div className="text-xs sm:text-sm">deux-mille-deux-cent-cinq</div>
                        <div id="badge-2205" className="absolute -top-2 -right-2 bg-yellow-400 text-teal-800 text-xs font-bold px-2 py-1 rounded-full border-2 border-yellow-300">
                          ✗ pas S
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Explication des règles avec milliers */}
                  <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg p-4 border-2 border-blue-300 mt-4">
                    <h5 className="font-bold text-gray-900 mb-2 bg-white px-3 py-2 rounded-lg inline-block">💡 Les règles avec les milliers :</h5>
                    <ul className="space-y-3 text-sm bg-white rounded-lg p-4 shadow-sm">
                      <li className="flex items-start gap-2">
                        <span className="bg-blue-100 text-blue-800 font-bold px-2 py-1 rounded-full">ℹ️</span>
                        <div>
                          <p className="text-gray-900 font-medium">"Mille" ne prend JAMAIS de "S"</p>
                          <p className="text-gray-600 text-xs mt-1 bg-blue-50 p-2 rounded">Exemples : mille, deux-mille, trois-mille...</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="bg-green-100 text-green-800 font-bold px-2 py-1 rounded-full">✓</span>
                        <div>
                          <p className="text-gray-900 font-medium">On met un "S" à "cents" quand c'est une centaine exacte, même après "mille"</p>
                          <p className="text-gray-600 text-xs mt-1 bg-green-50 p-2 rounded">Exemples : deux-cent<span className="text-green-700 font-bold">s</span>, deux-mille-deux-cent<span className="text-green-700 font-bold">s</span></p>
                        </div>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="bg-green-100 text-green-800 font-bold px-2 py-1 rounded-full">✓</span>
                        <div>
                          <p className="text-gray-900 font-medium">On met un "S" à "vingts" quand c'est quatre-vingts exact, même après "mille"</p>
                          <p className="text-gray-600 text-xs mt-1 bg-green-50 p-2 rounded">Exemples : quatre-vingt<span className="text-green-700 font-bold">s</span>, mille-quatre-vingt<span className="text-green-700 font-bold">s</span></p>
                        </div>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="bg-red-100 text-red-800 font-bold px-2 py-1 rounded-full">✗</span>
                        <div>
                          <p className="text-gray-900 font-medium">On ne met jamais de "S" quand il y a un autre nombre qui suit</p>
                          <p className="text-gray-600 text-xs mt-1 bg-red-50 p-2 rounded">Exemples : deux-mille-deux-cent-cinq, mille-quatre-vingt-trois</p>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* 🎮 MINI-JEU DU "S" - Remplace la section en colonnes */}
                <div className="bg-gradient-to-br from-blue-50 to-purple-100 rounded-lg p-4 shadow-lg border-2 border-blue-200 mb-6">
                  <h3 className="text-lg font-bold text-center mb-4 text-blue-800">
                    🎮 Le Défi du "S" !
                  </h3>
                  
                  {!gameStarted ? (
                    /* Écran d'accueil du jeu */
                    <div className="text-center">
                      <div className="mb-4">
                        <div className="text-4xl mb-3">🎯</div>
                        <h4 className="text-base font-bold text-gray-800 mb-3">
                          Prêt à tester tes connaissances ?
                        </h4>
                        <p className="text-sm text-gray-600 mb-4">
                          Je vais te montrer des nombres. À toi de deviner s'ils prennent un "S" ou pas !
                        </p>
                      </div>
                      
                      <button
                        id="start-game-button"
                        onClick={startGame}
                        className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-6 py-3 rounded-lg font-bold text-sm shadow-lg transform hover:scale-105 transition-all pulse-interactive"
                      >
                        🚀 Commencer le Défi !
                      </button>
                    </div>
                  ) : (
                    /* Interface de jeu */
                    <div>
                      {/* Tableau de score compact */}
                      <div className="flex justify-between items-center mb-4 bg-white rounded-lg p-2 shadow-md">
                        <div className="flex items-center gap-3">
                          <div className="text-center">
                            <div className="text-lg font-bold text-blue-600">{gameScore}</div>
                            <div className="text-xs text-gray-600">Score</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold text-purple-600">{gameStreak}</div>
                            <div className="text-xs text-gray-600">Série</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold text-green-600">Niv.{gameLevel}</div>
                            <div className="text-xs text-gray-600">Niveau</div>
                          </div>
                        </div>
                        <button
                          onClick={resetGame}
                          className="bg-gray-400 hover:bg-gray-500 text-white px-2 py-1 rounded text-xs transition-all"
                        >
                          🔄 Reset
                        </button>
                      </div>

                      {currentGameNumber && (
                        <div className="text-center">
                          {/* Question compacte */}
                          <div className="mb-4">
                            <h4 className="text-sm font-bold text-gray-800 mb-3">
                              Ce nombre prend-il un "S" ?
                            </h4>
                            
                            {/* Le nombre à analyser - plus compact */}
                            <div className="bg-white rounded-lg p-4 shadow-md mb-3 mx-auto max-w-xs">
                              <div className="text-3xl font-bold text-gray-800">
                                {currentGameNumber.value}
                              </div>
                            </div>
                          </div>

                          {!showGameResult ? (
                            /* Boutons de réponse compacts */
                            <div className="flex gap-3 justify-center mb-4">
                              <button
                                onClick={() => submitGameAnswer(true)}
                                className="bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 text-white px-6 py-3 rounded-lg font-bold text-sm shadow-lg transform hover:scale-105 transition-all"
                              >
                                ✅ AVEC "S"
                              </button>
                              <button
                                onClick={() => submitGameAnswer(false)}
                                className="bg-gradient-to-r from-red-400 to-red-500 hover:from-red-500 hover:to-red-600 text-white px-6 py-3 rounded-lg font-bold text-sm shadow-lg transform hover:scale-105 transition-all"
                              >
                                ❌ SANS "S"
                              </button>
                            </div>
                          ) : (
                            /* Résultat compact */
                            <div className={`p-4 rounded-lg mb-4 ${
                              gameAnswer === currentGameNumber.hasS 
                                ? 'bg-green-100 border-2 border-green-400' 
                                : 'bg-red-100 border-2 border-red-400'
                            }`}>
                              <div className="text-4xl mb-2">
                                {gameAnswer === currentGameNumber.hasS ? '🎉' : '😅'}
                              </div>
                              <div className={`text-lg font-bold mb-1 ${
                                gameAnswer === currentGameNumber.hasS ? 'text-green-800' : 'text-red-800'
                              }`}>
                                {gameAnswer === currentGameNumber.hasS ? 'Bravo !' : 'Pas tout à fait...'}
                              </div>
                              <div className="text-xs text-gray-900">
                                <span className="font-bold">
                                  {currentGameNumber.reading}
                                </span>
                                <br/>
                                {currentGameNumber.explanation}
                              </div>
                            </div>
                          )}

                          {/* Barre de progression */}
                          <div className="bg-gray-200 rounded-full h-1 mb-3">
                            <div 
                              className="bg-gradient-to-r from-blue-400 to-purple-400 h-1 rounded-full transition-all duration-1000"
                              style={{ width: `${Math.min((gameScore % 5) * 20, 100)}%` }}
                            ></div>
                          </div>
                          <div className="text-xs text-gray-600">
                            {5 - (gameScore % 5)} bonnes réponses pour le niveau suivant
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Section piège spéciale : 90/91 - Style coloré */}
                <div className="mt-6 p-6 bg-gradient-to-r from-yellow-100 to-red-100 border-2 border-yellow-300 rounded-xl shadow-lg">
                  <h4 className="text-center text-xl font-bold text-red-700 mb-4">
                    ⚠️ Attention aux pièges !
                  </h4>
                  <p className="text-center text-sm text-red-600 mb-6 font-medium">
                    Ces nombres ressemblent à "80" mais n'ont <span className="font-bold bg-red-200 px-2 py-1 rounded">PAS de S</span> !
                  </p>
                  
                  <div className="flex items-center justify-center gap-4 sm:gap-8 mb-4">
                    <button
                      onClick={() => {
                        setSelectedNumber('90');
                        setTimeout(() => scrollToElement('animation-section'), 100);
                      }}
                      className="group relative bg-gradient-to-br from-amber-400 to-amber-500 text-white border-2 border-amber-300 rounded-xl p-4 sm:p-6 hover:from-amber-500 hover:to-amber-600 hover:shadow-xl transform hover:scale-105 transition-all min-w-[110px] sm:min-w-[130px]"
                    >
                      <div className="text-2xl sm:text-3xl font-bold mb-2">90</div>
                      <div className="text-xs sm:text-sm">quatre-vingt-dix</div>
                      <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full border-2 border-red-400">
                        ⚠️ PAS S
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        setSelectedNumber('91');
                        setTimeout(() => scrollToElement('animation-section'), 100);
                      }}
                      className="group relative bg-gradient-to-br from-amber-400 to-amber-500 text-white border-2 border-amber-300 rounded-xl p-4 sm:p-6 hover:from-amber-500 hover:to-amber-600 hover:shadow-xl transform hover:scale-105 transition-all min-w-[110px] sm:min-w-[130px]"
                    >
                      <div className="text-2xl sm:text-3xl font-bold mb-2">91</div>
                      <div className="text-xs sm:text-sm">quatre-vingt-onze</div>
                      <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full border-2 border-red-400">
                        ⚠️ PAS S
                      </div>
                    </button>
                  </div>

                  <div className="text-center p-4 bg-gradient-to-r from-yellow-200 to-red-200 rounded-xl border border-yellow-300">
                    <p className="text-sm text-red-800 font-medium">
                      <span className="font-bold text-red-900">Pourquoi pas de S ?</span><br/>
                      Parce qu'ils sont suivis de "dix" ou "onze" !<br/>
                      <span className="italic bg-green-100 px-2 py-1 rounded mt-1 inline-block">80 = exact → quatre-vingt<span className="font-bold text-green-600">s</span></span><br/>
                      <span className="italic bg-red-100 px-2 py-1 rounded mt-1 inline-block">90 = suivi de "dix" → quatre-vingt-dix</span>
                    </p>
                  </div>
                </div>


              </div>

              {/* Règle sur les tirets */}
              <div className="bg-gradient-to-r from-orange-400 to-red-400 rounded-lg sm:rounded-xl p-3 sm:p-6 text-white">
                <h3 className="text-sm sm:text-xl font-bold mb-2 sm:mb-3">📏 Règle des tirets</h3>
                <div className="space-y-2 text-xs sm:text-base">
                  <p className="font-semibold">✅ Orthographe moderne :</p>
                  <ul className="space-y-1 ml-2">
                    <li>• Tous les nombres composés ont des tirets</li>
                  </ul>
                </div>
              </div>


            </div>
          ) : (
            /* EXERCICES */
            <div className="space-y-3 sm:space-y-8">
              {/* Personnage Minecraft avec bouton DÉMARRER */}
              <div className="flex flex-row items-center justify-center gap-2 sm:gap-6 p-2 sm:p-4 mb-3 sm:mb-6">
                {/* Image du personnage Minecraft */}
                <div className={`relative transition-all duration-500 border-4 border-blue-300 rounded-full bg-gradient-to-br from-blue-100 to-cyan-100 shadow-lg ${
                  isPlayingVocal
                    ? 'w-20 sm:w-24 h-20 sm:h-24' // When speaking - encore plus gros
                    : characterSizeExpanded
                      ? 'w-16 sm:w-20 h-16 sm:h-20' // After start - taille normale
                      : 'w-12 sm:w-16 h-12 sm:h-16' // Initial - plus petit
                }`}>
                  <img 
                    src="/image/Minecraftstyle.png" 
                    alt="Personnage Minecraft" 
                    className="w-full h-full rounded-full object-cover"
                  />
                  {/* Megaphone animé quand il parle */}
                  {isPlayingVocal && (
                    <div className="absolute -top-1 -right-1 bg-red-500 text-white p-1 rounded-full shadow-lg">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.77L4.916 14H2a1 1 0 01-1-1V7a1 1 0 011-1h2.916l3.467-2.77a1 1 0 011.617.77zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.983 5.983 0 01-1.757 4.243 1 1 0 01-1.415-1.414A3.983 3.983 0 0013 10a3.983 3.983 0 00-1.172-2.829 1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
                
                {/* Bouton DÉMARRER */}
                <div className="text-center">
                  <button
                    onClick={explainChapter}
                    disabled={isPlayingVocal}
                    className={`bg-gradient-to-r from-green-500 to-blue-500 text-white px-3 sm:px-8 py-2 sm:py-4 rounded-md sm:rounded-xl font-bold text-xs sm:text-xl shadow-md sm:shadow-2xl hover:shadow-lg sm:hover:shadow-3xl transition-all transform hover:scale-105 min-h-[2.5rem] sm:min-h-[3rem] ${
                      isPlayingVocal ? 'opacity-75 cursor-not-allowed' : 'hover:from-green-600 hover:to-blue-600'
                    }`}
                  >
                    <Play className="inline w-3 h-3 sm:w-6 sm:h-6 mr-1 sm:mr-2" />
                    {isPlayingVocal ? '🎤 JE PARLE...' : '🎯 DÉMARRER'}
                  </button>
                  

                </div>
              </div>

              {/* Header exercices */}
              <div id="score-section" className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-6 shadow-lg">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-2 sm:mb-4 gap-2 sm:gap-0">
                  <h2 className="text-base sm:text-2xl font-bold text-gray-900 text-center sm:text-left">
                    ✏️ Exercice {currentExercise + 1} sur {exercises.length}
                  </h2>
                  <button
                    onClick={resetAll}
                    disabled={isPlayingVocal}
                    className="bg-gray-500 text-white px-2 sm:px-4 py-1 sm:py-3 rounded-md sm:rounded-lg font-bold text-xs sm:text-base hover:bg-gray-600 transition-colors disabled:opacity-50 pulse-interactive-gray flex items-center justify-center min-h-[2rem] sm:min-h-[3rem]"
                  >
                    <RotateCcw className="inline w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    Recommencer
                  </button>
                </div>
                
                {/* Barre de progression */}
                <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
                  <div 
                    className="bg-blue-500 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${((currentExercise + 1) / exercises.length) * 100}%` }}
                  ></div>
                </div>
                
                {/* Score sous la barre */}
                <div className="text-center">
                  <div id="score-display" className={`text-sm sm:text-lg font-bold text-blue-600 ${
                    highlightedElement === 'score-display' ? 'ring-4 ring-yellow-400 bg-yellow-200 scale-110 animate-pulse p-2 rounded-lg' : ''
                  }`}>
                    Score : {score}/{exercises.length}
                  </div>
                </div>
              </div>

              {/* Question */}
              <div id="exercise-question" className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-8 shadow-lg text-center">
                <h3 className="text-base sm:text-xl font-bold mb-3 sm:mb-6 text-gray-900">
                  📝 Écris ce nombre en lettres
                </h3>
                
                <div id="mystery-number" className={`text-3xl sm:text-6xl font-bold text-blue-600 mb-4 sm:mb-8 ${
                  highlightedElement === 'mystery-number' ? 'ring-4 ring-yellow-400 bg-yellow-200 scale-110 animate-pulse p-2 sm:p-4 rounded-lg' : ''
                }`}>
                  {exercises[currentExercise].number}
                </div>
                
                <div className="max-w-xs sm:max-w-md mx-auto mb-3 sm:mb-6">
                  <input
                    id="answer-input"
                    type="text"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    placeholder="Écris comment tu lis ce nombre..."
                    autoComplete="off"
                    className={`w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-300 rounded-md sm:rounded-lg text-center text-sm sm:text-lg focus:border-blue-500 focus:outline-none bg-white text-gray-900 min-h-[2.5rem] sm:min-h-[3rem] ${
                      highlightedElement === 'answer-input' ? 'ring-4 ring-yellow-400 bg-yellow-100 scale-105' : ''
                    }`}
                  />
                </div>
                
                <div className="flex justify-center space-x-2 sm:space-x-4 mb-3 sm:mb-6">
                  <button
                    id="erase-button"
                    onClick={resetExercise}
                    disabled={isPlayingVocal}
                    className={`bg-gray-500 text-white px-3 sm:px-6 py-1 sm:py-3 rounded-md sm:rounded-lg font-bold text-xs sm:text-base hover:bg-gray-600 transition-colors disabled:opacity-50 pulse-interactive-gray flex items-center justify-center min-h-[2rem] sm:min-h-[3rem] ${
                      highlightedElement === 'erase-button' ? 'ring-4 ring-yellow-400 bg-gray-400 scale-110 animate-pulse' : ''
                    }`}
                  >
                    Effacer
                  </button>
                </div>
                
                {/* Résultat */}
                {isCorrect !== null && (
                  <div className={`p-3 sm:p-4 rounded-lg mb-4 sm:mb-6 ${
                    isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    <div className="flex items-center justify-center space-x-2">
                      {isCorrect ? (
                        <>
                          <CheckCircle className="w-6 h-6" />
                          <div className="text-center">
                            <span className="font-bold">Excellent ! C'est la bonne réponse !</span>
                            {(exercises[currentExercise].number === '300' || exercises[currentExercise].number === '600') && (
                              <div className="mt-2 p-2 bg-green-100 text-green-800 rounded-lg text-sm">
                                <span className="font-bold">🎯 BRAVO !</span> Tu as bien pensé au <span className="font-bold">"S"</span> de "cents" ! 
                                C'est parfait : les centaines exactes prennent toujours un S !
                              </div>
                            )}
                          </div>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-6 h-6" />
                          <div className="text-center">
                            <span className="font-bold">
                              Pas tout à fait... La bonne réponse est : "{exercises[currentExercise].reading}"
                            </span>
                            {(exercises[currentExercise].number === '300' || exercises[currentExercise].number === '600') && (
                              <div className="mt-2 p-2 bg-yellow-100 text-yellow-800 rounded-lg text-sm">
                                <span className="font-bold">💡 RAPPEL IMPORTANT :</span> Pour les centaines exactes (300, 600, etc.), 
                                on écrit <span className="font-bold">"cents" avec un S</span> à la fin ! 
                                C'est la règle : trois-cent<span className="font-bold text-red-600">s</span>, six-cent<span className="font-bold text-red-600">s</span> !
                              </div>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}
                
                {/* Navigation */}
                <div id="navigation-buttons" className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
                  <button
                    id="previous-button"
                    onClick={() => setCurrentExercise(Math.max(0, currentExercise - 1))}
                    disabled={currentExercise === 0 || isPlayingVocal}
                    className={`bg-gray-300 text-gray-700 px-4 sm:px-6 py-2 sm:py-3 rounded-md sm:rounded-lg font-bold text-sm sm:text-base hover:bg-gray-400 transition-colors disabled:opacity-50 pulse-interactive-gray flex items-center justify-center ${
                      highlightedElement === 'previous-button' ? 'ring-4 ring-yellow-400 bg-gray-200 scale-110 animate-pulse' : ''
                    }`}
                  >
                    ← Précédent
                  </button>
                  <button
                    id="next-button"
                    onClick={handleNext}
                    disabled={(!userAnswer.trim() && isCorrect === null) || isPlayingVocal}
                    className={`bg-green-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-md sm:rounded-lg font-bold text-sm sm:text-base hover:bg-green-600 transition-colors disabled:opacity-50 pulse-interactive-green flex items-center justify-center ${
                      highlightedElement === 'next-button' ? 'ring-4 ring-yellow-400 bg-green-400 scale-110 animate-pulse' : ''
                    }`}
                  >
                    {isCorrect === null ? 'Vérifier' : 'Suivant →'}
                  </button>
                </div>
              </div>


            </div>
          )}

          {/* Modale de fin d'exercices */}
          {showCompletionModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-2xl transform transition-all">
                {(() => {
                  const percentage = Math.round((finalScore / exercises.length) * 100);
                  const getMessage = () => {
                    if (percentage >= 90) return { title: "🎉 Excellent !", message: "Tu maîtrises parfaitement la lecture des nombres jusqu'à 1000 !", emoji: "🎉" };
                    if (percentage >= 70) return { title: "👏 Bien joué !", message: "Tu sais bien lire les nombres ! Continue comme ça !", emoji: "👏" };
                    if (percentage >= 50) return { title: "👍 C'est un bon début !", message: "Tu progresses bien. Entraîne-toi encore un peu !", emoji: "😊" };
                    return { title: "💪 Continue à t'entraîner !", message: "Recommence les exercices pour mieux maîtriser la lecture des nombres.", emoji: "📚" };
                  };
                  const result = getMessage();
                  return (
                    <>
                      <div className="text-6xl mb-4">{result.emoji}</div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">{result.title}</h3>
                      <p className="text-lg text-gray-700 mb-6">{result.message}</p>
                      <div className="bg-gray-100 rounded-lg p-4 mb-6">
                        <p className="text-xl font-bold text-gray-900">
                          Score final : {finalScore}/{exercises.length} ({percentage}%)
                        </p>
                      </div>
                      <div className="flex space-x-3">
                        <button
                          onClick={resetAll}
                          disabled={isPlayingVocal}
                          className="flex-1 bg-green-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-green-600 transition-colors disabled:opacity-50 pulse-interactive-green flex items-center justify-center"
                        >
                          Recommencer
                        </button>
                        <button
                          onClick={() => setShowCompletionModal(false)}
                          disabled={isPlayingVocal}
                          className="flex-1 bg-gray-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-gray-600 transition-colors disabled:opacity-50 pulse-interactive-gray flex items-center justify-center"
                        >
                          Fermer
                        </button>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>
          )}
        </div>
        
        {/* Bouton flottant Minecraft pour arrêter les vocaux */}
        {(isPlayingVocal || isAnimating) && (
          <div className="fixed top-4 right-4 z-[60]">
            <button
              onClick={stopAllVocalsAndAnimations}
              className="relative flex items-center gap-2 px-3 py-2 rounded-full shadow-2xl transition-all duration-300 bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 hover:scale-105 animate-pulse"
              title="Arrêter l'explication"
            >
              <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-white/50">
                <img 
                  src="/image/Minecraftstyle.png" 
                  alt="Personnage Minecraft" 
                  className="w-full h-full object-cover"
                />
              </div>
              <>
                <span className="text-sm font-bold hidden sm:block">Stop</span>
                <div className="w-3 h-3 bg-white rounded-sm animate-pulse"></div>
              </>
            </button>
          </div>
        )}
      </div>
    </>
  );
} 