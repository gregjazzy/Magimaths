'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, Play, Pause } from 'lucide-react';

export default function SensAdditionCP() {
  // États pour l'audio et animations
  const [isPlayingVocal, setIsPlayingVocal] = useState(false);
  const [isAnimationRunning, setIsAnimationRunning] = useState(false);
  const [highlightedElement, setHighlightedElement] = useState<string | null>(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [animatingStep, setAnimatingStep] = useState<string | null>(null);
  const [currentExample, setCurrentExample] = useState<number | null>(null);
  const [highlightedNumber, setHighlightedNumber] = useState<number | null>(null);
  const [showingProcess, setShowingProcess] = useState<'gathering' | 'counting' | null>(null);
  const [animatingObjects, setAnimatingObjects] = useState(false);
  const [objectsStep, setObjectsStep] = useState<'group1' | 'group2' | 'result' | null>(null);
  
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

  // Données des exemples d'addition
  const additionExamples = [
    { item: '🍎', group1: 2, group2: 3, result: 5, description: 'pommes' },
    { item: '🚗', group1: 1, group2: 2, result: 3, description: 'voitures' },
    { item: '⭐', group1: 3, group2: 2, result: 5, description: 'étoiles' },
    { item: '🎾', group1: 2, group2: 1, result: 3, description: 'balles' },
    { item: '🧸', group1: 4, group2: 1, result: 5, description: 'nounours' }
  ];

  // Exercices sur le sens de l'addition
  const exercises = [
    { 
      question: 'Que veut dire "additionner" ?', 
      correctAnswer: 'Mettre ensemble',
      choices: ['Mettre ensemble', 'Enlever', 'Couper en deux']
    },
    { 
      question: 'Quand tu additionnes 2 pommes et 3 pommes, que fais-tu ?', 
      correctAnswer: 'Tu les mets toutes ensemble',
      choices: ['Tu les sépares', 'Tu les mets toutes ensemble', 'Tu les caches']
    },
    { 
      question: 'Combien de voitures en tout ?', 
      correctAnswer: '4',
      choices: ['3', '4', '5'],
      visual: '🚗🚗 + 🚗🚗 = ?'
    },
    { 
      question: 'Que représente le signe + ?', 
      correctAnswer: 'Ajouter',
      choices: ['Enlever', 'Ajouter', 'Égaler']
    },
    { 
      question: 'Si tu as 3 bonbons et qu\'on te donne 2 bonbons, combien en as-tu ?', 
      correctAnswer: '5',
      choices: ['3', '5', '2'],
      visual: '🍬🍬🍬 + 🍬🍬 = ?'
    },
    { 
      question: 'Dans 2 + 3 = 5, que représente le 5 ?', 
      correctAnswer: 'Le total',
      choices: ['Le début', 'Le total', 'Le signe']
    },
    { 
      question: 'Pour additionner, on doit...', 
      correctAnswer: 'Compter tous les objets ensemble',
      choices: ['Compter seulement le premier groupe', 'Compter tous les objets ensemble', 'Ne rien compter']
    },
    { 
      question: 'Combien d\'étoiles en tout ?', 
      correctAnswer: '6',
      choices: ['5', '6', '7'],
      visual: '⭐⭐⭐⭐ + ⭐⭐ = ?'
    },
    { 
      question: 'Quelle addition correspond à cette situation : "1 chat puis 3 chats arrivent" ?', 
      correctAnswer: '1 + 3',
      choices: ['1 + 3', '3 - 1', '3 + 3']
    },
    { 
      question: 'L\'addition nous aide à trouver...', 
      correctAnswer: 'Combien on a en tout',
      choices: ['Combien on enlève', 'Combien on a en tout', 'Combien on partage']
    }
  ];

  // Fonction pour arrêter toutes les animations et vocaux
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
    setHighlightedNumber(null);
    setShowingProcess(null);
    setAnimatingObjects(false);
    setObjectsStep(null);
  };

  // Fonction pour jouer l'audio avec voix féminine française
  const playAudio = async (text: string, slowMode = false) => {
    return new Promise<void>((resolve) => {
      if (stopSignalRef.current) {
        resolve();
        return;
      }
      
      setIsPlayingVocal(true);
      const utterance = new SpeechSynthesisUtterance(text);
      
      utterance.lang = 'fr-FR';
      utterance.rate = slowMode ? 0.6 : 0.8;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      const voices = speechSynthesis.getVoices();
      
      // 🍎 FORCE APPLE SYSTEM VOICES ONLY - Diagnostic logs
      console.log('🔍 Toutes les voix disponibles:');
      voices.forEach(voice => {
        console.log(`  ${voice.name} (${voice.lang}) [Local: ${voice.localService}] [Default: ${voice.default}]`);
      });
      
      // 🎯 PRIORITÉ ABSOLUE: Voix système Apple françaises uniquement
      const appleVoices = voices.filter(voice => 
        voice.localService === true && 
        (voice.lang === 'fr-FR' || voice.lang === 'fr')
      );
      
      console.log('🍎 Voix Apple système françaises trouvées:', appleVoices.map(v => v.name));
      
      const femaleVoiceNames = ['Amélie', 'Audrey', 'Marie', 'Julie', 'Céline', 'Virginie', 'Pauline', 'Lucie'];
      
      // 1. Recherche voix féminine Apple française
      let selectedVoice = appleVoices.find(voice => 
        femaleVoiceNames.some(name => voice.name.includes(name))
      );
      
      // 2. Fallback: N'importe quelle voix Apple française
      if (!selectedVoice) {
        selectedVoice = appleVoices.find(voice => 
          voice.lang === 'fr-FR' || voice.lang === 'fr'
        );
      }
      
      // 3. Fallback: Voix Apple par défaut (même si pas française)
      if (!selectedVoice) {
        const defaultAppleVoice = voices.find(voice => 
          voice.localService === true && voice.default === true
        );
        if (defaultAppleVoice) {
          selectedVoice = defaultAppleVoice;
          console.log('⚠️ Utilisation voix Apple par défaut (non française):', defaultAppleVoice.name);
        }
      }
      
      // 4. Dernier recours: Première voix Apple disponible
      if (!selectedVoice && appleVoices.length > 0) {
        selectedVoice = appleVoices[0];
        console.log('⚠️ Utilisation première voix Apple disponible:', selectedVoice.name);
      }

      if (selectedVoice) {
        utterance.voice = selectedVoice;
        console.log('✅ Voix sélectionnée (Apple système):', selectedVoice.name, '(', selectedVoice.lang, ')');
      } else {
        console.log('❌ AUCUNE VOIX APPLE SYSTÈME TROUVÉE - TTS peut échouer');
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

  // Fonction utilitaire pour les pauses
  const wait = (ms: number) => {
    return new Promise(resolve => {
      if (stopSignalRef.current) {
        resolve(undefined);
        return;
      }
      setTimeout(resolve, ms);
    });
  };

  // Fonction pour scroller vers une section
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      });
    }
  };

  // Fonction pour rendre les objets avec animations
  const renderObjects = (count: number, item: string) => {
    if (count <= 0) return null;
    
    const objects = [];
    for (let i = 0; i < count; i++) {
      objects.push(
        <span
          key={i}
          className="text-4xl inline-block transition-all duration-300 animate-bounce"
          style={{ 
            animationDelay: `${i * 100}ms`,
            transform: highlightedNumber === count ? 'scale(1.2)' : 'scale(1)'
          }}
        >
          {item}
        </span>
      );
    }
    
    return (
      <div className="flex flex-wrap gap-2 justify-center items-center">
        {objects}
      </div>
    );
  };

     // Fonction pour expliquer le chapitre principal  
   const explainChapter = async () => {
     stopAllVocalsAndAnimations();
     await wait(300);
     stopSignalRef.current = false;
     setIsAnimationRunning(true);
     setHasStarted(true);
    
    try {
      // 1. Objet du chapitre
      await playAudio("Bonjour ! Aujourd'hui, nous allons apprendre ce que veut dire 'additionner' !", true);
      if (stopSignalRef.current) return;
      
      await wait(1200);
      await playAudio("Tu vas découvrir comment ajouter des objets ensemble pour savoir combien tu en as en tout !", true);
      if (stopSignalRef.current) return;
      
      // 2. Explication du concept avec animations
      await wait(1800);
      setHighlightedElement('concept-section');
      await playAudio("Additionner, c'est mettre des objets ensemble pour les compter tous !", true);
      if (stopSignalRef.current) return;
      
      await wait(1500);
      await playAudio("Regardons ensemble un exemple avec des pommes.", true);
      if (stopSignalRef.current) return;
      
      // Animation détaillée avec premier exemple
      await wait(1200);
      setCurrentExample(0);
      setAnimatingStep('introduction');
      const example = additionExamples[0];
      
      await playAudio(`D'abord, j'ai ${example.group1} ${example.description} ici.`, true);
      if (stopSignalRef.current) return;
      
      await wait(1200);
      setObjectsStep('group1');
      setHighlightedNumber(example.group1);
      await playAudio(`Je vois ${example.group1} ${example.description}.`, true);
      if (stopSignalRef.current) return;
      
             await wait(1500);
       // Explication du signe +
       setShowingProcess('gathering');
       await playAudio("Tu vois le signe plus ? Il veut dire qu'on va ajouter, mettre ensemble !", true);
       if (stopSignalRef.current) return;
       
       await wait(1500);
       await playAudio(`Maintenant, j'ajoute ${example.group2} ${example.description} de plus !`, true);
       if (stopSignalRef.current) return;
      
      await wait(1200);
      setObjectsStep('group2');
      setHighlightedNumber(example.group2);
      await playAudio(`Voici ${example.group2} ${example.description} en plus.`, true);
      if (stopSignalRef.current) return;
      
             await wait(1500);
       setShowingProcess('counting');
       await playAudio("Maintenant, je compte tout ensemble !", true);
       if (stopSignalRef.current) return;
       
       // Animation de comptage nombre par nombre
       await wait(1000);
       for (let i = 1; i <= example.result; i++) {
         if (stopSignalRef.current) return;
         setHighlightedNumber(i);
         await playAudio(`${i}`, true);
         await wait(800);
       }
       
       await wait(1000);
       setShowingProcess(null);
       setObjectsStep('result');
       setHighlightedNumber(example.result);
       await playAudio(`En tout, j'ai ${example.result} ${example.description} ! C'est ça, additionner !`, true);
       if (stopSignalRef.current) return;
      
      await wait(1500);
      await playAudio(`En mathématiques, on écrit : ${example.group1} plus ${example.group2} égale ${example.result} !`, true);
      if (stopSignalRef.current) return;
    
             // 3. Présentation des autres exemples
       await wait(2500);
       setHighlightedNumber(null);
       setShowingProcess(null);
       setObjectsStep(null);
       await playAudio("Parfait ! Maintenant tu comprends ce qu'est l'addition !", true);
       if (stopSignalRef.current) return;
       
       await wait(1200);
       await playAudio("Il y a d'autres exemples à découvrir pour bien maîtriser !", true);
       if (stopSignalRef.current) return;
       
       await wait(1500);
       setHighlightedElement('examples-section');
       scrollToSection('examples-section');
       await playAudio("Regarde ! Tu peux essayer avec d'autres objets !", true);
       if (stopSignalRef.current) return;
       
       await wait(1200);
       await playAudio("Clique sur les exemples pour voir d'autres animations !", true);
       if (stopSignalRef.current) return;
       
       await wait(800);
    setHighlightedElement(null);
       setCurrentExample(null);
    } finally {
      setHighlightedElement(null);
      setHighlightedNumber(null);
      setShowingProcess(null);
      setAnimatingStep(null);
      setCurrentExample(null);
      setObjectsStep(null);
      setIsAnimationRunning(false);
    }
  };

     // Fonction pour expliquer un exemple spécifique
   const explainSpecificExample = async (index: number) => {
     stopAllVocalsAndAnimations();
     await wait(300);
     stopSignalRef.current = false;
     setIsAnimationRunning(true);
     
     const example = additionExamples[index];
    
    try {
       setCurrentExample(index);
       setAnimatingStep('introduction');
       scrollToSection('concept-section');
       
       await playAudio(`Je vais te montrer l'addition avec des ${example.description}.`, true);
       if (stopSignalRef.current) return;
       
       await wait(1500);
       setObjectsStep('group1');
       setHighlightedNumber(example.group1);
       await playAudio(`D'abord, j'ai ${example.group1} ${example.description}.`, true);
       if (stopSignalRef.current) return;
       
       await wait(1200);
       // Explication du signe +
       setShowingProcess('gathering');
       await playAudio("Tu vois le signe plus ? Il veut dire qu'on va ajouter, mettre ensemble !", true);
       if (stopSignalRef.current) return;
      
       await wait(1500);
       await playAudio(`J'ajoute ${example.group2} ${example.description} en plus.`, true);
       if (stopSignalRef.current) return;
       
       await wait(1500);
       setObjectsStep('group2');
       setHighlightedNumber(example.group2);
       await playAudio(`Voici les ${example.group2} ${example.description} que j'ajoute.`, true);
       if (stopSignalRef.current) return;
       
      await wait(1200);
       setShowingProcess('counting');
       await playAudio("Je compte tout ensemble maintenant !", true);
       if (stopSignalRef.current) return;
       
       // Animation de comptage nombre par nombre
       await wait(1000);
       for (let i = 1; i <= example.result; i++) {
         if (stopSignalRef.current) return;
         setHighlightedNumber(i);
         await playAudio(`${i}`, true);
         await wait(800);
       }
       
       await wait(1000);
       setShowingProcess(null);
       setObjectsStep('result');
       setHighlightedNumber(example.result);
       await playAudio(`${example.group1} plus ${example.group2} égale ${example.result} !`, true);
       if (stopSignalRef.current) return;
       
       await wait(2000);
       setCurrentExample(null);
       setHighlightedNumber(null);
       setShowingProcess(null);
       setAnimatingStep(null);
       setObjectsStep(null);
    } finally {
       setCurrentExample(null);
       setHighlightedNumber(null);
       setShowingProcess(null);
       setAnimatingStep(null);
       setObjectsStep(null);
       setIsAnimationRunning(false);
    }
  };

     // Gestion des exercices
  const handleAnswerClick = (answer: string) => {
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
    if (percentage >= 90) return { title: "🎉 Champion de l'addition !", message: "Tu comprends parfaitement le sens de l'addition !", emoji: "🎉" };
    if (percentage >= 70) return { title: "👏 Très bien !", message: "Tu progresses super bien !", emoji: "👏" };
    if (percentage >= 50) return { title: "👍 C'est bien !", message: "Continue, tu apprends bien !", emoji: "😊" };
    return { title: "💪 Continue !", message: "Recommence pour mieux comprendre l'addition !", emoji: "📚" };
  };

  // Effet pour initialiser le client
  useEffect(() => {
    setIsClient(true);
  }, []);

     // Effet pour gérer les changements de visibilité de la page et navigation
   useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
         console.log('Page cachée - arrêt du vocal');
         stopAllVocalsAndAnimations();
      }
    };
    
     const handleBeforeUnload = () => {
       console.log('Avant déchargement - arrêt du vocal');
       stopAllVocalsAndAnimations();
    };
    
     const handlePopState = () => {
       console.log('Navigation back/forward - arrêt du vocal');
       stopAllVocalsAndAnimations();
     };

     const handlePageHide = () => {
       console.log('Page masquée - arrêt du vocal');
       stopAllVocalsAndAnimations();
     };

     const handleUnload = () => {
       console.log('Déchargement - arrêt du vocal');
       stopAllVocalsAndAnimations();
     };

     const handleHashChange = () => {
       console.log('Changement de hash - arrêt du vocal');
       stopAllVocalsAndAnimations();
     };

     const handleBlur = () => {
       console.log('Perte de focus fenêtre - arrêt du vocal');
       stopAllVocalsAndAnimations();
     };

     // Event listeners standard
     document.addEventListener('visibilitychange', handleVisibilityChange);
     window.addEventListener('beforeunload', handleBeforeUnload);
     window.addEventListener('popstate', handlePopState);
     window.addEventListener('pagehide', handlePageHide);
     window.addEventListener('unload', handleUnload);
     window.addEventListener('hashchange', handleHashChange);
     window.addEventListener('blur', handleBlur);

     // Override des méthodes history pour détecter navigation programmatique
     const originalPushState = history.pushState;
     const originalReplaceState = history.replaceState;

     history.pushState = function(...args) {
       console.log('Navigation programmatique pushState - arrêt du vocal');
       stopAllVocalsAndAnimations();
       return originalPushState.apply(this, args);
     };

     history.replaceState = function(...args) {
       console.log('Navigation programmatique replaceState - arrêt du vocal');
       stopAllVocalsAndAnimations();
       return originalReplaceState.apply(this, args);
     };

     return () => {
       document.removeEventListener('visibilitychange', handleVisibilityChange);
       window.removeEventListener('beforeunload', handleBeforeUnload);
       window.removeEventListener('popstate', handlePopState);
       window.removeEventListener('pagehide', handlePageHide);
       window.removeEventListener('unload', handleUnload);
       window.removeEventListener('hashchange', handleHashChange);
       window.removeEventListener('blur', handleBlur);
      
       // Restaurer les méthodes originales
       history.pushState = originalPushState;
       history.replaceState = originalReplaceState;
     };
   }, []);

  // Effet pour gérer les changements d'onglet interne (cours ↔ exercices)
  useEffect(() => {
    stopAllVocalsAndAnimations();
  }, [showExercises]);
      
  if (!isClient) {
    return <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 flex items-center justify-center">
      <div className="text-xl">Chargement...</div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/chapitre/cp-additions-simples" 
             onClick={stopAllVocalsAndAnimations}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour aux additions simples</span>
          </Link>
          
          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              ➕ Le sens de l'addition
            </h1>
            <p className="text-lg text-gray-600">
              Découvre ce que veut dire "additionner" avec des objets et des animations !
            </p>
          </div>
        </div>

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
                   ? 'bg-green-500 text-white shadow-md' 
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
                   ? 'bg-green-500 text-white shadow-md' 
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
            {/* Bouton d'explication vocal principal */}
            <div className="text-center mb-6">
                <button
                onClick={explainChapter}
                disabled={isAnimationRunning}
                className={`px-8 py-4 rounded-xl font-bold text-xl shadow-lg transition-all transform ${
                  isAnimationRunning 
                    ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-green-500 to-blue-500 text-white hover:shadow-xl hover:scale-105'
                }`}
                style={{
                  animationDuration: !hasStarted && !isAnimationRunning ? '2s' : 'none',
                  animationIterationCount: !hasStarted && !isAnimationRunning ? 'infinite' : 'none'
                }}
                >
                {isAnimationRunning ? '⏳ Animation en cours...' : '▶️ COMMENCER !'}
                </button>
              </div>

                         {/* Explication du concept avec animation intégrée */}
             <div 
               id="concept-section"
               className={`bg-white rounded-xl p-8 shadow-lg transition-all duration-1000 ${
                 highlightedElement === 'concept-section' ? 'ring-4 ring-green-400 bg-green-50 scale-105' : ''
              }`}
            >
               <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
                 🤔 Qu'est-ce qu'additionner ?
               </h2>
            
               <div className="bg-green-50 rounded-lg p-6 mb-6">
                 <p className="text-lg text-center text-green-800 font-semibold mb-6">
                   Additionner, c'est mettre des objets ensemble pour savoir combien on en a en tout !
                 </p>
                 
                 <div className="bg-white rounded-lg p-6">
                   <div className="text-center mb-6">
                     <div className="text-2xl font-bold text-green-600 mb-4">
                       {currentExample !== null ? 
                         `Exemple : ${additionExamples[currentExample].group1} + ${additionExamples[currentExample].group2} = ${additionExamples[currentExample].result}` 
                         : 'Exemple : 2 + 3 = 5'
                       }
          </div>
        </div>

                                       {/* Animation intégrée dans le concept */}
                    {currentExample !== null ? (
                     <div className="space-y-6">
                       {/* Indicateur d'étape */}
                       {animatingStep && (
                         <div className="p-3 rounded-lg bg-blue-100 border-l-4 border-blue-500 text-center">
                           <div className="text-lg font-bold text-blue-800">
                             {animatingStep === 'introduction' && '🎯 Regardons ensemble...'}
            </div>
          </div>
                       )}
                       
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Premier groupe */}
                           <div className={`text-center p-6 rounded-lg transition-all duration-500 ${
                             objectsStep === 'group1' ? 'ring-4 ring-purple-400 bg-purple-100 scale-105' : 'bg-purple-50'
                           }`}>
                             <h4 className="text-lg font-bold text-purple-800 mb-4">
                               {additionExamples[currentExample].group1} {additionExamples[currentExample].description}
                             </h4>
                             <div className="mb-4">
                               {renderObjects(additionExamples[currentExample].group1, additionExamples[currentExample].item)}
                  </div>
                             <div className={`text-xl font-bold transition-all duration-500 ${
                               highlightedNumber === additionExamples[currentExample].group1 ? 'text-purple-600 scale-125 animate-pulse' : 'text-purple-800'
                             }`}>
                               {additionExamples[currentExample].group1}
                  </div>
                </div>

                {/* Symbole + */}
                           <div className="text-center flex items-center justify-center">
                  <div className={`text-8xl font-bold transition-all duration-500 ${
                               showingProcess === 'gathering' ? 'text-green-500 animate-bounce scale-125 ring-4 ring-yellow-400 bg-yellow-100 rounded-full p-4 shadow-2xl' : 'text-gray-400'
                  }`}>
                    +
                  </div>
                </div>

                {/* Deuxième groupe */}
                           <div className={`text-center p-6 rounded-lg transition-all duration-500 ${
                             objectsStep === 'group2' ? 'ring-4 ring-pink-400 bg-pink-100 scale-105' : 'bg-pink-50'
                           }`}>
                             <h4 className="text-lg font-bold text-pink-800 mb-4">
                               {additionExamples[currentExample].group2} {additionExamples[currentExample].description}
                             </h4>
                             <div className="mb-4">
                               {renderObjects(additionExamples[currentExample].group2, additionExamples[currentExample].item)}
                             </div>
                             <div className={`text-xl font-bold transition-all duration-500 ${
                               highlightedNumber === additionExamples[currentExample].group2 ? 'text-pink-600 scale-125 animate-pulse' : 'text-pink-800'
                             }`}>
                               {additionExamples[currentExample].group2}
                             </div>
                           </div>
                         </div>

                                                {/* Animation de comptage */}
                         {showingProcess === 'counting' && (
                           <div className="bg-yellow-50 rounded-lg p-6 border-2 border-yellow-300">
                             <h4 className="text-xl font-bold text-center text-yellow-800 mb-4">
                               🔢 Maintenant, comptons tout ensemble !
                             </h4>
                             <div className="flex justify-center items-center space-x-2 text-5xl">
                               {Array.from({ length: additionExamples[currentExample].result }, (_, i) => (
                      <span 
                        key={i} 
                                   className={`transition-all duration-500 ${
                                     highlightedNumber === i + 1 ? 'scale-150 animate-bounce text-red-500' : ''
                                   }`}
                      >
                                   {additionExamples[currentExample].item}
                      </span>
                    ))}
                  </div>
                             <div className="text-center mt-4">
                               <div className="text-3xl font-bold text-yellow-800">
                                 {highlightedNumber && highlightedNumber > 0 && `${highlightedNumber}...`}
                  </div>
                </div>
              </div>
                         )}

              {/* Résultat */}
                         {objectsStep === 'result' && (
                           <div className={`text-center p-6 rounded-lg transition-all duration-1000 bg-green-100 ring-4 ring-green-400 scale-105`}>
                             <h4 className="text-2xl font-bold text-green-800 mb-4">🎉 Résultat !</h4>
                             <div className="mb-4">
                               {renderObjects(additionExamples[currentExample].result, additionExamples[currentExample].item)}
                    </div>
                             <div className="text-3xl font-bold text-green-800 mb-2">
                               {additionExamples[currentExample].group1} + {additionExamples[currentExample].group2} = {additionExamples[currentExample].result}
                    </div>
                             <div className="text-lg text-green-600">
                               En tout : {additionExamples[currentExample].result} {additionExamples[currentExample].description} !
                  </div>
                </div>
              )}
            </div>
                   ) : (
                     /* Version statique quand pas d'animation */
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                       <div className="text-center p-4 bg-purple-50 rounded-lg">
                         <div className="text-sm text-gray-600 mb-2">2 pommes</div>
                         {renderObjects(2, '🍎')}
                         <div className="text-xl font-bold text-purple-800 mt-2">2</div>
                </div>
                       <div className="text-center flex items-center justify-center">
                         <div className="text-6xl font-bold text-green-600">+</div>
                </div>
                       <div className="text-center p-4 bg-pink-50 rounded-lg">
                         <div className="text-sm text-gray-600 mb-2">3 pommes</div>
                         {renderObjects(3, '🍎')}
                         <div className="text-xl font-bold text-pink-800 mt-2">3</div>
              </div>
            </div>
          )}
              </div>
                  </div>
                </div>

            {/* Autres exemples */}
            <div 
              id="examples-section"
              className={`bg-white rounded-xl p-8 shadow-lg transition-all duration-1000 ${
                highlightedElement === 'examples-section' ? 'ring-4 ring-blue-400 bg-blue-50 scale-105' : ''
              }`}
            >
              <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
                🌟 Autres exemples d'addition
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {additionExamples.map((example, index) => (
                  <div 
                    key={index}
                    className={`bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-6 transition-all duration-300 ${
                      isAnimationRunning 
                        ? 'opacity-50 cursor-not-allowed' 
                        : 'cursor-pointer hover:scale-105 hover:shadow-lg'
                    } ${currentExample === index ? 'ring-4 ring-yellow-400 bg-yellow-100' : ''}`}
                    onClick={isAnimationRunning ? undefined : () => explainSpecificExample(index)}
                  >
                <div className="text-center">
                      <div className="text-3xl mb-2">{example.item}</div>
                      <div className="font-bold text-lg text-gray-800 mb-2">
                        {example.group1} + {example.group2} = {example.result}
                </div>
                      <div className="text-sm text-gray-600 mb-3">
                        {example.description}
                  </div>
                      <button className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                        isAnimationRunning 
                          ? 'bg-gray-400 text-gray-200' 
                          : 'bg-blue-500 text-white hover:bg-blue-600'
                      }`}>
                        {isAnimationRunning ? '⏳ Attendez...' : '▶️ Voir l\'animation'}
                      </button>
                  </div>
                </div>
                      ))}
                    </div>
        </div>

            {/* Conseils pratiques */}
            <div className="bg-gradient-to-r from-green-400 to-blue-500 rounded-xl p-6 text-white">
              <h3 className="text-xl font-bold mb-4 text-center">
                💡 Conseils pour bien additionner
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-3xl mb-2">🤲</div>
                  <div className="font-bold">Utilise tes doigts</div>
                  <div className="text-sm">Compte sur tes mains</div>
                </div>
                <div>
                  <div className="text-3xl mb-2">🧸</div>
                  <div className="font-bold">Prends des objets</div>
                  <div className="text-sm">Jouets, crayons, bonbons...</div>
                </div>
                <div>
                  <div className="text-3xl mb-2">👀</div>
                  <div className="font-bold">Regarde bien</div>
                  <div className="text-sm">Compte tous les objets ensemble</div>
                </div>
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
                  🔄 Recommencer
                </button>
              </div>
              
              {/* Barre de progression */}
              <div className="w-full bg-gray-200 rounded-full h-4 mb-3">
                <div 
                  className="bg-green-500 h-4 rounded-full transition-all duration-500"
                  style={{ width: `${((currentExercise + 1) / exercises.length) * 100}%` }}
                ></div>
              </div>
              
              {/* Score */}
              <div className="text-center">
                <div className="text-xl font-bold text-green-600">
                  Score : {score}/{exercises.length}
                </div>
                </div>
              </div>

              {/* Question */}
            <div className="bg-white rounded-xl p-8 shadow-lg text-center">
              <h3 className="text-2xl font-bold mb-8 text-gray-900">
                  {exercises[currentExercise].question}
                </h3>
                
              {/* Visuel si disponible */}
              {exercises[currentExercise].visual && (
                <div className="bg-gray-50 rounded-lg p-6 mb-8">
                  <div className="text-4xl">
                    {exercises[currentExercise].visual}
                  </div>
                </div>
              )}

              {/* Choix multiples */}
              <div className="grid grid-cols-1 gap-4 max-w-md mx-auto mb-8">
                {exercises[currentExercise].choices.map((choice) => (
                  <button
                    key={choice}
                    onClick={() => handleAnswerClick(choice)}
                    disabled={isCorrect !== null}
                    className={`p-6 rounded-lg font-bold text-xl transition-all ${
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

              {/* Résultat */}
              {isCorrect !== null && (
                <div className={`p-6 rounded-lg mb-6 ${
                  isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  <div className="flex items-center justify-center space-x-3">
                  {isCorrect ? (
                      <>
                        <span className="text-2xl">✅</span>
                        <span className="font-bold text-xl">
                          Excellent ! C'est la bonne réponse !
                        </span>
                      </>
                  ) : (
                      <>
                        <span className="text-2xl">❌</span>
                    <span className="font-bold text-xl">
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
                    onClick={nextExercise}
                    className="bg-green-500 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-green-600 transition-colors"
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
                        {finalScore >= 8 ? '⭐⭐⭐' : finalScore >= 6 ? '⭐⭐' : '⭐'}
              </div>
                      <p className="text-sm text-gray-600 mt-2">
                        Comprendre l'addition est très important !
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