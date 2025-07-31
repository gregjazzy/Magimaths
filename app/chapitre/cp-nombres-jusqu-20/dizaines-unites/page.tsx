'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CheckCircle, XCircle, RotateCcw, Volume2, Play, Pause } from 'lucide-react';

export default function DizainesUnitesCP() {
  const router = useRouter();
  const [selectedNumber, setSelectedNumber] = useState(15);
  const [currentExercise, setCurrentExercise] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showExercises, setShowExercises] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredCorrectly, setAnsweredCorrectly] = useState<Set<number>>(new Set());
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [finalScore, setFinalScore] = useState(0);

  // States pour audio et animations
  const [isPlayingVocal, setIsPlayingVocal] = useState(false);
  const [highlightedElement, setHighlightedElement] = useState<string | null>(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [animatingDecomposition, setAnimatingDecomposition] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [animatingExample, setAnimatingExample] = useState(false);
  const [highlightDigit, setHighlightDigit] = useState<'left' | 'right' | null>(null);
  const [animatingCircles, setAnimatingCircles] = useState<'dizaines' | 'unites' | 'all' | null>(null);

  // Refs pour contrôler les vocaux et animations
  const stopSignalRef = useRef(false);
  const currentAudioRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Fonction pour arrêter tous les vocaux et animations
  const stopAllVocalsAndAnimations = () => {
    console.log('🛑 Arrêt FORCÉ de tous les vocaux et animations (navigation détectée)');
    stopSignalRef.current = true;
    
    // Arrêt immédiat et multiple de la synthèse vocale
    try {
      if (speechSynthesis.speaking || speechSynthesis.pending) {
        speechSynthesis.cancel();
        console.log('🔇 speechSynthesis.cancel() appelé (1er)');
      }
      speechSynthesis.cancel(); // Force même si pas actif
      console.log('🔇 speechSynthesis.cancel() forcé');
    } catch (error) {
      console.log('❌ Erreur lors de l\'arrêt speechSynthesis:', error);
    }
    
    if (currentAudioRef.current) {
      currentAudioRef.current = null;
      console.log('🗑️ currentAudioRef supprimé');
    }
    
    // Reset immédiat de tous les états
    setIsPlayingVocal(false);
    setHighlightedElement(null);
    setAnimatingDecomposition(false);
    setAnimatingExample(false);
    setHighlightDigit(null);
    setAnimatingCircles(null);
    
    // Arrêts supplémentaires en différé pour s'assurer
    setTimeout(() => {
      try {
        speechSynthesis.cancel();
        console.log('🔇 speechSynthesis.cancel() appelé (2e tentative)');
      } catch (error) {
        console.log('❌ Erreur 2e tentative:', error);
      }
      stopSignalRef.current = false; // Reset pour permettre nouveaux audios
    }, 100);
    
    setTimeout(() => {
      try {
        speechSynthesis.cancel();
        console.log('🔇 speechSynthesis.cancel() appelé (3e tentative)');
      } catch (error) {
        console.log('❌ Erreur 3e tentative:', error);
      }
    }, 300);
  };

  // Fonction pour scroller vers l'illustration
  const scrollToIllustration = () => {
    const element = document.getElementById('number-analysis');
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'center'
      });
    }
  };

  // Fonction pour scroller vers le sélecteur de nombre
  const scrollToNumberChoice = () => {
    const element = document.getElementById('number-choice');
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'center'
      });
    }
  };

  // Fonction d'attente
  const wait = (ms: number): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (stopSignalRef.current) {
        resolve();
        return;
      }
        resolve();
      }, ms);
    });
  };

  // Fonction pour jouer un audio avec gestion d'interruption
  const playAudio = async (text: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      try {
        if (stopSignalRef.current) {
          console.log('🚫 playAudio annulé par stopSignalRef');
        resolve();
        return;
      }
      
        // S'assurer que la synthèse précédente est bien arrêtée
        if (speechSynthesis.speaking || speechSynthesis.pending) {
          speechSynthesis.cancel();
          console.log('🔇 Audio précédent annulé dans playAudio');
        }
        
        if (!('speechSynthesis' in window)) {
          console.warn('SpeechSynthesis API non disponible');
          resolve();
          return;
        }
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'fr-FR';
        utterance.rate = 1.05; // Débit optimisé
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
      
      utterance.onend = () => {
          currentAudioRef.current = null;
        resolve();
      };
      
        utterance.onerror = (event) => {
          console.error('Erreur synthèse vocale:', event);
          currentAudioRef.current = null;
        resolve();
      };
      
        if (stopSignalRef.current) {
          resolve();
          return;
        }

        speechSynthesis.speak(utterance);
      } catch (error) {
        console.error('Erreur dans playAudio:', error);
        currentAudioRef.current = null;
        resolve();
      }
    });
  };

  // Fonction pour expliquer le chapitre au démarrage avec animations
  const explainChapter = async () => {
    console.log('📖 explainChapter - Début explication');
    
    stopSignalRef.current = false;
    setIsPlayingVocal(true);
    setHasStarted(true);

    try {
      console.log('Début explainChapter - Dizaines et unités');
      
      await playAudio("Bonjour ! Bienvenue dans le chapitre sur les dizaines et unités !");
      if (stopSignalRef.current) return;
      await wait(1200);
      
      await playAudio("Aujourd'hui, tu vas apprendre un secret très important sur les nombres !");
      if (stopSignalRef.current) return;
      await wait(1500);
      
      // Animation directe avec l'exemple 15
      setHighlightedElement('example-section');
      setAnimatingExample(true);
      await playAudio("Regardons ensemble le nombre 15 !");
      if (stopSignalRef.current) return;
      await wait(1000);
      
      await playAudio("Quand tu vois un nombre à 2 chiffres, il y a une règle magique !");
      if (stopSignalRef.current) return;
      await wait(1500);
      
      // Animation du chiffre de gauche
      setHighlightDigit('left');
      await playAudio("Le chiffre de gauche, ici le 1, représente les dizaines !");
      if (stopSignalRef.current) return;
      await wait(1800);
      
      setAnimatingCircles('dizaines');
      await playAudio("1 dizaine, c'est 1 groupe de 10 objets ! Regarde les 10 cercles bleus !");
      if (stopSignalRef.current) return;
      await wait(1800);
      
      // Animation du chiffre de droite
      setHighlightDigit('right');
      setAnimatingCircles('unites');
      await playAudio("Le chiffre de droite, ici le 5, représente les unités !");
      if (stopSignalRef.current) return;
      await wait(1800);
      
      await playAudio("5 unités, ce sont 5 objets tout seuls ! Regarde les 5 cercles rouges !");
      if (stopSignalRef.current) return;
      await wait(2000);
      
      // Animation finale
      setHighlightDigit(null);
      setAnimatingCircles('all');
      await playAudio("Donc 15, c'est 1 groupe de 10 plus 5 unités ! 10 plus 5 égale 15 !");
      if (stopSignalRef.current) return;
      await wait(2500);
      
      await playAudio("C'est comme ça que fonctionnent TOUS les nombres à 2 chiffres !");
      if (stopSignalRef.current) return;
      await wait(1800);
      
      await playAudio("Gauche égale dizaines, droite égale unités ! C'est la règle !");
      if (stopSignalRef.current) return;
      await wait(1800);
      
      // Transition vers les choix
      setHighlightedElement(null);
      setAnimatingExample(false);
      setAnimatingCircles(null);
      await wait(1000);
      
      scrollToNumberChoice();
      setHighlightedElement('number-choice');
      await playAudio("Maintenant, choisis un nombre et je te montrerai sa décomposition !");
      if (stopSignalRef.current) return;
      await wait(1500);
      
      await playAudio("Tu verras toujours : chiffre de gauche égale dizaines, chiffre de droite égale unités !");
      if (stopSignalRef.current) return;
      await wait(2000);
      
      setHighlightedElement(null);
      await playAudio("Alors, quel nombre veux-tu décomposer ?");
      if (stopSignalRef.current) return;
      await wait(1500);
      
    } catch (error) {
      console.error('Erreur dans explainChapter:', error);
    } finally {
      console.log('📖 explainChapter - Fin (normale ou interrompue)');
      setIsPlayingVocal(false);
      setHighlightedElement(null);
      setAnimatingExample(false);
      setHighlightDigit(null);
      setAnimatingCircles(null);
    }
  };

  // Fonction pour expliquer un nombre spécifique avec animations avancées
  const explainNumber = async (number: number) => {
    console.log(`🔢 explainNumber(${number}) - Début, arrêt des animations précédentes`);
    
    // Arrêter toute animation/vocal en cours
    stopAllVocalsAndAnimations();
    
    // Attendre un délai pour s'assurer que l'arrêt est effectif
    await wait(300);
    
    // Vérifier une dernière fois si quelque chose joue encore
    if (speechSynthesis.speaking || speechSynthesis.pending) {
      speechSynthesis.cancel();
      await wait(100);
    }
    
    stopSignalRef.current = false;
    setIsPlayingVocal(true);
    setAnimatingDecomposition(true);

    try {
      scrollToIllustration();
      
      const { dizaines, unites } = analyzeNumber(number);
      const numberStr = number.toString();
      
      await playAudio(`Le nombre ${number} !`);
      if (stopSignalRef.current) return;
      await wait(800);
      
      // Expliquer la position des chiffres
      if (numberStr.length === 2) {
        await playAudio(`Regardons les chiffres ! Le ${numberStr[0]} à gauche, et le ${numberStr[1]} à droite !`);
        if (stopSignalRef.current) return;
        await wait(1800);
        
        await playAudio(`Souviens-toi : gauche égale dizaines, droite égale unités !`);
        if (stopSignalRef.current) return;
        await wait(1500);
      }
      
      setAnimatingCircles('dizaines');
      if (dizaines > 0) {
        await playAudio(`Le ${numberStr[0]} de gauche donne ${dizaines} dizaine${dizaines > 1 ? 's' : ''} !`);
        if (stopSignalRef.current) return;
        await wait(1500);
        
        await playAudio(`Regarde le${dizaines > 1 ? 's' : ''} groupe${dizaines > 1 ? 's' : ''} de 10 cercles bleus ! ${dizaines} fois 10 égale ${dizaines * 10} !`);
        if (stopSignalRef.current) return;
        await wait(1800);
      }
      
      setAnimatingCircles('unites');
      if (unites > 0) {
        await playAudio(`Le ${numberStr[1] || '0'} de droite donne ${unites} unité${unites > 1 ? 's' : ''} !`);
        if (stopSignalRef.current) return;
        await wait(1500);
        
        await playAudio(`Regarde le${unites > 1 ? 's' : ''} ${unites} cercle${unites > 1 ? 's' : ''} rouge${unites > 1 ? 's' : ''} ! Ce sont les unités !`);
        if (stopSignalRef.current) return;
        await wait(1800);
      }
      
      setAnimatingCircles('all');
      await playAudio(`Au total : ${dizaines * 10} plus ${unites} égale ${number} !`);
      if (stopSignalRef.current) return;
      await wait(1800);
      
      await playAudio(`Formidable ! ${number} égale ${dizaines} dizaine${dizaines > 1 ? 's' : ''} plus ${unites} unité${unites > 1 ? 's' : ''} !`);
      if (stopSignalRef.current) return;
      await wait(1500);
      
      await playAudio("Choisis un autre nombre pour continuer à t'exercer !");
      
    } catch (error) {
      console.error('Erreur dans explainNumber:', error);
    } finally {
      console.log('🔢 explainNumber - Fin (normale ou interrompue)');
      setIsPlayingVocal(false);
      setAnimatingDecomposition(false);
      setAnimatingCircles(null);
    }
  };

  // Fonction pour mélanger un tableau
  const shuffleArray = (array: string[]) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const [shuffledChoices, setShuffledChoices] = useState<string[]>([]);

  // Sauvegarder les progrès
  const saveProgress = (score: number, maxScore: number) => {
    const progress = {
      sectionId: 'dizaines-unites',
      completed: true,
      score: score,
      maxScore: maxScore,
      completedAt: new Date().toISOString(),
      attempts: 1
    };

    const existingProgress = localStorage.getItem('cp-nombres-20-progress');
    let allProgress = [];
    
    if (existingProgress) {
      allProgress = JSON.parse(existingProgress);
      const existingIndex = allProgress.findIndex((p: any) => p.sectionId === 'dizaines-unites');
      
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

    localStorage.setItem('cp-nombres-20-progress', JSON.stringify(allProgress));
  };

  // Fonction pour analyser un nombre en dizaines et unités
  const analyzeNumber = (num: number) => {
    const dizaines = Math.floor(num / 10);
    const unites = num % 10;
    return { dizaines, unites };
  };

  // Données des nombres avec leur décomposition
  const numbersData = Array.from({ length: 10 }, (_, i) => {
    const number = i + 11;
    const { dizaines, unites } = analyzeNumber(number);
    return {
      number,
      dizaines,
      unites,
      visual: `${'🔵'.repeat(dizaines)}${'🔴'.repeat(unites)}`,
      explanation: `${number} = ${dizaines} dizaine${dizaines > 1 ? 's' : ''} + ${unites} unité${unites > 1 ? 's' : ''}`
    };
  });

  // Exercices sur les dizaines et unités
  const exercises = [
    { question: '13 = ? dizaine + ? unités', number: 13, correctAnswer: '1 dizaine + 3 unités', choices: ['1 dizaine + 3 unités', '3 dizaines + 1 unité', '1 dizaine + 2 unités'] },
    { question: '17 = ? dizaine + ? unités', number: 17, correctAnswer: '1 dizaine + 7 unités', choices: ['1 dizaine + 7 unités', '7 dizaines + 1 unité', '1 dizaine + 6 unités'] },
    { question: '15 = ? dizaine + ? unités', number: 15, correctAnswer: '1 dizaine + 5 unités', choices: ['1 dizaine + 5 unités', '5 dizaines + 1 unité', '1 dizaine + 4 unités'] },
    { question: '19 = ? dizaine + ? unités', number: 19, correctAnswer: '1 dizaine + 9 unités', choices: ['1 dizaine + 9 unités', '9 dizaines + 1 unité', '1 dizaine + 8 unités'] },
    { question: '12 = ? dizaine + ? unités', number: 12, correctAnswer: '1 dizaine + 2 unités', choices: ['1 dizaine + 2 unités', '2 dizaines + 1 unité', '1 dizaine + 1 unité'] },
    { question: '16 = ? dizaine + ? unités', number: 16, correctAnswer: '1 dizaine + 6 unités', choices: ['1 dizaine + 6 unités', '6 dizaines + 1 unité', '1 dizaine + 5 unités'] },
    { question: '18 = ? dizaine + ? unités', number: 18, correctAnswer: '1 dizaine + 8 unités', choices: ['1 dizaine + 8 unités', '8 dizaines + 1 unité', '1 dizaine + 7 unités'] },
    { question: '14 = ? dizaine + ? unités', number: 14, correctAnswer: '1 dizaine + 4 unités', choices: ['1 dizaine + 4 unités', '4 dizaines + 1 unité', '1 dizaine + 3 unités'] },
    { question: '11 = ? dizaine + ? unités', number: 11, correctAnswer: '1 dizaine + 1 unité', choices: ['1 dizaine + 1 unité', '1 dizaine + 0 unité', '0 dizaine + 11 unités'] },
    { question: '20 = ? dizaines + ? unités', number: 20, correctAnswer: '2 dizaines + 0 unité', choices: ['2 dizaines + 0 unité', '1 dizaine + 10 unités', '0 dizaine + 20 unités'] },
    { question: '13 = ? dizaine + ? unités', number: 13, correctAnswer: '1 dizaine + 3 unités', choices: ['1 dizaine + 3 unités', '2 dizaines + 3 unités', '0 dizaine + 13 unités'] },
    { question: '16 = ? dizaine + ? unités', number: 16, correctAnswer: '1 dizaine + 6 unités', choices: ['1 dizaine + 6 unités', '1 dizaine + 5 unités', '2 dizaines + 6 unités'] },
    { question: '19 = ? dizaine + ? unités', number: 19, correctAnswer: '1 dizaine + 9 unités', choices: ['1 dizaine + 9 unités', '1 dizaine + 8 unités', '9 dizaines + 1 unité'] },
    { question: '15 = ? dizaine + ? unités', number: 15, correctAnswer: '1 dizaine + 5 unités', choices: ['1 dizaine + 5 unités', '5 dizaines + 1 unité', '1 dizaine + 4 unités'] },
    { question: '12 = ? dizaine + ? unités', number: 12, correctAnswer: '1 dizaine + 2 unités', choices: ['1 dizaine + 2 unités', '1 dizaine + 1 unité', '2 dizaines + 2 unités'] }
  ];

  // Fonction pour rendre les cercles visuels - dizaines = groupes de 10
  const renderCircles = (dizaines: number, unites: number) => {
    const elements = [];
    
    // Dizaines (groupes de 10 cercles bleus)
    for (let d = 0; d < dizaines; d++) {
      const group = [];
      for (let i = 0; i < 10; i++) {
        group.push(
          <div
            key={`d${d}-${i}`}
            className={`w-4 h-4 rounded-full bg-blue-600 transition-all duration-700 ${
              animatingDecomposition && (animatingCircles === 'dizaines' || animatingCircles === 'all') ? 
              'scale-110 ring-2 ring-blue-300 animate-pulse' : ''
            }`}
          />
        );
      }
      
      elements.push(
        <div
          key={`dizaine-${d}`}
          className={`grid grid-cols-5 gap-1 p-2 rounded-lg border-2 border-blue-300 bg-blue-50 transition-all duration-700 ${
            animatingDecomposition && (animatingCircles === 'dizaines' || animatingCircles === 'all') ? 
            'scale-110 ring-4 ring-blue-400 bg-blue-100' : ''
          }`}
        >
          {group}
          <div className="col-span-5 text-center text-xs font-bold text-blue-700 mt-1">
            1 dizaine = 10
          </div>
        </div>
      );
    }
    
    // Unités (cercles rouges individuels)
    for (let i = 0; i < unites; i++) {
      elements.push(
        <div
          key={`unite-${i}`}
          className={`w-6 h-6 rounded-full bg-red-600 transition-all duration-700 ${
            animatingDecomposition && (animatingCircles === 'unites' || animatingCircles === 'all') ? 
            'scale-125 ring-4 ring-red-300 animate-pulse' : 
            animatingDecomposition ? 'scale-110 ring-2 ring-red-300' : ''
          }`}
        />
      );
    }
    
    return elements;
  };

  // Initialiser les choix mélangés pour l'exercice actuel
  const initializeShuffledChoices = () => {
    const currentChoices = exercises[currentExercise].choices;
    const shuffled = shuffleArray(currentChoices);
    setShuffledChoices(shuffled);
  };

  // Effet pour initialiser le client
  useEffect(() => {
    setIsClient(true);
    console.log('✅ Composant DizainesUnites initialisé avec surveillance navigation renforcée');
  }, []);

  // Effet pour gérer les changements de visibilité de la page et navigation
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopAllVocalsAndAnimations();
      }
    };

    const handleBeforeUnload = () => {
      stopAllVocalsAndAnimations();
    };

    const handlePopState = () => {
      console.log('Navigation détectée (popstate) - arrêt audio');
      stopAllVocalsAndAnimations();
    };

    const handlePageHide = () => {
      console.log('Page cachée (pagehide) - arrêt audio');
      stopAllVocalsAndAnimations();
    };

    const handleUnload = () => {
      console.log('Page déchargée (unload) - arrêt audio');
      stopAllVocalsAndAnimations();
    };

    // Navigation via historique du navigateur
    const handleHashChange = () => {
      console.log('Changement de hash détecté - arrêt audio');
      stopAllVocalsAndAnimations();
    };

    // Focus/blur de la fenêtre (indicateur de navigation)
    const handleBlur = () => {
      console.log('Fenêtre blur détecté - arrêt audio');
      stopAllVocalsAndAnimations();
    };

    const handleFocus = () => {
      console.log('Fenêtre focus détecté');
      // Pas d'arrêt sur focus, juste log
    };

    // Détection de changement d'URL (pour Next.js)
    const handleLocationChange = () => {
      console.log('Location change détecté - arrêt audio');
      stopAllVocalsAndAnimations();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('popstate', handlePopState);
    window.addEventListener('pagehide', handlePageHide);
    window.addEventListener('unload', handleUnload);
    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('blur', handleBlur);
    window.addEventListener('focus', handleFocus);
    
    // Surveiller les changements d'URL
    let currentUrl = window.location.href;
    const urlCheckInterval = setInterval(() => {
      if (window.location.href !== currentUrl) {
        console.log('🌐 Changement d\'URL détecté - arrêt audio');
        currentUrl = window.location.href;
        stopAllVocalsAndAnimations();
      }
    }, 100);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('pagehide', handlePageHide);
      window.removeEventListener('unload', handleUnload);
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('focus', handleFocus);
      clearInterval(urlCheckInterval);
      console.log('🧹 Nettoyage des event listeners de navigation');
      // Arrêt final au démontage du composant
      stopAllVocalsAndAnimations();
    };
  }, []);

  // Effet pour gérer les changements d'onglet interne (cours ↔ exercices)
  useEffect(() => {
    stopAllVocalsAndAnimations();
  }, [showExercises]);

  // Effet pour mélanger les choix quand on change d'exercice
  useEffect(() => {
    if (exercises.length > 0) {
      initializeShuffledChoices();
    }
  }, [currentExercise]);

  // Effet pour arrêter l'audio lors de la navigation (bouton back)
  useEffect(() => {
    // Écouter les clics sur les liens de navigation
    const handleClick = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'A' || target.closest('a')) {
        console.log('🔗 Clic sur lien détecté - arrêt audio');
        stopAllVocalsAndAnimations();
      }
    };

    // Écouter les changements d'URL via pushState/replaceState
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = function(...args) {
      console.log('📍 history.pushState détecté - arrêt audio');
      stopAllVocalsAndAnimations();
      return originalPushState.apply(history, args);
    };

    history.replaceState = function(...args) {
      console.log('📍 history.replaceState détecté - arrêt audio');
      stopAllVocalsAndAnimations();
      return originalReplaceState.apply(history, args);
    };

    document.addEventListener('click', handleClick);
    
    return () => {
      document.removeEventListener('click', handleClick);
      // Restaurer les méthodes originales
      history.pushState = originalPushState;
      history.replaceState = originalReplaceState;
    };
  }, []);

  const handleAnswerClick = (answer: string) => {
    setUserAnswer(answer);
    const correct = answer === exercises[currentExercise].correctAnswer;
    setIsCorrect(correct);
    
    if (correct && !answeredCorrectly.has(currentExercise)) {
      setScore(prevScore => prevScore + 1);
      setAnsweredCorrectly(prev => {
        const newSet = new Set(prev);
        newSet.add(currentExercise);
        return newSet;
      });
    }

    // Si bonne réponse → passage automatique après 1.5s
    if (correct) {
      setTimeout(() => {
        if (currentExercise + 1 < exercises.length) {
          setCurrentExercise(currentExercise + 1);
          setUserAnswer('');
          setIsCorrect(null);
      } else {
          // Dernier exercice terminé
          const finalScoreValue = score + (!answeredCorrectly.has(currentExercise) ? 1 : 0);
          setFinalScore(finalScoreValue);
          setShowCompletionModal(true);
          saveProgress(finalScoreValue, exercises.length);
        }
      }, 1500);
    }
  };

  const nextExercise = () => {
    if (currentExercise < exercises.length - 1) {
      setCurrentExercise(currentExercise + 1);
      setUserAnswer('');
      setIsCorrect(null);
    } else {
      setFinalScore(score);
      setShowCompletionModal(true);
      saveProgress(score, exercises.length);
    }
  };

  const resetAll = () => {
    setCurrentExercise(0);
    setUserAnswer('');
    setIsCorrect(null);
    setScore(0);
    setAnsweredCorrectly(new Set());
    setShowCompletionModal(false);
    setFinalScore(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/chapitre/cp-nombres-jusqu-20" 
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
            onClick={stopAllVocalsAndAnimations}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour au chapitre</span>
          </Link>
          
          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              🔢 Dizaines et unités
            </h1>
            <p className="text-lg text-gray-600">
              Apprends à décomposer les nombres en dizaines et unités !
            </p>
          </div>
        </div>



        {/* Message de debug temporaire (visible en mode développement) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="fixed bottom-4 left-4 bg-green-600 text-white px-3 py-1 rounded text-xs opacity-75 z-40">
            🔍 Navigation surveillance: ON
          </div>
        )}

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
                  ? 'bg-purple-500 text-white shadow-md' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              📖 Cours
            </button>
            <button
              onClick={() => {
                stopAllVocalsAndAnimations();
                setShowExercises(true);
              }}
              className={`px-6 py-3 rounded-lg font-bold transition-all ${
                showExercises 
                  ? 'bg-purple-500 text-white shadow-md' 
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
            {/* Bouton Démarrer */}
            <div className="flex justify-center mb-8">
              <button
                onClick={explainChapter}
                disabled={isPlayingVocal}
                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-12 py-6 rounded-2xl font-bold text-2xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed animate-pulse"
              >
                <Play className="inline w-8 h-8 mr-3" />
                🎯 Démarrer l'explication !
              </button>
            </div>

            {/* Qu'est-ce que les dizaines et unités ? */}
            <div 
              id="example-section"
              className={`bg-white rounded-xl p-8 shadow-lg transition-all duration-500 ${
                highlightedElement === 'example-section' ? 'ring-4 ring-blue-400 bg-blue-50' : ''
              }`}
            >
              <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
                🤔 Qu'est-ce que les dizaines et unités ?
              </h2>
              
              <div className="bg-purple-50 rounded-lg p-6 mb-6">
                <p className="text-lg text-center text-purple-800 font-semibold mb-4">
                  Chaque nombre a des dizaines (groupes de 10) et des unités (ce qui reste) !
                </p>
                
                <div className="bg-white rounded-lg p-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600 mb-4">
                      Exemple avec le nombre :
                </div>
                    
                    {/* Affichage animé du nombre 15 */}
                    <div className="flex justify-center items-center mb-6">
                      <div className={`text-8xl font-bold transition-all duration-700 ${
                        highlightDigit === 'left' ? 'text-blue-500 scale-125 animate-bounce' : 
                        animatingExample ? 'text-purple-600' : 'text-gray-600'
                      }`}>
                        1
                      </div>
                      <div className={`text-8xl font-bold transition-all duration-700 ${
                        highlightDigit === 'right' ? 'text-red-500 scale-125 animate-bounce' : 
                        animatingExample ? 'text-purple-600' : 'text-gray-600'
                      }`}>
                        5
              </div>
            </div>

                    {/* Explications positionnelles */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className={`p-3 rounded-lg transition-all duration-500 ${
                        highlightDigit === 'left' ? 'bg-blue-200 ring-4 ring-blue-400' : 'bg-blue-50'
                      }`}>
                        <div className="text-blue-800 font-bold">↑ Chiffre de GAUCHE</div>
                        <div className="text-blue-600">= DIZAINES</div>
                      </div>
                      <div className={`p-3 rounded-lg transition-all duration-500 ${
                        highlightDigit === 'right' ? 'bg-red-200 ring-4 ring-red-400' : 'bg-red-50'
                      }`}>
                        <div className="text-red-800 font-bold">↑ Chiffre de DROITE</div>
                        <div className="text-red-600">= UNITÉS</div>
                      </div>
                    </div>
                    
                    {/* Représentation réaliste */}
                    <div className="flex justify-center gap-4 mb-4 flex-wrap">
                      {/* Dizaine = groupe de 10 */}
                      <div className={`transition-all duration-700 ${
                        animatingCircles === 'dizaines' || animatingCircles === 'all' ? 
                        'scale-110 ring-4 ring-blue-400' : ''
                      }`}>
                        <div className="grid grid-cols-5 gap-1 p-3 rounded-lg border-2 border-blue-400 bg-blue-100">
                          {Array.from({ length: 10 }, (_, i) => (
                            <div
                              key={i}
                              className="w-5 h-5 rounded-full bg-blue-600"
                            />
                          ))}
                          <div className="col-span-5 text-center text-sm font-bold text-blue-700 mt-2">
                            1 dizaine = 10
                          </div>
                        </div>
                      </div>
                      
                      {/* Unités individuelles */}
                      <div className={`flex gap-1 items-center transition-all duration-700 ${
                        animatingCircles === 'unites' || animatingCircles === 'all' ? 
                        'scale-125 ring-4 ring-red-300 rounded-lg p-2' : ''
                      }`}>
                        {Array.from({ length: 5 }, (_, i) => (
                          <div
                            key={i}
                            className="w-6 h-6 rounded-full bg-red-600"
                          />
                        ))}
                        <div className="ml-2 text-sm font-bold text-red-700">
                          5 unités
                        </div>
                      </div>
                </div>
                
                    <div className="text-xl font-bold text-gray-700">
                      1 dizaine + 5 unités = 15
                    </div>
                  </div>
                </div>
              </div>
                </div>
                
            {/* Comprendre avec les objets */}
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
                🎯 Comprendre avec des objets
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-blue-50 rounded-lg p-6">
                  <h3 className="text-xl font-bold mb-4 text-blue-800">
                    🔵 Une dizaine = 10 unités groupées
                  </h3>
                  <div className="space-y-3">
                    <div className="bg-white rounded-lg p-3 text-center">
                      <div className="grid grid-cols-5 gap-1 justify-center mb-2">
                        {Array.from({ length: 10 }, (_, i) => (
                          <div
                            key={i}
                            className="w-4 h-4 rounded-full bg-red-600"
                          />
                        ))}
                              </div>
                      <div className="text-lg font-bold">10 unités = 1 dizaine</div>
                      <div className="text-lg">⬇️</div>
                      <div className="border-2 border-blue-400 rounded p-2 bg-blue-100 inline-block">
                        <div className="grid grid-cols-5 gap-1">
                          {Array.from({ length: 10 }, (_, i) => (
                            <div
                              key={i}
                                                             className="w-3 h-3 rounded-full bg-blue-600"
                            />
                          ))}
                        </div>
                        <div className="text-xs text-blue-700 font-bold mt-1">1 dizaine</div>
                      </div>
                    </div>
                            </div>
                          </div>
                        
                <div className="bg-red-50 rounded-lg p-6">
                  <h3 className="text-xl font-bold mb-4 text-red-800">
                    🔴 Les unités = objets individuels
                  </h3>
                  <div className="space-y-3">
                    <div className="bg-white rounded-lg p-3 text-center">
                      <div className="text-lg font-bold mb-2">Dans 13 :</div>
                      <div className="flex justify-center gap-2 mb-2">
                        {/* 1 dizaine */}
                        <div className="border-2 border-blue-400 rounded p-1 bg-blue-100">
                          <div className="grid grid-cols-5 gap-1">
                            {Array.from({ length: 10 }, (_, i) => (
                              <div
                                key={i}
                                                                 className="w-2 h-2 rounded-full bg-blue-600"
                              />
                            ))}
                                  </div>
                                  </div>
                        {/* 3 unités */}
                        {Array.from({ length: 3 }, (_, i) => (
                          <div
                            key={i}
                            className="w-4 h-4 rounded-full bg-red-600"
                          />
                        ))}
                      </div>
                      <div className="text-lg">1 dizaine + 3 unités</div>
                    </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
            {/* Sélecteur de nombre */}
            <div 
              id="number-choice"
              className={`bg-white rounded-xl p-8 shadow-lg transition-all duration-500 ${
                highlightedElement === 'number-choice' ? 'ring-4 ring-green-400 bg-green-50' : ''
              }`}
            >
              <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
                🎯 Choisis un nombre à analyser
              </h2>
              
              <div className="grid grid-cols-5 gap-4 mb-6">
                {Array.from({ length: 10 }, (_, i) => i + 11).map((num) => (
                    <button
                    key={num}
                      onClick={() => {
                      setSelectedNumber(num);
                      explainNumber(num);
                    }}
                    className={`p-4 rounded-lg font-bold text-2xl transition-all ${
                      selectedNumber === num
                        ? 'bg-purple-500 text-white shadow-lg scale-105'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                    {num}
                    </button>
                ))}
                  </div>
                </div>

            {/* Affichage de l'analyse */}
            <div 
              id="number-analysis"
              className={`bg-white rounded-xl p-8 shadow-lg transition-all duration-500 ${
                animatingDecomposition ? 'ring-4 ring-orange-400 bg-orange-50' : ''
              }`}
            >
              <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
                🔍 Analyse de {selectedNumber}
              </h2>
              
              {(() => {
                const { dizaines, unites } = analyzeNumber(selectedNumber);
                const numberStr = selectedNumber.toString();
                return (
                  <div className="bg-indigo-50 rounded-lg p-6">
                    <div className="text-center space-y-6">
                      {/* Affichage du nombre avec position des chiffres */}
                      <div className="flex justify-center items-center mb-6">
                        <div className="text-6xl font-bold text-blue-500 mr-2">
                          {numberStr[0]}
                    </div>
                        <div className="text-6xl font-bold text-red-500">
                          {numberStr[1] || '0'}
                  </div>
                </div>

                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-blue-100 rounded-lg p-3">
                          <div className="text-blue-800 font-bold">↑ GAUCHE = DIZAINES</div>
                          <div className="text-3xl font-bold text-blue-600">{numberStr[0]}</div>
                        </div>
                        <div className="bg-red-100 rounded-lg p-3">
                          <div className="text-red-800 font-bold">↑ DROITE = UNITÉS</div>
                          <div className="text-3xl font-bold text-red-600">{numberStr[1] || '0'}</div>
                      </div>
                    </div>
                      
                      <div className="text-2xl font-bold text-indigo-600 mb-4">
                        {selectedNumber} = {dizaines} dizaine{dizaines > 1 ? 's' : ''} + {unites} unité{unites > 1 ? 's' : ''}
                  </div>
                  
                      <div className="bg-white rounded-lg p-6">
                        <div className="flex justify-center gap-4 mb-6 flex-wrap items-center">
                          {renderCircles(dizaines, unites)}
                  </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-lg">
                          <div className={`bg-blue-100 rounded-lg p-4 transition-all duration-700 ${
                            animatingCircles === 'dizaines' || animatingCircles === 'all' ? 
                            'ring-4 ring-blue-400 bg-blue-200' : ''
                          }`}>
                            <div className="font-bold text-blue-800">Dizaines :</div>
                            <div className="flex justify-center gap-1 my-2">
                              {Array.from({ length: dizaines }, (_, i) => (
                                <div
                                  key={i}
                                  className={`w-6 h-6 rounded-full bg-blue-600 transition-all duration-700 ${
                                    animatingDecomposition && (animatingCircles === 'dizaines' || animatingCircles === 'all') ? 
                                    'scale-125 ring-2 ring-blue-300 animate-pulse' : 
                                    animatingDecomposition ? 'scale-110 ring-2 ring-blue-300' : ''
                                  }`}
                                />
                              ))}
                            </div>
                            <div className="font-bold text-blue-800">{dizaines} × 10 = {dizaines * 10}</div>
                </div>

                          <div className={`bg-red-100 rounded-lg p-4 transition-all duration-700 ${
                            animatingCircles === 'unites' || animatingCircles === 'all' ? 
                            'ring-4 ring-red-400 bg-red-200' : ''
                          }`}>
                            <div className="font-bold text-red-800">Unités :</div>
                            <div className="flex justify-center gap-1 my-2">
                              {Array.from({ length: unites }, (_, i) => (
                                <div
                                  key={i}
                                  className={`w-6 h-6 rounded-full bg-red-600 transition-all duration-700 ${
                                    animatingDecomposition && (animatingCircles === 'unites' || animatingCircles === 'all') ? 
                                    'scale-125 ring-2 ring-red-300 animate-pulse' : 
                                    animatingDecomposition ? 'scale-110 ring-2 ring-red-300' : ''
                                  }`}
                                />
                              ))}
                            </div>
                            <div className="font-bold text-red-800">{unites} × 1 = {unites}</div>
                        </div>
                      </div>
                        
                        <div className={`mt-6 text-2xl font-bold transition-all duration-700 ${
                          animatingCircles === 'all' ? 'text-purple-600 scale-110' : 'text-gray-700'
                        }`}>
                          {dizaines * 10} + {unites} = {selectedNumber}
                    </div>
                      </div>
                    </div>
                  </div>
                );
              })()}
                  </div>
                  
            {/* Exemples */}
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
                📚 Exemples
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { number: 12, dizaines: 1, unites: 2 },
                  { number: 17, dizaines: 1, unites: 7 },
                  { number: 20, dizaines: 2, unites: 0 },
                  { number: 19, dizaines: 1, unites: 9 }
                ].map((item, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600 mb-2">
                        {item.number}
                        </div>
                      <div className="flex justify-center gap-2 mb-2 flex-wrap">
                        {renderCircles(item.dizaines, item.unites)}
                      </div>
                      <div className="text-lg text-gray-700">
                        {item.dizaines} dizaine{item.dizaines > 1 ? 's' : ''} + {item.unites} unité{item.unites > 1 ? 's' : ''}
                    </div>
                  </div>
                </div>
                ))}
              </div>
            </div>

            {/* Conseils */}
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
                💡 Trucs pour retenir
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-blue-50 rounded-lg p-6">
                  <h3 className="text-xl font-bold mb-4 text-blue-800">
                    🔵 Pour les dizaines
                  </h3>
                  <ul className="space-y-2 text-blue-700">
                    <li>• Compte par groupes de 10</li>
                    <li>• Utilise tes 10 doigts</li>
                    <li>• 1 dizaine = 10 unités</li>
                    <li>• Regarde le chiffre de gauche</li>
              </ul>
            </div>
                
                <div className="bg-red-50 rounded-lg p-6">
                  <h3 className="text-xl font-bold mb-4 text-red-800">
                    🔴 Pour les unités
                  </h3>
                  <ul className="space-y-2 text-red-700">
                    <li>• Ce qui reste après les dizaines</li>
                    <li>• Toujours moins de 10</li>
                    <li>• Regarde le chiffre de droite</li>
                    <li>• Compte un par un</li>
                  </ul>
          </div>
                </div>
              </div>

            {/* Mini-jeu */}
            <div className="bg-gradient-to-r from-purple-400 to-indigo-400 rounded-xl p-6 text-white">
              <h3 className="text-xl font-bold mb-3">🎮 Mini-jeu : Trouve les dizaines et unités !</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { number: '14', answer: '1 dizaine + 4 unités' },
                  { number: '18', answer: '1 dizaine + 8 unités' },
                  { number: '20', answer: '2 dizaines + 0 unité' },
                  { number: '16', answer: '1 dizaine + 6 unités' }
                ].map((item, index) => (
                  <div key={index} className="bg-white bg-opacity-20 rounded-lg p-3 text-center">
                    <div className="font-bold mb-2">{item.number} = ?</div>
                    <div className="text-sm font-bold">{item.answer}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* EXERCICES */
          <div className="space-y-8">
            {/* Header exercices */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-900">
                  ✏️ Exercice {currentExercise + 1} sur {exercises.length}
                </h2>
                <button
                  onClick={resetAll}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-gray-600 transition-colors"
                >
                  <RotateCcw className="inline w-4 h-4 mr-2" />
                  Recommencer
                </button>
              </div>
              
              {/* Barre de progression */}
              <div className="w-full bg-gray-200 rounded-full h-4 mb-3">
                <div 
                  className="bg-purple-500 h-4 rounded-full transition-all duration-500"
                  style={{ width: `${((currentExercise + 1) / exercises.length) * 100}%` }}
                ></div>
              </div>
              
              {/* Score */}
              <div className="text-center">
                <div className="text-xl font-bold text-purple-600">
                  Score : {score}/{exercises.length}
                </div>
              </div>
            </div>

            {/* Question */}
            <div className="bg-white rounded-xl p-8 shadow-lg text-center">
              <h3 className="text-2xl font-bold mb-8 text-gray-900">
                {exercises[currentExercise].question}
              </h3>
                
              {/* Affichage du nombre à analyser */}
              <div className="bg-purple-50 rounded-lg p-6 mb-8">
                <div className="text-6xl font-bold text-purple-600 mb-4">
                  {exercises[currentExercise].number}
              </div>
                <div className="flex justify-center gap-2 mb-4 flex-wrap">
                  {(() => {
                    const { dizaines, unites } = analyzeNumber(exercises[currentExercise].number);
                    return renderCircles(dizaines, unites);
                  })()}
                    </div>
                <p className="text-lg text-gray-700 font-semibold">
                  Décompose ce nombre en dizaines et unités !
                </p>
              </div>
              
              {/* Choix multiples */}
              <div className="grid grid-cols-1 gap-4 max-w-lg mx-auto mb-8">
                {shuffledChoices.map((choice) => (
                  <button
                    key={choice}
                    onClick={() => handleAnswerClick(choice)}
                    disabled={isCorrect !== null}
                    className={`p-6 rounded-lg font-bold text-lg transition-all ${
                      userAnswer === choice
                        ? isCorrect === true
                          ? 'bg-green-500 text-white'
                          : isCorrect === false
                            ? 'bg-red-500 text-white'
                            : 'bg-purple-500 text-white'
                        : exercises[currentExercise].correctAnswer === choice && isCorrect === false
                          ? 'bg-green-200 text-green-800 border-2 border-green-500'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50'
                    } disabled:cursor-not-allowed`}
                  >
                    {choice}
                  </button>
                ))}
              </div>
              
              {/* Résultat */}
              {isCorrect !== null && (
                <div className={`p-6 rounded-lg mb-6 ${
                  isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  <div className="flex items-center justify-center space-x-3 mb-4">
                    {isCorrect ? (
                      <>
                        <CheckCircle className="w-8 h-8" />
                        <span className="font-bold text-xl">
                          Excellent ! {exercises[currentExercise].correctAnswer} est la bonne réponse !
                        </span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-8 h-8" />
                        <span className="font-bold text-xl">
                          Pas tout à fait... La bonne réponse est {exercises[currentExercise].correctAnswer} !
                        </span>
                      </>
                    )}
                  </div>
                  
                  {/* Explication pour les mauvaises réponses */}
                  {!isCorrect && (
                    <div className="bg-white rounded-lg p-6 border-2 border-blue-300">
                      <h4 className="text-lg font-bold mb-4 text-blue-800 text-center">
                        📚 Explication
                      </h4>
                      
                      <div className="space-y-4">
                        <div className="bg-blue-50 rounded-lg p-4 text-center">
                          <div className="text-xl font-bold text-blue-600 mb-2">
                            {exercises[currentExercise].number} = {exercises[currentExercise].correctAnswer}
                </div>
                          <div className="flex justify-center gap-2 mb-2 flex-wrap">
                            {(() => {
                              const { dizaines, unites } = analyzeNumber(exercises[currentExercise].number);
                              return renderCircles(dizaines, unites);
                            })()}
                          </div>
                          <div className="text-lg text-gray-700">
                            Compte les groupes de 10 (cadres bleus) et les unités isolées (cercles rouges) !
                          </div>
                        </div>
                        
                        <div className="bg-gradient-to-r from-purple-100 to-indigo-100 rounded-lg p-3 text-center">
                          <div className="text-lg">🌟</div>
                          <p className="text-sm font-semibold text-purple-800">
                            Maintenant tu sais décomposer {exercises[currentExercise].number} !
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {/* Navigation */}
              {isCorrect === false && (
                <div className="flex justify-center">
                  <button
                    onClick={nextExercise}
                    className="bg-purple-500 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-purple-600 transition-colors"
                  >
                    Suivant →
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Modale de fin */}
        {showCompletionModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-2xl">
              {(() => {
                const percentage = Math.round((finalScore / exercises.length) * 100);
                const getMessage = () => {
                  if (percentage >= 90) return { title: "🎉 Expert des dizaines et unités !", message: "Tu maîtrises parfaitement !", emoji: "🎉" };
                  if (percentage >= 70) return { title: "👏 Très bien !", message: "Tu progresses super bien !", emoji: "👏" };
                  if (percentage >= 50) return { title: "👍 C'est bien !", message: "Continue, tu apprends bien !", emoji: "😊" };
                  return { title: "💪 Continue !", message: "Recommence pour mieux maîtriser !", emoji: "📚" };
                };
                const result = getMessage();
                return (
                  <>
                    <div className="text-6xl mb-4">{result.emoji}</div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">{result.title}</h3>
                    <p className="text-lg text-gray-700 mb-6">{result.message}</p>
                    <div className="bg-purple-100 rounded-lg p-4 mb-6">
                      <p className="text-xl font-bold text-gray-900">
                        Score : {finalScore}/{exercises.length}
                      </p>
                      <div className="text-4xl mt-2">
                        {finalScore >= 12 ? '⭐⭐⭐' : finalScore >= 8 ? '⭐⭐' : '⭐'}
                      </div>
                      <p className="text-sm text-gray-600 mt-2">
                        Comprendre les dizaines et unités est très important !
                      </p>
                    </div>
                    <div className="flex space-x-3">
                      <button
                        onClick={resetAll}
                        className="flex-1 bg-purple-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-purple-600 transition-colors"
                      >
                        Recommencer
                      </button>
                      <button
                        onClick={() => setShowCompletionModal(false)}
                        className="flex-1 bg-gray-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-gray-600 transition-colors"
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
    </div>
  );
} 