'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, Play, Pause } from 'lucide-react';

export default function AdditionSansRetenueCE2() {
  // États pour l'audio et animations
  const [isPlayingVocal, setIsPlayingVocal] = useState(false);
  const [isAnimationRunning, setIsAnimationRunning] = useState(false);
  const [highlightedElement, setHighlightedElement] = useState<string | null>(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [animatingStep, setAnimatingStep] = useState<string | null>(null);
  const [currentExample, setCurrentExample] = useState<number | null>(null);
  const [highlightedDigits, setHighlightedDigits] = useState<string[]>([]);
  const [calculationStep, setCalculationStep] = useState<'setup' | 'units' | 'carry' | 'tens' | 'hundreds' | 'result' | null>(null);
  const [showingCarry, setShowingCarry] = useState(false);
  const [partialResults, setPartialResults] = useState<{units: string | null, tens: string | null, hundreds: string | null}>({units: null, tens: null, hundreds: null});
  
  // États pour les exercices
  const [showExercises, setShowExercises] = useState(false);
  const [currentExercise, setCurrentExercise] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [answeredCorrectly, setAnsweredCorrectly] = useState<Set<number>>(new Set());
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  
  // États pour le personnage Minecraft (cours)
  const [samSizeExpanded, setSamSizeExpanded] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  // États pour le personnage Minecraft (exercices)
  const [exercisesIsPlayingVocal, setExercisesIsPlayingVocal] = useState(false);
  const [exercisesHasStarted, setExercisesHasStarted] = useState(false);
  const [exercisesImageError, setExercisesImageError] = useState(false);
  
  // Refs pour gérer l'audio
  const stopSignalRef = useRef(false);
  const currentAudioRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Exemples d'additions posées
  const additionExamples = [
    { num1: 27, num2: 15, result: 42, hasCarry: true, description: 'avec retenue simple', carryPositions: ['units'] },
    { num1: 47, num2: 36, result: 83, hasCarry: true, description: 'avec retenue simple', carryPositions: ['units'] },
    { num1: 58, num2: 27, result: 85, hasCarry: true, description: 'avec retenue simple', carryPositions: ['units'] },
    { num1: 267, num2: 85, result: 352, hasCarry: true, description: '3 chiffres + 2 chiffres avec retenue', carryPositions: ['units'] },
    { num1: 256, num2: 167, result: 423, hasCarry: true, description: 'à 3 chiffres avec retenue', carryPositions: ['units', 'tens'] },
    { num1: 267, num2: 358, result: 625, hasCarry: true, description: 'à 3 chiffres avec retenue aux unités et dizaines', carryPositions: ['units', 'tens'] },
    { num1: 26, num2: 37, num3: 28, result: 91, hasCarry: true, description: '3 nombres à 2 chiffres avec retenue', carryPositions: ['units', 'tens'] },
    { num1: 267, num2: 358, num3: 175, result: 800, hasCarry: true, description: '3 nombres à 3 chiffres avec retenue', carryPositions: ['units', 'tens'] },
    { num1: 256, num2: 167, num3: 78, result: 501, hasCarry: true, description: '2 nombres à 3 chiffres + 1 nombre à 2 chiffres avec retenue', carryPositions: ['units', 'tens'] }
  ];

  // Exercices progressifs
  // Fonction pour mélanger un tableau (Fisher-Yates)
  const shuffleArray = (array: any[]) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const baseExercises = [
    // 1. Introduction rapide
    {
      question: 'Pour poser une addition, je dois...', 
      correctAnswer: 'Aligner les chiffres en colonnes',
      choices: ['Écrire n\'importe comment', 'Aligner les chiffres en colonnes', 'Mélanger les nombres']
    },
    
    // 2. Démarrage avec calculs simples à 2 nombres
    { 
      question: 'Calcule : 37 + 25', 
      correctAnswer: '62',
      choices: ['62', '52', '72'],
      visual: '   37\n+  25\n─────\n   ?'
    },
    { 
      question: 'Calcule : 48 + 36', 
      correctAnswer: '84',
      choices: ['84', '74', '94'],
      visual: '   48\n+  36\n─────\n   ?'
    },
    
    // 3. Addition de 2 nombres à 3 chiffres avec retenue
    { 
      question: 'Quand je fais 7 + 8 = 15, que fais-je du 1 ?', 
      correctAnswer: 'Je le mets en retenue',
      choices: ['Je le mets en retenue', 'Je le laisse à droite', 'Je le barre']
    },
    { 
      question: 'Calcule : 267 + 358', 
      correctAnswer: '625',
      choices: ['615', '625', '635'],
      visual: '  267\n+ 358\n─────\n   ?'
    },
    { 
      question: 'Calcule : 456 + 367', 
      correctAnswer: '823',
      choices: ['813', '823', '833'],
      visual: '  456\n+ 367\n─────\n   ?'
    },
    
    // 4. Addition de 3 nombres à 2 chiffres avec retenue
    { 
      question: 'Calcule : 26 + 37 + 28', 
      correctAnswer: '91',
      choices: ['81', '91', '101'],
      visual: '   26\n+  37\n+  28\n─────\n   ?'
    },
    { 
      question: 'Calcule : 35 + 27 + 29', 
      correctAnswer: '91',
      choices: ['81', '91', '101'],
      visual: '   35\n+  27\n+  29\n─────\n   ?'
    },
    
    // 5. Addition mixte (2 nombres à 3 chiffres + 1 nombre à 2 chiffres)
    { 
      question: 'Calcule : 256 + 167 + 78', 
      correctAnswer: '501',
      choices: ['491', '501', '511'],
      visual: '  256\n+ 167\n+  78\n─────\n   ?'
    },
    { 
      question: 'Calcule : 267 + 156 + 77', 
      correctAnswer: '500',
      choices: ['490', '500', '510'],
      visual: '  267\n+ 156\n+  77\n─────\n   ?'
    },
    
    // 6. Questions de compréhension
    { 
      question: 'Par quelle colonne commence-t-on toujours ?', 
      correctAnswer: 'Les unités (à droite)',
      choices: ['Les dizaines (à gauche)', 'Les unités (à droite)', 'Les centaines (à gauche)']
    },
    { 
      question: 'L\'addition posée sans retenue nous aide à...', 
      correctAnswer: 'Calculer plus facilement',
      choices: ['Aller plus vite', 'Faire plus joli', 'Calculer plus facilement']
    }
  ];

  const exercises = baseExercises;

  // Fonction pour arrêter toutes les animations et vocaux
  const stopAllVocalsAndAnimations = () => {
    console.log('🛑 Arrêt de tous les vocaux et animations');
    stopSignalRef.current = true;
    
    if (speechSynthesis.speaking || speechSynthesis.pending) {
      speechSynthesis.cancel();
    }
    
    if (currentAudioRef.current) {
      currentAudioRef.current = null;
    }
    
    setIsPlayingVocal(false);
    setExercisesIsPlayingVocal(false);
    setIsAnimationRunning(false);
    setHighlightedElement(null);
    setAnimatingStep(null);
    setCurrentExample(null);
    setHighlightedDigits([]);
    setCalculationStep(null);
    setShowingCarry(false);
    setPartialResults({units: null, tens: null, hundreds: null});
    setSamSizeExpanded(false);
  };

  // Fonction pour jouer l'audio
  const playAudio = async (text: string, slowMode = false) => {
    return new Promise<void>((resolve) => {
      if (stopSignalRef.current) {
        resolve();
        return;
      }
      
      setIsPlayingVocal(true);
      const utterance = new SpeechSynthesisUtterance(text);
      
      utterance.lang = 'fr-FR';
      utterance.rate = slowMode ? 1.0 : 1.3;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      const voices = speechSynthesis.getVoices();
      const frenchVoice = voices.find(voice => 
        voice.lang === 'fr-FR' && voice.localService === true
      );
      
      if (frenchVoice) {
        utterance.voice = frenchVoice;
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

  // Fonction pour scroller vers un élément
  const scrollToElement = (elementId: string) => {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // Fonction pour expliquer le chapitre dans le cours avec le personnage
  const explainChapterWithSam = async () => {
    if (isPlayingVocal) return;
    
    stopAllVocalsAndAnimations();
    await wait(300);
    stopSignalRef.current = false;
    setIsPlayingVocal(true);
    setHasStarted(true);
    setSamSizeExpanded(true);
    
    try {
      // Introduction générale
      await playAudio("Salut ! Moi c'est Sam ! Aujourd'hui, on va apprendre l'addition posée ensemble !", true);
      if (stopSignalRef.current) return;
      await wait(1000);
      
      await playAudio("L'objectif de ce chapitre est d'apprendre à poser des additions pour calculer de gros nombres facilement !", true);
      if (stopSignalRef.current) return;
      await wait(1000);
      
      // Présentation de la section introduction avec scroll
      setHighlightedElement('intro-section');
      document.getElementById('intro-section')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      await wait(1500);
      
      await playAudio("D'abord, nous allons comprendre ce que signifie 'poser une addition'.", true);
      if (stopSignalRef.current) return;
      await wait(1000);
      
      // Présentation de l'exemple principal avec scroll et surbrillance
      setHighlightedElement('example-section');
      document.getElementById('example-section')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      await wait(1500);
      
      await playAudio("Ensuite, voici l'exemple principal avec son animation !", true);
      if (stopSignalRef.current) return;
      await wait(1000);
      
      // Mettre en surbrillance le bouton "Voir l'animation"
      const exampleButton = document.querySelector('#example-section button');
      if (exampleButton) {
        exampleButton.classList.add('ring-4', 'ring-yellow-400', 'animate-pulse');
      }
      await playAudio("Tu vois ce bouton qui clignote ? Clique sur 'Voir l'animation' pour voir la magie opérer !", true);
      if (stopSignalRef.current) return;
      await wait(2000);
      
      // Retirer la surbrillance
      if (exampleButton) {
        exampleButton.classList.remove('ring-4', 'ring-yellow-400', 'animate-pulse');
      }
      
      // Présentation des autres exemples avec scroll
      setHighlightedElement('examples-section');
      document.getElementById('examples-section')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      await wait(1500);
      
      await playAudio("Ici, tu trouveras plein d'autres exemples à explorer !", true);
      if (stopSignalRef.current) return;
      await wait(1000);
      
      // Mettre en surbrillance toutes les cartes d'exemples
      const exampleCards = document.querySelectorAll('#examples-section .bg-gradient-to-br');
      exampleCards.forEach(card => {
        card.classList.add('ring-4', 'ring-yellow-400', 'animate-pulse');
      });
      await playAudio("Regarde tous ces boutons qui clignotent ! Chaque carte verte a son animation spéciale !", true);
      if (stopSignalRef.current) return;
      await wait(2000);
      
      // Retirer la surbrillance des cartes
      exampleCards.forEach(card => {
        card.classList.remove('ring-4', 'ring-yellow-400', 'animate-pulse');
      });
      
      await wait(1000);
      
      // Présentation finale et transition vers les exercices
      await playAudio("Tu as maintenant découvert toutes les parties du cours !", true);
      if (stopSignalRef.current) return;
      await wait(1000);
      
      // Scroll vers les onglets et mettre en surbrillance le bouton exercices
      setHighlightedElement('exercise_tab');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      await wait(1500);
      
      await playAudio("Quand tu te sentiras prêt, tu pourras passer aux exercices pour t'entraîner !", true);
      if (stopSignalRef.current) return;
      await wait(2000);
      
      await playAudio("Amuse-toi bien avec les additions posées ! Et n'hésite pas à refaire les animations si tu en as besoin !", true);
      if (stopSignalRef.current) return;
      
    } catch (error) {
      console.error('Erreur dans explainChapterWithSam:', error);
    } finally {
      setIsPlayingVocal(false);
      setSamSizeExpanded(false);
      setHighlightedElement(null);
    }
  };

  // Fonction pour expliquer un exemple spécifique avec animations interactives
  const explainExercisesWithSam = async () => {
    if (exercisesIsPlayingVocal) return;
    
    setExercisesIsPlayingVocal(true);
    setExercisesHasStarted(true);
    stopSignalRef.current = false;
    
    const speak = (text: string, highlightElement?: string) => {
      return new Promise<void>((resolve) => {
        if (stopSignalRef.current) {
          resolve();
          return;
        }
        
        if (highlightElement) {
          setHighlightedElement(highlightElement);
        }
        
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.9;
        utterance.pitch = 1.1;
        utterance.volume = 1;
        
        utterance.onend = () => {
          if (highlightElement) {
            setTimeout(() => setHighlightedElement(''), 300);
          }
          resolve();
        };
        
        utterance.onerror = () => resolve();
        currentAudioRef.current = utterance;
        speechSynthesis.speak(utterance);
      });
    };

    const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
    
    try {
      await speak("Salut ! Je vais t'expliquer comment faire les exercices d'addition posée !");
      if (stopSignalRef.current) return;

      await speak("D'abord, clique sur l'onglet Exercices pour voir les questions !");
      if (stopSignalRef.current) return;

      // Basculer vers l'onglet exercices
      setShowExercises(true);
      await wait(1000); // Attendre que l'onglet se charge
      if (stopSignalRef.current) return;
      
      await speak("Parfait ! Maintenant tu vois la première question !", 'exercises-header');
      if (stopSignalRef.current) return;
      
      await speak("Tu peux écouter l'énoncé en cliquant sur ce bouton bleu !", 'listen-button');
      if (stopSignalRef.current) return;
      
      await speak("Ensuite, écris ta réponse dans cette case !", 'answer-input');
      if (stopSignalRef.current) return;
      
      await speak("Quand tu es sûr de ta réponse, clique sur Valider !", 'validate-button');
      if (stopSignalRef.current) return;
      
      await speak("Si c'est correct, tu passes automatiquement à l'exercice suivant !");
      if (stopSignalRef.current) return;
      
      await speak("Si c'est faux, je te montre l'animation pour t'expliquer la bonne méthode !");
      if (stopSignalRef.current) return;
      
      await speak("Puis tu pourras cliquer sur Exercice suivant pour continuer !", 'next-button');
      if (stopSignalRef.current) return;
      
      await speak("Ton score s'affiche ici en haut à droite ! Allez, c'est parti !", 'score-display');
      
    } catch (error) {
      console.error('Erreur lors de l\'explication des exercices:', error);
    } finally {
      if (!stopSignalRef.current) {
        setExercisesIsPlayingVocal(false);
        setHighlightedElement('');
      }
    }
  };

  const explainExample = async (index: number) => {
    if (isAnimationRunning) return;
    
    stopAllVocalsAndAnimations();
    await wait(300);
    stopSignalRef.current = false;
    setIsAnimationRunning(true);
    setCurrentExample(index);
    setPartialResults({units: null, tens: null, hundreds: null}); // Reset des résultats partiels
    
    const example = additionExamples[index];
    
    // Scroll automatique vers l'animation
    scrollToElement('example-section');
    
    try {
      // Introduction avec focus sur le tableau U/D
      setCalculationStep('setup');
      setHighlightedElement('example-section');
      await playAudio(`Regardons ensemble cette addition posée : ${example.num1} plus ${example.num2}${example.num3 ? ` plus ${example.num3}` : ''} ! C'est parti !`, true);
      if (stopSignalRef.current) return;
      
      await wait(1000);
      const maxDigits = Math.max(example.num1.toString().length, example.num2.toString().length);
      if (maxDigits >= 3) {
        await playAudio("Vois-tu le tableau au-dessus ? C pour centaines, D pour dizaines, et U pour unités ! C'est très important !", true);
      } else {
        await playAudio("Vois-tu le tableau au-dessus ? D pour dizaines... U pour unités ! C'est très important de bien comprendre ça !", true);
      }
      if (stopSignalRef.current) return;
      
      await wait(1500);
      await playAudio("Chaque chiffre doit aller dans la bonne colonne ! Regarde comme ils s'alignent parfaitement... Magnifique !", true);
      if (stopSignalRef.current) return;
      
      // Focus sur les unités avec animation colorée
      await wait(2000);
      setCalculationStep('units');
      const num1Units = example.num1 % 10;
      const num2Units = example.num2 % 10;
      const num3Units = example.num3 ? example.num3 % 10 : 0;
      const unitsSum = num1Units + num2Units + (example.num3 ? num3Units : 0);
      
      // Préparer le texte pour l'explication des unités
      let unitsText = `Maintenant, la colonne des unités devient bleue ! Regarde bien... Je calcule : ${num1Units} plus ${num2Units}`;
      if (example.num3) {
        unitsText += ` plus ${num3Units}`;
      }
      unitsText += ` égale ${unitsSum} !`;
      if (unitsSum >= 10) {
        if (example.num3) {
          unitsText += ` Comme ${unitsSum} est plus grand que 9, je pose ${unitsSum % 10} et je retiens ${Math.floor(unitsSum / 10)} pour les dizaines.`;
        } else {
          unitsText += ` Comme ${unitsSum} est plus grand que 9, je pose ${unitsSum % 10} et je retiens ${Math.floor(unitsSum / 10)}.`;
        }
      }
      await playAudio(unitsText, true);
      if (stopSignalRef.current) return;
      
      // Afficher le résultat des unités immédiatement
      await wait(500);
      const unitsResult = unitsSum >= 10 ? (unitsSum % 10).toString() : unitsSum.toString();
      setPartialResults(prev => ({ ...prev, units: unitsResult }));
      await wait(1000);
      
      // Gestion de la retenue avec animation spéciale
              if (example.hasCarry) {
          await wait(1500);
          setShowingCarry(true);
          await playAudio(`${unitsSum} est plus grand que 9 ! Je pose ${unitsSum % 10} et je retiens ${Math.floor(unitsSum / 10)}.`, true);
        if (stopSignalRef.current) return;
      }
      
      // Focus sur les dizaines avec animation orange
      if (maxDigits >= 2) {
        await wait(2000);
        setCalculationStep('tens');
        const num1Tens = Math.floor((example.num1 % 100) / 10);
        const num2Tens = Math.floor((example.num2 % 100) / 10);
        const num3Tens = example.num3 ? Math.floor((example.num3 % 100) / 10) : 0;
        const carry = example.hasCarry ? Math.floor(unitsSum / 10) : 0;
        
        await playAudio(`Maintenant, la colonne des dizaines devient orange ! Regarde comme elle s'anime... Fantastique !`, true);
        if (stopSignalRef.current) return;
        
        await wait(1000);
        const tensSum = parseInt(String(num1Tens || '0')) + parseInt(String(num2Tens || '0')) + parseInt(String(num3Tens || '0')) + carry;
                await playAudio(`Je calcule : ${num1Tens} plus ${num2Tens}${example.num3 ? ` plus ${num3Tens}` : ''}${carry > 0 ? ` plus ${carry} de retenue` : ''} égale ${tensSum}. Je pose ${tensSum % 10} et je retiens ${Math.floor(tensSum / 10)}`, true);
        if (stopSignalRef.current) return;
        
        // Afficher le résultat des dizaines immédiatement (seulement le chiffre des unités)
        await wait(500);
        // On ne met que le chiffre des unités (le 0 de 20) dans le résultat
        setPartialResults(prev => ({ ...prev, tens: (tensSum % 10).toString() }));
        await wait(1000);

        // Maintenant on continue avec les centaines
        setCalculationStep('hundreds');
        const num1Hundreds = Math.floor(example.num1 / 100) % 10;
        const num2Hundreds = Math.floor(example.num2 / 100) % 10;
        const num3Hundreds = example.num3 ? Math.floor(example.num3 / 100) % 10 : 0;
        const hundredsCarry = 2; // On garde le 2 de retenue des dizaines
        
        await playAudio(`Maintenant je calcule ${num1Hundreds} plus ${num2Hundreds}${example.num3 ? ` plus ${num3Hundreds}` : ''} plus ${hundredsCarry} de retenue`, true);
        if (stopSignalRef.current) return;
        
        await wait(1000);
        const hundredsSum = num1Hundreds + num2Hundreds + (example.num3 ? num3Hundreds : 0) + hundredsCarry;
        await playAudio(`Égale ${hundredsSum}`, true);
        if (stopSignalRef.current) return;
        
        // Afficher le résultat des centaines immédiatement
        await wait(500);
        setPartialResults(prev => ({ ...prev, hundreds: hundredsSum.toString() }));
        await wait(1000);
      }
      
      // Résultat final
      await wait(2000);
      setCalculationStep('result');
      await playAudio(`Le résultat est ${example.result}.`, true);
      if (stopSignalRef.current) return;
      
      await wait(2500);
      setCurrentExample(null);
      setCalculationStep(null);
      setShowingCarry(false);
      setHighlightedElement(null);
    } catch (error) {
      console.error('Erreur dans explainExample:', error);
    } finally {
      setIsAnimationRunning(false);
      setCurrentExample(null);
      setCalculationStep(null);
      setShowingCarry(false);
      setHighlightedElement(null);
      setPartialResults({units: null, tens: null, hundreds: null});
    }
  };

  // Fonction pour la présentation succincte de la page
  const startLessonPresentation = async () => {
    if (isAnimationRunning) return;
    
    stopAllVocalsAndAnimations();
    await wait(300);
    stopSignalRef.current = false;
    setIsAnimationRunning(true);
    setShowExercises(false); // S'assurer qu'on est sur le cours
    
    try {
      // Introduction du chapitre
      setHighlightedElement('intro-section');
      document.getElementById('intro-section')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      await wait(1000);
      
      await playAudio("Voici le chapitre pour apprendre à poser les additions ! C'est plus facile comme cela !", true);
      if (stopSignalRef.current) return;
      
      await wait(1500);
      setHighlightedElement(null);
      
      // Présentation des différentes techniques
      await playAudio("Tu as en dessous les différentes techniques d'additions posées...", true);
      if (stopSignalRef.current) return;
      
      await wait(1000);
      
      // Focus sur les additions sans retenue
      setHighlightedElement('examples-section');
      document.getElementById('examples-section')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      await wait(1000);
      
      await playAudio("D'abord, les additions posées sans retenue ! Comme 23 plus 14 ou 31 plus 26...", true);
      
      // Illuminer les exemples sans retenue (indices 0 et 1)
      setHighlightedElement('example-0');
      document.getElementById('example-0')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      await wait(800);
      setHighlightedElement('example-1');
      document.getElementById('example-1')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      await wait(1000);
      if (stopSignalRef.current) return;
      
      // Highlight spécifiquement les exemples avec retenue
      await playAudio("Ensuite, les additions avec retenue ! Comme 37 plus 28... c'est un peu plus compliqué !", true);
      
      // Illuminer les exemples avec retenue (indices 2 et 3)
      setHighlightedElement('example-2');
      document.getElementById('example-2')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      await wait(800);
      setHighlightedElement('example-3');
      document.getElementById('example-3')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      await wait(1000);
      if (stopSignalRef.current) return;
      
      // Highlight les grands nombres
      await playAudio("Et enfin, les additions avec de grands nombres ! Par exemple 123 plus 145... avec 3 chiffres !", true);
      
      // Illuminer l'exemple à 3 chiffres (indice 4)
      setHighlightedElement('example-4');
      document.getElementById('example-4')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      await wait(1000);
      if (stopSignalRef.current) return;
      
      await wait(1500);
      setHighlightedElement(null);
      
      // Retour vers le haut pour les instructions d'utilisation
      document.getElementById('examples-section')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      await wait(1000);
      
      // Instructions d'utilisation
      await playAudio("Pour voir la méthode détaillée... il suffit de cliquer sur la case correspondante ! C'est très simple !", true);
      if (stopSignalRef.current) return;
      
      await wait(1500);
      await playAudio("Chaque exemple te montrera... étape par étape... comment bien poser ton addition ! Bonne découverte !", true);
      if (stopSignalRef.current) return;
      
      await wait(1000);
      setHighlightedElement(null);
      
    } finally {
      setIsAnimationRunning(false);
      setHighlightedElement(null);
      setPartialResults({units: null, tens: null, hundreds: null});
    }
  };

  // Fonction pour rendre une addition posée avec animations améliorées
  const renderPostedAddition = (example: any, isAnimated = false) => {
    // Déterminer le nombre de chiffres maximum
    const maxDigits = Math.max(
      example.num1.toString().length, 
      example.num2.toString().length, 
      example.num3 ? example.num3.toString().length : 0,
      example.result.toString().length
    );
    const num1Str = example.num1.toString().padStart(maxDigits, ' ');
    const num2Str = example.num2.toString().padStart(maxDigits, ' ');
    const num3Str = example.num3 ? example.num3.toString().padStart(maxDigits, ' ') : null;
    const resultStr = example.result.toString().padStart(maxDigits, ' ');
    
    // Séparer les chiffres (unités, dizaines, centaines)
    const num1Units = num1Str[num1Str.length - 1];
    const num1Tens = num1Str[num1Str.length - 2] === ' ' ? '' : num1Str[num1Str.length - 2];
    const num1Hundreds = maxDigits >= 3 ? (num1Str[num1Str.length - 3] === ' ' ? '' : num1Str[num1Str.length - 3]) : '';
    
    const num2Units = num2Str[num2Str.length - 1];
    const num2Tens = num2Str[num2Str.length - 2] === ' ' ? '' : num2Str[num2Str.length - 2];
    const num2Hundreds = maxDigits >= 3 ? (num2Str[num2Str.length - 3] === ' ' ? '' : num2Str[num2Str.length - 3]) : '';

    // Séparer les chiffres du troisième nombre si présent
    const num3Units = num3Str ? num3Str[num3Str.length - 1] : '';
    const num3Tens = num3Str && num3Str[num3Str.length - 2] !== ' ' ? num3Str[num3Str.length - 2] : '';
    const num3Hundreds = num3Str && maxDigits >= 3 && num3Str[num3Str.length - 3] !== ' ' ? num3Str[num3Str.length - 3] : '';

    // Calculer les sommes et retenues
    const unitsSum = parseInt(String(num1Units || '0')) + parseInt(String(num2Units || '0')) + parseInt(String(num3Units || '0'));
    const unitsCarry = Math.floor(unitsSum / 10);
    
    // Pour les dizaines, on n'ajoute la retenue des unités que si on est à l'étape des dizaines
    const tensSum = parseInt(String(num1Tens || '0')) + parseInt(String(num2Tens || '0')) + parseInt(String(num3Tens || '0')) + 
                   (calculationStep === 'tens' ? unitsCarry : 0);
    const tensCarry = Math.floor(tensSum / 10);

    // Pour les centaines, on n'ajoute la retenue des dizaines que si on est à l'étape des centaines
    const hundredsSum = parseInt(String(num1Hundreds || '0')) + parseInt(String(num2Hundreds || '0')) + parseInt(String(num3Hundreds || '0')) + 
                       (calculationStep === 'hundreds' ? tensCarry : 0);

    // Variable carry qui change selon l'étape
    const carry = calculationStep === 'tens' ? unitsCarry : 
                 calculationStep === 'hundreds' ? tensCarry : 0;
    
    const resultUnits = resultStr[resultStr.length - 1];
    const resultTens = resultStr[resultStr.length - 2] === ' ' ? '' : resultStr[resultStr.length - 2];
    const resultHundreds = maxDigits >= 3 ? (resultStr[resultStr.length - 3] === ' ' ? '' : resultStr[resultStr.length - 3]) : '';
    
    return (
      <div className={`bg-gradient-to-br from-white to-blue-50 p-8 rounded-xl shadow-lg border-2 transition-all duration-500 ${
        isAnimated && currentExample === additionExamples.indexOf(example) ? 'border-blue-400 bg-blue-50 scale-105 shadow-xl' : 'border-gray-200'
      }`}>
        <div className="flex justify-center">
          <div className="space-y-4">
            {/* Tableau des colonnes C, D et U (ou seulement D et U) */}
            <div className="flex justify-center mb-4">
              <div className={`grid gap-4 sm:gap-6 font-bold text-sm sm:text-base ${maxDigits >= 3 ? 'grid-cols-3' : 'grid-cols-2'}`}>
                {maxDigits >= 3 && (
                  <div className={`text-center p-2 rounded-lg transition-all duration-500 ${
                    calculationStep === 'hundreds' ? 'bg-purple-200 text-purple-800 animate-column-highlight' : 'bg-gray-100 text-gray-600'
                  }`}>
                    C
                  </div>
                )}
                <div className={`text-center p-2 rounded-lg transition-all duration-500 ${
                  calculationStep === 'tens' ? 'bg-orange-200 text-orange-800 animate-column-highlight' : 'bg-gray-100 text-gray-600'
                }`}>
                  D
                </div>
                <div className={`text-center p-2 rounded-lg transition-all duration-500 ${
                  calculationStep === 'units' ? 'bg-blue-200 text-blue-800 animate-column-highlight' : 'bg-gray-100 text-gray-600'
                }`}>
                  U
                </div>
              </div>
            </div>

            {/* Retenues si nécessaire */}
            {example.hasCarry && showingCarry && (
              <div className="flex justify-center">
                <div className={`grid gap-8 ${maxDigits >= 3 ? 'grid-cols-3' : 'grid-cols-2'}`}>
                  {maxDigits >= 3 && (
                    <div className="text-center">
                      {/* Retenue pour les centaines - apparaît après avoir posé le résultat des dizaines et reste affichée */}
                      {partialResults.tens !== null && (
                        <div className="text-red-500 text-lg animate-carry-bounce">
                          <sup className="bg-red-100 px-2 py-1 rounded-full border-2 border-red-300">
                            2
                          </sup>
                        </div>
                      )}
                    </div>
                  )}
                  <div className="text-center">
                    {/* Retenue pour les dizaines - reste affichée après le calcul des unités */}
                    {unitsSum >= 10 && (
                      <div className="text-red-500 text-lg animate-carry-bounce">
                        <sup className="bg-red-100 px-2 py-1 rounded-full border-2 border-red-300">
                          {Math.floor(unitsSum / 10)}
                        </sup>
                      </div>
                    )}
                  </div>
                  <div className="text-center"></div>
                </div>
              </div>
            )}
            
            {/* Premier nombre */}
            <div className="flex justify-center">
              <div className={`grid gap-2 sm:gap-6 font-mono text-base sm:text-2xl ${maxDigits >= 3 ? 'grid-cols-3' : 'grid-cols-2'}`}>
                {maxDigits >= 3 && (
                  <div className={`text-center p-3 rounded-lg transition-all duration-500 ${
                    calculationStep === 'hundreds' ? 'bg-purple-100 text-purple-700 animate-column-highlight' : 
                    calculationStep === 'setup' ? 'text-blue-600 font-bold' : 'text-gray-700'
                  } ${num1Hundreds ? 'border-2 border-dashed border-purple-300' : ''}`}>
                    {num1Hundreds || ''}
                  </div>
                )}
                <div className={`text-center p-3 rounded-lg transition-all duration-500 ${
                  calculationStep === 'tens' ? 'bg-orange-100 text-orange-700 animate-column-highlight' : 
                  calculationStep === 'setup' ? 'text-blue-600 font-bold' : 'text-gray-700'
                } ${num1Tens ? 'border-2 border-dashed border-orange-300' : ''}`}>
                  {num1Tens || ''}
                </div>
                <div className={`text-center p-3 rounded-lg transition-all duration-500 ${
                  calculationStep === 'units' ? 'bg-blue-100 text-blue-700 animate-column-highlight' : 
                  calculationStep === 'setup' ? 'text-blue-600 font-bold' : 'text-gray-700'
                } border-2 border-dashed border-blue-300`}>
                  {num1Units}
                </div>
              </div>
            </div>
            
            {/* Deuxième nombre avec signe + */}
            <div className="flex justify-center">
              <div className="relative">
                <div className={`grid gap-2 sm:gap-6 font-mono text-base sm:text-2xl ${maxDigits >= 3 ? 'grid-cols-3' : 'grid-cols-2'}`}>
                  {maxDigits >= 3 && (
                    <div className={`text-center p-3 rounded-lg transition-all duration-500 ${
                      calculationStep === 'hundreds' ? 'bg-purple-100 text-purple-700 animate-column-highlight' : 
                      calculationStep === 'setup' ? 'text-green-600 font-bold' : 'text-gray-700'
                    } ${num2Hundreds ? 'border-2 border-dashed border-purple-300' : ''}`}>
                      {num2Hundreds || ''}
                    </div>
                  )}
                  <div className={`text-center p-3 rounded-lg transition-all duration-500 relative ${
                    calculationStep === 'tens' ? 'bg-orange-100 text-orange-700 animate-column-highlight' : 
                    calculationStep === 'setup' ? 'text-green-600 font-bold' : 'text-gray-700'
                  } ${num2Tens ? 'border-2 border-dashed border-orange-300' : ''}`}>
                    {num2Tens || ''}
                  </div>
                  <div className={`text-center p-3 rounded-lg transition-all duration-500 ${
                    calculationStep === 'units' ? 'bg-blue-100 text-blue-700 animate-column-highlight' : 
                    calculationStep === 'setup' ? 'text-green-600 font-bold' : 'text-gray-700'
                  } border-2 border-dashed border-blue-300`}>
                    {num2Units}
                  </div>
                </div>
                {/* Signe + positionné à gauche sans affecter l'alignement */}
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-8 text-3xl font-mono text-green-600 font-bold">
                  +
                </div>
              </div>
            </div>

            {/* Troisième nombre avec signe + (si présent) */}
            {num3Str && (
              <div className="flex justify-center">
                <div className="relative">
                  <div className={`grid gap-2 sm:gap-6 font-mono text-base sm:text-2xl ${maxDigits >= 3 ? 'grid-cols-3' : 'grid-cols-2'}`}>
                    {maxDigits >= 3 && (
                      <div className={`text-center p-3 rounded-lg transition-all duration-500 ${
                        calculationStep === 'hundreds' ? 'bg-purple-100 text-purple-700 animate-column-highlight' : 
                        calculationStep === 'setup' ? 'text-green-600 font-bold' : 'text-gray-700'
                      } ${num3Str[num3Str.length - 3] !== ' ' ? 'border-2 border-dashed border-purple-300' : ''}`}>
                        {num3Str[num3Str.length - 3] === ' ' ? '' : num3Str[num3Str.length - 3]}
                      </div>
                    )}
                    <div className={`text-center p-3 rounded-lg transition-all duration-500 relative ${
                      calculationStep === 'tens' ? 'bg-orange-100 text-orange-700 animate-column-highlight' : 
                      calculationStep === 'setup' ? 'text-green-600 font-bold' : 'text-gray-700'
                    } ${num3Str[num3Str.length - 2] !== ' ' ? 'border-2 border-dashed border-orange-300' : ''}`}>
                      {num3Str[num3Str.length - 2] === ' ' ? '' : num3Str[num3Str.length - 2]}
                    </div>
                    <div className={`text-center p-3 rounded-lg transition-all duration-500 ${
                      calculationStep === 'units' ? 'bg-blue-100 text-blue-700 animate-column-highlight' : 
                      calculationStep === 'setup' ? 'text-green-600 font-bold' : 'text-gray-700'
                    } border-2 border-dashed border-blue-300`}>
                      {num3Str[num3Str.length - 1]}
                    </div>
                  </div>
                  {/* Signe + positionné à gauche sans affecter l'alignement */}
                  <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-8 text-3xl font-mono text-green-600 font-bold">
                    +
                  </div>
                </div>
              </div>
            )}
            
            {/* Ligne de séparation animée */}
            <div className="flex justify-center">
              <div className={`border-t-4 my-3 transition-all duration-700 ${
                calculationStep === 'result' ? 'border-purple-500 shadow-lg animate-pulse' : 'border-purple-400'
              }`} style={{ width: maxDigits >= 3 ? '11rem' : '7.5rem' }}></div>
            </div>
            
            {/* Résultat avec animations progressives */}
            <div className="flex justify-center">
              <div className={`grid gap-4 sm:gap-8 font-mono text-lg sm:text-3xl font-bold ${maxDigits >= 3 ? 'grid-cols-3' : 'grid-cols-2'}`}>
                {maxDigits >= 3 && (
                  <div className={`text-center p-3 rounded-lg transition-all duration-1000 ${
                    partialResults.hundreds || calculationStep === 'result' ? 'bg-purple-100 text-purple-700 animate-result-reveal' : 'text-gray-400'
                  } ${resultHundreds ? 'border-2 border-dashed border-purple-300' : ''}`}>
                    {partialResults.hundreds || (calculationStep === 'result' ? resultHundreds : '?')}
                  </div>
                )}
                <div className={`text-center p-3 rounded-lg transition-all duration-1000 ${
                  partialResults.tens || calculationStep === 'result' ? 'bg-purple-100 text-purple-700 animate-result-reveal' : 'text-gray-400'
                } ${resultTens ? 'border-2 border-dashed border-purple-300' : ''}`}>
                  {partialResults.tens || (calculationStep === 'result' ? resultTens : '?')}
                </div>
                <div className={`text-center p-3 rounded-lg transition-all duration-1000 border-2 border-dashed border-purple-300 ${
                  partialResults.units || calculationStep === 'result' ? 'bg-purple-100 text-purple-700 animate-result-reveal' : 'text-gray-400'
                }`}>
                  {partialResults.units || (calculationStep === 'result' ? resultUnits : '?')}
                </div>
              </div>
            </div>

            {/* Explications textuelles animées */}
            {isAnimated && (
              <div className="mt-6 text-center">
                                    {calculationStep === 'units' && (
                      <div className="bg-blue-100 text-blue-800 p-3 rounded-lg animate-fade-in font-medium">
                        🔵 On commence par les <strong>unités</strong> : {num1Units} + {num2Units}{example.num3 ? ` + ${num3Units}` : ''} !
                      </div>
                    )}
                {calculationStep === 'tens' && (
                  <div className="bg-orange-100 text-orange-800 p-3 rounded-lg animate-fade-in font-medium">
                    🟠 Puis les <strong>dizaines</strong> : {num1Tens || '0'} + {num2Tens || '0'}{example.num3 ? ` + ${num3Tens || '0'}` : ''}{carry > 0 ? ` + ${carry} de retenue` : ''} !
                  </div>
                )}
                {calculationStep === 'hundreds' && (
                  <div className="bg-purple-100 text-purple-800 p-3 rounded-lg animate-fade-in font-medium">
                    🟣 Enfin les <strong>centaines</strong> : {num1Hundreds || '0'} + {num2Hundreds || '0'}{example.num3 ? ` + ${num3Hundreds || '0'}` : ''}{carry > 0 ? ` + ${carry} de retenue` : ''} !
                  </div>
                )}
                {calculationStep === 'result' && (
                  <div className="bg-purple-100 text-purple-800 p-3 rounded-lg animate-fade-in font-medium">
                    🟣 <strong>Résultat final</strong> : {example.result} ! Tu as réussi !
                  </div>
                )}
                {showingCarry && (
                  <div className="bg-red-100 text-red-800 p-3 rounded-lg animate-bounce font-medium mt-2">
                    ⚠️ <strong>Retenue</strong> : regarde le calcul à côté ! Attention !
                  </div>
                )}
              </div>
            )}
          </div>


        </div>
      </div>
    );
  };

  // Fonction pour expliquer une mauvaise réponse avec animation
  const explainWrongAnswer = async (exercise: any) => {
    if (!exercise.visual) return; // Seulement pour les exercices de calcul
    
    stopAllVocalsAndAnimations();
    await wait(500);
    stopSignalRef.current = false;
    setIsAnimationRunning(true);
    
    // Extraire les nombres de l'exercice
    const match = exercise.question.match(/Calcule : (\d+) \+ (\d+)/);
    if (!match) {
      setIsAnimationRunning(false);
      return;
    }
    
    const num1 = parseInt(String(match[1]));
    const num2 = parseInt(String(match[2]));
    const result = parseInt(String(exercise.correctAnswer));
    const example = { num1, num2, result, hasCarry: false };
    
    try {
      // Reset des états d'animation
      setCalculationStep('setup');
      setPartialResults({units: null, tens: null, hundreds: null});
      setShowingCarry(false);
      
      await playAudio(`${exercise.question}. Regardons ensemble comment faire.`, true);
      if (stopSignalRef.current) return;
      
      await wait(1000);
      const maxDigits = Math.max(num1.toString().length, num2.toString().length);
      if (maxDigits >= 3) {
        await playAudio("Tu vois les trois colonnes : C pour centaines, D pour dizaines, et U pour unités !", true);
      } else {
        await playAudio("Tu vois les deux colonnes : D pour dizaines et U pour unités !", true);
      }
      if (stopSignalRef.current) return;
      
      await wait(1000);
      await playAudio("On commence toujours par la colonne des unités, à droite !", true);
      if (stopSignalRef.current) return;
      
      // Animation des unités
      await wait(1500);
      setCalculationStep('units');
      const num1Units = num1 % 10;
      const num2Units = num2 % 10;
      const unitsSum = num1Units + num2Units;
      
      await playAudio(`Je calcule : ${num1Units} plus ${num2Units}${example.num3 ? ` plus ${num3Units}` : ''} égale ${unitsSum}${unitsSum >= 10 ? `. Je pose ${unitsSum % 10} et je retiens ${Math.floor(unitsSum / 10)}` : ''}`, true);
      if (stopSignalRef.current) return;
      
      await wait(500);
      const unitsResult = unitsSum >= 10 ? (unitsSum % 10).toString() : unitsSum.toString();
      setPartialResults(prev => ({ ...prev, units: unitsResult }));
      await wait(1000);
      
      // Animation des dizaines si nécessaire
      if (maxDigits >= 2) {
        await wait(1500);
        setCalculationStep('tens');
        // Extraire uniquement le chiffre des dizaines
        const num1Tens = Math.floor((num1 % 100) / 10);
        const num2Tens = Math.floor((num2 % 100) / 10);
        const tensSum = num1Tens + num2Tens;
        
        await playAudio(`Je calcule : ${num1Tens} plus ${num2Tens}${unitsSum >= 10 ? ` plus ${Math.floor(unitsSum / 10)} de retenue` : ''} égale ${tensSum}${tensSum >= 10 ? `. Je pose ${tensSum % 10} et je retiens ${Math.floor(tensSum / 10)}` : ''}`, true);
        if (stopSignalRef.current) return;
        
        await wait(500);
        setPartialResults(prev => ({ ...prev, tens: (tensSum % 10).toString() }));
        await wait(1000);
      }
      
      // Animation des centaines si nécessaire
      if (maxDigits >= 3) {
        await wait(1500);
        setCalculationStep('hundreds');
        // Extraire uniquement le chiffre des centaines
        const num1Hundreds = Math.floor(num1 / 100) % 10;
        const num2Hundreds = Math.floor(num2 / 100) % 10;
        const hundredsSum = num1Hundreds + num2Hundreds;
        
        await playAudio(`Je calcule : ${num1Hundreds} plus ${num2Hundreds}${tensSum >= 10 ? ` plus ${Math.floor(tensSum / 10)} de retenue` : ''} égale ${hundredsSum}`, true);
        if (stopSignalRef.current) return;
        
        await wait(500);
        setPartialResults(prev => ({ ...prev, hundreds: hundredsSum.toString() }));
        await wait(1000);
      }
      
      // Résultat final
      await wait(1500);
      setCalculationStep('result');
      await playAudio(`Le résultat est ${result}.`, true);
      if (stopSignalRef.current) return;
      
    } catch (error) {
      console.error('Erreur dans explainWrongAnswer:', error);
    } finally {
      setIsAnimationRunning(false);
      setCalculationStep(null);
      setPartialResults({units: null, tens: null, hundreds: null});
      setShowingCarry(false);
    }
  };

  // Gestion des exercices
  const handleAnswerClick = async (answer: string) => {
    stopAllVocalsAndAnimations();
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

    if (correct) {
      setTimeout(() => {
        if (currentExercise + 1 < exercises.length) {
          setCurrentExercise(currentExercise + 1);
          setUserAnswer('');
          setIsCorrect(null);
        } else {
          const finalScoreValue = score + (!answeredCorrectly.has(currentExercise) ? 1 : 0);
          setFinalScore(finalScoreValue);
          setShowCompletionModal(true);
        }
      }, 1500);
    } else {
      // Lancer l'animation d'explication pour les mauvaises réponses
      setTimeout(() => {
        if (exercises[currentExercise].visual) {
          explainWrongAnswer(exercises[currentExercise]);
        }
      }, 1000);
    }
  };

  const nextExercise = () => {
    stopAllVocalsAndAnimations();
    if (currentExercise < exercises.length - 1) {
      setCurrentExercise(currentExercise + 1);
      setUserAnswer('');
      setIsCorrect(null);
    } else {
      setFinalScore(score);
      setShowCompletionModal(true);
    }
  };

  const resetAll = () => {
    stopAllVocalsAndAnimations();
    setCurrentExercise(0);
    setUserAnswer('');
    setIsCorrect(null);
    setScore(0);
    setAnsweredCorrectly(new Set());
    setShowCompletionModal(false);
    setFinalScore(0);
  };

  // Fonction helper pour les messages de fin
  const getCompletionMessage = (score: number, total: number) => {
    const percentage = Math.round((score / total) * 100);
    if (percentage >= 90) return { title: "🎉 Maître des additions posées !", message: "Tu maîtrises parfaitement la technique !", emoji: "🎉" };
    if (percentage >= 70) return { title: "👏 Très bien !", message: "Tu progresses super bien !", emoji: "👏" };
    if (percentage >= 50) return { title: "👍 C'est bien !", message: "Continue, tu apprends bien !", emoji: "😊" };
    return { title: "💪 Continue !", message: "Recommence pour mieux maîtriser !", emoji: "📚" };
  };

  // Effet pour initialiser le client
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Effet pour gérer les changements de visibilité
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

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('popstate', handlePopState);

    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = function(...args) {
      stopAllVocalsAndAnimations();
      return originalPushState.apply(this, args);
    };

    history.replaceState = function(...args) {
      stopAllVocalsAndAnimations();
      return originalReplaceState.apply(this, args);
    };

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
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

  if (!isClient) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-50">
      {/* Bouton Stop flottant */}
      {(isPlayingVocal || isAnimationRunning || exercisesIsPlayingVocal) && (
        <div className="fixed top-4 right-4 z-[60]">
          <button
            onClick={stopAllVocalsAndAnimations}
            className="relative flex items-center gap-2 px-3 py-2 rounded-full shadow-2xl transition-all duration-300 bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 hover:scale-105 animate-pulse"
            title={(isPlayingVocal || exercisesIsPlayingVocal) ? "Arrêter le personnage" : "Arrêter l'animation"}
          >
            {/* Image du personnage */}
            <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-white/50">
              <img
                src="/image/Minecraftstyle.png"
                alt="Personnage Minecraft"
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Texte et icône */}
            <>
              <span className="text-sm font-bold hidden sm:block">
                {(isPlayingVocal || exercisesIsPlayingVocal) ? 'Stop' : 'Stop Animation'}
              </span>
              <div className="w-3 h-3 bg-white rounded-sm animate-pulse"></div>
            </>
          </button>
        </div>
      )}

      {/* Animation CSS personnalisée pour les icônes */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes subtle-glow {
            0%, 100% {
              opacity: 0.8;
              transform: scale(1);
              filter: brightness(1);
            }
            50% {
              opacity: 1;
              transform: scale(1.05);
              filter: brightness(1.1);
            }
          }
        `
      }} />
      

      
      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
      {/* Header */}
        <div className="mb-6 sm:mb-8">
          <Link href="/chapitre/ce2-operations-complexes/addition-ce2" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-3 sm:mb-4">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm sm:text-base">Retour à l'addition CE2</span>
            </Link>
          
          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg text-center">
            <h1 className="text-lg sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-3">
              📝 Addition avec retenue - CE2
            </h1>
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
                ? 'bg-green-600 text-white shadow-lg'
                : 'bg-white text-green-600 hover:bg-green-50'
            } ${highlightedElement === 'course_tab' ? 'ring-4 ring-green-400 animate-pulse' : ''}`}
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
                ? 'bg-green-600 text-white shadow-lg'
                : 'bg-white text-green-600 hover:bg-green-50'
            } ${highlightedElement === 'exercise_tab' ? 'ring-4 ring-green-400 animate-pulse' : ''}`}
          >
            🎯 Exercices ({score}/{exercises.length})
          </button>
        </div>

        {!showExercises ? (
          /* COURS */
          <div className="space-y-8">
            {/* Bouton DÉMARRER pour le cours avec personnage Minecraft */}
            <div className="flex items-center justify-center gap-2 sm:gap-4 p-2 sm:p-4 mb-3 sm:mb-6">
              {/* Image du personnage pour le cours */}
              <div className={`relative transition-all duration-500 border-2 border-green-300 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 ${
                isPlayingVocal
                    ? 'w-14 sm:w-24 h-14 sm:h-24' // When speaking - plus petit sur mobile
                    : 'w-12 sm:w-20 h-12 sm:h-20' // Normal size
              }`}>
                {!imageError ? (
                  <img 
                    src="/image/Minecraftstyle.png" 
                    alt="Personnage Minecraft" 
                    className="w-full h-full object-cover rounded-full"
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-green-600 text-lg font-bold rounded-full">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C13.1 2 14 2.9 14 4V12C14 13.1 13.1 14 12 14C10.9 14 10 13.1 10 12V4C10 2.9 10.9 2 12 2M19 11C19 15.4 15.4 19 11 19V21H13V23H11V21H9V23H7V21H9V19C4.6 19 1 15.4 1 11H3C3 14.3 5.7 17 9 17V15C7.3 15 6 13.7 6 12V11H4V9H6V8C6 6.3 7.3 5 9 5V7C8.4 7 8 7.4 8 8V12C8 12.6 8.4 13 9 13V11H11V13C11.6 13 12 12.6 12 12V8C12 7.4 11.6 7 11 7V5C12.7 5 14 6.3 14 8V9H16V11H14V12C14 13.7 12.7 15 11 15V17C14.3 17 17 14.3 17 11H19Z"/>
                    </svg>
                  </div>
                )}
              </div>

              {/* Bouton DÉMARRER pour le cours */}
              <button
                onClick={explainChapterWithSam}
                disabled={isPlayingVocal}
                className={`px-2 sm:px-4 py-1 sm:py-2 rounded-lg font-bold text-xs sm:text-base shadow-lg transition-all ${
                  isPlayingVocal
                    ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                    : 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:shadow-xl hover:scale-105'
                } ${!hasStarted && !isPlayingVocal ? 'animate-pulse' : ''}`}
              >
                <Play className="w-3 h-3 sm:w-5 sm:h-5 inline-block mr-1 sm:mr-2" />
                {isPlayingVocal ? 'Sam explique le cours...' : 'DÉMARRER LE COURS'}
              </button>
            </div>

            {/* Introduction */}
            <div 
              id="intro-section"
              className={`bg-white rounded-xl p-3 sm:p-8 shadow-lg transition-all duration-1000 ${
                highlightedElement === 'intro-section' ? 'ring-4 ring-green-400 bg-green-50 scale-105' : ''
              }`}
            >
              <div className="text-center mb-3 sm:mb-6">
                <div className="text-3xl sm:text-6xl mb-2 sm:mb-4">📝</div>
                <div className="flex items-center justify-center gap-1 sm:gap-3 mb-3 sm:mb-4">
                  <h2 className="text-sm sm:text-xl font-bold text-gray-900">
                    Qu'est-ce que poser une addition ?
                  </h2>
                </div>
                <p className="text-xs sm:text-base text-gray-600">
                  C'est aligner les nombres en colonnes pour calculer plus facilement !
                </p>
            </div>

              {/* Exemple principal animé */}
              <div 
                id="example-section"
                className={`bg-gradient-to-br from-blue-50 to-green-50 rounded-lg p-6 transition-all duration-1000 ${
                  highlightedElement === 'example-section' ? 'ring-4 ring-blue-400 scale-105' : ''
                }`}
              >
                <h3 className="text-xl font-bold text-center mb-4 text-gray-800">
                  🎯 Exemple principal
                </h3>
                <div className="text-center mb-6">
                  <div className="bg-green-100 text-green-800 px-2 sm:px-4 py-1 sm:py-2 rounded-lg inline-block font-bold text-sm sm:text-lg">
                    📝 Calculer : 23 + 14
                  </div>
                </div>

                {currentExample !== null ? (
                  <div className="text-center">
                    <div className="mb-6">
                      {renderPostedAddition(additionExamples[currentExample], true)}
                        </div>
                    
                    {calculationStep && (
                      <div className="bg-white rounded-lg p-4 shadow-inner">
                        <div className="text-lg font-semibold text-green-700">
                          {calculationStep === 'setup' && '1️⃣ J\'aligne les nombres en colonnes !'}
                          {calculationStep === 'units' && '2️⃣ Je calcule les unités en premier !'}
                          {calculationStep === 'carry' && '3️⃣ Je gère la retenue ! Attention !'}
                          {calculationStep === 'tens' && '4️⃣ Je calcule les dizaines !'}
                          {calculationStep === 'result' && '5️⃣ Voici le résultat final ! Tu as réussi !'}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                  <div className="text-center">
                    <div className="mb-6">
                      {renderPostedAddition(additionExamples[0])}
                  </div>
                    <button
                      onClick={() => explainExample(0)}
                      disabled={isAnimationRunning}
                      className={`px-6 py-3 rounded-lg font-bold text-lg transition-colors ${
                        isAnimationRunning 
                          ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
                          : 'bg-green-500 text-white hover:bg-green-600'
                      }`}
                    >
                      {isAnimationRunning ? '⏳ Animation en cours...' : '▶️ Voir l\'animation'}
                    </button>
                </div>
              )}
              </div>
            </div>

            {/* Autres exemples */}
            <div 
              id="examples-section"
              className={`bg-white rounded-xl p-3 sm:p-8 shadow-lg transition-all duration-1000 ${
                highlightedElement === 'examples-section' ? 'ring-4 ring-blue-400 bg-blue-50 scale-105' : ''
              }`}
            >
              <div className="flex items-center justify-center gap-1 sm:gap-3 mb-3 sm:mb-6">
                <h2 className="text-sm sm:text-xl font-bold text-gray-900">
                  🌟 Autres exemples d'additions posées
                </h2>
                {/* Icône d'animation pour les exemples */}
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full w-6 h-6 sm:w-12 sm:h-12 flex items-center justify-center text-xs sm:text-xl font-bold shadow-lg hover:scale-110 cursor-pointer transition-all duration-300 ring-2 ring-blue-300" 
                     style={{animation: 'subtle-glow 2s infinite'}}>
                  🌟
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {additionExamples.map((example, index) => (
                  <div 
                    key={index}
                    id={`example-${index}`}
                    className={`bg-gradient-to-br from-green-50 to-teal-50 rounded-lg p-6 transition-all duration-300 ${
                      isAnimationRunning 
                        ? 'opacity-50 cursor-not-allowed' 
                        : 'cursor-pointer hover:scale-105 hover:shadow-lg'
                    } ${currentExample === index ? 'ring-4 ring-yellow-400 bg-yellow-100' : ''} ${
                      highlightedElement === `example-${index}` ? 'ring-4 ring-blue-400 bg-blue-50 scale-105' : ''
                    }`}
                    onClick={isAnimationRunning ? undefined : () => explainExample(index)}
                  >
                    <div className="text-center">
                      <div className="mb-4">
                        {renderPostedAddition(example)}
                    </div>
                      <div className="text-xs sm:text-sm text-gray-600 mb-3">
                        Addition {example.description}
                    </div>
                      <button className={`px-2 sm:px-4 py-1 sm:py-2 rounded-lg text-xs sm:text-sm transition-colors ${
                        isAnimationRunning 
                          ? 'bg-gray-400 text-gray-200' 
                          : 'bg-green-500 text-white hover:bg-green-600'
                      }`}>
                        {isAnimationRunning ? '⏳ Attendez...' : '▶️ Voir l\'animation'}
                      </button>
                  </div>
                </div>
              ))}
                    </div>
            </div>

            {/* Guide pratique */}
            <div className="bg-gradient-to-r from-green-400 to-teal-500 rounded-xl p-3 sm:p-6 text-white">
              <h3 className="text-base sm:text-xl font-bold mb-3 sm:mb-4 text-center">
                💡 Guide pour poser une addition
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 sm:gap-4 text-center">
                <div>
                  <div className="text-2xl sm:text-3xl mb-1 sm:mb-2">1️⃣</div>
                  <div className="font-bold text-xs sm:text-sm">Aligner</div>
                  <div className="text-xs">Unités sous unités, dizaines sous dizaines</div>
              </div>
                <div>
                  <div className="text-xl sm:text-2xl mb-1">2️⃣</div>
                  <div className="font-bold text-xs sm:text-sm">Calculer</div>
                  <div className="text-xs">Commence par la droite (unités)</div>
            </div>
                <div>
                  <div className="text-xl sm:text-2xl mb-1">3️⃣</div>
                  <div className="font-bold text-xs sm:text-sm">Retenue</div>
                  <div className="text-xs">Si ≥ 10, écris l'unité et retiens</div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* EXERCICES */
          <div 
            id="exercises-section"
            className={`space-y-8 transition-all duration-1000 ${
              highlightedElement === 'exercises-section' ? 'scale-105' : ''
            }`}
          >

            {/* Bouton DÉMARRER pour les exercices avec personnage Minecraft */}
            <div className="flex items-center justify-center gap-2 sm:gap-4 p-2 sm:p-4 mb-3 sm:mb-6">
              {/* Image du personnage pour les exercices */}
              <div className={`relative transition-all duration-500 border-2 border-green-300 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 ${
                exercisesIsPlayingVocal
                    ? 'w-14 sm:w-24 h-14 sm:h-24' // When speaking - plus petit sur mobile
                    : 'w-12 sm:w-20 h-12 sm:h-20' // Normal size
              }`}>
                {!exercisesImageError ? (
                  <img 
                    src="/image/Minecraftstyle.png" 
                    alt="Personnage Minecraft" 
                    className="w-full h-full object-cover rounded-full"
                    onError={() => setExercisesImageError(true)}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-lg sm:text-2xl rounded-full bg-gradient-to-br from-green-200 to-emerald-200">
                    🧱
                  </div>
                )}
                
                {exercisesIsPlayingVocal && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-red-500 rounded-full animate-pulse">
                    <svg className="w-full h-full text-white" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C13.1 2 14 2.9 14 4V12C14 13.1 13.1 14 12 14C10.9 14 10 13.1 10 12V4C10 2.9 10.9 2 12 2M19 11C19 15.4 15.4 19 11 19V21H13V23H11V21H9V23H7V21H9V19C4.6 19 1 15.4 1 11H3C3 14.3 5.7 17 9 17V15C7.3 15 6 13.7 6 12V11H4V9H6V8C6 6.3 7.3 5 9 5V7C8.4 7 8 7.4 8 8V12C8 12.6 8.4 13 9 13V11H11V13C11.6 13 12 12.6 12 12V8C12 7.4 11.6 7 11 7V5C12.7 5 14 6.3 14 8V9H16V11H14V12C14 13.7 12.7 15 11 15V17C14.3 17 17 14.3 17 11H19Z"/>
                    </svg>
                  </div>
                )}
              </div>

              {/* Bouton DÉMARRER pour les exercices */}
              <button
                onClick={explainExercisesWithSam}
                disabled={exercisesIsPlayingVocal}
                className={`px-2 sm:px-4 py-1 sm:py-2 rounded-lg font-bold text-xs sm:text-base shadow-lg transition-all ${
                  exercisesIsPlayingVocal
                    ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                    : 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:shadow-xl hover:scale-105'
                } ${!exercisesHasStarted && !exercisesIsPlayingVocal ? 'animate-pulse' : ''}`}
              >
                <Play className="w-3 h-3 sm:w-5 sm:h-5 inline-block mr-1 sm:mr-2" />
                {exercisesIsPlayingVocal ? 'Le personnage explique...' : 'DÉMARRER LES EXERCICES'}
              </button>
            </div>

            {/* Header exercices */}
            <div 
              id="exercises-header"
              className={`bg-white rounded-xl p-6 shadow-lg ${
                highlightedElement === 'exercises-header' ? 'ring-4 ring-blue-400 bg-blue-50' : ''
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                  ✏️ Exercice {currentExercise + 1} sur {exercises.length}
                </h2>
                <div 
                  id="score-display"
                  className={`text-sm sm:text-xl font-bold text-green-600 ${
                    highlightedElement === 'score-display' ? 'ring-2 ring-green-400 bg-green-50 rounded px-2 py-1' : ''
                  }`}
                >
                    Score : {score}/{exercises.length}
                </div>
              </div>
              
              {/* Barre de progression */}
              <div className="w-full bg-gray-200 rounded-full h-4 mb-3">
                <div 
                  className="bg-green-500 h-4 rounded-full transition-all duration-500"
                  style={{ width: `${((currentExercise + 1) / exercises.length) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Question */}
            <div className="bg-white rounded-xl p-8 shadow-lg text-center">
              <div className="flex justify-between items-start mb-4 sm:mb-6">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 flex-1">
                  {exercises[currentExercise].question}
                </h3>
                <button
                  id="listen-button"
                  onClick={() => {
                    const utterance = new SpeechSynthesisUtterance(exercises[currentExercise].question);
                    utterance.rate = 0.9;
                    utterance.pitch = 1.1;
                    speechSynthesis.speak(utterance);
                  }}
                  className={`ml-4 px-3 py-2 bg-blue-500 text-white rounded-lg text-sm font-bold hover:bg-blue-600 transition-all ${
                    highlightedElement === 'listen-button' ? 'ring-4 ring-blue-400 animate-pulse' : ''
                  }`}
                >
                  🔊 Écouter
                </button>
              </div>
              
              {/* Visuel si disponible */}
              {exercises[currentExercise].visual && (
                <div className="bg-gray-50 rounded-lg p-6 mb-8 flex justify-center">
                  {isAnimationRunning && isCorrect === false ? (
                    // Animation interactive pendant les corrections
                    (() => {
                      const match = exercises[currentExercise].question.match(/Calcule : (\d+) \+ (\d+)/);
                      if (match) {
                        const num1 = parseInt(String(match[1]));
                        const num2 = parseInt(String(match[2]));
                        const result = parseInt(String(exercises[currentExercise].correctAnswer));
                        const example = { num1, num2, result, hasCarry: false };
                        return renderPostedAddition(example, true);
                      }
                      return null;
                    })()
                  ) : (
                    // Visuel statique normal
                    <div className="font-mono text-lg sm:text-xl text-gray-800 leading-tight" style={{ width: '10rem' }}>
                      {exercises[currentExercise].visual.split('\n').map((line, index) => {
                        // Espacer les chiffres mais pas les autres caractères
                        let formattedLine = line;
                        if (line.includes('─') || line === '  ?' || line === ' ?') {
                          formattedLine = line; // Garder tel quel pour les lignes et les ?
                        } else {
                          // Pour les nombres, espacer les chiffres
                          formattedLine = line.replace(/(\d)/g, '$1 ').replace(/\s+$/, '');
                        }
                        
                        return (
                          <div key={index} style={{ textAlign: 'right', minHeight: '1.2em' }}>
                            {formattedLine}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

            {/* Saisie ou choix multiples selon le type d'exercice */}
            {exercises[currentExercise].visual ? (
              // Case de saisie pour les calculs d'additions posées
              <div className="max-w-sm mx-auto mb-6">
                <div className="flex items-center justify-center gap-4">
                  <input
                    id="answer-input"
                    type="number"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && userAnswer && handleAnswerClick(userAnswer)}
                    disabled={isCorrect !== null}
                    placeholder="?"
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                    className={`w-32 p-3 sm:p-4 text-center rounded-lg font-bold text-lg sm:text-xl border-2 transition-all ${
                      isCorrect === null
                        ? 'border-gray-300 focus:border-green-500 focus:outline-none'
                        : isCorrect
                        ? 'border-green-500 bg-green-50'
                        : 'border-red-500 bg-red-50'
                    } disabled:opacity-50 disabled:cursor-not-allowed ${
                      highlightedElement === 'answer-input' ? 'ring-4 ring-green-400 animate-pulse' : ''
                    }`}
                  />
                  <button
                    id="validate-button"
                    onClick={() => handleAnswerClick(userAnswer)}
                    disabled={!userAnswer || isCorrect !== null}
                    className={`px-4 py-3 sm:px-6 sm:py-4 bg-green-500 text-white rounded-lg font-bold text-sm sm:text-lg hover:bg-green-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                      highlightedElement === 'validate-button' ? 'ring-4 ring-green-400 animate-pulse' : ''
                    }`}
                  >
                    Valider
                  </button>
                </div>
              </div>
            ) : (
              // Choix multiples pour les questions théoriques
              <div className="grid grid-cols-1 gap-3 max-w-sm mx-auto mb-6">
                {exercises[currentExercise].choices.map((choice) => (
                  <button
                    key={choice}
                    onClick={() => handleAnswerClick(choice)}
                    disabled={isCorrect !== null}
                    className={`p-2 sm:p-4 rounded-lg font-bold text-sm sm:text-xl transition-all ${
                      userAnswer === choice
                        ? isCorrect === true
                          ? 'bg-green-500 text-white'
                          : isCorrect === false
                          ? 'bg-red-500 text-white'
                          : 'bg-green-500 text-white'
                        : exercises[currentExercise].correctAnswer === choice && isCorrect === false
                          ? 'bg-green-200 text-green-800 border-2 border-green-500'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50'
                    } disabled:cursor-not-allowed`}
                  >
                    {choice}
                  </button>
                ))}
              </div>
            )}

              {/* Résultat */}
            {isCorrect !== null && (
              <div className={`p-3 sm:p-4 rounded-lg mb-4 ${
                isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                  <div className="flex items-center justify-center space-x-2">
                  {isCorrect ? (
                    <>
                      <span className="text-xl sm:text-2xl">✅</span>
                      <span className="font-bold text-sm sm:text-lg">
                        Excellent ! C'est la bonne réponse !
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="text-xl sm:text-2xl">❌</span>
                      <span className="font-bold text-sm sm:text-lg">
                        Pas tout à fait... La bonne réponse est : {exercises[currentExercise].correctAnswer}
                      </span>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Navigation */}
            {isCorrect === false && (
              <div className="flex justify-center">
                <button
                  id="next-button"
                  onClick={nextExercise}
                  className={`bg-green-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-bold text-sm sm:text-base hover:bg-green-600 transition-colors ${
                    highlightedElement === 'next-button' ? 'ring-4 ring-green-400 animate-pulse' : ''
                  }`}
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
                const result = getCompletionMessage(finalScore, exercises.length);
                return (
                  <>
                    <div className="text-6xl mb-4">{result.emoji}</div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">{result.title}</h3>
                    <p className="text-lg text-gray-700 mb-6">{result.message}</p>
                    <div className="bg-green-100 rounded-lg p-4 mb-6">
                      <p className="text-xl font-bold text-gray-900">
                        Score : {finalScore}/{exercises.length}
                      </p>
                      <div className="text-4xl mt-2">
                        {finalScore >= 9 ? '⭐⭐⭐' : finalScore >= 7 ? '⭐⭐' : '⭐'}
                      </div>
                      <p className="text-sm text-gray-600 mt-2">
                        Poser une addition est une technique essentielle !
                      </p>
                    </div>
                    <div className="flex space-x-3">
                      <button
                        onClick={resetAll}
                        className="flex-1 bg-green-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-green-600 transition-colors"
                      >
                        Recommencer
                      </button>
                      <button
                        onClick={() => {
                          stopAllVocalsAndAnimations();
                          setShowCompletionModal(false);
                        }}
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