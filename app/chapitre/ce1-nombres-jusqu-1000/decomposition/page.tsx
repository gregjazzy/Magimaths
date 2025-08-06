'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, XCircle, RotateCcw, Shuffle, Play } from 'lucide-react';
import { VoiceInput } from '@/components/VoiceInput';

export default function DecompositionNombresCE1Page() {
  const [selectedNumber, setSelectedNumber] = useState('234');
  const [currentExercise, setCurrentExercise] = useState(0);
  const [userAnswers, setUserAnswers] = useState({ centaines: '', dizaines: '', unites: '' });
  const [userNumber, setUserNumber] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showExercises, setShowExercises] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredCorrectly, setAnsweredCorrectly] = useState<Set<string>>(new Set());
  const [isAnimating, setIsAnimating] = useState(false);
  const [exerciseType, setExerciseType] = useState<'decompose' | 'compose'>('decompose');
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [finalScore, setFinalScore] = useState(0);

  // États pour le système readmeanim
  const [isPlayingVocal, setIsPlayingVocal] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [characterSizeExpanded, setCharacterSizeExpanded] = useState(false);
  const [highlightedElement, setHighlightedElement] = useState<string | null>(null);

  // Refs pour contrôler les vocaux
  const stopSignalRef = useRef(false);
  const currentAudioRef = useRef<SpeechSynthesisUtterance | null>(null);



  // Effet pour arrêter les vocaux lors du changement cours ↔ exercices
  useEffect(() => {
    stopAllVocalsAndAnimations();
  }, [showExercises]);

  // Fonction pour arrêter tous les vocaux et animations
  const stopAllVocalsAndAnimations = () => {
    stopSignalRef.current = true;
    if (currentAudioRef.current) {
      speechSynthesis.cancel();
      currentAudioRef.current = null;
    }
    setIsPlayingVocal(false);
    setIsAnimating(false);
    setHighlightedElement(null);
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

  // Fonction pour jouer un audio avec voix Minecraft
  const playAudio = (text: string): Promise<void> => {
    return new Promise((resolve) => {
      if (stopSignalRef.current) {
        resolve();
        return;
      }
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;    // Légèrement plus lent
      utterance.pitch = 1.1;   // Légèrement plus aigu
      utterance.lang = 'fr-FR';
      
      currentAudioRef.current = utterance;
      
      utterance.onend = () => {
        if (!stopSignalRef.current) {
          setIsPlayingVocal(false);
        }
        resolve();
      };
      
      utterance.onerror = () => {
        if (!stopSignalRef.current) {
          setIsPlayingVocal(false);
        }
        resolve();
      };
      
      setIsPlayingVocal(true);
      speechSynthesis.speak(utterance);
    });
  };

  // Sauvegarder les progrès dans localStorage
  const saveProgress = (score: number, maxScore: number) => {
    const progress = {
      sectionId: 'decomposition',
      completed: true,
      score: score,
      maxScore: maxScore,
      completedAt: new Date().toISOString(),
      attempts: 1
    };

    const existingProgress = localStorage.getItem('ce1-nombres-progress');
    let allProgress = [];
    
    if (existingProgress) {
      allProgress = JSON.parse(existingProgress);
      const existingIndex = allProgress.findIndex((p: any) => p.sectionId === 'decomposition');
      
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

    localStorage.setItem('ce1-nombres-progress', JSON.stringify(allProgress));
  };

  // Fonction pour expliquer le chapitre (tutoriel vocal)
  const explainChapter = async () => {
    stopSignalRef.current = false;
    setHasStarted(true);
    setCharacterSizeExpanded(true);

    if (showExercises) {
      // Mode d'emploi pour les exercices
      if (stopSignalRef.current) return;
      await playAudio("Salut petit architecte ! Bienvenue dans l'atelier de décomposition des nombres !");
      if (stopSignalRef.current) return;
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (stopSignalRef.current) return;
      await playAudio("Objectif de ta mission : séparer les nombres comme un vrai ingénieur !");
      if (stopSignalRef.current) return;
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (stopSignalRef.current) return;
      await playAudio("Voici tes outils de construction :");
      if (stopSignalRef.current) return;
      await new Promise(resolve => setTimeout(resolve, 300));
      
      if (stopSignalRef.current) return;
      scrollToElement('exercise-header');
      await playAudio("D'abord, ton tableau de bord avec le score et les exercices !");
      if (stopSignalRef.current) return;
      highlightElement('exercise-header', 3000);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (stopSignalRef.current) return;
      scrollToElement('exercise-type-selector');
      await playAudio("Tu peux choisir entre décomposer un nombre ou le composer à partir de ses parties !");
      if (stopSignalRef.current) return;
      highlightElement('exercise-type-selector', 2500);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (stopSignalRef.current) return;
      scrollToElement('exercise-question');
      await playAudio("Ici tu verras le nombre à décomposer ou les parties à assembler !");
      if (stopSignalRef.current) return;
      highlightElement('exercise-question', 2500);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (stopSignalRef.current) return;
      await playAudio("Écris tes réponses dans les cases et utilise le bouton Vérifier !");
      if (stopSignalRef.current) return;
      // Scroller vers le bouton Vérifier et le mettre en surbrillance
      scrollToElement('verify-button');
      highlightElement('verify-button', 3000);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (stopSignalRef.current) return;
      await playAudio("Allez petit ingénieur, montre-moi tes talents de décomposition ! C'est parti !");
      
    } else {
      // Mode d'emploi pour le cours
      if (stopSignalRef.current) return;
      await playAudio("Salut petit crafteur ! Bienvenue dans l'école de décomposition des nombres !");
      if (stopSignalRef.current) return;
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (stopSignalRef.current) return;
      await playAudio("Objectif : apprendre à séparer un nombre en centaines, dizaines et unités !");
      if (stopSignalRef.current) return;
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (stopSignalRef.current) return;
      await playAudio("Voici ta boîte à outils :");
      if (stopSignalRef.current) return;
      await new Promise(resolve => setTimeout(resolve, 300));
      
      if (stopSignalRef.current) return;
      scrollToElement('positions-explanation');
      await playAudio("D'abord, les positions des chiffres ! Chaque position a sa valeur spéciale !");
      if (stopSignalRef.current) return;
      highlightElement('positions-explanation', 3000);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (stopSignalRef.current) return;
      scrollToElement('number-selector');
      await playAudio("Ensuite, tu peux choisir un nombre pour voir sa décomposition en direct !");
      if (stopSignalRef.current) return;
      highlightElement('number-selector', 3000);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (stopSignalRef.current) return;
      scrollToElement('decomposition-demo');
      await playAudio("Et voici la magie ! Regarde comment le nombre se décompose avec l'animation !");
      if (stopSignalRef.current) return;
      highlightElement('decomposition-demo', 3000);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (stopSignalRef.current) return;
      await playAudio("N'oublie pas de passer aux Exercices pour t'entraîner !");
      if (stopSignalRef.current) return;
      // Scroller vers l'onglet Exercices et le mettre en surbrillance
      scrollToElement('exercises-tab');
      highlightElement('exercises-tab', 3000);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (stopSignalRef.current) return;
      await playAudio("Alors petit architecte, prêt à décomposer des nombres ? C'est parti pour l'aventure !");
    }
  };

  const examples = [
    { number: '234', centaines: '2', dizaines: '3', unites: '4' },
    { number: '49', centaines: '0', dizaines: '4', unites: '9' },
    { number: '748', centaines: '7', dizaines: '4', unites: '8' },
    { number: '156', centaines: '1', dizaines: '5', unites: '6' },
    { number: '307', centaines: '3', dizaines: '0', unites: '7' },
    { number: '900', centaines: '9', dizaines: '0', unites: '0' }
  ];

  const exercises = [
    { number: '145', centaines: '1', dizaines: '4', unites: '5' },
    { number: '267', centaines: '2', dizaines: '6', unites: '7' },
    { number: '389', centaines: '3', dizaines: '8', unites: '9' },
    { number: '512', centaines: '5', dizaines: '1', unites: '2' },
    { number: '634', centaines: '6', dizaines: '3', unites: '4' },
    { number: '758', centaines: '7', dizaines: '5', unites: '8' },
    { number: '823', centaines: '8', dizaines: '2', unites: '3' },
    { number: '946', centaines: '9', dizaines: '4', unites: '6' },
    { number: '207', centaines: '2', dizaines: '0', unites: '7' },
    { number: '350', centaines: '3', dizaines: '5', unites: '0' },
    { number: '400', centaines: '4', dizaines: '0', unites: '0' },
    { number: '501', centaines: '5', dizaines: '0', unites: '1' },
    { number: '610', centaines: '6', dizaines: '1', unites: '0' },
    { number: '720', centaines: '7', dizaines: '2', unites: '0' },
    { number: '880', centaines: '8', dizaines: '8', unites: '0' }
  ];

  const composeExercises = [
    { centaines: '1', dizaines: '3', unites: '2', number: '132' },
    { centaines: '2', dizaines: '4', unites: '5', number: '245' },
    { centaines: '3', dizaines: '6', unites: '7', number: '367' },
    { centaines: '4', dizaines: '1', unites: '9', number: '419' },
    { centaines: '5', dizaines: '8', unites: '3', number: '583' },
    { centaines: '6', dizaines: '2', unites: '6', number: '626' },
    { centaines: '7', dizaines: '4', unites: '1', number: '741' },
    { centaines: '8', dizaines: '5', unites: '7', number: '857' },
    { centaines: '9', dizaines: '0', unites: '4', number: '904' },
    { centaines: '1', dizaines: '7', unites: '0', number: '170' },
    { centaines: '2', dizaines: '0', unites: '8', number: '208' },
    { centaines: '3', dizaines: '9', unites: '0', number: '390' },
    { centaines: '4', dizaines: '0', unites: '5', number: '405' },
    { centaines: '5', dizaines: '0', unites: '0', number: '500' },
    { centaines: '6', dizaines: '7', unites: '0', number: '670' }
  ];

  const decomposeNumber = (num: string) => {
    if (num === '1000') return { centaines: '10', dizaines: '0', unites: '0' };
    const padded = num.padStart(3, '0');
    return {
      centaines: padded[0],
      dizaines: padded[1],
      unites: padded[2]
    };
  };

  const animateDecomposition = async () => {
    setIsAnimating(true);
    
    // Décomposer le nombre
    const decomposed = decomposeNumber(selectedNumber);
    
    console.log('=== ENQUÊTE DÉCOMPOSITION ===');
    console.log('Nombre sélectionné:', selectedNumber);
    console.log('Type:', typeof selectedNumber);
    console.log('Décomposition:', decomposed);
    console.log('Chiffres du nombre:', selectedNumber.split(''));
    
    // Vérifier quels éléments existent vraiment
    const allDigitElements = [];
    for (let i = 0; i < 5; i++) {
      const element = document.getElementById(`demo-digit-${i}`);
      if (element) {
        allDigitElements.push({
          id: `demo-digit-${i}`,
          text: element.textContent,
          exists: true
        });
      } else {
        allDigitElements.push({
          id: `demo-digit-${i}`,
          text: null,
          exists: false
        });
      }
    }
    console.log('Éléments demo-digit trouvés:', allDigitElements);
    
    // ÉTAPE 1: Animer les CENTAINES
    // Si le nombre a des centaines (>=100), illuminer le premier chiffre
    if (parseInt(selectedNumber) >= 100) {
      const firstDigit = document.getElementById('demo-digit-0');
      if (firstDigit) {
        firstDigit.classList.add('animate-pulse', 'bg-yellow-400', 'text-black', 'rounded-lg', 'border-4', 'border-orange-500', 'shadow-2xl', 'scale-125');
        await new Promise(resolve => setTimeout(resolve, 1200));
        firstDigit.classList.remove('animate-pulse', 'bg-yellow-400', 'text-black', 'rounded-lg', 'border-4', 'border-orange-500', 'shadow-2xl', 'scale-125');
      }
    }
    
    // Illuminer la case centaines SEULEMENT si ce n'est pas 0
    const centainesBox = document.getElementById('centaines-box');
    if (centainesBox && decomposed.centaines !== '0') {
      centainesBox.classList.add('animate-pulse', 'bg-red-400', 'border-4', 'border-red-600', 'shadow-2xl', 'scale-110', 'text-white');
      await new Promise(resolve => setTimeout(resolve, 1200));
      centainesBox.classList.remove('animate-pulse', 'bg-red-400', 'border-4', 'border-red-600', 'shadow-2xl', 'scale-110', 'text-white');
    }
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // ÉTAPE 2: Animer les DIZAINES
    // Trouver quel chiffre correspond aux dizaines
    let dizainesDigitId = null;
    if (parseInt(selectedNumber) >= 100) {
      dizainesDigitId = 'demo-digit-1'; // 2ème chiffre pour nombres à 3 chiffres
    } else if (parseInt(selectedNumber) >= 10) {
      dizainesDigitId = 'demo-digit-0'; // 1er chiffre pour nombres à 2 chiffres
    }
    
    if (dizainesDigitId && decomposed.dizaines !== '0') {
      const dizainesDigit = document.getElementById(dizainesDigitId);
      if (dizainesDigit) {
        dizainesDigit.classList.add('animate-pulse', 'bg-yellow-400', 'text-black', 'rounded-lg', 'border-4', 'border-orange-500', 'shadow-2xl', 'scale-125');
        await new Promise(resolve => setTimeout(resolve, 1200));
        dizainesDigit.classList.remove('animate-pulse', 'bg-yellow-400', 'text-black', 'rounded-lg', 'border-4', 'border-orange-500', 'shadow-2xl', 'scale-125');
      }
    }
    
    // Illuminer la case dizaines SEULEMENT si ce n'est pas 0
    const dizainesBox = document.getElementById('dizaines-box');
    if (dizainesBox && decomposed.dizaines !== '0') {
      dizainesBox.classList.add('animate-pulse', 'bg-blue-500', 'border-4', 'border-blue-700', 'shadow-2xl', 'scale-110', 'text-white');
      await new Promise(resolve => setTimeout(resolve, 1200));
      dizainesBox.classList.remove('animate-pulse', 'bg-blue-500', 'border-4', 'border-blue-700', 'shadow-2xl', 'scale-110', 'text-white');
    }
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // ÉTAPE 3: Animer les UNITÉS
    // Trouver quel chiffre correspond aux unités (toujours le dernier)
    let unitesDigitId = null;
    if (parseInt(selectedNumber) >= 100) {
      unitesDigitId = 'demo-digit-2'; // 3ème chiffre pour nombres à 3 chiffres
    } else if (parseInt(selectedNumber) >= 10) {
      unitesDigitId = 'demo-digit-1'; // 2ème chiffre pour nombres à 2 chiffres
    } else {
      unitesDigitId = 'demo-digit-0'; // 1er chiffre pour nombres à 1 chiffre
    }
    
    if (unitesDigitId) {
      const unitesDigit = document.getElementById(unitesDigitId);
      if (unitesDigit) {
        unitesDigit.classList.add('animate-pulse', 'bg-yellow-400', 'text-black', 'rounded-lg', 'border-4', 'border-orange-500', 'shadow-2xl', 'scale-125');
        await new Promise(resolve => setTimeout(resolve, 1200));
        unitesDigit.classList.remove('animate-pulse', 'bg-yellow-400', 'text-black', 'rounded-lg', 'border-4', 'border-orange-500', 'shadow-2xl', 'scale-125');
      }
    }
    
    // Illuminer la case unités (toujours présente)
    const unitesBox = document.getElementById('unites-box');
    if (unitesBox) {
      unitesBox.classList.add('animate-pulse', 'bg-green-500', 'border-4', 'border-green-700', 'shadow-2xl', 'scale-110', 'text-white');
      await new Promise(resolve => setTimeout(resolve, 1200));
      unitesBox.classList.remove('animate-pulse', 'bg-green-500', 'border-4', 'border-green-700', 'shadow-2xl', 'scale-110', 'text-white');
    }
    
    // ÉTAPE FINALE: Mettre en surbrillance la vérification
    await new Promise(resolve => setTimeout(resolve, 500));
    const verificationBox = document.getElementById('verification-box');
    if (verificationBox) {
      verificationBox.classList.add('animate-pulse', 'bg-yellow-200', 'border-4', 'border-yellow-500', 'shadow-2xl', 'scale-105');
      await new Promise(resolve => setTimeout(resolve, 2000));
      verificationBox.classList.remove('animate-pulse', 'bg-yellow-200', 'border-4', 'border-yellow-500', 'shadow-2xl', 'scale-105');
    }
    
    setIsAnimating(false);
  };

  const handleNext = () => {
    // Si aucune réponse vérifiée encore, on vérifie
    if (isCorrect === null) {
      let correct = false;
      
      if (exerciseType === 'decompose') {
        const correctResult = decomposeNumber(exercises[currentExercise].number);
        correct = 
          userAnswers.centaines === correctResult.centaines &&
          userAnswers.dizaines === correctResult.dizaines &&
          userAnswers.unites === correctResult.unites;
      } else {
        // compose exercise
        const correctNumber = composeExercises[currentExercise].number;
        correct = userNumber.trim() === correctNumber;
      }
      
      setIsCorrect(correct);
      
      const exerciseKey = `${exerciseType}-${currentExercise}`;
      
      if (correct && !answeredCorrectly.has(exerciseKey)) {
        setScore(prevScore => prevScore + 1);
        setAnsweredCorrectly(prev => {
          const newSet = new Set(prev);
          newSet.add(exerciseKey);
          return newSet;
        });
      }

      // Si bonne réponse → passage automatique après 1.5s
      if (correct) {
        setTimeout(() => {
          const maxExercises = exerciseType === 'decompose' ? exercises.length : composeExercises.length;
          if (currentExercise + 1 < maxExercises) {
            setCurrentExercise(Math.min(currentExercise + 1, maxExercises - 1));
            setUserAnswers({ centaines: '', dizaines: '', unites: '' });
            setUserNumber('');
            setIsCorrect(null);
          } else {
            // Dernier exercice terminé, afficher la modale
            const finalScoreValue = score + (!answeredCorrectly.has(exerciseKey) ? 1 : 0);
            setFinalScore(finalScoreValue);
            setShowCompletionModal(true);
            
            // Sauvegarder les progrès
            const maxExercises = exerciseType === 'decompose' ? exercises.length : composeExercises.length;
            saveProgress(finalScoreValue, maxExercises);
          }
        }, 1500);
      }
      // Si mauvaise réponse, on affiche la correction et on attend le clic suivant
    } else {
      // Réponse déjà vérifiée, on passe au suivant
      const maxExercises = exerciseType === 'decompose' ? exercises.length : composeExercises.length;
      if (currentExercise + 1 < maxExercises) {
        setCurrentExercise(Math.min(currentExercise + 1, maxExercises - 1));
        setUserAnswers({ centaines: '', dizaines: '', unites: '' });
        setUserNumber('');
        setIsCorrect(null);
      } else {
        // Dernier exercice, afficher la modale
        setFinalScore(score);
        setShowCompletionModal(true);
        
        // Sauvegarder les progrès
        const maxExercises = exerciseType === 'decompose' ? exercises.length : composeExercises.length;
        saveProgress(score, maxExercises);
      }
    }
  };

  const nextExercise = () => {
    const maxExercises = exerciseType === 'decompose' ? exercises.length : composeExercises.length;
    if (currentExercise < maxExercises - 1) {
      setCurrentExercise(currentExercise + 1);
      setUserAnswers({ centaines: '', dizaines: '', unites: '' });
      setUserNumber('');
      setIsCorrect(null);
    }
  };

  const resetExercise = () => {
    setUserAnswers({ centaines: '', dizaines: '', unites: '' });
    setUserNumber('');
    setIsCorrect(null);
  };

  const resetAll = () => {
    setCurrentExercise(0);
    setUserAnswers({ centaines: '', dizaines: '', unites: '' });
    setUserNumber('');
    setIsCorrect(null);
    setScore(0);
    setAnsweredCorrectly(new Set());
    setShowCompletionModal(false);
    setFinalScore(0);
  };

  const switchExerciseType = (type: 'decompose' | 'compose') => {
    setExerciseType(type);
    setCurrentExercise(0);
    setUserAnswers({ centaines: '', dizaines: '', unites: '' });
    setUserNumber('');
    setIsCorrect(null);
    setAnsweredCorrectly(new Set());
  };

  const updateAnswer = (type: 'centaines' | 'dizaines' | 'unites', value: string) => {
    setUserAnswers(prev => ({ ...prev, [type]: value }));
  };

  return (
    <>
      <style jsx global>{`
        .pulse-interactive {
          animation: pulseGlow 2s ease-in-out infinite;
        }
        .pulse-interactive-green {
          animation: pulseGlowGreen 2s ease-in-out infinite;
        }
        .pulse-interactive-yellow {
          animation: pulseGlowYellow 2s ease-in-out infinite;
        }
        .pulse-interactive-gray {
          animation: pulseGlowGray 2s ease-in-out infinite;
        }
      `}</style>
      
      {/* Bouton STOP flottant global */}
      {(isPlayingVocal || isAnimating) && (
        <button
          onClick={stopAllVocalsAndAnimations}
          className="fixed top-4 right-4 z-[60] bg-red-500 hover:bg-red-600 text-white p-3 rounded-full shadow-lg transition-all flex items-center gap-2"
        >
          <div className="w-8 h-8 relative">
            <img
              src="/image/Minecraftstyle.png"
              alt="Stop"
              className="w-full h-full rounded-full object-cover"
            />
          </div>
          <span className="font-bold text-sm">Stop</span>
          <div className="w-3 h-3 bg-white rounded animate-pulse"></div>
        </button>
      )}

    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/chapitre/ce1-nombres-jusqu-1000" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-4">
            <ArrowLeft className="w-4 h-4" />
            <span>Retour au chapitre</span>
          </Link>
          
          <div className="bg-white rounded-xl p-3 sm:p-6 shadow-lg text-center">
            <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-2 sm:mb-4">
              🧩 Décomposer les nombres
            </h1>
            <p className="text-sm sm:text-lg text-gray-600 hidden sm:block">
              Apprends à séparer un nombre en centaines, dizaines et unités !
            </p>
          </div>
        </div>

        {/* Navigation entre cours et exercices */}
        <div className="flex justify-center mb-4 sm:mb-8">
          <div className="bg-white rounded-lg p-1 shadow-md">
            <button
              onClick={() => setShowExercises(false)}
              className={`px-3 sm:px-6 py-2 sm:py-3 rounded-lg font-bold transition-all text-xs sm:text-base ${
                !showExercises 
                  ? 'bg-purple-500 text-white shadow-md' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              📖 Cours
            </button>
            <button
              id="exercises-tab"
              onClick={() => setShowExercises(true)}
              className={`px-3 sm:px-6 py-2 sm:py-3 rounded-lg font-bold transition-all text-xs sm:text-base ${
                showExercises 
                  ? 'bg-pink-500 text-white shadow-md' 
                  : 'text-gray-600 hover:bg-gray-100'
              } ${
                highlightedElement === 'exercises-tab' ? 'ring-4 ring-yellow-400 bg-yellow-300 scale-110 animate-pulse' : ''
              }`}
            >
              ✏️ Exercices ({score}/{exercises.length})
            </button>
          </div>
        </div>

        {!showExercises ? (
          /* COURS */
          <div className="space-y-4 sm:space-y-8">
            {/* Personnage Minecraft avec bouton DÉMARRER */}
            <div className="flex flex-row items-center justify-center gap-2 sm:gap-6 p-2 sm:p-4 mb-3 sm:mb-6">
              {/* Image du personnage Minecraft */}
              <div className={`relative transition-all duration-500 border-4 border-green-300 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 shadow-lg ${
                isPlayingVocal
                  ? 'w-16 sm:w-24 h-16 sm:h-24' // When speaking - encore plus gros  
                  : characterSizeExpanded
                    ? 'w-12 sm:w-20 h-12 sm:h-20' // After start - taille normale
                    : 'w-10 sm:w-16 h-10 sm:h-16' // Initial - plus petit
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
                  onClick={() => {
                    setHasStarted(true);
                    setCharacterSizeExpanded(true);
                    explainChapter();
                  }}
                  disabled={isPlayingVocal}
                  className={`bg-gradient-to-r from-green-500 to-blue-500 text-white px-3 sm:px-8 py-2 sm:py-4 rounded-lg sm:rounded-xl font-bold text-xs sm:text-xl min-h-[2.5rem] sm:min-h-[3rem] shadow-lg sm:shadow-2xl hover:shadow-xl sm:hover:shadow-3xl transition-all transform hover:scale-105 pulse-interactive ${
                    isPlayingVocal ? 'opacity-75 cursor-not-allowed' : 'hover:from-green-600 hover:to-blue-600'
                  }`}
                >
                  <Play className="inline w-3 h-3 sm:w-6 sm:h-6 mr-1 sm:mr-2" />
                  {isPlayingVocal ? '🎤 JE PARLE...' : '🎯 DÉMARRER'}
                </button>
              </div>
            </div>
            {/* Explication des positions */}
            <div id="positions-explanation" className={`bg-white rounded-xl p-3 sm:p-4 shadow-lg ${
              highlightedElement === 'positions-explanation' ? 'ring-4 ring-yellow-400 bg-yellow-200 scale-105 animate-pulse' : ''
            }`}>
              <h2 className="text-base sm:text-xl font-bold text-center mb-2 sm:mb-4 text-gray-900">
                📊 Les positions des chiffres
              </h2>
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                <div className="bg-red-50 rounded-lg p-2 sm:p-3 text-center">
                  <div className="text-lg sm:text-2xl mb-1">💯</div>
                  <h3 className="font-bold text-red-800 mb-1 text-xs sm:text-sm">Centaines</h3>
                  <p className="text-red-700 text-xs hidden sm:block">Le chiffre de gauche</p>
                  <p className="text-red-700 text-xs hidden sm:block">Vaut × 100</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-2 sm:p-3 text-center">
                  <div className="text-lg sm:text-2xl mb-1">🔟</div>
                  <h3 className="font-bold text-blue-800 mb-1 text-xs sm:text-sm">Dizaines</h3>
                  <p className="text-blue-700 text-xs hidden sm:block">Le chiffre du milieu</p>
                  <p className="text-blue-700 text-xs hidden sm:block">Vaut × 10</p>
                </div>
                <div className="bg-green-50 rounded-lg p-2 sm:p-3 text-center">
                  <div className="text-lg sm:text-2xl mb-1">1️⃣</div>
                  <h3 className="font-bold text-green-800 mb-1 text-xs sm:text-sm">Unités</h3>
                  <p className="text-green-700 text-xs hidden sm:block">Le chiffre de droite</p>
                  <p className="text-green-700 text-xs hidden sm:block">Vaut × 1</p>
                </div>
              </div>
            </div>

            {/* Sélecteur de nombre pour démonstration */}
            <div id="number-selector" className={`bg-white rounded-xl p-3 sm:p-6 shadow-lg ${
              highlightedElement === 'number-selector' ? 'ring-4 ring-yellow-400 bg-yellow-200 scale-105 animate-pulse' : ''
            }`}>
              <h2 className="text-base sm:text-2xl font-bold text-center mb-3 sm:mb-6 text-gray-900">
                🎯 Choisis un nombre à décomposer
              </h2>
              <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-3 sm:mb-6">
                {examples.map((example) => (
                  <button
                    key={example.number}
                    onClick={() => {
                      setSelectedNumber(example.number);
                      // Lancer l'animation après un petit délai pour laisser le DOM se mettre à jour
                      setTimeout(() => {
                        animateDecomposition();
                      }, 100);
                    }}
                    disabled={isAnimating}
                    className={`p-2 sm:p-4 rounded-lg font-bold text-sm sm:text-xl transition-all disabled:opacity-50 min-h-[2.5rem] sm:min-h-[3rem] ${
                      selectedNumber === example.number
                        ? 'bg-purple-500 text-white shadow-lg scale-105'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {example.number}
                  </button>
                ))}
              </div>
            </div>

            {/* Démonstration de décomposition */}
            <div id="decomposition-demo" className={`bg-white rounded-xl p-3 sm:p-4 shadow-lg ${
              highlightedElement === 'decomposition-demo' ? 'ring-4 ring-yellow-400 bg-yellow-200 scale-105 animate-pulse' : ''
            }`}>
              <h3 className="text-sm sm:text-lg font-bold mb-2 sm:mb-4 text-center text-gray-900">
                🔍 Décomposition du nombre {selectedNumber}
              </h3>
              
              {/* Affichage du nombre */}
              <div className="flex justify-center mb-2 sm:mb-4">
                <div className="flex space-x-1 sm:space-x-2">
                  {selectedNumber.split('').map((digit, index) => (
                    <div
                      key={index}
                      id={`demo-digit-${index}`}
                      className="w-8 h-8 sm:w-12 sm:h-12 bg-gray-100 rounded-lg flex items-center justify-center text-lg sm:text-2xl font-bold text-gray-900 transition-all duration-300"
                    >
                      {digit}
                    </div>
                  ))}
                </div>
              </div>

              {/* Flèches et décomposition */}
              <div className="grid grid-cols-3 gap-1 sm:gap-2">
                {/* Centaines */}
                <div className="text-center">
                  <div className="text-sm sm:text-lg mb-1">⬇️</div>
                  <div className="bg-red-100 rounded-lg p-1 sm:p-2 transition-all duration-300" id="centaines-box">
                    <div className="text-lg sm:text-xl font-bold text-red-600 mb-1">
                      {decomposeNumber(selectedNumber).centaines}
                    </div>
                    <div className="font-bold text-red-800 text-xs">Centaines</div>
                    <div className="text-xs text-red-700 hidden sm:block">
                      {decomposeNumber(selectedNumber).centaines} × 100 = {parseInt(decomposeNumber(selectedNumber).centaines) * 100}
                    </div>
                  </div>
                </div>

                {/* Dizaines */}
                <div className="text-center">
                  <div className="text-sm sm:text-lg mb-1">⬇️</div>
                  <div className="bg-blue-100 rounded-lg p-1 sm:p-2 transition-all duration-300" id="dizaines-box">
                    <div className="text-lg sm:text-xl font-bold text-blue-600 mb-1">
                      {decomposeNumber(selectedNumber).dizaines}
                    </div>
                    <div className="font-bold text-blue-800 text-xs">Dizaines</div>
                    <div className="text-xs text-blue-700 hidden sm:block">
                      {decomposeNumber(selectedNumber).dizaines} × 10 = {parseInt(decomposeNumber(selectedNumber).dizaines) * 10}
                    </div>
                  </div>
                </div>

                {/* Unités */}
                <div className="text-center">
                  <div className="text-sm sm:text-lg mb-1">⬇️</div>
                  <div className="bg-green-100 rounded-lg p-1 sm:p-2 transition-all duration-300" id="unites-box">
                    <div className="text-lg sm:text-xl font-bold text-green-600 mb-1">
                      {decomposeNumber(selectedNumber).unites}
                    </div>
                    <div className="font-bold text-green-800 text-xs">Unités</div>
                    <div className="text-xs text-green-700 hidden sm:block">
                      {decomposeNumber(selectedNumber).unites} × 1 = {parseInt(decomposeNumber(selectedNumber).unites)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Vérification */}
              <div id="verification-box" className="mt-2 sm:mt-4 bg-yellow-50 rounded-lg p-2 sm:p-3 text-center transition-all duration-300">
                <h4 className="font-bold text-yellow-800 mb-1 text-xs sm:text-sm">✅ Vérification :</h4>
                <div className="text-xs sm:text-sm text-yellow-900">
                  {parseInt(decomposeNumber(selectedNumber).centaines) * 100} + {parseInt(decomposeNumber(selectedNumber).dizaines) * 10} + {parseInt(decomposeNumber(selectedNumber).unites)} = {selectedNumber}
                </div>
              </div>


            </div>

            {/* Conseils */}
            <div className="bg-gradient-to-r from-indigo-400 to-purple-400 rounded-xl p-3 sm:p-6 text-white">
              <h3 className="text-sm sm:text-xl font-bold mb-2 sm:mb-3">💡 Astuces pour décomposer</h3>
              <ul className="space-y-1 sm:space-y-2 text-xs sm:text-base">
                <li className="hidden sm:block">• Le premier chiffre (à gauche) = les centaines</li>
                <li className="hidden sm:block">• Le deuxième chiffre (au milieu) = les dizaines</li>
                <li className="hidden sm:block">• Le troisième chiffre (à droite) = les unités</li>
                <li className="block sm:hidden">• Gauche = centaines, milieu = dizaines, droite = unités</li>
                <li>• Si il n'y a que 2 chiffres, il n'y a pas de centaines</li>
                <li>• Le zéro signifie "aucun" dans cette position</li>
              </ul>
            </div>
          </div>
        ) : (
          /* EXERCICES */
          <div className="space-y-4 sm:space-y-8">
            {/* Personnage Minecraft avec bouton DÉMARRER */}
            <div className="flex flex-row items-center justify-center gap-2 sm:gap-6 p-2 sm:p-4 mb-3 sm:mb-6">
              {/* Image du personnage Minecraft */}
              <div className={`relative transition-all duration-500 border-4 border-green-300 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 shadow-lg ${
                isPlayingVocal
                  ? 'w-16 sm:w-24 h-16 sm:h-24' // When speaking - encore plus gros  
                  : characterSizeExpanded
                    ? 'w-12 sm:w-20 h-12 sm:h-20' // After start - taille normale
                    : 'w-10 sm:w-16 h-10 sm:h-16' // Initial - plus petit
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
                  onClick={() => {
                    setHasStarted(true);
                    setCharacterSizeExpanded(true);
                    explainChapter();
                  }}
                  disabled={isPlayingVocal}
                  className={`bg-gradient-to-r from-green-500 to-blue-500 text-white px-3 sm:px-8 py-2 sm:py-4 rounded-lg sm:rounded-xl font-bold text-xs sm:text-xl min-h-[2.5rem] sm:min-h-[3rem] shadow-lg sm:shadow-2xl hover:shadow-xl sm:hover:shadow-3xl transition-all transform hover:scale-105 pulse-interactive ${
                    isPlayingVocal ? 'opacity-75 cursor-not-allowed' : 'hover:from-green-600 hover:to-blue-600'
                  }`}
                >
                  <Play className="inline w-3 h-3 sm:w-6 sm:h-6 mr-1 sm:mr-2" />
                  {isPlayingVocal ? '🎤 JE PARLE...' : '🎯 DÉMARRER'}
                </button>
              </div>
            </div>
            
            {/* Sélecteur type d'exercice - GLOBAL */}
            <div className="bg-white rounded-xl p-3 sm:p-4 shadow-lg mb-4 sm:mb-6">
              <div className="text-center mb-3 sm:mb-4">
                <h3 className="text-sm sm:text-lg font-bold text-gray-800 mb-1 sm:mb-2">🎯 Choisis ton type d'exercice :</h3>
                <p className="text-xs sm:text-sm text-gray-600 hidden sm:block">Deux façons différentes de travailler avec les nombres !</p>
              </div>
              <div id="exercise-type-selector" className={`flex justify-center ${
                highlightedElement === 'exercise-type-selector' ? 'ring-4 ring-yellow-400 bg-yellow-200 scale-105 animate-pulse rounded-lg' : ''
              }`}>
                <div className="bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => switchExerciseType('decompose')}
                    className={`px-2 sm:px-4 py-2 sm:py-3 rounded-lg font-bold transition-all text-center min-h-[3rem] sm:min-h-[4rem] ${
                      exerciseType === 'decompose' 
                        ? 'bg-purple-500 text-white shadow-md' 
                        : 'text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <div className="text-xs sm:text-base">🧩 Décomposer</div>
                    <div className="text-xs opacity-75 mt-1">234 → 2, 3, 4</div>
                  </button>
                  <button
                    onClick={() => switchExerciseType('compose')}
                    className={`px-2 sm:px-4 py-2 sm:py-3 rounded-lg font-bold transition-all text-center min-h-[3rem] sm:min-h-[4rem] ${
                      exerciseType === 'compose' 
                        ? 'bg-green-500 text-white shadow-md' 
                        : 'text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <div className="text-xs sm:text-base">🔢 Composer</div>
                    <div className="text-xs opacity-75 mt-1">2, 3, 4 → 234</div>
                  </button>
                </div>
              </div>
            </div>

            {/* Header exercices */}
            <div id="exercise-header" className={`bg-white rounded-xl p-6 shadow-lg ${
              highlightedElement === 'exercise-header' ? 'ring-4 ring-yellow-400 bg-yellow-200 scale-105 animate-pulse' : ''
            }`}>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-900">
                  ✏️ Exercice {currentExercise + 1} sur {exerciseType === 'decompose' ? exercises.length : composeExercises.length}
                </h2>
              </div>
              
              {/* Barre de progression */}
              <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
                <div 
                  className={`h-3 rounded-full transition-all duration-500 ${
                    exerciseType === 'decompose' ? 'bg-purple-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${((currentExercise + 1) / (exerciseType === 'decompose' ? exercises.length : composeExercises.length)) * 100}%` }}
                ></div>
              </div>
              
              {/* Score sous la barre */}
              <div className="text-center">
                <div className={`text-lg font-bold ${
                  exerciseType === 'decompose' ? 'text-purple-600' : 'text-green-600'
                }`}>
                  Score : {score}/{(exerciseType === 'decompose' ? exercises.length : composeExercises.length)}
                </div>
              </div>
            </div>

            {/* Question */}
            <div id="exercise-question" className={`bg-white rounded-xl p-4 md:p-8 shadow-lg text-center ${
              highlightedElement === 'exercise-question' ? 'ring-4 ring-yellow-400 bg-yellow-200 scale-105 animate-pulse' : ''
            }`}>
              {exerciseType === 'decompose' ? (
                <>
                  <h3 className="text-lg md:text-xl font-bold mb-4 md:mb-6 text-gray-900">
                    🧩 Décompose ce nombre
                  </h3>
                  
                  <div className="text-4xl md:text-6xl font-bold text-purple-600 mb-6 md:mb-8">
                    {exercises[currentExercise].number}
                  </div>
                  
                  {/* Champs de saisie pour décomposition */}
                  <div className="grid grid-cols-3 gap-2 md:gap-6 max-w-2xl mx-auto mb-6 md:mb-8">
                    <div className="text-center">
                      <label className="block font-bold text-red-600 mb-1 md:mb-2 text-sm md:text-base">Centaines</label>
                      <input
                        type="text"
                        value={userAnswers.centaines}
                        onChange={(e) => updateAnswer('centaines', e.target.value)}
                        placeholder="?"
                        className="w-16 h-16 md:w-20 md:h-20 mx-auto border-2 border-red-300 rounded-lg text-center text-xl md:text-2xl font-bold focus:border-red-500 focus:outline-none bg-white text-gray-900"
                        maxLength={2}
                      />
                    </div>
                    <div className="text-center">
                      <label className="block font-bold text-blue-600 mb-1 md:mb-2 text-sm md:text-base">Dizaines</label>
                      <input
                        type="text"
                        value={userAnswers.dizaines}
                        onChange={(e) => updateAnswer('dizaines', e.target.value)}
                        placeholder="?"
                        className="w-16 h-16 md:w-20 md:h-20 mx-auto border-2 border-blue-300 rounded-lg text-center text-xl md:text-2xl font-bold focus:border-blue-500 focus:outline-none bg-white text-gray-900"
                        maxLength={1}
                      />
                    </div>
                    <div className="text-center">
                      <label className="block font-bold text-green-600 mb-1 md:mb-2 text-sm md:text-base">Unités</label>
                      <input
                        type="text"
                        value={userAnswers.unites}
                        onChange={(e) => updateAnswer('unites', e.target.value)}
                        placeholder="?"
                        className="w-16 h-16 md:w-20 md:h-20 mx-auto border-2 border-green-300 rounded-lg text-center text-xl md:text-2xl font-bold focus:border-green-500 focus:outline-none bg-white text-gray-900"
                        maxLength={1}
                      />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <h3 className="text-lg md:text-xl font-bold mb-4 md:mb-6 text-gray-900">
                    🔢 Trouve le nombre avec cette décomposition
                  </h3>
                  
                  {/* Affichage de la décomposition */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6 max-w-2xl mx-auto mb-8">
                    <div className="text-center">
                      <div className="bg-red-100 rounded-lg p-1 md:p-4">
                        <div className="text-xl md:text-3xl font-bold text-red-600 mb-1 md:mb-2">
                          {composeExercises[currentExercise].centaines}
                        </div>
                        <div className="font-bold text-red-800 text-sm md:text-base">Centaines</div>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="bg-blue-100 rounded-lg p-1 md:p-4">
                        <div className="text-xl md:text-3xl font-bold text-blue-600 mb-1 md:mb-2">
                          {composeExercises[currentExercise].dizaines}
                        </div>
                        <div className="font-bold text-blue-800 text-sm md:text-base">Dizaines</div>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="bg-green-100 rounded-lg p-1 md:p-4">
                        <div className="text-xl md:text-3xl font-bold text-green-600 mb-1 md:mb-2">
                          {composeExercises[currentExercise].unites}
                        </div>
                        <div className="font-bold text-green-800 text-sm md:text-base">Unités</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Champ de saisie pour le nombre */}
                  <div className="max-w-md mx-auto mb-6 md:mb-8">
                    <input
                      type="text"
                      value={userNumber}
                      onChange={(e) => setUserNumber(e.target.value)}
                      placeholder="Écris le nombre ici..."
                      className="w-full px-3 md:px-4 py-3 md:py-4 border-2 border-green-300 rounded-lg text-center text-2xl md:text-3xl font-bold focus:border-green-500 focus:outline-none bg-white text-gray-900"
                      maxLength={4}
                    />
                    
                    {/* Reconnaissance vocale */}
                    <div className="border-t border-gray-200 pt-4 mt-4">
                      <VoiceInput
                        onTranscript={(transcript) => setUserNumber(transcript)}
                        placeholder="Ou dites le nombre à voix haute..."
                        className="justify-center"
                      />
                    </div>
                  </div>
                </>
              )}
              
              <div className="flex justify-center space-x-4 mb-4 md:mb-6">
                <button
                  onClick={resetExercise}
                  className="bg-gray-500 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg font-bold hover:bg-gray-600 transition-colors text-sm md:text-base"
                >
                  Effacer
                </button>
              </div>
              
              {/* Résultat */}
              {isCorrect !== null && (
                <div className={`p-4 rounded-lg mb-6 ${
                  isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  <div className="flex items-center justify-center space-x-2">
                    {isCorrect ? (
                      <>
                        <CheckCircle className="w-6 h-6" />
                        <span className="font-bold">
                          {exerciseType === 'decompose' 
                            ? 'Super ! Tu as bien décomposé le nombre !' 
                            : 'Excellent ! Tu as trouvé le bon nombre !'}
                        </span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-6 h-6" />
                        <span className="font-bold">
                          {exerciseType === 'decompose' 
                            ? `Pas tout à fait... La bonne réponse est : ${exercises[currentExercise].centaines} centaines, ${exercises[currentExercise].dizaines} dizaines, ${exercises[currentExercise].unites} unités`
                            : `Pas tout à fait... La bonne réponse est : ${composeExercises[currentExercise].number}`}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              )}
              
              {/* Navigation */}
              <div className="flex justify-center space-x-3 md:space-x-4">
                <button
                  onClick={() => setCurrentExercise(Math.max(0, currentExercise - 1))}
                  disabled={currentExercise === 0}
                  className="bg-gray-300 text-gray-700 px-4 md:px-6 py-2 md:py-3 rounded-lg font-bold hover:bg-gray-400 transition-colors disabled:opacity-50 text-sm md:text-base"
                >
                  ← Précédent
                </button>
                <button
                  id="verify-button"
                  onClick={handleNext}
                  disabled={
                    isCorrect === null && (
                      exerciseType === 'decompose' 
                        ? (!userAnswers.centaines || !userAnswers.dizaines || userAnswers.unites === '')
                        : !userNumber.trim()
                    )
                  }
                  className={`text-white px-4 md:px-6 py-2 md:py-3 rounded-lg font-bold transition-colors disabled:opacity-50 text-sm md:text-base ${
                    exerciseType === 'decompose' 
                      ? 'bg-pink-500 hover:bg-pink-600' 
                      : 'bg-lime-500 hover:bg-lime-600'
                  } ${
                    highlightedElement === 'verify-button' ? 'ring-4 ring-yellow-400 bg-yellow-300 scale-110 animate-pulse' : ''
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
                const totalExercises = exerciseType === 'decompose' ? exercises.length : composeExercises.length;
                const percentage = Math.round((finalScore / totalExercises) * 100);
                const getMessage = () => {
                  if (percentage >= 90) return { title: "🎉 Excellent !", message: `Tu maîtrises parfaitement ${exerciseType === 'decompose' ? 'la décomposition' : 'la composition'} des nombres jusqu'à 1000 !`, emoji: "🎉" };
                  if (percentage >= 70) return { title: "👏 Bien joué !", message: `Tu sais bien ${exerciseType === 'decompose' ? 'décomposer' : 'composer'} les nombres ! Continue comme ça !`, emoji: "👏" };
                  if (percentage >= 50) return { title: "👍 C'est un bon début !", message: "Tu progresses bien. Entraîne-toi encore un peu !", emoji: "😊" };
                  return { title: "💪 Continue à t'entraîner !", message: `Recommence les exercices pour mieux maîtriser ${exerciseType === 'decompose' ? 'la décomposition' : 'la composition'} des nombres.`, emoji: "📚" };
                };
                const result = getMessage();
                return (
                  <>
                    <div className="text-6xl mb-4">{result.emoji}</div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">{result.title}</h3>
                    <p className="text-lg text-gray-700 mb-6">{result.message}</p>
                    <div className="bg-gray-100 rounded-lg p-4 mb-6">
                      <p className="text-xl font-bold text-gray-900">
                        Score final : {finalScore}/{totalExercises} ({percentage}%)
                      </p>
                    </div>
                    <div className="flex justify-center">
                      <button
                        onClick={() => setShowCompletionModal(false)}
                        className="bg-gray-500 text-white px-8 py-3 rounded-lg font-bold hover:bg-gray-600 transition-colors"
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
    </>
  );
} 