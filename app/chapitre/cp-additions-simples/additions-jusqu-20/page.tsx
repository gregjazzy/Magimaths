'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, XCircle, RotateCcw } from 'lucide-react';

export default function AdditionsJusqu20CP() {
  // États pour l'audio et animations
  const [isPlayingVocal, setIsPlayingVocal] = useState(false);
  const [isAnimationRunning, setIsAnimationRunning] = useState(false);
  const [highlightedElement, setHighlightedElement] = useState<string | null>(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [animatingStep, setAnimatingStep] = useState<string | null>(null);
  const [currentExample, setCurrentExample] = useState<number | null>(null);
  const [highlightedNumber, setHighlightedNumber] = useState<number | null>(null);
  const [showingProcess, setShowingProcess] = useState<'showing-first' | 'showing-second' | 'counting' | 'result' | null>(null);
  const [additionStep, setAdditionStep] = useState<'overview' | 'complement-strategy' | 'moving-objects' | 'first-ten' | 'adding-rest' | 'final-result' | null>(null);
  const [countingProgress, setCountingProgress] = useState<number>(0);
  const [movingBlues, setMovingBlues] = useState<number>(0);
  const [showStrategy, setShowStrategy] = useState<boolean>(false);
  
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

  // Données des additions jusqu'à 20 avec animations
  const additionExamples = [
    { 
      first: 7, 
      second: 5, 
      result: 12,
      item1: '🔴', 
      item2: '🔵',
      description: 'addition avec passage de dizaine',
      strategy: 'complément à 10',
      explanation: 'Pour 7 + 5, je prends 3 de 5 pour faire 7 + 3 = 10, puis j\'ajoute les 2 qui restent : 10 + 2 = 12'
    },
    { 
      first: 6, 
      second: 6, 
      result: 12,
      item1: '🟢', 
      item2: '🟢',
      description: 'double de 6',
      strategy: 'doubles',
      explanation: '6 + 6 = 12. Les doubles sont faciles à retenir !'
    },
    { 
      first: 8, 
      second: 7, 
      result: 15,
      item1: '🟡', 
      item2: '🟣',
      description: 'addition avec passage de dizaine',
      strategy: 'complément à 10',
      explanation: 'Pour 8 + 7, je prends 2 de 7 pour faire 8 + 2 = 10, puis j\'ajoute les 5 qui restent : 10 + 5 = 15'
    },
    { 
      first: 9, 
      second: 6, 
      result: 15,
      item1: '🔴', 
      item2: '🔵',
      description: 'addition avec passage de dizaine',
      strategy: 'complément à 10',
      explanation: 'Pour 9 + 6, je prends 1 de 6 pour faire 9 + 1 = 10, puis j\'ajoute les 5 qui restent : 10 + 5 = 15'
    },
    { 
      first: 10, 
      second: 8, 
      result: 18,
      item1: '🟢', 
      item2: '🟡',
      description: 'addition avec 10',
      strategy: 'ajouter à 10',
      explanation: '10 + 8 = 18. Quand on ajoute à 10, c\'est très facile !'
    }
  ];

  // Exercices sur les additions jusqu'à 20
  const exercises = [
    { question: 'Calcule : 7 + 5 = ?', correctAnswer: '12', choices: ['11', '12', '13'], type: 'passage-dizaine' },
    { question: 'Calcule : 6 + 6 = ?', correctAnswer: '12', choices: ['11', '12', '13'], type: 'double' },
    { question: 'Calcule : 8 + 7 = ?', correctAnswer: '15', choices: ['14', '15', '16'], type: 'passage-dizaine' },
    { question: 'Calcule : 9 + 4 = ?', correctAnswer: '13', choices: ['12', '13', '14'], type: 'passage-dizaine' },
    { question: 'Calcule : 10 + 6 = ?', correctAnswer: '16', choices: ['15', '16', '17'], type: 'avec-10' },
    { question: 'Calcule : 5 + 8 = ?', correctAnswer: '13', choices: ['12', '13', '14'], type: 'passage-dizaine' },
    { question: 'Calcule : 9 + 9 = ?', correctAnswer: '18', choices: ['17', '18', '19'], type: 'double' },
    { question: 'Calcule : 7 + 8 = ?', correctAnswer: '15', choices: ['14', '15', '16'], type: 'passage-dizaine' },
    { question: 'Calcule : 10 + 9 = ?', correctAnswer: '19', choices: ['18', '19', '20'], type: 'avec-10' },
    { question: 'Calcule : 6 + 8 = ?', correctAnswer: '14', choices: ['13', '14', '15'], type: 'passage-dizaine' }
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
    
    setIsPlayingVocal(false);
    setIsAnimationRunning(false);
    setHighlightedElement(null);
    setAnimatingStep(null);
    setCurrentExample(null);
    setHighlightedNumber(null);
    setShowingProcess(null);
    setAdditionStep(null);
    setCountingProgress(0);
    setMovingBlues(0);
    setShowStrategy(false);
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

      // Sélectionner la MEILLEURE voix française féminine disponible
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
        voice.localService                                 // Voix système française
      ) || voices.find(voice => 
        voice.lang === 'fr-FR'                            // N'importe quelle voix fr-FR
      ) || voices.find(voice => 
        voice.lang.startsWith('fr')                       // N'importe quelle voix française
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
  const renderObjects = (count: number, item: string, isHighlighted = false) => {
    if (count <= 0) return null;
    
    const objects = [];
    for (let i = 0; i < count; i++) {
      objects.push(
        <span
          key={i}
          className={`text-4xl inline-block transition-all duration-500 ${
            isHighlighted ? 'animate-bounce scale-125' : ''
          } ${
            countingProgress > 0 && i < countingProgress ? 'text-green-500 scale-110' : ''
          }`}
          style={{ 
            animationDelay: `${i * 100}ms`
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

  // Fonction pour expliquer le chapitre principal avec la belle animation
  const explainChapter = async () => {
    stopAllVocalsAndAnimations();
    await wait(300);
    stopSignalRef.current = false;
    setIsAnimationRunning(true);
    setHasStarted(true);
    
    try {
      // 1. Objet du chapitre
      await playAudio("Bonjour ! Aujourd'hui, nous allons apprendre les additions jusqu'à 20 !", true);
      if (stopSignalRef.current) return;
      
      await wait(1200);
      await playAudio("C'est passionnant ! Nous allons découvrir des techniques magiques pour calculer facilement !", true);
      if (stopSignalRef.current) return;
      
      // 2. Montrer la vue d'ensemble
      await wait(1800);
      setHighlightedElement('concept-section');
      setCurrentExample(0);
      setAdditionStep('overview');
      const example = additionExamples[0];
      await playAudio(`Regardons ensemble comment faire ${example.first} plus ${example.second} !`, true);
      if (stopSignalRef.current) return;
      
      await wait(1500);
      await playAudio(`Voici mes objets : ${example.first} objets rouges et ${example.second} objets bleus.`, true);
      if (stopSignalRef.current) return;
      
      // 3. Expliquer la stratégie du complément à 10
      await wait(2000);
      setAdditionStep('complement-strategy');
      setShowStrategy(true);
      await playAudio("Je vais te montrer une astuce magique : le complément à 10 !", true);
      if (stopSignalRef.current) return;
      
      await wait(1500);
      await playAudio(`Au lieu de compter ${example.first} plus ${example.second}, je vais séparer les ${example.second} objets bleus.`, true);
      if (stopSignalRef.current) return;
      
      // Calculs dynamiques pour l'exemple
      const complement = 10 - example.first;
      const remaining = example.second - complement;
      
      await wait(1500);
      await playAudio(`Je prends ${complement} objets bleus pour compléter les ${example.first} rouges et faire 10.`, true);
      if (stopSignalRef.current) return;
      
      // 4. Animation du déplacement des objets bleus
      await wait(1000);
      setAdditionStep('moving-objects');
      await playAudio(`Regarde ! Les ${complement} objets bleus vont rejoindre les ${example.first} rouges.`, true);
      if (stopSignalRef.current) return;
      
      // Animation progressive du déplacement
      await wait(800);
      for (let i = 1; i <= complement; i++) {
        if (stopSignalRef.current) return;
        setMovingBlues(i);
        await playAudio(`${i}...`, true);
        await wait(600);
      }
      await playAudio("Maintenant j'ai 10 objets ensemble !", true);
      if (stopSignalRef.current) return;
      
      // 5. Montrer les 10 objets
      await wait(1500);
      setAdditionStep('first-ten');
      await playAudio(`${example.first} plus ${complement} égale 10 ! C'est beaucoup plus facile !`, true);
      if (stopSignalRef.current) return;
      
      // 6. Ajouter les restants
      await wait(1800);
      setAdditionStep('adding-rest');
      await playAudio(`Maintenant j'ajoute les ${remaining} objets bleus qui restent.`, true);
      if (stopSignalRef.current) return;
      
      await wait(1200);
      await playAudio(`10 plus ${remaining} égale ${example.result} !`, true);
      if (stopSignalRef.current) return;
      
      // 7. Résultat final
      await wait(1500);
      setAdditionStep('final-result');
      await playAudio(`Et voilà ! ${example.first} plus ${example.second} égale ${example.result}, grâce à l'astuce du complément à 10 !`, true);
      if (stopSignalRef.current) return;
      
      await wait(2000);
      await playAudio("Avec cette technique, tu peux additionner beaucoup plus facilement !", true);
      if (stopSignalRef.current) return;
      
      // 8. Présentation des autres exemples
      await wait(2500);
      setHighlightedNumber(null);
      setShowingProcess(null);
      setAdditionStep(null);
      setCountingProgress(0);
      setMovingBlues(0);
      setShowStrategy(false);
      setCurrentExample(null);
      setHighlightedElement(null);
      await playAudio("Parfait ! Maintenant tu comprends les additions jusqu'à 20 !", true);
      if (stopSignalRef.current) return;
      
      await wait(1200);
      await playAudio("Il y a plein d'autres additions et d'astuces à découvrir !", true);
      if (stopSignalRef.current) return;
      
      await wait(1500);
      setHighlightedElement('examples-section');
      scrollToSection('examples-section');
      await playAudio("Regarde ! Tu peux essayer avec d'autres nombres !", true);
      if (stopSignalRef.current) return;
      
      await wait(1200);
      await playAudio("Clique sur les exemples pour voir d'autres techniques !", true);
      if (stopSignalRef.current) return;
      
      await wait(800);
      setHighlightedElement(null);
    } finally {
      setHighlightedElement(null);
      setHighlightedNumber(null);
      setShowingProcess(null);
      setAnimatingStep(null);
      setCurrentExample(null);
      setAdditionStep(null);
      setCountingProgress(0);
      setMovingBlues(0);
      setShowStrategy(false);
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
      scrollToSection('concept-section');
      
      // Utiliser la même séquence que le chapitre principal mais adaptée
      await playAudio(`Je vais te montrer comment calculer ${example.first} plus ${example.second} avec l'astuce du complément à 10.`, true);
      if (stopSignalRef.current) return;
      
      await wait(1500);
      setAdditionStep('overview');
      await playAudio(`Voici mes objets : ${example.first} objets rouges et ${example.second} objets bleus.`, true);
      if (stopSignalRef.current) return;
      
      if (example.strategy === 'complément à 10') {
        // Calculs dynamiques pour cet exemple
        const complement = 10 - example.first;
        const remaining = example.second - complement;
        
      await wait(1500);
        setAdditionStep('complement-strategy');
        setShowStrategy(true);
        await playAudio("Je vais utiliser l'astuce du complément à 10 !", true);
        if (stopSignalRef.current) return;
      
      await wait(1500);
        await playAudio(`Au lieu de compter ${example.first} plus ${example.second}, je vais séparer les ${example.second} objets bleus.`, true);
        if (stopSignalRef.current) return;
      
      await wait(1500);
        await playAudio(`Je prends ${complement} objets bleus pour compléter les ${example.first} rouges et faire 10.`, true);
        if (stopSignalRef.current) return;
        
        // Animation du déplacement des objets bleus
        await wait(1000);
        setAdditionStep('moving-objects');
        await playAudio(`Regarde ! Les ${complement} objets bleus vont rejoindre les ${example.first} rouges.`, true);
        if (stopSignalRef.current) return;
        
        // Animation progressive du déplacement
        await wait(800);
        for (let i = 1; i <= complement; i++) {
          if (stopSignalRef.current) return;
          setMovingBlues(i);
          await playAudio(`${i}...`, true);
          await wait(600);
        }
        await playAudio("Maintenant j'ai 10 objets ensemble !", true);
        if (stopSignalRef.current) return;
        
        // Montrer les 10 objets
        await wait(1500);
        setAdditionStep('first-ten');
        await playAudio(`${example.first} plus ${complement} égale 10 ! C'est beaucoup plus facile !`, true);
        if (stopSignalRef.current) return;
        
        // Ajouter les restants
        await wait(1800);
        setAdditionStep('adding-rest');
        await playAudio(`Maintenant j'ajoute les ${remaining} objets bleus qui restent.`, true);
        if (stopSignalRef.current) return;
        
        await wait(1200);
        await playAudio(`10 plus ${remaining} égale ${example.result} !`, true);
        if (stopSignalRef.current) return;
        
        // Résultat final
        await wait(1500);
        setAdditionStep('final-result');
        await playAudio(`Et voilà ! ${example.first} plus ${example.second} égale ${example.result}, grâce à l'astuce du complément à 10 !`, true);
        if (stopSignalRef.current) return;
      } else {
        await wait(1500);
        setAdditionStep('final-result');
        await playAudio(example.explanation, true);
        if (stopSignalRef.current) return;
        
        await wait(1200);
        await playAudio(`${example.first} plus ${example.second} égale ${example.result} !`, true);
        if (stopSignalRef.current) return;
      }
      
      await wait(2000);
      setCurrentExample(null);
      setHighlightedNumber(null);
      setShowingProcess(null);
      setAnimatingStep(null);
      setAdditionStep(null);
      setCountingProgress(0);
      setMovingBlues(0);
      setShowStrategy(false);
    } finally {
      setCurrentExample(null);
      setHighlightedNumber(null);
      setShowingProcess(null);
      setAnimatingStep(null);
      setAdditionStep(null);
      setCountingProgress(0);
      setMovingBlues(0);
      setShowStrategy(false);
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
    if (percentage >= 90) return { title: "🎉 Champion des additions !", message: "Tu maîtrises parfaitement les additions jusqu'à 20 !", emoji: "🎉" };
    if (percentage >= 70) return { title: "👏 Très bien !", message: "Tu progresses super bien !", emoji: "👏" };
    if (percentage >= 50) return { title: "👍 C'est bien !", message: "Continue, tu apprends bien !", emoji: "😊" };
    return { title: "💪 Continue !", message: "Recommence pour mieux comprendre les additions !", emoji: "📚" };
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

  // Effet pour nettoyer lors du démontage
  useEffect(() => {
    return () => {
      stopAllVocalsAndAnimations();
    };
  }, []);

  if (!isClient) {
    return <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 flex items-center justify-center">
      <div className="text-xl">Chargement...</div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100">
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
            🧮 Additions jusqu'à 20
          </h1>
            <p className="text-lg text-gray-600">
              Découvre les techniques magiques pour calculer jusqu'à 20 !
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
                  ? 'bg-blue-500 text-white shadow-md' 
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
                  ? 'bg-blue-500 text-white shadow-md' 
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
                    : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:shadow-xl hover:scale-105'
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
                highlightedElement === 'concept-section' ? 'ring-4 ring-blue-400 bg-blue-50 scale-105' : ''
              }`}
            >
              <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
                🧮 Comment faire des additions jusqu'à 20 ?
              </h2>
              
              <div className="bg-blue-50 rounded-lg p-6 mb-6">
                <p className="text-lg text-center text-blue-800 font-semibold mb-6">
                  Découvre les techniques magiques pour calculer facilement !
                </p>
                
                <div className="bg-white rounded-lg p-6">
                  <div className="text-center mb-6">
                    <div className="text-2xl font-bold text-blue-600 mb-4">
                      {currentExample !== null ? 
                        `${additionExamples[currentExample].first} + ${additionExamples[currentExample].second} = ${additionExamples[currentExample].result}` 
                        : '7 + 5 = 12'
                      }
                    </div>
                    </div>

                  {/* Animation avec stratégie du complément à 10 intégrée */}
                  {currentExample !== null ? (
                    <div className="space-y-6">
                                              {/* Vue d'ensemble */}
                        {additionStep === 'overview' && (
                          <div className="bg-white rounded-lg p-6 border-2 border-gray-300">
                            <div className="text-lg text-gray-700 mb-4 text-center">Problème : {additionExamples[currentExample].first} + {additionExamples[currentExample].second} = ?</div>
                            <div className="text-lg text-gray-700 mb-4 text-center">Voici tous mes objets :</div>
                            <div className="flex flex-wrap gap-2 justify-center mb-4">
                              {/* Premier nombre d'objets rouges */}
                              {Array.from({ length: additionExamples[currentExample].first }, (_, i) => (
                                <span key={`red-${i}`} className="text-3xl border-2 border-red-300 rounded-lg p-1 bg-red-50">🔴</span>
                              ))}
                              {/* Deuxième nombre d'objets bleus */}
                              {Array.from({ length: additionExamples[currentExample].second }, (_, i) => (
                                <span key={`blue-${i}`} className="text-3xl border-2 border-blue-300 rounded-lg p-1 bg-blue-50">🔵</span>
                ))}
              </div>
                            <div className="text-xl font-bold text-gray-800 text-center">
                              <span className="text-red-600">{additionExamples[currentExample].first} objets rouges</span> + <span className="text-blue-600">{additionExamples[currentExample].second} objets bleus</span> = <span className="text-purple-600">?</span>
                </div>
                          </div>
                        )}

                                              {/* Animation fluide du complément à 10 */}
                        {(additionStep === 'complement-strategy' || additionStep === 'moving-objects' || additionStep === 'first-ten' || additionStep === 'adding-rest') && showStrategy && (() => {
                          const example = additionExamples[currentExample];
                          const complement = 10 - example.first; // Ce qu'il faut prendre du second pour faire 10
                          const remaining = example.second - complement; // Ce qui reste du second
                          
                          return (
                            <div className="bg-yellow-50 rounded-lg p-6 border-2 border-yellow-300">
                              <div className="text-center text-lg text-yellow-800 font-bold mb-4">🎯 Astuce magique : Complément à 10</div>
                              
                              {/* Animation continue sur une seule ligne */}
                              <div className="bg-white rounded-lg p-6 border-2 border-yellow-300">
                                <div className="flex justify-center items-center gap-4 mb-4">
                                  
                                  {/* Premier nombre d'objets rouges (deviennent 10 objets) */}
                                  <div className="text-center">
                                    <div className="text-sm text-red-700 mb-2">
                                      {(additionStep === 'complement-strategy' || additionStep === 'moving-objects') && `${example.first} objets rouges`}
                                      {(additionStep === 'first-ten' || additionStep === 'adding-rest') && `10 objets (${example.first}+${complement})`}
                    </div>
                                    <div className="flex gap-1 justify-center border-2 border-red-300 rounded-lg p-2 bg-red-50">
                                      {Array.from({ length: example.first }, (_, i) => (
                                        <span key={i} className="text-2xl">🔴</span>
                                      ))}
                                      {/* Bleus qui arrivent pour faire 10 */}
                                      {(additionStep === 'first-ten' || additionStep === 'adding-rest') && Array.from({ length: complement }, (_, i) => (
                                        <span key={`moved-${i}`} className="text-2xl animate-pulse">🔵</span>
                                      ))}
                    </div>
                                    {(additionStep === 'first-ten' || additionStep === 'adding-rest') && (
                                      <div className="text-green-700 font-bold mt-2">{example.first} + {complement} = 10 ✅</div>
                                    )}
                  </div>
                  
                  {/* Signe + */}
                                  <div className="text-3xl text-yellow-600 font-bold">+</div>

                                  {/* Deuxième nombre d'objets bleus (avec séparation progressive) */}
                                  <div className="text-center">
                                    <div className="text-sm text-blue-700 mb-2">
                                      {additionStep === 'complement-strategy' && `${example.second} objets bleus`}
                                      {additionStep === 'moving-objects' && `Les ${complement} vont faire 10...`}
                                      {additionStep === 'first-ten' && `${remaining} bleus restants`}
                                      {additionStep === 'adding-rest' && `${remaining} bleus restants`}
                    </div>
                                    <div className="flex gap-1 justify-center border-2 border-blue-300 rounded-lg p-2 bg-blue-50">
                                      {/* Les premiers bleus qui vont partir */}
                                      {additionStep === 'complement-strategy' && Array.from({ length: complement }, (_, i) => (
                                        <span key={i} className="text-2xl border-2 border-green-400 rounded bg-green-100 animate-pulse">🔵</span>
                                      ))}
                                      {additionStep === 'moving-objects' && Array.from({ length: complement }, (_, i) => (
                                        <span key={i} className={`text-2xl transition-all duration-1000 ${
                                          i < movingBlues ? 'opacity-30 scale-75 animate-ping' : 'border-2 border-green-400 rounded bg-green-100 animate-pulse'
                                        }`}>🔵</span>
                                      ))}
                                      {/* Les restants (toujours présents) */}
                                      {Array.from({ length: remaining }, (_, i) => (
                                        <span key={`remaining-${i}`} className={`text-2xl ${
                                          additionStep === 'adding-rest' ? 'animate-bounce scale-125 bg-orange-200 rounded-full' : ''
                                        }`}>🔵</span>
                                      ))}
                    </div>
                  </div>
                  
                  {/* Signe = */}
                                  <div className="text-3xl text-purple-600 font-bold">=</div>

                                  {/* Résultat progressif */}
                                  <div className="text-center">
                                    <div className="text-sm text-purple-700 mb-2">
                                      {additionStep === 'complement-strategy' && 'Résultat'}
                                      {additionStep === 'moving-objects' && 'En cours...'}
                                      {additionStep === 'first-ten' && '10 objets !'}
                                      {additionStep === 'adding-rest' && `${example.result} objets !`}
                    </div>
                                    <div className="border-2 border-purple-300 rounded-lg p-2 bg-purple-50 min-h-[60px] flex items-center justify-center">
                                      {additionStep === 'complement-strategy' && (
                                        <span className="text-2xl text-gray-400">?</span>
                                      )}
                                      {additionStep === 'moving-objects' && (
                                        <span className="text-lg text-purple-600 animate-pulse">En formation...</span>
                                      )}
                                      {additionStep === 'first-ten' && (
                                        <div className="flex gap-1">
                                          {Array.from({ length: 10 }, (_, i) => (
                                            <span key={i} className="text-lg animate-pulse">{i < example.first ? '🔴' : '🔵'}</span>
                                          ))}
                    </div>
                                      )}
                                      {additionStep === 'adding-rest' && (
                                        <div className="flex gap-1">
                                          {Array.from({ length: example.result }, (_, i) => (
                                            <span key={i} className="text-lg">{i < example.first ? '🔴' : '🔵'}</span>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                    {additionStep === 'adding-rest' && (
                                      <div className="text-orange-700 font-bold mt-2">10 + {remaining} = {example.result} ✅</div>
                                    )}
                  </div>
                </div>
                
                                {/* Formule du bas */}
                                <div className="text-center text-lg font-bold text-gray-700 border-t-2 border-yellow-200 pt-3">
                                  {additionStep === 'complement-strategy' && `${example.first} + ${example.second} = ?`}
                                  {additionStep === 'moving-objects' && `${example.first} + (${complement} + ${remaining}) = ?`}
                                  {additionStep === 'first-ten' && `(${example.first} + ${complement}) + ${remaining} = 10 + ${remaining}`}
                                  {additionStep === 'adding-rest' && `${example.first} + ${example.second} = (${example.first} + ${complement}) + ${remaining} = 10 + ${remaining} = ${example.result} 🎉`}
                      </div>
                  </div>
                            </div>
                          );
                        })()}

                      

                      {/* Résultat final */}
                      {additionStep === 'final-result' && currentExample !== null && (() => {
                        const example = additionExamples[currentExample];
                        const complement = 10 - example.first;
                        const remaining = example.second - complement;
                        
                        return (
                          <div className="bg-purple-100 rounded-lg p-6 border-2 border-purple-400 ring-4 ring-purple-400 scale-105">
                            <h4 className="text-2xl font-bold text-purple-800 mb-4 text-center">🎉 Résultat final !</h4>
                            <div className="bg-white rounded-lg p-4 mb-4">
                              <div className="text-center mb-4">
                                <div className="text-3xl font-bold text-purple-800 mb-2">{example.first} + {example.second} = {example.result}</div>
                                <div className="text-lg text-purple-600">
                                  {example.strategy === 'complément à 10' ? 'Grâce au complément à 10 !' : 
                                   example.strategy === 'doubles' ? 'Grâce aux doubles !' :
                                   example.strategy === 'ajouter à 10' ? 'Grâce à l\'addition à 10 !' : 'Excellent calcul !'}
                                </div>
                              </div>
                              <div className="flex flex-wrap gap-1 justify-center">
                                {Array.from({ length: example.result }, (_, i) => (
                                  <span key={i} className="text-lg animate-pulse">{i < example.first ? '🔴' : '🔵'}</span>
                                ))}
                              </div>
                            </div>
                            {example.strategy === 'complément à 10' && (
                              <div className="text-center bg-purple-200 rounded-lg p-4">
                                <div className="text-lg font-bold text-purple-800">
                                  {example.first} + {example.second} = {example.first} + ({complement} + {remaining}) = ({example.first} + {complement}) + {remaining} = 10 + {remaining} = {example.result} ! 🎯
                                </div>
                  </div>
                )}
                          </div>
                        );
                      })()}
                    </div>
                  ) : (
                    /* Version statique avec visualisation complète */
                    currentExample !== null ? (() => {
                      const example = additionExamples[currentExample];
                      
                      return (
                        <div className="space-y-8">
                          {/* Visualisation complète de l'exemple choisi */}
                          <div className="bg-gray-50 rounded-lg p-6">
                            <h4 className="text-lg font-bold text-center text-gray-800 mb-6">🧮 Visualisation de {example.first} + {example.second} = {example.result}</h4>
                            
                            {/* Montrer tous les objets ensemble */}
                            <div className="text-center mb-6">
                              <div className="bg-white rounded-lg p-6 border-2 border-gray-300">
                                <div className="text-lg text-gray-700 mb-4">Voici tous les objets ensemble :</div>
                                <div className="flex flex-wrap gap-2 justify-center mb-4">
                                  {/* Premier nombre d'objets rouges */}
                                  {Array.from({ length: example.first }, (_, i) => (
                                    <span key={`red-${i}`} className="text-3xl border-2 border-red-300 rounded-lg p-1 bg-red-50">🔴</span>
                                  ))}
                                  {/* Deuxième nombre d'objets bleus */}
                                  {Array.from({ length: example.second }, (_, i) => (
                                    <span key={`blue-${i}`} className="text-3xl border-2 border-blue-300 rounded-lg p-1 bg-blue-50">🔵</span>
                                  ))}
                  </div>
                                <div className="text-xl font-bold text-gray-800">
                                  <span className="text-red-600">{example.first} objets rouges</span> + <span className="text-blue-600">{example.second} objets bleus</span> = <span className="text-green-600">{example.result} objets en tout</span>
                                </div>
                              </div>
                            </div>

                            {/* Décomposition claire */}
                            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                              <div className="text-center p-4 bg-red-50 rounded-lg border-2 border-red-200">
                                <div className="text-sm text-gray-600 mb-2">{example.first} objets rouges</div>
                                <div className="flex flex-wrap gap-1 justify-center mb-2">
                                  {Array.from({ length: example.first }, (_, i) => (
                                    <span key={i} className="text-2xl">🔴</span>
                                  ))}
                                </div>
                                <div className="text-xl font-bold text-red-800">{example.first}</div>
                              </div>
                              <div className="text-center flex items-center justify-center">
                                <div className="text-4xl font-bold text-gray-600 bg-gray-200 rounded-full px-3 py-1">+</div>
                              </div>
                              <div className="text-center p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
                                <div className="text-sm text-gray-600 mb-2">{example.second} objets bleus</div>
                                <div className="flex flex-wrap gap-1 justify-center mb-2">
                                  {Array.from({ length: example.second }, (_, i) => (
                                    <span key={i} className="text-2xl">🔵</span>
                                  ))}
                                </div>
                                <div className="text-xl font-bold text-blue-800">{example.second}</div>
                              </div>
                              <div className="text-center flex items-center justify-center">
                                <div className="text-4xl font-bold text-gray-600 bg-gray-200 rounded-full px-3 py-1">=</div>
                              </div>
                              <div className="text-center p-4 bg-green-50 rounded-lg border-2 border-green-200">
                                <div className="text-sm text-gray-600 mb-2">{example.result} objets en tout</div>
                                <div className="flex flex-wrap gap-1 justify-center mb-2">
                                  {Array.from({ length: example.result }, (_, i) => (
                                    <span key={i} className="text-lg">{i < example.first ? '🔴' : '🔵'}</span>
                                  ))}
                                </div>
                                <div className="text-xl font-bold text-green-800">{example.result}</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })() : <div></div>
                  )}
                </div>
              </div>
            </div>

            {/* Autres exemples */}
            <div 
              id="examples-section"
              className={`bg-white rounded-xl p-8 shadow-lg transition-all duration-1000 ${
                highlightedElement === 'examples-section' ? 'ring-4 ring-green-400 bg-green-50 scale-105' : ''
              }`}
            >
              <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
                🌟 Autres exemples d'additions
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {additionExamples.map((example, index) => (
                  <div 
                    key={index}
                    className={`bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-6 transition-all duration-300 ${
                      isAnimationRunning 
                        ? 'opacity-50 cursor-not-allowed' 
                        : 'cursor-pointer hover:scale-105 hover:shadow-lg'
                    } ${currentExample === index ? 'ring-4 ring-purple-400 bg-purple-100' : ''}`}
                    onClick={isAnimationRunning ? undefined : () => explainSpecificExample(index)}
                  >
                    <div className="text-center">
                      <div className="flex justify-center space-x-2 mb-3">
                        <span className="text-2xl">{example.item1}</span>
                        <span className="text-2xl">{example.item2}</span>
                </div>
                      <div className="font-bold text-lg text-gray-800 mb-2">
                        {example.first} + {example.second} = {example.result}
                </div>
                      <div className="text-sm text-gray-600 mb-2">
                        {example.description}
                </div>
                      <div className={`text-xs px-2 py-1 rounded-full mb-3 ${
                        example.strategy === 'complément à 10' ? 'bg-blue-100 text-blue-800' :
                        example.strategy === 'doubles' ? 'bg-pink-100 text-pink-800' :
                        example.strategy === 'ajouter à 10' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {example.strategy}
              </div>
                <button
                        onClick={isAnimationRunning ? undefined : (e) => {
                          e.stopPropagation(); // Empêche le clic de remonter au div parent
                          stopAllVocalsAndAnimations();
                          explainSpecificExample(index);
                        }}
                        className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                          isAnimationRunning 
                            ? 'bg-gray-400 text-gray-200' 
                            : 'bg-blue-500 text-white hover:bg-blue-600'
                        }`}
                      >
                        {isAnimationRunning ? '⏳ Attendez...' : '▶️ Voir l\'animation'}
                </button>
              </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Stratégies d'addition */}
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
                🧠 Stratégies d'addition
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-blue-50 rounded-lg p-6 text-center">
                  <div className="text-4xl mb-4">🎯</div>
                  <h3 className="text-xl font-bold mb-3 text-blue-800">Complément à 10</h3>
                  <p className="text-blue-600">
                    Pour 7 + 5 : prends 3 de 5 pour faire 10, puis ajoute les 2 qui restent !
                  </p>
                  <div className="mt-3 p-2 bg-blue-100 rounded">
                    <span className="text-sm font-bold text-blue-800">7 + 3 = 10, puis 10 + 2 = 12</span>
                  </div>
                </div>
                
                <div className="bg-pink-50 rounded-lg p-6 text-center">
                  <div className="text-4xl mb-4">💕</div>
                  <h3 className="text-xl font-bold mb-3 text-pink-800">Les doubles</h3>
                  <p className="text-pink-600">
                    6 + 6 = 12, 7 + 7 = 14, 8 + 8 = 16, 9 + 9 = 18
                  </p>
                  <div className="mt-3 p-2 bg-pink-100 rounded">
                    <span className="text-sm font-bold text-pink-800">Faciles à retenir !</span>
                  </div>
                </div>
                
                <div className="bg-green-50 rounded-lg p-6 text-center">
                  <div className="text-4xl mb-4">➕</div>
                  <h3 className="text-xl font-bold mb-3 text-green-800">Ajouter à 10</h3>
                  <p className="text-green-600">
                    10 + 5 = 15, 10 + 8 = 18, 10 + 9 = 19
                  </p>
                  <div className="mt-3 p-2 bg-green-100 rounded">
                    <span className="text-sm font-bold text-green-800">Super facile !</span>
                  </div>
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
                  <RotateCcw className="inline w-4 h-4 mr-2" />
                  Recommencer
                      </button>
                    </div>
              
              {/* Barre de progression */}
              <div className="w-full bg-gray-200 rounded-full h-4 mb-3">
                <div 
                  className="bg-blue-500 h-4 rounded-full transition-all duration-500"
                  style={{ width: `${((currentExercise + 1) / exercises.length) * 100}%` }}
                ></div>
                  </div>
              
              {/* Score */}
              <div className="text-center">
                <div className="text-xl font-bold text-blue-600">
                  Score : {score}/{exercises.length}
                  </div>
                  </div>
                </div>

            {/* Question */}
            <div className="bg-white rounded-xl p-8 shadow-lg text-center">
              <h3 className="text-2xl font-bold mb-6 text-gray-900">
                    {exercises[currentExercise].question}
                  </h3>
                  
              {/* Badge du type */}
              <div className="flex justify-center mb-6">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  exercises[currentExercise].type === 'passage-dizaine' ? 'bg-blue-100 text-blue-800' :
                      exercises[currentExercise].type === 'double' ? 'bg-pink-100 text-pink-800' :
                  exercises[currentExercise].type === 'avec-10' ? 'bg-green-100 text-green-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {exercises[currentExercise].type === 'passage-dizaine' ? '🎯 Passage de dizaine' :
                   exercises[currentExercise].type === 'double' ? '💕 Double' :
                   exercises[currentExercise].type === 'avec-10' ? '➕ Avec 10' :
                   '📝 Calcul'}
                    </span>
                  </div>

              {/* Choix multiples */}
              <div className="grid grid-cols-1 gap-4 max-w-md mx-auto mb-8">
                {exercises[currentExercise].choices.map((choice) => (
                      <button
                    key={choice}
                    onClick={() => handleAnswerClick(choice)}
                    disabled={isCorrect !== null}
                    className={`p-6 rounded-lg font-bold text-3xl transition-all ${
                      userAnswer === choice
                        ? isCorrect === true
                          ? 'bg-green-500 text-white'
                          : isCorrect === false
                            ? 'bg-red-500 text-white'
                          : 'bg-blue-500 text-white'
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
                        <CheckCircle className="w-8 h-8" />
                        <span className="font-bold text-xl">
                          Excellent ! La réponse est bien {exercises[currentExercise].correctAnswer} !
                        </span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-8 h-8" />
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
                    className="bg-blue-500 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-blue-600 transition-colors"
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
                    <div className="bg-blue-100 rounded-lg p-4 mb-6">
                      <p className="text-xl font-bold text-gray-900">
                        Score : {finalScore}/{exercises.length}
                      </p>
                      <div className="text-4xl mt-2">
                        {finalScore >= 8 ? '⭐⭐⭐' : finalScore >= 6 ? '⭐⭐' : '⭐'}
                </div>
                      <p className="text-sm text-gray-600 mt-2">
                        Bravo ! Tu maîtrises les additions jusqu'à 20 !
                      </p>
              </div>
                    <div className="flex space-x-3">
                      <button
                        onClick={resetAll}
                        className="flex-1 bg-blue-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-600 transition-colors"
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