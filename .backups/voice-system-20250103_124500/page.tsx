'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, Calculator, Target, Star, CheckCircle, XCircle, Trophy, Brain, Zap, BookOpen, Eye } from 'lucide-react';

export default function AdditionsJusqua100() {
  // États pour l'audio et animations
  const [isPlayingVocal, setIsPlayingVocal] = useState(false);
  const [isAnimationRunning, setIsAnimationRunning] = useState(false);
  const [highlightedElement, setHighlightedElement] = useState<string | null>(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [animatingStep, setAnimatingStep] = useState<string | null>(null);
  const [currentExample, setCurrentExample] = useState<number | null>(null);
  const [currentTechnique, setCurrentTechnique] = useState<string | null>(null);
  const [calculationStep, setCalculationStep] = useState<'setup' | 'show-first' | 'decompose-first' | 'show-second' | 'decompose-second' | 'explain-strategy' | 'units' | 'units-sum' | 'carry-explanation' | 'carry-visual' | 'tens' | 'regroup' | 'result' | 'show-problem' | 'find-complement' | 'add-complement' | 'show-intermediate' | 'add-remaining' | null>(null);
  const [showingCarry, setShowingCarry] = useState(false);
  const [highlightedDigits, setHighlightedDigits] = useState<string[]>([]);

  // États pour les exercices
  const [showExercises, setShowExercises] = useState(false);
  const [currentExercise, setCurrentExercise] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [answeredCorrectly, setAnsweredCorrectly] = useState<Set<number>>(new Set());
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [finalScore, setFinalScore] = useState(0);

  // Refs pour gérer l'audio
  const stopSignalRef = useRef(false);
  const currentAudioRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Données des techniques d'addition avec animations
  const additionTechniques = [
    {
      id: 'sans-retenue',
      title: 'Addition sans retenue',
      icon: '✨',
      description: 'La technique la plus simple : on additionne directement',
      examples: [
        { 
          calculation: '23 + 45', 
          num1: 23, 
          num2: 45, 
          result: 68,
          steps: [
            'On place les nombres en colonnes, alignés par dizaines et unités',
            'On additionne les unités : 3 + 5 = 8',
            'On additionne les dizaines : 2 + 4 = 6',
            'Le résultat est 68 !'
          ]
        },
        { 
          calculation: '31 + 12', 
          num1: 31, 
          num2: 12, 
          result: 43,
          steps: [
            'On aligne les nombres en colonnes, dizaines et unités',
            'Unités : 1 + 2 = 3',
            'Dizaines : 3 + 1 = 4',
            'Résultat : 43 !'
          ]
        }
      ]
    },
    {
      id: 'avec-retenue',
      title: 'Addition avec retenue',
      icon: '🔄',
      description: 'Quand ça dépasse 10, on fait une retenue magique !',
      examples: [
        { 
          calculation: '37 + 28', 
          num1: 37, 
          num2: 28, 
          result: 65,
          steps: [
            'On place les nombres l\'un sous l\'autre',
            'Unités : 7 + 8 = 15, j\'écris 5 et je retiens 1',
            'Dizaines : 3 + 2 + 1 (retenue) = 6',
            'Le résultat est 65 !'
          ]
        },
        { 
          calculation: '49 + 27', 
          num1: 49, 
          num2: 27, 
          result: 76,
          steps: [
            'On aligne les nombres en colonnes soigneusement',
            'Unités : 9 + 7 = 16, j\'écris 6 et retiens 1',
            'Dizaines : 4 + 2 + 1 = 7',
            'Résultat : 76 !'
          ]
        }
      ]
    },
    {
      id: 'calcul-mental',
      title: 'Calcul mental rapide',
      icon: '🧠',
      description: 'Des astuces pour calculer très vite dans sa tête !',
      examples: [
        { 
          calculation: '35 + 24', 
          num1: 35, 
          num2: 24, 
          result: 59,
          steps: [
            'Je décompose : 35 + 24',
            'J\'additionne les dizaines : 30 + 20 = 50',
            'J\'additionne les unités : 5 + 4 = 9',
            'Je regroupe : 50 + 9 = 59 !'
          ]
        },
        { 
          calculation: '42 + 36', 
          num1: 42, 
          num2: 36, 
          result: 78,
          steps: [
            'Technique maligne : 42 + 36',
            'Dizaines d\'abord : 40 + 30 = 70',
            'Unités ensuite : 2 + 6 = 8',
            'Total : 70 + 8 = 78 !'
          ]
        }
      ]
    },
    {
      id: 'complement-10',
      title: 'Technique du complément à 10',
      icon: '🎯',
      description: 'Utiliser les compléments pour faciliter le calcul',
      examples: [
        { 
          calculation: '27 + 8', 
          num1: 27, 
          num2: 8, 
          result: 35,
          steps: [
            'Je veux ajouter 8 à 27',
            'Je prends 3 de 8 pour faire 30 (27 + 3)',
            'Il me reste 5 à ajouter (8 - 3 = 5)',
            '30 + 5 = 35 ! C\'est magique !'
          ]
        },
        { 
          calculation: '56 + 9', 
          num1: 56, 
          num2: 9, 
          result: 65,
          steps: [
            'J\'ajoute 9 à 56',
            'Je prends 4 de 9 pour faire 60 (56 + 4)',
            'Il reste 5 (9 - 4 = 5)',
            '60 + 5 = 65 ! Technique magique !'
          ]
        }
      ]
    }
  ];

  // Exercices progressifs
  const exercises = [
    { question: '24 + 35', answer: 59, type: 'sans-retenue', hint: 'Additionne d\'abord les unités : 4 + 5' },
    { question: '51 + 23', answer: 74, type: 'sans-retenue', hint: 'Puis les dizaines : 5 + 2' },
    { question: '16 + 29', answer: 45, type: 'avec-retenue', hint: '6 + 9 = 15, écris 5 et retiens 1' },
    { question: '38 + 47', answer: 85, type: 'avec-retenue', hint: 'N\'oublie pas la retenue !' },
    { question: '42 + 26', answer: 68, type: 'calcul-mental', hint: '40 + 20 = 60, puis 2 + 6 = 8' },
    { question: '33 + 45', answer: 78, type: 'calcul-mental', hint: 'Décompose par dizaines et unités' },
    { question: '37 + 8', answer: 45, type: 'complement-10', hint: 'Complète à 40 d\'abord' },
    { question: '54 + 9', answer: 63, type: 'complement-10', hint: 'Va jusqu\'à 60 puis ajoute le reste' }
  ];

  // Mount check
  useEffect(() => {
    setIsClient(true);

    // Gestionnaires d'événements pour arrêter les animations lors de navigation
    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopAllVocalsAndAnimations();
      }
    };

    const handleBeforeUnload = () => {
      stopAllVocalsAndAnimations();
    };

    const handlePopState = () => {
      stopAllVocalsAndAnimations();
    };

    // Événements de navigation et changement d'onglet
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('pagehide', handleBeforeUnload);
    window.addEventListener('popstate', handlePopState);

    // Override history pour détecter la navigation programmatique
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = function(...args) {
      stopAllVocalsAndAnimations();
      return originalPushState.apply(history, args);
    };

    history.replaceState = function(...args) {
      stopAllVocalsAndAnimations();
      return originalReplaceState.apply(history, args);
    };

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('pagehide', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
      history.pushState = originalPushState;
      history.replaceState = originalReplaceState;
      stopAllVocalsAndAnimations();
    };
  }, []);

  // Effet pour arrêter les animations lors du changement cours ↔ exercices
  useEffect(() => {
    stopAllVocalsAndAnimations();
  }, [showExercises]);

  // Fonction pour arrêter tous les vocaux et animations
  const stopAllVocalsAndAnimations = () => {
    console.log('🛑 Arrêt de tous les vocaux et animations');
    stopSignalRef.current = true;
    
    // Arrêter complètement la synthèse vocale
    if (speechSynthesis.speaking || speechSynthesis.pending) {
      speechSynthesis.cancel();
      console.log('🔇 speechSynthesis.cancel() appelé');
    }
    
    if (currentAudioRef.current) {
      currentAudioRef.current = null;
    }
    
    // Reset de tous les états d'animation et de vocal
    setIsPlayingVocal(false);
    setIsAnimationRunning(false);
    setHighlightedElement(null);
    setAnimatingStep(null);
    setCurrentExample(null);
    setCurrentTechnique(null);
    setCalculationStep(null);
    setShowingCarry(false);
    setHighlightedDigits([]);
  };

  // Fonction pour jouer l'audio avec voix féminine française
  const playAudio = async (text: string, slowMode = false) => {
    return new Promise<void>((resolve) => {
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
      
      setIsPlayingVocal(true);
      const utterance = new SpeechSynthesisUtterance(text);
      
      utterance.lang = 'fr-FR';
      utterance.rate = slowMode ? 0.6 : 0.8;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      // Sélectionner la MEILLEURE voix française féminine disponible
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
        voice.localService                                 
      ) || voices.find(voice => 
        voice.lang === 'fr-FR'                            
      ) || voices.find(voice => 
        voice.lang.startsWith('fr')                       
      );

      if (bestFrenchVoice) {
        utterance.voice = bestFrenchVoice;
        console.log('🎤 Voix sélectionnée:', bestFrenchVoice.name);
      } else {
        console.warn('⚠️ Aucune voix française trouvée');
      }
      
      utterance.onend = () => {
        setIsPlayingVocal(false);
        currentAudioRef.current = null;
        resolve();
      };
      
      utterance.onerror = () => {
        setIsPlayingVocal(false);
        currentAudioRef.current = null;
        resolve();
      };
      
      currentAudioRef.current = utterance;
      speechSynthesis.speak(utterance);
    });
  };

  // Fonction pour attendre
  const wait = async (ms: number) => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        if (stopSignalRef.current) {
          resolve();
          return;
        }
        resolve();
      }, ms);
    });
  };

  // Fonction pour faire défiler vers une section
  const scrollToSection = (elementId: string) => {
    setTimeout(() => {
      const element = document.getElementById(elementId);
      if (element) {
        element.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center',
          inline: 'nearest' 
        });
      }
    }, 300);
  };

  // Fonction pour expliquer le chapitre principal
  const explainChapter = async () => {
    stopAllVocalsAndAnimations();
    await wait(300);
    stopSignalRef.current = false;
    setIsAnimationRunning(true);
    setHasStarted(true);

    try {
      // Introduction
      setHighlightedElement('intro');
      scrollToSection('intro-section');
      await playAudio("Bonjour ! Aujourd'hui, nous allons apprendre les additions jusqu'à 100 ! C'est un cours très important qui va te rendre super fort en calcul !");
      await wait(500);

      if (stopSignalRef.current) return;

      // Les techniques
      setHighlightedElement('techniques');
      scrollToSection('techniques-section');
      await playAudio("Je vais te montrer 4 techniques extraordinaires pour additionner facilement tous les nombres jusqu'à 100 !");
      await wait(500);

      if (stopSignalRef.current) return;

      // Première technique : sans retenue
      setAnimatingStep('sans-retenue');
      await playAudio("Première technique : l'addition sans retenue ! C'est la plus simple et tu vas l'adorer !");
      await wait(800);

      if (stopSignalRef.current) return;

      // Deuxième technique : avec retenue
      setAnimatingStep('avec-retenue');
      await playAudio("Deuxième technique : l'addition avec retenue ! C'est magique, quand ça dépasse 10, on fait une retenue !");
      await wait(800);

      if (stopSignalRef.current) return;

      // Troisième technique : calcul mental
      setAnimatingStep('calcul-mental');
      await playAudio("Troisième technique : le calcul mental rapide ! Pour impressionner tout le monde avec ta vitesse !");
      await wait(800);

      if (stopSignalRef.current) return;

      // Quatrième technique : complément à 10
      setAnimatingStep('complement-10');
      await playAudio("Quatrième technique : le complément à 10 ! Une astuce de champion pour calculer super vite !");
      await wait(800);

      if (stopSignalRef.current) return;

      // Transition vers les exemples
      setHighlightedElement('examples');
      scrollToSection('examples-section');
      await playAudio("Maintenant, choisis une technique et je te montre comment elle fonctionne avec de belles animations !");
      await wait(500);

    } finally {
      setHighlightedElement(null);
      setAnimatingStep(null);
      setIsAnimationRunning(false);
    }
  };

  // Fonction pour expliquer une technique spécifique
  const explainTechnique = async (techniqueIndex: number, exampleIndex: number = 0) => {
    stopAllVocalsAndAnimations();
    await wait(300);
    stopSignalRef.current = false;
    setIsAnimationRunning(true);
    
    const technique = additionTechniques[techniqueIndex];
    const example = technique.examples[exampleIndex];
    setCurrentTechnique(technique.id);
    setCurrentExample(exampleIndex);

    try {
      // Scroll vers la zone d'animation
      scrollToSection('animation-section');
      await wait(500);

      // Présentation de la technique
      setHighlightedElement('technique-title');
      await playAudio(`Découvrons la technique : ${technique.title} ! ${technique.description}`);
      await wait(800);

      if (stopSignalRef.current) return;

      // Animation spécifique selon la technique
      if (technique.id === 'sans-retenue') {
        await animateSansRetenue(example);
      } else if (technique.id === 'avec-retenue') {
        await animateAvecRetenue(example);
      } else if (technique.id === 'calcul-mental') {
        await animateCalculMental(example);
      } else if (technique.id === 'complement-10') {
        await animateComplement10(example);
      }

    } finally {
      setHighlightedElement(null);
      setAnimatingStep(null);
      setCurrentTechnique(null);
      setCurrentExample(null);
      setCalculationStep(null);
      setIsAnimationRunning(false);
      setShowingCarry(false);
      setHighlightedDigits([]);
    }
  };

  // Animation pour addition sans retenue
  const animateSansRetenue = async (example: any) => {
    // Étape 1 : Setup
    setCalculationStep('setup');
    await playAudio(`Calculons ${example.calculation}. Je place les nombres en colonnes, l'un sous l'autre.`);
    await wait(1000);

    if (stopSignalRef.current) return;

    // Étape 2 : Unités
    setCalculationStep('units');
    setHighlightedDigits(['units']);
    await playAudio(`J'additionne d'abord les unités : ${example.num1 % 10} plus ${example.num2 % 10} égale ${(example.num1 % 10) + (example.num2 % 10)}.`);
    await wait(1500);

    if (stopSignalRef.current) return;

    // Étape 3 : Dizaines
    setCalculationStep('tens');
    setHighlightedDigits(['tens']);
    await playAudio(`Ensuite les dizaines : ${Math.floor(example.num1 / 10)} plus ${Math.floor(example.num2 / 10)} égale ${Math.floor(example.num1 / 10) + Math.floor(example.num2 / 10)}.`);
    await wait(1500);

    if (stopSignalRef.current) return;

    // Étape 4 : Explication de la condition importante
    setCalculationStep('result');
    setHighlightedDigits([]);
    await playAudio(`Attention ! Cette technique sans retenue ne fonctionne que si chaque addition en colonne ne dépasse pas 10.`);
    await wait(1500);

    if (stopSignalRef.current) return;

    // Vérification des sommes
    const unitsSum = (example.num1 % 10) + (example.num2 % 10);
    const tensSum = Math.floor(example.num1 / 10) + Math.floor(example.num2 / 10);
    await playAudio(`Ici, ${example.num1 % 10} plus ${example.num2 % 10} égale ${unitsSum}, et ${Math.floor(example.num1 / 10)} plus ${Math.floor(example.num2 / 10)} égale ${tensSum}. Aucune somme ne dépasse 10 !`);
    await wait(2000);

    if (stopSignalRef.current) return;

    // Étape 5 : Résultat final
    await playAudio(`Le résultat est ${example.result} ! C'était facile car il n'y avait pas de retenue !`);
    await wait(1000);
  };

  // Animation pour addition avec retenue
  const animateAvecRetenue = async (example: any) => {
    const unitsSum = (example.num1 % 10) + (example.num2 % 10);
    const hasCarry = unitsSum >= 10;

    // Étape 1 : Introduction
    setCalculationStep('setup');
    await playAudio(`Addition avec retenue : ${example.calculation}. Je vais te montrer comment faire quand ça dépasse 10 !`);
    await wait(2500);

    if (stopSignalRef.current) return;

    // Étape 2 : Placement en colonnes
    await playAudio(`D'abord, je place les nombres en colonnes : dizaines sous dizaines, unités sous unités.`);
    await wait(3000);

    if (stopSignalRef.current) return;

    // Étape 3 : Focus sur les unités
    setCalculationStep('units');
    setHighlightedDigits(['units']);
    await playAudio(`Commençons par les unités : ${example.num1 % 10} plus ${example.num2 % 10}.`);
    await wait(2500);

    if (stopSignalRef.current) return;

    // Étape 4 : Calcul des unités avec visualisation
    setCalculationStep('units-sum');
    await playAudio(`${example.num1 % 10} plus ${example.num2 % 10} égale ${unitsSum}. Regarde bien ce qui se passe !`);
    await wait(3000);

    if (stopSignalRef.current) return;

    if (hasCarry) {
      // Étape 5 : Explication de la retenue
      setCalculationStep('carry-explanation');
      await playAudio(`${unitsSum}, c'est plus que 10 ! Je dois décomposer : ${unitsSum} égale ${Math.floor(unitsSum / 10)} dizaine plus ${unitsSum % 10} unités.`);
      await wait(4000);

      if (stopSignalRef.current) return;

      // Étape 6 : Animation visuelle de la retenue
      setCalculationStep('carry-visual');
      setShowingCarry(true);
      await playAudio(`La dizaine va glisser vers le haut pour rejoindre les dizaines. L'unité reste en bas.`);
      await wait(3500);

      if (stopSignalRef.current) return;

      await playAudio(`J'écris ${unitsSum % 10} dans les unités, et je retiens ${Math.floor(unitsSum / 10)} dans les dizaines !`);
      await wait(3000);

      if (stopSignalRef.current) return;
    }

    // Étape 7 : Calcul des dizaines
    setCalculationStep('tens');
    setHighlightedDigits(['tens']);
    const tensSum = Math.floor(example.num1 / 10) + Math.floor(example.num2 / 10) + (hasCarry ? 1 : 0);
    
    if (hasCarry) {
      await playAudio(`Maintenant les dizaines : ${Math.floor(example.num1 / 10)} plus ${Math.floor(example.num2 / 10)} plus 1 de retenue.`);
      await wait(3500);

      if (stopSignalRef.current) return;

      await playAudio(`${Math.floor(example.num1 / 10)} plus ${Math.floor(example.num2 / 10)} plus 1 égale ${tensSum}.`);
      await wait(3000);
    } else {
      await playAudio(`Maintenant les dizaines : ${Math.floor(example.num1 / 10)} plus ${Math.floor(example.num2 / 10)} égale ${tensSum}.`);
      await wait(2500);
    }

    if (stopSignalRef.current) return;

    // Étape 8 : Résultat final
    setCalculationStep('result');
    setHighlightedDigits([]);
    await playAudio(`Résultat final : ${tensSum}${unitsSum % 10} = ${example.result} ! Bravo, tu maîtrises la retenue !`);
    await wait(3000);
  };

  // Animation pour calcul mental
  const animateCalculMental = async (example: any) => {
    // Étape 1 : Introduction
    setCalculationStep('setup');
    await playAudio(`Calcul mental de ${example.calculation}. Je vais te montrer une technique magique !`);
    await wait(2000);

    if (stopSignalRef.current) return;

    // Étape 2 : Présentation du premier nombre
    setCalculationStep('show-first');
    await playAudio(`D'abord, regardons ${example.num1}. Je vais le décomposer en dizaines et unités.`);
    await wait(3000);

    if (stopSignalRef.current) return;

    // Étape 3 : Décomposition visuelle du premier nombre
    setCalculationStep('decompose-first');
    const tens1 = Math.floor(example.num1 / 10);
    const units1 = example.num1 % 10;
    await playAudio(`${example.num1}, c'est ${tens1} dizaine${tens1 > 1 ? 's' : ''} et ${units1} unité${units1 > 1 ? 's' : ''}. Regarde bien !`);
    await wait(3500);

    if (stopSignalRef.current) return;

    // Étape 4 : Présentation du deuxième nombre
    setCalculationStep('show-second');
    await playAudio(`Maintenant, regardons ${example.num2}. Je vais aussi le décomposer.`);
    await wait(3000);

    if (stopSignalRef.current) return;

    // Étape 5 : Décomposition visuelle du deuxième nombre
    setCalculationStep('decompose-second');
    const tens2 = Math.floor(example.num2 / 10);
    const units2 = example.num2 % 10;
    await playAudio(`${example.num2}, c'est ${tens2} dizaine${tens2 > 1 ? 's' : ''} et ${units2} unité${units2 > 1 ? 's' : ''}. Tu vois la différence de couleur ?`);
    await wait(3500);

    if (stopSignalRef.current) return;

    // Étape 6 : Explication de la stratégie
    setCalculationStep('explain-strategy');
    await playAudio(`Maintenant, voici le secret : je vais additionner les dizaines ensemble, puis les unités ensemble !`);
    await wait(3000);

    if (stopSignalRef.current) return;

    // Étape 7 : Calcul des dizaines
    setCalculationStep('tens');
    setHighlightedDigits(['tens']);
    const tensTotal = tens1 + tens2;
    await playAudio(`Les dizaines : ${tens1} dizaine${tens1 > 1 ? 's' : ''} plus ${tens2} dizaine${tens2 > 1 ? 's' : ''}.`);
    await wait(2500);

    if (stopSignalRef.current) return;

    await playAudio(`${tens1} plus ${tens2} égale ${tensTotal}. Donc j'ai ${tensTotal} dizaine${tensTotal > 1 ? 's' : ''} !`);
    await wait(3000);

    if (stopSignalRef.current) return;

    // Étape 8 : Calcul des unités
    setCalculationStep('units');
    setHighlightedDigits(['units']);
    const unitsTotal = units1 + units2;
    await playAudio(`Les unités : ${units1} unité${units1 > 1 ? 's' : ''} plus ${units2} unité${units2 > 1 ? 's' : ''}.`);
    await wait(2500);

    if (stopSignalRef.current) return;

    await playAudio(`${units1} plus ${units2} égale ${unitsTotal}. Donc j'ai ${unitsTotal} unité${unitsTotal > 1 ? 's' : ''} !`);
    await wait(3000);

    if (stopSignalRef.current) return;

    // Étape 9 : Regroupement final
    setCalculationStep('regroup');
    setHighlightedDigits([]);
    await playAudio(`Maintenant, je regroupe : ${tensTotal} dizaine${tensTotal > 1 ? 's' : ''} plus ${unitsTotal} unité${unitsTotal > 1 ? 's' : ''}.`);
    await wait(3000);

    if (stopSignalRef.current) return;

    // Étape 10 : Résultat final
    setCalculationStep('result');
    await playAudio(`${tensTotal * 10} plus ${unitsTotal} égale ${example.result} ! Bravo, tu maîtrises le calcul mental !`);
    await wait(2500);
  };

  // Animation pour complément à 10
  const animateComplement10 = async (example: any) => {
    // Étape 1 : Introduction
    setCalculationStep('setup');
    await playAudio(`Technique du complément à 10 : ${example.calculation}. Je vais te montrer une astuce géniale !`);
    await wait(2500);

    if (stopSignalRef.current) return;

    // Étape 2 : Présentation du problème
    setCalculationStep('show-problem');
    await playAudio(`Je veux calculer ${example.num1} plus ${example.num2}. Voici ma stratégie secrète !`);
    await wait(3000);

    if (stopSignalRef.current) return;

    // Étape 3 : Trouver le complément
    setCalculationStep('find-complement');
    const complement = 10 - (example.num1 % 10);
    const nextTen = Math.ceil(example.num1 / 10) * 10;
    await playAudio(`D'abord, je regarde ${example.num1}. Pour arriver à ${nextTen}, j'ai besoin de ${complement}.`);
    await wait(3500);

    if (stopSignalRef.current) return;

    await playAudio(`${example.num1} plus ${complement} égale ${nextTen}. C'est plus facile de calculer avec ${nextTen} !`);
    await wait(3000);

    if (stopSignalRef.current) return;

    // Étape 4 : Ajouter le complément
    setCalculationStep('add-complement');
    await playAudio(`Je prends ${complement} dans ${example.num2}. ${example.num2} moins ${complement} égale ${example.num2 - complement}.`);
    await wait(3500);

    if (stopSignalRef.current) return;

    // Étape 5 : Montrer l'étape intermédiaire
    setCalculationStep('show-intermediate');
    await playAudio(`Maintenant j'ai ${nextTen} plus ${example.num2 - complement}. C'est beaucoup plus simple !`);
    await wait(3000);

    if (stopSignalRef.current) return;

    // Étape 6 : Addition du reste
    setCalculationStep('add-remaining');
    await playAudio(`${nextTen} plus ${example.num2 - complement} égale ${example.result}.`);
    await wait(2500);

    if (stopSignalRef.current) return;

    // Étape 7 : Résultat final
    setCalculationStep('result');
    setHighlightedDigits([]);
    await playAudio(`Résultat : ${example.result} ! Tu vois comme c'est malin ? Le complément à 10 rend tout plus facile !`);
    await wait(3000);
  };

  // Fonctions pour les exercices
  const checkAnswer = () => {
    const userNum = parseInt(userAnswer);
    const correct = userNum === exercises[currentExercise].answer;
    setIsCorrect(correct);
    
    if (correct) {
      setScore(score + 1);
      setAnsweredCorrectly(prev => new Set([...prev, currentExercise]));
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
    }
  };

  const resetExercises = () => {
    setCurrentExercise(0);
    setUserAnswer('');
    setIsCorrect(null);
    setScore(0);
    setAnsweredCorrectly(new Set());
    setShowCompletionModal(false);
  };

  // Gestion des événements pour arrêter les vocaux
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
      stopAllVocalsAndAnimations();
    };

    // Event listeners
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('pagehide', handleBeforeUnload);
    window.addEventListener('popstate', handlePopState);

    // Override history methods
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;
    
    history.pushState = function(...args) {
      stopAllVocalsAndAnimations();
      return originalPushState.apply(history, args);
    };
    
    history.replaceState = function(...args) {
      stopAllVocalsAndAnimations();
      return originalReplaceState.apply(history, args);
    };

    return () => {
      stopAllVocalsAndAnimations();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('pagehide', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
      history.pushState = originalPushState;
      history.replaceState = originalReplaceState;
    };
  }, []);

  if (!isClient) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/chapitre/cp-additions-simples" 
            onClick={stopAllVocalsAndAnimations}
            className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour au chapitre</span>
          </Link>
          
          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              💯 Additions jusqu'à 100
            </h1>
            <p className="text-lg text-gray-800">
              Maîtrise les additions avec des nombres plus grands ! Découvre 4 techniques incroyables.
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center space-x-4 mb-8">
          <button
            onClick={() => {
              stopAllVocalsAndAnimations();
              setShowExercises(false);
            }}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              !showExercises
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white text-blue-600 hover:bg-blue-50'
            } ${highlightedElement === 'course_tab' ? 'ring-4 ring-blue-400 animate-pulse' : ''}`}
          >
            📚 Cours
          </button>
          <button
            onClick={() => {
              stopAllVocalsAndAnimations();
              setShowExercises(true);
            }}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              showExercises
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white text-blue-600 hover:bg-blue-50'
            } ${highlightedElement === 'exercise_tab' ? 'ring-4 ring-blue-400 animate-pulse' : ''}`}
          >
            🎯 Exercices
          </button>
        </div>

        {!showExercises ? (
          /* Section Cours */
          <div className="space-y-8">
            {/* Bouton COMMENCER */}
            <div className="text-center mb-8">
              <button
                onClick={explainChapter}
                disabled={isAnimationRunning}
                className={`px-8 py-4 rounded-xl font-bold text-xl shadow-lg transition-all transform ${
                  isAnimationRunning 
                    ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:shadow-xl hover:scale-105 animate-pulse'
                }`}
              >
                {isAnimationRunning ? '⏳ Animation en cours...' : '▶️ COMMENCER !'}
              </button>
            </div>

            {/* Introduction */}
            <div 
              id="intro-section"
              className={`bg-white rounded-xl shadow-lg p-6 transition-all duration-300 ${
                highlightedElement === 'intro' ? 'ring-4 ring-blue-400 bg-blue-100' : ''
              }`}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Calculator className="w-6 h-6 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Les additions jusqu'à 100</h2>
              </div>
              <p className="text-lg text-gray-700 leading-relaxed">
                Félicitations ! Tu vas apprendre les techniques pour additionner tous les nombres jusqu'à 100. 
                C'est un cours très important qui va te rendre super fort en mathématiques !
              </p>
            </div>

            {/* Les 4 techniques */}
            <div 
              id="techniques-section"
              className={`bg-white rounded-xl shadow-lg p-6 transition-all duration-300 ${
                highlightedElement === 'techniques' ? 'ring-4 ring-blue-400 bg-blue-100' : ''
              }`}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <Brain className="w-6 h-6 text-indigo-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">4 techniques extraordinaires</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className={`p-4 rounded-lg text-center transition-all duration-500 ${
                  animatingStep === 'sans-retenue' ? 'bg-green-100 ring-2 ring-green-400 scale-105' : 'bg-gray-100'
                }`}>
                  <div className="text-3xl mb-2">✨</div>
                  <h4 className="font-bold text-green-800">Sans retenue</h4>
                  <p className="text-sm text-green-700">La plus simple !</p>
                </div>
                
                <div className={`p-4 rounded-lg text-center transition-all duration-500 ${
                  animatingStep === 'avec-retenue' ? 'bg-orange-100 ring-2 ring-orange-400 scale-105' : 'bg-gray-100'
                }`}>
                  <div className="text-3xl mb-2">🔄</div>
                  <h4 className="font-bold text-orange-800">Avec retenue</h4>
                  <p className="text-sm text-orange-700">La magique !</p>
                </div>

                <div className={`p-4 rounded-lg text-center transition-all duration-500 ${
                  animatingStep === 'calcul-mental' ? 'bg-purple-100 ring-2 ring-purple-400 scale-105' : 'bg-gray-100'
                }`}>
                  <div className="text-3xl mb-2">🧠</div>
                  <h4 className="font-bold text-purple-800">Calcul mental</h4>
                  <p className="text-sm text-purple-700">La rapide !</p>
                </div>

                <div className={`p-4 rounded-lg text-center transition-all duration-500 ${
                  animatingStep === 'complement-10' ? 'bg-blue-100 ring-2 ring-blue-400 scale-105' : 'bg-gray-100'
                }`}>
                  <div className="text-3xl mb-2">🎯</div>
                  <h4 className="font-bold text-blue-800">Complément à 10</h4>
                  <p className="text-sm text-blue-700">L'astucieuse !</p>
                </div>
              </div>
            </div>

            {/* Exemples de techniques */}
            <div 
              id="examples-section"
              className={`bg-white rounded-xl shadow-lg p-6 transition-all duration-300 ${
                highlightedElement === 'examples' ? 'ring-4 ring-blue-400 bg-blue-100' : ''
              }`}
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                🎯 Choisis ta technique préférée !
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {additionTechniques.map((technique, index) => (
                  <div 
                    key={index}
                    className={`bg-gradient-to-br from-blue-200 to-indigo-200 rounded-lg p-6 transition-all duration-300 ${
                      isAnimationRunning 
                        ? 'opacity-50 cursor-not-allowed' 
                        : 'cursor-pointer hover:scale-105 hover:shadow-lg'
                    } ${currentTechnique === technique.id ? 'ring-4 ring-blue-400 bg-blue-100' : ''}`}
                    onClick={isAnimationRunning ? undefined : () => explainTechnique(index)}
                  >
                    <div className="text-center">
                      <div className="text-4xl mb-3">{technique.icon}</div>
                      <h3 className="font-bold text-lg text-gray-900 mb-2">{technique.title}</h3>
                      <div className="text-sm text-gray-900 mb-4 leading-relaxed">{technique.description}</div>
                      <div className="text-lg font-mono bg-white px-3 py-1 rounded mb-3 text-gray-900 shadow-sm">
                        {technique.examples[0].calculation}
                      </div>
                      <button className={`px-3 py-1 rounded-lg text-sm transition-colors shadow-md ${
                        isAnimationRunning 
                          ? 'bg-gray-400 text-gray-200' 
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}>
                        {isAnimationRunning ? '⏳ Attendez...' : '▶️ Voir l\'animation'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Zone d'animation */}
            {currentTechnique && currentExample !== null && (
              <div 
                id="animation-section"
                className="bg-white rounded-xl shadow-lg p-6"
              >
                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                  🎬 Animation de calcul
                </h2>
                
                {(() => {
                  const technique = additionTechniques.find(t => t.id === currentTechnique);
                  const example = technique?.examples[currentExample];
                  if (!technique || !example) return null;

                  return (
                    <div className="space-y-6">
                      {/* Titre de la technique */}
                      <div className={`p-4 rounded-lg text-center ${
                        highlightedElement === 'technique-title' ? 'bg-blue-100 ring-2 ring-blue-400' : 'bg-gray-100'
                      }`}>
                        <h3 className="text-xl font-bold text-blue-800">{technique.title}</h3>
                        <p className="text-gray-800 mt-2">{technique.description}</p>
                      </div>

                      {/* Animation du calcul */}
                      <div className="bg-gradient-to-r from-indigo-100 to-blue-100 rounded-lg p-6">
                        <div className="text-center">
                          <div className="text-4xl font-mono font-bold mb-4 text-indigo-900">
                            {example.calculation}
                          </div>
                          
                          {/* Animation des étapes selon la technique */}
                          {currentTechnique === 'sans-retenue' && calculationStep && (
                            <div className="space-y-6">
                              {/* Addition posée en colonnes */}
                              <div className="bg-white rounded-lg p-6 shadow-md max-w-md mx-auto">
                                <div className="font-mono text-center">
                                  {/* En-têtes de colonnes */}
                                  <div className="flex justify-center mb-2">
                                    <div className="w-4"></div>
                                    <div className="w-12 text-sm text-gray-600 font-bold">D</div>
                                    <div className="w-12 text-sm text-gray-600 font-bold">U</div>
                                  </div>
                                  
                                  {/* Premier nombre */}
                                  <div className={`flex justify-center py-2 rounded transition-all ${
                                    calculationStep === 'setup' ? 'bg-blue-100' : ''
                                  }`}>
                                    <div className="w-4"></div>
                                    <div className={`w-12 text-2xl font-bold text-center ${
                                      highlightedDigits.includes('tens') ? 'bg-yellow-200 text-yellow-900 rounded px-1' : 'text-gray-900'
                                    }`}>
                                      {Math.floor(example.num1 / 10)}
                                    </div>
                                    <div className={`w-12 text-2xl font-bold text-center ${
                                      highlightedDigits.includes('units') ? 'bg-yellow-200 text-yellow-900 rounded px-1' : 'text-gray-900'
                                    }`}>
                                      {example.num1 % 10}
                                    </div>
                                  </div>
                                  
                                  {/* Ligne avec le signe + et le deuxième nombre */}
                                  <div className={`flex justify-center py-2 rounded transition-all ${
                                    calculationStep === 'setup' ? 'bg-blue-100' : ''
                                  }`}>
                                    <div className="w-4 text-2xl font-bold text-gray-900 text-right pr-1">+</div>
                                    <div className={`w-12 text-2xl font-bold text-center ${
                                      highlightedDigits.includes('tens') ? 'bg-yellow-200 text-yellow-900 rounded px-1' : 'text-gray-900'
                                    }`}>
                                      {Math.floor(example.num2 / 10)}
                                    </div>
                                    <div className={`w-12 text-2xl font-bold text-center ${
                                      highlightedDigits.includes('units') ? 'bg-yellow-200 text-yellow-900 rounded px-1' : 'text-gray-900'
                                    }`}>
                                      {example.num2 % 10}
                                    </div>
                                  </div>
                                  
                                  {/* Ligne de séparation */}
                                  <div className="border-b-2 border-gray-400 my-2 w-28 mx-auto"></div>
                                  
                                  {/* Résultat progressif */}
                                  {(calculationStep === 'units' || calculationStep === 'tens' || calculationStep === 'result') && (
                                    <div className={`flex justify-center py-2 ${
                                      calculationStep === 'result' ? 'animate-bounce' : ''
                                    }`}>
                                      <div className="w-4"></div>
                                      
                                      {/* Chiffre des dizaines */}
                                      <div className={`w-12 text-2xl font-bold text-center ${
                                        calculationStep === 'tens' || calculationStep === 'result' 
                                          ? 'text-green-700 animate-pulse' 
                                          : 'text-transparent'
                                      }`}>
                                        {calculationStep === 'tens' || calculationStep === 'result' 
                                          ? Math.floor(example.result / 10) 
                                          : '?'}
                                      </div>
                                      
                                      {/* Chiffre des unités */}
                                      <div className={`w-12 text-2xl font-bold text-center ${
                                        calculationStep === 'units' || calculationStep === 'tens' || calculationStep === 'result'
                                          ? 'text-green-700 animate-pulse' 
                                          : 'text-transparent'
                                      }`}>
                                        {calculationStep === 'units' || calculationStep === 'tens' || calculationStep === 'result'
                                          ? example.result % 10 
                                          : '?'}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                              
                              {/* Explication textuelle */}
                              {calculationStep === 'units' && (
                                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
                                  <p className="text-yellow-800 font-semibold">
                                    🧮 J'additionne les unités : {example.num1 % 10} + {example.num2 % 10} = {(example.num1 % 10) + (example.num2 % 10)}
                                  </p>
                                </div>
                              )}
                              
                              {calculationStep === 'tens' && (
                                <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-lg">
                                  <p className="text-blue-800 font-semibold">
                                    🧮 J'additionne les dizaines : {Math.floor(example.num1 / 10)} + {Math.floor(example.num2 / 10)} = {Math.floor(example.num1 / 10) + Math.floor(example.num2 / 10)}
                                  </p>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Animation pour avec retenue */}
                          {currentTechnique === 'avec-retenue' && calculationStep && (
                            <div className="space-y-6 bg-gradient-to-br from-orange-50 to-red-50 p-6 rounded-xl border-2 border-orange-200">
                              
                              {/* Étape : Introduction */}
                              {calculationStep === 'setup' && (
                                <div className="text-center">
                                  <div className="text-4xl font-bold text-orange-800 animate-pulse">
                                    {example.calculation}
                                  </div>
                                  <div className="text-lg text-orange-600 mt-2">
                                    ⚡ Addition avec retenue - Attention !
                                  </div>
                                </div>
                              )}

                              {/* Affichage permanent de la colonne (ne s'efface jamais) */}
                              {(calculationStep === 'setup' || calculationStep === 'units' || calculationStep === 'units-sum' || calculationStep === 'carry-explanation' || calculationStep === 'carry-visual' || calculationStep === 'tens' || calculationStep === 'result') && (
                                <div className="bg-white rounded-lg p-6 shadow-lg max-w-lg mx-auto">
                                  <div className="text-center mb-4">
                                    <div className="text-lg font-bold text-gray-700">📊 Addition en colonnes</div>
                                  </div>
                                  
                                  {/* Retenue (visible seulement si nécessaire) */}
                                  <div className="flex justify-center mb-2">
                                    <div className="w-8"></div>
                                    <div className="w-16 text-center">
                                      {(calculationStep === 'carry-visual' || calculationStep === 'tens' || calculationStep === 'result') && (
                                        <div className="text-lg font-bold text-red-700 animate-bounce border-2 border-red-400 bg-red-100 rounded-full px-2 py-1">
                                          1
                                        </div>
                                      )}
                                    </div>
                                    <div className="w-16"></div>
                                  </div>
                                  
                                  {/* En-têtes de colonnes */}
                                  <div className="flex justify-center mb-3">
                                    <div className="w-8"></div>
                                    <div className="w-16 text-center text-lg font-bold text-gray-600 border-b-2 border-gray-400 pb-1">D</div>
                                    <div className="w-16 text-center text-lg font-bold text-gray-600 border-b-2 border-gray-400 pb-1">U</div>
                                  </div>
                                  
                                  {/* Premier nombre */}
                                  <div className="flex justify-center py-3">
                                    <div className="w-8"></div>
                                    <div className={`w-16 text-3xl font-bold text-center transition-all ${
                                      highlightedDigits.includes('tens') ? 'bg-yellow-200 text-yellow-900 rounded-lg px-2 py-1 ring-2 ring-yellow-400' : 'text-gray-900'
                                    }`}>
                                      {Math.floor(example.num1 / 10)}
                                    </div>
                                    <div className={`w-16 text-3xl font-bold text-center transition-all ${
                                      highlightedDigits.includes('units') ? 'bg-blue-200 text-blue-900 rounded-lg px-2 py-1 ring-2 ring-blue-400' : 'text-gray-900'
                                    }`}>
                                      {example.num1 % 10}
                                    </div>
                                  </div>
                                  
                                  {/* Ligne avec le signe + et le deuxième nombre */}
                                  <div className="flex justify-center py-3">
                                    <div className="w-8 text-3xl font-bold text-orange-700 text-center">+</div>
                                    <div className={`w-16 text-3xl font-bold text-center transition-all ${
                                      highlightedDigits.includes('tens') ? 'bg-yellow-200 text-yellow-900 rounded-lg px-2 py-1 ring-2 ring-yellow-400' : 'text-gray-900'
                                    }`}>
                                      {Math.floor(example.num2 / 10)}
                                    </div>
                                    <div className={`w-16 text-3xl font-bold text-center transition-all ${
                                      highlightedDigits.includes('units') ? 'bg-blue-200 text-blue-900 rounded-lg px-2 py-1 ring-2 ring-blue-400' : 'text-gray-900'
                                    }`}>
                                      {example.num2 % 10}
                                    </div>
                                  </div>
                                  
                                  {/* Ligne de séparation */}
                                  <div className="border-b-4 border-gray-600 my-4 w-40 mx-auto"></div>
                                  
                                  {/* Résultat progressif */}
                                  {(calculationStep === 'units-sum' || calculationStep === 'carry-explanation' || calculationStep === 'carry-visual' || calculationStep === 'tens' || calculationStep === 'result') && (
                                    <div className="flex justify-center py-3">
                                      <div className="w-8"></div>
                                      
                                      {/* Chiffre des dizaines */}
                                      <div className={`w-16 text-3xl font-bold text-center transition-all ${
                                        calculationStep === 'tens' || calculationStep === 'result' 
                                          ? 'text-green-700 animate-pulse bg-green-100 rounded-lg px-2 py-1' 
                                          : 'text-gray-300'
                                      }`}>
                                        {calculationStep === 'tens' || calculationStep === 'result' 
                                          ? Math.floor(example.result / 10) 
                                          : '?'}
                                      </div>
                                      
                                      {/* Chiffre des unités */}
                                      <div className={`w-16 text-3xl font-bold text-center transition-all ${
                                        (calculationStep === 'carry-visual' || calculationStep === 'tens' || calculationStep === 'result')
                                          ? 'text-green-700 animate-pulse bg-green-100 rounded-lg px-2 py-1' 
                                          : 'text-gray-300'
                                      }`}>
                                        {(calculationStep === 'carry-visual' || calculationStep === 'tens' || calculationStep === 'result')
                                          ? ((example.num1 % 10) + (example.num2 % 10)) % 10
                                          : '?'}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )}

                              {/* Animation de calcul des unités (reste visible) */}
                              {(calculationStep === 'units' || calculationStep === 'units-sum' || calculationStep === 'carry-explanation' || calculationStep === 'carry-visual' || calculationStep === 'tens' || calculationStep === 'result') && (
                                <div className="text-center bg-blue-100 p-4 rounded-lg border-2 border-blue-400">
                                  <div className="text-2xl font-bold text-blue-800 mb-3">
                                    🔹 Calcul des unités
                                  </div>
                                  <div className="flex justify-center items-center space-x-3 mb-4">
                                    {/* Unités du premier nombre */}
                                    <div className="flex space-x-1">
                                      {Array.from({length: example.num1 % 10}, (_, i) => (
                                        <div key={i} className="w-6 h-6 bg-blue-500 border-2 border-blue-700 rounded-full flex items-center justify-center text-white font-bold text-xs">
                                          1
                                        </div>
                                      ))}
                                    </div>
                                    
                                    <div className="text-2xl font-bold text-blue-600">+</div>
                                    
                                    {/* Unités du deuxième nombre */}
                                    <div className="flex space-x-1">
                                      {Array.from({length: example.num2 % 10}, (_, i) => (
                                        <div key={i} className="w-6 h-6 bg-cyan-500 border-2 border-cyan-700 rounded-full flex items-center justify-center text-white font-bold text-xs">
                                          1
                                        </div>
                                      ))}
                                    </div>
                                    
                                    {(calculationStep === 'units-sum' || calculationStep === 'carry-explanation' || calculationStep === 'carry-visual' || calculationStep === 'tens' || calculationStep === 'result') && (
                                      <>
                                        <div className="text-2xl font-bold text-blue-600">=</div>
                                        
                                        {/* Résultat des unités */}
                                        <div className="flex space-x-1">
                                          {Array.from({length: (example.num1 % 10) + (example.num2 % 10)}, (_, i) => (
                                            <div key={i} className="w-6 h-6 bg-purple-600 border-2 border-purple-800 rounded-full flex items-center justify-center text-white font-bold text-xs">
                                              1
                                            </div>
                                          ))}
                                        </div>
                                      </>
                                    )}
                                  </div>
                                  <div className="text-xl font-bold text-blue-700">
                                    {example.num1 % 10} + {example.num2 % 10} {(calculationStep === 'units-sum' || calculationStep === 'carry-explanation' || calculationStep === 'carry-visual' || calculationStep === 'tens' || calculationStep === 'result') ? `= ${(example.num1 % 10) + (example.num2 % 10)}` : ''}
                                  </div>
                                </div>
                              )}

                              {/* Animation de la décomposition (reste visible) */}
                              {(calculationStep === 'carry-explanation' || calculationStep === 'carry-visual' || calculationStep === 'tens' || calculationStep === 'result') && (
                                <div className="text-center bg-orange-100 p-4 rounded-lg border-2 border-orange-400">
                                  <div className="text-2xl font-bold text-orange-800 mb-3">
                                    ⚡ Décomposition : plus de 10 !
                                  </div>
                                  <div className="text-xl font-bold text-orange-700 mb-4">
                                    {(example.num1 % 10) + (example.num2 % 10)} = {Math.floor(((example.num1 % 10) + (example.num2 % 10)) / 10)} dizaine + {((example.num1 % 10) + (example.num2 % 10)) % 10} unités
                                  </div>
                                  <div className="flex justify-center items-center space-x-4">
                                    {/* Représentation de la décomposition */}
                                    <div className="text-center">
                                      <div className="w-12 h-16 bg-red-500 border-2 border-red-700 rounded flex items-center justify-center text-white font-bold text-lg">
                                        10
                                      </div>
                                      <div className="text-sm font-bold text-red-700 mt-1">1 dizaine</div>
                                    </div>
                                    
                                    <div className="text-2xl font-bold text-orange-600">+</div>
                                    
                                    <div className="text-center">
                                      <div className="flex space-x-1">
                                        {Array.from({length: ((example.num1 % 10) + (example.num2 % 10)) % 10}, (_, i) => (
                                          <div key={i} className="w-6 h-6 bg-blue-500 border-2 border-blue-700 rounded-full flex items-center justify-center text-white font-bold text-xs">
                                            1
                                          </div>
                                        ))}
                                      </div>
                                      <div className="text-sm font-bold text-blue-700 mt-1">{((example.num1 % 10) + (example.num2 % 10)) % 10} unités</div>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {/* Animation visuelle de la retenue qui glisse (reste visible) */}
                              {(calculationStep === 'carry-visual' || calculationStep === 'tens' || calculationStep === 'result') && (
                                <div className="text-center bg-red-100 p-4 rounded-lg border-2 border-red-400">
                                  <div className="text-2xl font-bold text-red-800 mb-3">
                                    🎯 La retenue glisse vers le haut !
                                  </div>
                                  <div className="relative flex justify-center items-center space-x-8">
                                    {/* La dizaine qui "glisse" vers le haut */}
                                    <div className="text-center">
                                      <div className="w-12 h-16 bg-red-500 border-2 border-red-700 rounded flex items-center justify-center text-white font-bold text-lg animate-bounce transform -translate-y-4">
                                        10
                                      </div>
                                      <div className="text-sm font-bold text-red-700 mt-1">↑ Vers les dizaines</div>
                                    </div>
                                    
                                    {/* Les unités qui restent en bas */}
                                    <div className="text-center">
                                      <div className="flex space-x-1">
                                        {Array.from({length: ((example.num1 % 10) + (example.num2 % 10)) % 10}, (_, i) => (
                                          <div key={i} className="w-6 h-6 bg-blue-500 border-2 border-blue-700 rounded-full flex items-center justify-center text-white font-bold text-xs animate-pulse">
                                            1
                                          </div>
                                        ))}
                                      </div>
                                      <div className="text-sm font-bold text-blue-700 mt-1">↓ Restent en unités</div>
                                    </div>
                                  </div>
                                  <div className="text-lg font-bold text-red-700 mt-4">
                                    J'écris {((example.num1 % 10) + (example.num2 % 10)) % 10} en unités et je retiens 1 en dizaines !
                                  </div>
                                </div>
                              )}

                              {/* Animation des dizaines (reste visible) */}
                              {(calculationStep === 'tens' || calculationStep === 'result') && (
                                <div className="text-center bg-purple-100 p-4 rounded-lg border-2 border-purple-400">
                                  <div className="text-2xl font-bold text-purple-800 mb-3">
                                    🔢 Calcul des dizaines avec retenue
                                  </div>
                                  <div className="flex justify-center items-center space-x-4 mb-4">
                                    {/* Dizaines du premier nombre */}
                                    <div className="flex space-x-1">
                                      {Array.from({length: Math.floor(example.num1 / 10)}, (_, i) => (
                                        <div key={i} className="w-10 h-14 bg-yellow-500 border-2 border-yellow-700 rounded flex items-center justify-center text-white font-bold animate-pulse">
                                          10
                                        </div>
                                      ))}
                                    </div>
                                    
                                    <div className="text-2xl font-bold text-purple-600">+</div>
                                    
                                    {/* Dizaines du deuxième nombre */}
                                    <div className="flex space-x-1">
                                      {Array.from({length: Math.floor(example.num2 / 10)}, (_, i) => (
                                        <div key={i} className="w-10 h-14 bg-orange-500 border-2 border-orange-700 rounded flex items-center justify-center text-white font-bold animate-pulse">
                                          10
                                        </div>
                                      ))}
                                    </div>
                                    
                                    <div className="text-2xl font-bold text-purple-600">+</div>
                                    
                                    {/* Retenue */}
                                    <div className="w-10 h-14 bg-red-500 border-2 border-red-700 rounded flex items-center justify-center text-white font-bold animate-bounce">
                                      10
                                    </div>
                                    
                                    <div className="text-2xl font-bold text-purple-600">=</div>
                                    
                                    {/* Résultat des dizaines */}
                                    <div className="flex space-x-1">
                                      {Array.from({length: Math.floor(example.num1 / 10) + Math.floor(example.num2 / 10) + 1}, (_, i) => (
                                        <div key={i} className="w-10 h-14 bg-purple-600 border-2 border-purple-800 rounded flex items-center justify-center text-white font-bold animate-bounce">
                                          10
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                  <div className="text-xl font-bold text-purple-700">
                                    {Math.floor(example.num1 / 10)} + {Math.floor(example.num2 / 10)} + 1 (retenue) = {Math.floor(example.num1 / 10) + Math.floor(example.num2 / 10) + 1}
                                  </div>
                                </div>
                              )}

                              {/* Résultat final */}
                              {calculationStep === 'result' && (
                                <div className="text-center bg-green-100 p-4 rounded-lg border-2 border-green-400">
                                  <div className="text-5xl font-bold text-green-700 animate-bounce mb-4">
                                    = {example.result}
                                  </div>
                                  <div className="text-2xl font-bold text-green-600">
                                    🏆 Bravo ! Tu maîtrises la retenue !
                                  </div>
                                  <div className="text-lg text-green-700 mt-2">
                                    {Math.floor(example.result / 10)} dizaines + {example.result % 10} unités = {example.result}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Animation pour calcul mental */}
                          {currentTechnique === 'calcul-mental' && calculationStep && (
                            <div className="space-y-6 bg-gradient-to-br from-purple-50 to-blue-50 p-6 rounded-xl border-2 border-purple-200">
                              {/* Étape : Setup */}
                              {calculationStep === 'setup' && (
                                <div className="text-center">
                                  <div className="text-4xl font-bold text-purple-800 animate-pulse">
                                    {example.calculation}
                                  </div>
                                  <div className="text-lg text-purple-600 mt-2">
                                    🧠 Technique du calcul mental magique !
                                  </div>
                                </div>
                              )}

                              {/* Étape : Montrer le premier nombre */}
                              {(calculationStep === 'show-first' || calculationStep === 'decompose-first') && (
                                <div className="text-center">
                                  <div className="text-3xl font-bold text-red-700 mb-4 animate-pulse">
                                    Premier nombre : {example.num1}
                                  </div>
                                  {calculationStep === 'decompose-first' && (
                                    <div className="space-y-4">
                                      {/* Représentation visuelle du premier nombre */}
                                      <div className="flex justify-center items-center space-x-4">
                                        {/* Dizaines en rouge */}
                                        <div className="text-center">
                                          <div className="text-sm font-semibold text-red-600 mb-2">Dizaines</div>
                                          <div className="flex space-x-1">
                                            {Array.from({length: Math.floor(example.num1 / 10)}, (_, i) => (
                                              <div key={i} className="w-8 h-12 bg-red-500 border-2 border-red-700 rounded flex items-center justify-center text-white font-bold animate-bounce" style={{animationDelay: `${i * 0.2}s`}}>
                                                10
                                              </div>
                                            ))}
                                          </div>
                                          <div className="text-lg font-bold text-red-700 mt-2">
                                            {Math.floor(example.num1 / 10)} × 10 = {Math.floor(example.num1 / 10) * 10}
                                          </div>
                                        </div>

                                        <div className="text-3xl font-bold text-gray-600">+</div>

                                        {/* Unités en bleu */}
                                        <div className="text-center">
                                          <div className="text-sm font-semibold text-blue-600 mb-2">Unités</div>
                                          <div className="flex space-x-1">
                                            {Array.from({length: example.num1 % 10}, (_, i) => (
                                              <div key={i} className="w-6 h-6 bg-blue-500 border-2 border-blue-700 rounded-full flex items-center justify-center text-white font-bold animate-bounce" style={{animationDelay: `${i * 0.1}s`}}>
                                                1
                                              </div>
                                            ))}
                                          </div>
                                          <div className="text-lg font-bold text-blue-700 mt-2">
                                            {example.num1 % 10} unité{example.num1 % 10 > 1 ? 's' : ''}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )}

                              {/* Étape : Montrer le deuxième nombre */}
                              {(calculationStep === 'show-second' || calculationStep === 'decompose-second') && (
                                <div className="text-center">
                                  <div className="text-3xl font-bold text-green-700 mb-4 animate-pulse">
                                    Deuxième nombre : {example.num2}
                                  </div>
                                  {calculationStep === 'decompose-second' && (
                                    <div className="space-y-4">
                                      {/* Représentation visuelle du deuxième nombre */}
                                      <div className="flex justify-center items-center space-x-4">
                                        {/* Dizaines en orange */}
                                        <div className="text-center">
                                          <div className="text-sm font-semibold text-orange-600 mb-2">Dizaines</div>
                                          <div className="flex space-x-1">
                                            {Array.from({length: Math.floor(example.num2 / 10)}, (_, i) => (
                                              <div key={i} className="w-8 h-12 bg-orange-500 border-2 border-orange-700 rounded flex items-center justify-center text-white font-bold animate-bounce" style={{animationDelay: `${i * 0.2}s`}}>
                                                10
                                              </div>
                                            ))}
                                          </div>
                                          <div className="text-lg font-bold text-orange-700 mt-2">
                                            {Math.floor(example.num2 / 10)} × 10 = {Math.floor(example.num2 / 10) * 10}
                                          </div>
                                        </div>

                                        <div className="text-3xl font-bold text-gray-600">+</div>

                                        {/* Unités en cyan */}
                                        <div className="text-center">
                                          <div className="text-sm font-semibold text-cyan-600 mb-2">Unités</div>
                                          <div className="flex space-x-1">
                                            {Array.from({length: example.num2 % 10}, (_, i) => (
                                              <div key={i} className="w-6 h-6 bg-cyan-500 border-2 border-cyan-700 rounded-full flex items-center justify-center text-white font-bold animate-bounce" style={{animationDelay: `${i * 0.1}s`}}>
                                                1
                                              </div>
                                            ))}
                                          </div>
                                          <div className="text-lg font-bold text-cyan-700 mt-2">
                                            {example.num2 % 10} unité{example.num2 % 10 > 1 ? 's' : ''}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )}

                              {/* Étape : Explication de la stratégie */}
                              {calculationStep === 'explain-strategy' && (
                                <div className="text-center bg-yellow-100 p-4 rounded-lg border-2 border-yellow-400">
                                  <div className="text-2xl font-bold text-yellow-800 mb-2">
                                    🎯 Stratégie secrète !
                                  </div>
                                  <div className="text-lg text-yellow-700">
                                    Je vais additionner les dizaines ensemble, puis les unités ensemble !
                                  </div>
                                </div>
                              )}

                              {/* Étape : Calcul des dizaines */}
                              {calculationStep === 'tens' && (
                                <div className="text-center">
                                  <div className="text-2xl font-bold text-purple-800 mb-4">
                                    🔢 Addition des dizaines
                                  </div>
                                  <div className="flex justify-center items-center space-x-4 mb-4">
                                    {/* Dizaines du premier nombre */}
                                    <div className="flex space-x-1">
                                      {Array.from({length: Math.floor(example.num1 / 10)}, (_, i) => (
                                        <div key={i} className="w-8 h-12 bg-red-500 border-2 border-red-700 rounded flex items-center justify-center text-white font-bold animate-pulse">
                                          10
                                        </div>
                                      ))}
                                    </div>
                                    
                                    <div className="text-3xl font-bold text-purple-600">+</div>
                                    
                                    {/* Dizaines du deuxième nombre */}
                                    <div className="flex space-x-1">
                                      {Array.from({length: Math.floor(example.num2 / 10)}, (_, i) => (
                                        <div key={i} className="w-8 h-12 bg-orange-500 border-2 border-orange-700 rounded flex items-center justify-center text-white font-bold animate-pulse">
                                          10
                                        </div>
                                      ))}
                                    </div>
                                    
                                    <div className="text-3xl font-bold text-purple-600">=</div>
                                    
                                    {/* Résultat des dizaines */}
                                    <div className="flex space-x-1">
                                      {Array.from({length: Math.floor(example.num1 / 10) + Math.floor(example.num2 / 10)}, (_, i) => (
                                        <div key={i} className="w-8 h-12 bg-purple-600 border-2 border-purple-800 rounded flex items-center justify-center text-white font-bold animate-bounce">
                                          10
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                  <div className="text-xl font-bold text-purple-700">
                                    {Math.floor(example.num1 / 10)} + {Math.floor(example.num2 / 10)} = {Math.floor(example.num1 / 10) + Math.floor(example.num2 / 10)} dizaines
                                  </div>
                                </div>
                              )}

                              {/* Étape : Calcul des unités */}
                              {calculationStep === 'units' && (
                                <div className="text-center">
                                  <div className="text-2xl font-bold text-blue-800 mb-4">
                                    🔹 Addition des unités
                                  </div>
                                  <div className="flex justify-center items-center space-x-4 mb-4">
                                    {/* Unités du premier nombre */}
                                    <div className="flex space-x-1">
                                      {Array.from({length: example.num1 % 10}, (_, i) => (
                                        <div key={i} className="w-6 h-6 bg-blue-500 border-2 border-blue-700 rounded-full flex items-center justify-center text-white font-bold animate-pulse">
                                          1
                                        </div>
                                      ))}
                                    </div>
                                    
                                    <div className="text-2xl font-bold text-blue-600">+</div>
                                    
                                    {/* Unités du deuxième nombre */}
                                    <div className="flex space-x-1">
                                      {Array.from({length: example.num2 % 10}, (_, i) => (
                                        <div key={i} className="w-6 h-6 bg-cyan-500 border-2 border-cyan-700 rounded-full flex items-center justify-center text-white font-bold animate-pulse">
                                          1
                                        </div>
                                      ))}
                                    </div>
                                    
                                    <div className="text-2xl font-bold text-blue-600">=</div>
                                    
                                    {/* Résultat des unités */}
                                    <div className="flex space-x-1">
                                      {Array.from({length: (example.num1 % 10) + (example.num2 % 10)}, (_, i) => (
                                        <div key={i} className="w-6 h-6 bg-indigo-600 border-2 border-indigo-800 rounded-full flex items-center justify-center text-white font-bold animate-bounce">
                                          1
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                  <div className="text-xl font-bold text-blue-700">
                                    {example.num1 % 10} + {example.num2 % 10} = {(example.num1 % 10) + (example.num2 % 10)} unités
                                  </div>
                                </div>
                              )}

                              {/* Étape : Regroupement */}
                              {calculationStep === 'regroup' && (
                                <div className="text-center bg-green-100 p-4 rounded-lg border-2 border-green-400">
                                  <div className="text-2xl font-bold text-green-800 mb-4">
                                    🔄 Regroupement final
                                  </div>
                                  <div className="text-xl font-bold text-green-700">
                                    {Math.floor(example.num1 / 10) + Math.floor(example.num2 / 10)} dizaines + {(example.num1 % 10) + (example.num2 % 10)} unités
                                  </div>
                                  <div className="text-lg text-green-600 mt-2">
                                    = {(Math.floor(example.num1 / 10) + Math.floor(example.num2 / 10)) * 10} + {(example.num1 % 10) + (example.num2 % 10)}
                                  </div>
                                </div>
                              )}

                              {/* Étape : Résultat final */}
                              {calculationStep === 'result' && (
                                <div className="text-center">
                                  <div className="text-5xl font-bold text-green-700 animate-bounce mb-4">
                                    = {example.result}
                                  </div>
                                  <div className="text-2xl font-bold text-green-600">
                                    🏆 Bravo ! Tu maîtrises le calcul mental !
                                  </div>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Animation pour complément à 10 */}
                          {currentTechnique === 'complement-10' && calculationStep && (
                            <div className="space-y-6 bg-gradient-to-br from-yellow-50 to-green-50 p-6 rounded-xl border-2 border-yellow-200">
                              
                              {/* Étape : Introduction */}
                              {calculationStep === 'setup' && (
                                <div className="text-center">
                                  <div className="text-4xl font-bold text-yellow-800 animate-pulse">
                                    {example.calculation}
                                  </div>
                                  <div className="text-lg text-yellow-600 mt-2">
                                    🎯 Technique du complément à 10 - Astuce géniale !
                                  </div>
                                </div>
                              )}

                              {/* Affichage permanent du problème (reste visible) */}
                              {(calculationStep === 'show-problem' || calculationStep === 'find-complement' || calculationStep === 'add-complement' || calculationStep === 'show-intermediate' || calculationStep === 'add-remaining' || calculationStep === 'result') && (
                                <div className="bg-white rounded-lg p-6 shadow-lg max-w-lg mx-auto">
                                  <div className="text-center mb-4">
                                    <div className="text-lg font-bold text-gray-800">🎯 Problème à résoudre</div>
                                  </div>
                                  <div className="text-center">
                                    <div className="text-4xl font-bold text-gray-800 mb-4">
                                      {example.num1} + {example.num2} = ?
                                    </div>
                                  </div>
                                </div>
                              )}

                              {/* Étape : Trouver le complément (reste visible) */}
                              {(calculationStep === 'find-complement' || calculationStep === 'add-complement' || calculationStep === 'show-intermediate' || calculationStep === 'add-remaining' || calculationStep === 'result') && (
                                <div className="text-center bg-blue-100 p-4 rounded-lg border-2 border-blue-400">
                                  <div className="text-2xl font-bold text-blue-800 mb-3">
                                    🔍 Étape 1 : Trouver le complément
                                  </div>
                                  
                                  {/* Représentation visuelle du nombre à arrondir */}
                                  <div className="flex justify-center items-center space-x-4 mb-4">
                                    <div className="text-center">
                                      <div className="text-xl font-bold text-blue-700 mb-2">{example.num1}</div>
                                      <div className="flex items-center space-x-2">
                                        {/* Dizaines */}
                                        {Array.from({length: Math.floor(example.num1 / 10)}, (_, i) => (
                                          <div key={i} className="w-8 h-12 bg-blue-500 border-2 border-blue-700 rounded flex items-center justify-center text-white font-bold text-sm">
                                            10
                                          </div>
                                        ))}
                                        {/* Unités */}
                                        {Array.from({length: example.num1 % 10}, (_, i) => (
                                          <div key={i} className="w-6 h-6 bg-cyan-500 border-2 border-cyan-700 rounded-full flex items-center justify-center text-white font-bold text-xs">
                                            1
                                          </div>
                                        ))}
                                      </div>
                                    </div>

                                    <div className="text-2xl font-bold text-blue-600">+</div>

                                    {/* Complément nécessaire */}
                                    <div className="text-center">
                                      <div className="text-xl font-bold text-green-700 mb-2">{10 - (example.num1 % 10)}</div>
                                      <div className="flex items-center space-x-1">
                                        {Array.from({length: 10 - (example.num1 % 10)}, (_, i) => (
                                          <div key={i} className="w-6 h-6 bg-green-500 border-2 border-green-700 rounded-full flex items-center justify-center text-white font-bold text-xs animate-pulse">
                                            1
                                          </div>
                                        ))}
                                      </div>
                                      <div className="text-sm font-bold text-green-700 mt-1">Complément</div>
                                    </div>

                                    <div className="text-2xl font-bold text-blue-600">=</div>

                                    {/* Résultat arrondi */}
                                    <div className="text-center">
                                      <div className="text-xl font-bold text-purple-700 mb-2">{Math.ceil(example.num1 / 10) * 10}</div>
                                      <div className="flex items-center space-x-2">
                                        {Array.from({length: Math.ceil(example.num1 / 10)}, (_, i) => (
                                          <div key={i} className="w-8 h-12 bg-purple-600 border-2 border-purple-800 rounded flex items-center justify-center text-white font-bold text-sm animate-bounce">
                                            10
                                          </div>
                                        ))}
                                      </div>
                                      <div className="text-sm font-bold text-purple-700 mt-1">Dizaine ronde !</div>
                                    </div>
                                  </div>

                                  <div className="text-xl font-bold text-blue-700">
                                    {example.num1} + {10 - (example.num1 % 10)} = {Math.ceil(example.num1 / 10) * 10}
                                  </div>
                                </div>
                              )}

                              {/* Étape : Décomposer le deuxième nombre (reste visible) */}
                              {(calculationStep === 'add-complement' || calculationStep === 'show-intermediate' || calculationStep === 'add-remaining' || calculationStep === 'result') && (
                                <div className="text-center bg-orange-100 p-4 rounded-lg border-2 border-orange-400">
                                  <div className="text-2xl font-bold text-orange-800 mb-3">
                                    ✂️ Étape 2 : Décomposer {example.num2}
                                  </div>
                                  
                                  <div className="flex justify-center items-center space-x-4 mb-4">
                                    {/* Nombre original */}
                                    <div className="text-center">
                                      <div className="text-xl font-bold text-orange-700 mb-2">{example.num2}</div>
                                      <div className="flex items-center space-x-1">
                                        {Array.from({length: example.num2}, (_, i) => (
                                          <div key={i} className={`w-6 h-6 border-2 rounded-full flex items-center justify-center text-white font-bold text-xs ${
                                            i < (10 - (example.num1 % 10)) ? 'bg-green-500 border-green-700 animate-pulse' : 'bg-orange-500 border-orange-700'
                                          }`}>
                                            1
                                          </div>
                                        ))}
                                      </div>
                                    </div>

                                    <div className="text-2xl font-bold text-orange-600">=</div>

                                    {/* Complément (qui sera utilisé) */}
                                    <div className="text-center">
                                      <div className="text-xl font-bold text-green-700 mb-2">{10 - (example.num1 % 10)}</div>
                                      <div className="flex items-center space-x-1">
                                        {Array.from({length: 10 - (example.num1 % 10)}, (_, i) => (
                                          <div key={i} className="w-6 h-6 bg-green-500 border-2 border-green-700 rounded-full flex items-center justify-center text-white font-bold text-xs animate-pulse">
                                            1
                                          </div>
                                        ))}
                                      </div>
                                      <div className="text-sm font-bold text-green-700 mt-1">Pour le complément</div>
                                    </div>

                                    <div className="text-2xl font-bold text-orange-600">+</div>

                                    {/* Reste */}
                                    <div className="text-center">
                                      <div className="text-xl font-bold text-red-700 mb-2">{example.num2 - (10 - (example.num1 % 10))}</div>
                                      <div className="flex items-center space-x-1">
                                        {Array.from({length: example.num2 - (10 - (example.num1 % 10))}, (_, i) => (
                                          <div key={i} className="w-6 h-6 bg-red-500 border-2 border-red-700 rounded-full flex items-center justify-center text-white font-bold text-xs">
                                            1
                                          </div>
                                        ))}
                                      </div>
                                      <div className="text-sm font-bold text-red-700 mt-1">Ce qui reste</div>
                                    </div>
                                  </div>

                                  <div className="text-xl font-bold text-orange-700">
                                    {example.num2} = {10 - (example.num1 % 10)} + {example.num2 - (10 - (example.num1 % 10))}
                                  </div>
                                </div>
                              )}

                              {/* Étape : Transformation magique (reste visible) */}
                              {(calculationStep === 'show-intermediate' || calculationStep === 'add-remaining' || calculationStep === 'result') && (
                                <div className="text-center bg-purple-100 p-4 rounded-lg border-2 border-purple-400">
                                  <div className="text-2xl font-bold text-purple-800 mb-3">
                                    ✨ Étape 3 : Transformation magique !
                                  </div>
                                  
                                  <div className="flex justify-center items-center space-x-4 mb-4">
                                    {/* Problème original */}
                                    <div className="text-center p-3 bg-gray-200 rounded-lg">
                                      <div className="text-sm font-bold text-gray-700 mb-1">Avant</div>
                                      <div className="text-lg font-bold text-gray-800">
                                        {example.num1} + {example.num2}
                                      </div>
                                      <div className="text-sm text-gray-600">Difficile !</div>
                                    </div>

                                    <div className="text-3xl text-purple-600">→</div>

                                    {/* Problème transformé */}
                                    <div className="text-center p-3 bg-green-200 rounded-lg">
                                      <div className="text-sm font-bold text-green-700 mb-1">Après</div>
                                      <div className="text-lg font-bold text-green-800">
                                        {Math.ceil(example.num1 / 10) * 10} + {example.num2 - (10 - (example.num1 % 10))}
                                      </div>
                                      <div className="text-sm text-green-600">Facile !</div>
                                    </div>
                                  </div>

                                  <div className="text-xl font-bold text-purple-700">
                                    Maintenant c'est plus simple : {Math.ceil(example.num1 / 10) * 10} + {example.num2 - (10 - (example.num1 % 10))}
                                  </div>
                                </div>
                              )}

                              {/* Étape : Calcul final (reste visible) */}
                              {(calculationStep === 'add-remaining' || calculationStep === 'result') && (
                                <div className="text-center bg-green-100 p-4 rounded-lg border-2 border-green-400">
                                  <div className="text-2xl font-bold text-green-800 mb-3">
                                    🧮 Étape 4 : Calcul final
                                  </div>
                                  
                                  <div className="flex justify-center items-center space-x-4 mb-4">
                                    {/* Dizaine ronde */}
                                    <div className="text-center">
                                      <div className="flex items-center space-x-2">
                                        {Array.from({length: Math.ceil(example.num1 / 10)}, (_, i) => (
                                          <div key={i} className="w-8 h-12 bg-green-500 border-2 border-green-700 rounded flex items-center justify-center text-white font-bold text-sm animate-pulse">
                                            10
                                          </div>
                                        ))}
                                      </div>
                                      <div className="text-xl font-bold text-green-700 mt-2">
                                        {Math.ceil(example.num1 / 10) * 10}
                                      </div>
                                    </div>

                                    <div className="text-3xl font-bold text-green-600">+</div>

                                    {/* Reste à ajouter */}
                                    <div className="text-center">
                                      <div className="flex items-center space-x-1">
                                        {Array.from({length: example.num2 - (10 - (example.num1 % 10))}, (_, i) => (
                                          <div key={i} className="w-6 h-6 bg-red-500 border-2 border-red-700 rounded-full flex items-center justify-center text-white font-bold text-xs animate-pulse">
                                            1
                                          </div>
                                        ))}
                                      </div>
                                      <div className="text-xl font-bold text-red-700 mt-2">
                                        {example.num2 - (10 - (example.num1 % 10))}
                                      </div>
                                    </div>

                                    <div className="text-3xl font-bold text-green-600">=</div>

                                    {/* Résultat */}
                                    <div className="text-center">
                                      <div className="text-3xl font-bold text-purple-700 animate-bounce">
                                        {example.result}
                                      </div>
                                    </div>
                                  </div>

                                  <div className="text-xl font-bold text-green-700">
                                    {Math.ceil(example.num1 / 10) * 10} + {example.num2 - (10 - (example.num1 % 10))} = {example.result}
                                  </div>
                                </div>
                              )}

                              {/* Résultat final avec célébration */}
                              {calculationStep === 'result' && (
                                <div className="text-center bg-yellow-100 p-4 rounded-lg border-2 border-yellow-400">
                                  <div className="text-5xl font-bold text-yellow-700 animate-bounce mb-4">
                                    = {example.result}
                                  </div>
                                  <div className="text-2xl font-bold text-yellow-600">
                                    🏆 Bravo ! Le complément à 10, c'est magique !
                                  </div>
                                  <div className="text-lg text-yellow-700 mt-2">
                                    Tu as transformé un calcul difficile en calcul facile !
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        ) : (
          /* Section Exercices */
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  Exercice {currentExercise + 1} / {exercises.length}
                </h2>
                <div className="text-lg font-semibold text-blue-600">
                  Score : {score} / {exercises.length}
                </div>
              </div>

              {!showCompletionModal ? (
                <div className="space-y-6">
                  {/* Type de technique */}
                  <div className="text-center">
                    <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                      exercises[currentExercise].type === 'sans-retenue' ? 'bg-green-100 text-green-800' :
                      exercises[currentExercise].type === 'avec-retenue' ? 'bg-orange-100 text-orange-800' :
                      exercises[currentExercise].type === 'calcul-mental' ? 'bg-purple-100 text-purple-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {exercises[currentExercise].type === 'sans-retenue' ? '✨ Sans retenue' :
                       exercises[currentExercise].type === 'avec-retenue' ? '🔄 Avec retenue' :
                       exercises[currentExercise].type === 'calcul-mental' ? '🧠 Calcul mental' :
                       '🎯 Complément à 10'}
                    </span>
                  </div>

                  {/* Question */}
                  <div className="p-4 bg-blue-200 rounded-lg text-center">
                    <div className="text-3xl font-mono font-bold mb-4 text-blue-900">
                      {exercises[currentExercise].question} = ?
                    </div>
                  </div>

                  {/* Zone de réponse */}
                  <div className="text-center space-y-4">
                    <input
                      type="number"
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      placeholder="Ta réponse..."
                      className="text-center text-xl font-bold border-2 border-gray-300 rounded-lg px-4 py-2 w-32"
                      onKeyPress={(e) => e.key === 'Enter' && checkAnswer()}
                    />
                    <div className="flex justify-center space-x-3">
                      <button
                        onClick={checkAnswer}
                        disabled={!userAnswer}
                        className="bg-blue-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-600 disabled:opacity-50"
                      >
                        Vérifier
                      </button>
                    </div>
                  </div>

                  {/* Indice */}
                  <div className="p-4 bg-yellow-100 rounded-lg text-center border-2 border-yellow-300">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Zap className="w-5 h-5 text-yellow-700" />
                      <span className="font-bold text-yellow-800">Astuce :</span>
                    </div>
                    <p className="text-yellow-800">{exercises[currentExercise].hint}</p>
                  </div>

                  {/* Feedback */}
                  {isCorrect !== null && (
                    <div className={`p-4 rounded-lg text-center ${
                      isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      <div className="flex items-center justify-center gap-2 mb-2">
                        {isCorrect ? (
                          <CheckCircle className="w-6 h-6" />
                        ) : (
                          <XCircle className="w-6 h-6" />
                        )}
                        <span className="font-bold">
                          {isCorrect ? 'Excellent ! Tu maîtrises cette technique !' : `Pas tout à fait... La réponse était ${exercises[currentExercise].answer}`}
                        </span>
                      </div>
                      
                      <button
                        onClick={nextExercise}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-600 mt-2"
                      >
                        {currentExercise < exercises.length - 1 ? 'Exercice suivant' : 'Voir mes résultats'}
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                /* Modal de fin */
                <div className="text-center space-y-6">
                  <div className="text-6xl">🏆</div>
                  <h2 className="text-3xl font-bold text-gray-800">
                    Bravo ! Tu maîtrises les additions jusqu'à 100 !
                  </h2>
                  <div className="text-2xl font-bold text-blue-600">
                    Score : {finalScore} / {exercises.length}
                  </div>
                  <div className="flex justify-center space-x-4">
                    <button
                      onClick={resetExercises}
                      className="bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600"
                    >
                      Recommencer
                    </button>
                    <button
                      onClick={() => setShowExercises(false)}
                      className="bg-indigo-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-600"
                    >
                      Retour au cours
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}