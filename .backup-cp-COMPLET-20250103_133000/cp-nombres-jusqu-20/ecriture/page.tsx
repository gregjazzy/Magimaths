'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, XCircle, RotateCcw, Volume2, Play, Pause } from 'lucide-react';

export default function EcritureNombresCP() {
  const [selectedNumber, setSelectedNumber] = useState(5);
  const [currentExercise, setCurrentExercise] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showExercises, setShowExercises] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredCorrectly, setAnsweredCorrectly] = useState<Set<number>>(new Set());
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  
  // États pour le système audio et animations
  const [isPlayingVocal, setIsPlayingVocal] = useState(false);
  const [highlightedElement, setHighlightedElement] = useState<string | null>(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [animatingPoints, setAnimatingPoints] = useState<number[]>([]);
  const [countingNumber, setCountingNumber] = useState<number | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [animatingWriting, setAnimatingWriting] = useState(false);
  const [writingStep, setWritingStep] = useState<string | null>(null);
  const [currentLetterIndex, setCurrentLetterIndex] = useState<number>(-1);
  const [exampleAnimating, setExampleAnimating] = useState(false);
  const [exampleLetterIndex, setExampleLetterIndex] = useState<number>(-1);

  // Refs pour contrôler les vocaux et animations
  const stopSignalRef = useRef(false);
  const currentAudioRef = useRef<SpeechSynthesisUtterance | null>(null);
  
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
    
    setIsPlayingVocal(false);
    setHighlightedElement(null);
    setAnimatingPoints([]);
    setCountingNumber(null);
    setAnimatingWriting(false);
    setWritingStep(null);
    setCurrentLetterIndex(-1);
    setExampleAnimating(false);
    setExampleLetterIndex(-1);
  };

  // Fonction pour scroller vers l'illustration
  const scrollToIllustration = () => {
    const element = document.getElementById('number-illustration');
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  // Fonction pour scroller vers le tableau des nombres
  const scrollToNumberChoice = () => {
    const element = document.getElementById('number-choice-grid');
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'center'
      });
    }
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
          console.warn('Speech synthesis not supported');
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
          if (!stopSignalRef.current) {
            resolve();
          }
        };

        utterance.onerror = (event) => {
          console.error('Erreur speech synthesis:', event);
          currentAudioRef.current = null;
          reject(event);
        };

        if (voices.length === 0) {
          speechSynthesis.addEventListener('voiceschanged', () => {
            if (!stopSignalRef.current) {
              speechSynthesis.speak(utterance);
            }
          }, { once: true });
        } else {
          speechSynthesis.speak(utterance);
        }

      } catch (error) {
        console.error('Erreur playAudio:', error);
        currentAudioRef.current = null;
        reject(error);
      }
    });
  };

  // Fonction d'attente avec vérification d'interruption
  const wait = (ms: number): Promise<void> => {
    return new Promise(resolve => {
      if (stopSignalRef.current) {
        resolve();
        return;
      }
      setTimeout(() => {
        if (!stopSignalRef.current) {
          resolve();
        }
      }, ms);
    });
  };

  // Fonction pour afficher les lettres avec épellation progressive
  const renderWordWithHighlight = (word: string, currentIndex: number) => {
    const letters = word.split('');
    return (
      <div className="flex flex-wrap justify-center gap-2 text-4xl font-bold">
        {letters.map((letter, index) => {
          let className = "px-3 py-2 rounded-lg transition-all duration-500 min-w-[50px] text-center ";
          
          if (index < currentIndex || currentIndex >= letters.length) {
            // Lettres déjà épelées (ou toutes finies) - en vert
            className += "bg-green-500 text-white scale-110 shadow-md";
          } else if (index === currentIndex) {
            // Lettre en cours d'épellation - en orange brillant (ou bleu pour le trait d'union)
            if (letter === '-') {
              className += "bg-blue-500 text-white scale-125 animate-pulse ring-4 ring-blue-300 shadow-lg";
            } else {
              className += "bg-orange-500 text-white scale-125 animate-bounce ring-4 ring-orange-300 shadow-lg";
            }
          } else {
            // Lettres pas encore épelées - en gris clair
            className += "bg-gray-300 text-gray-600 scale-95";
          }
          
          return (
            <span key={index} className={className}>
              {letter === '-' ? '–' : letter.toUpperCase()}
            </span>
          );
        })}
      </div>
    );
  };

  // Fonction pour animer l'exemple "cinq"
  const animateExample = async () => {
    setExampleAnimating(true);
    setExampleLetterIndex(-1);
    
    await playAudio("Regardons bien comment on épelle cinq :");
    if (stopSignalRef.current) return;
    await wait(800);
    
    // Épeller "cinq" dans l'exemple
    const letters = "cinq".split('');
    for (let i = 0; i < letters.length; i++) {
      if (stopSignalRef.current) break;
      
      setExampleLetterIndex(i);
      await playAudio(letters[i]);
      
      if (stopSignalRef.current) break;
      await wait(600);
    }
    
    // Montrer toutes les lettres
    setExampleLetterIndex(letters.length);
    
    if (stopSignalRef.current) return;
    await wait(800);
    
    await playAudio("CINQ ! Ça donne le chiffre 5 !");
    if (stopSignalRef.current) return;
    await wait(1500);
    
    // Revenir à l'affichage normal
    setExampleAnimating(false);
    setExampleLetterIndex(-1);
  };

  // Fonction pour expliquer le chapitre au démarrage
  const explainChapter = async () => {
    console.log('📖 explainChapter - Début explication');
    
    stopSignalRef.current = false;
    setIsPlayingVocal(true);
    setHasStarted(true);

    try {
      console.log('Début explainChapter - Écriture');
      
      await playAudio("Bonjour ! Bienvenue dans le chapitre sur l'écriture des nombres !");
      if (stopSignalRef.current) return;
      await wait(1200);
      
      await playAudio("Dans ce chapitre, tu vas apprendre quelque chose de très important !");
      if (stopSignalRef.current) return;
      await wait(1000);
      
      await playAudio("Tu vas apprendre à transformer les mots en chiffres, et les chiffres en mots !");
      if (stopSignalRef.current) return;
      await wait(1500);
      
      await playAudio("Par exemple, si je dis le mot 'huit', tu devras savoir l'écrire avec le chiffre 8 !");
      if (stopSignalRef.current) return;
      await wait(1800);
      
      await playAudio("Et si tu vois le chiffre 12, tu devras savoir que ça s'écrit 'douze' !");
      if (stopSignalRef.current) return;
      await wait(1800);
      
      // Démonstration avec l'exemple
      setHighlightedElement('example-section');
      await playAudio("Regarde bien cet exemple : le mot 'cinq' devient le chiffre 5 !");
      if (stopSignalRef.current) return;
      await wait(1500);
      
      // Animer l'exemple avec épellation
      await animateExample();
      if (stopSignalRef.current) return;
      
      await playAudio("C'est exactement ce que tu vas apprendre à faire !");
      if (stopSignalRef.current) return;
      await wait(1200);
      
      await playAudio("Je vais même t'aider en épelant chaque mot lettre par lettre !");
      if (stopSignalRef.current) return;
      await wait(1500);
      
      await playAudio("Comme ça, tu retiendras bien comment écrire chaque nombre !");
      if (stopSignalRef.current) return;
      await wait(1500);
      
      // Transition vers les choix
      setHighlightedElement(null);
      await wait(800);
      
      await playAudio("Maintenant, on va passer à la pratique !");
      if (stopSignalRef.current) return;
      await wait(1000);
      
      scrollToNumberChoice();
      setHighlightedElement('number-choice');
      await playAudio("Voici tous les nombres que tu peux explorer !");
      if (stopSignalRef.current) return;
      await wait(1200);
      
      await playAudio("Tu peux choisir n'importe quel nombre de 1 à 20 !");
      if (stopSignalRef.current) return;
      await wait(1500);
      
      await playAudio("Pour chaque nombre que tu choisis, je vais faire 3 choses :");
      if (stopSignalRef.current) return;
      await wait(1500);
      
      await playAudio("D'abord, je te dirai comment ça s'écrit en lettres !");
      if (stopSignalRef.current) return;
      await wait(1500);
      
      await playAudio("Ensuite, je vais épeler le mot lettre par lettre pour que tu retiennes bien !");
      if (stopSignalRef.current) return;
      await wait(1800);
      
      await playAudio("Et enfin, je te montrerai le chiffre qui correspond !");
      if (stopSignalRef.current) return;
      await wait(1500);
      
      setHighlightedElement(null);
      await playAudio("Alors, quel nombre veux-tu découvrir en premier ?");
      if (stopSignalRef.current) return;
      await wait(2000);

    } catch (error) {
      console.error('Erreur dans explainChapter:', error);
    } finally {
      console.log('📖 explainChapter - Fin (normale ou interrompue)');
      setIsPlayingVocal(false);
      setHighlightedElement(null);
      setExampleAnimating(false);
      setExampleLetterIndex(-1);
    }
  };

  // Fonction pour expliquer un nombre spécifique (focus sur l'écriture)
  const explainNumber = async (number: number) => {
    console.log(`🔢 explainNumber(${number}) - Début, arrêt des animations précédentes`);
    
    // Arrêter toute animation/vocal en cours (y compris "Démarrer")
    stopAllVocalsAndAnimations();
    
    // Attendre un délai plus long pour s'assurer que l'arrêt est effectif
    await wait(300);
    
    // Vérifier une dernière fois si quelque chose joue encore
    if (speechSynthesis.speaking || speechSynthesis.pending) {
      speechSynthesis.cancel();
      await wait(100);
    }
    
    stopSignalRef.current = false;
    setIsPlayingVocal(true);
    setAnimatingWriting(true);
    setWritingStep('showing');
    
    try {
      scrollToIllustration();
      
      const word = numberWords[number as keyof typeof numberWords];
      await playAudio(`Le nombre ${number} !`);
      if (stopSignalRef.current) return;
      await wait(800);
      
      setWritingStep('word');
      await playAudio(`En lettres, ça s'écrit : ${word} !`);
      if (stopSignalRef.current) return;
      await wait(800);
      
      // ÉPELLATION lettre par lettre
      setWritingStep('spelling');
      setCurrentLetterIndex(-1);  // Commencer sans aucune lettre en surbrillance
      await playAudio(`Épelons ensemble :`);
      if (stopSignalRef.current) return;
      await wait(500);

      // Épeler chaque lettre du mot avec illustration visuelle
      const letters = word.split('');
      for (let i = 0; i < letters.length; i++) {
        if (stopSignalRef.current) break;
        
        // Mettre en évidence la lettre courante
        setCurrentLetterIndex(i);
        const letter = letters[i];
        
        if (letter === '-') {
          await playAudio(`trait d'union`);
        } else {
          await playAudio(letter);
        }
        
        if (stopSignalRef.current) break;
        await wait(600);  // Un peu plus long pour voir la lettre
      }
      
      // Montrer toutes les lettres à la fin
      setCurrentLetterIndex(letters.length);
      
      if (stopSignalRef.current) return;
      await wait(1000);  // Plus long pour admirer le mot complet
      
      await playAudio(`Parfait ! Tu as appris à épeler ${word} !`);
      if (stopSignalRef.current) return;
      await wait(1200);
      
      setWritingStep('digit');
      await playAudio(`En chiffres, ça s'écrit : ${number} !`);
      if (stopSignalRef.current) return;
      await wait(1000);
      
      setWritingStep('final');
      await playAudio(`Parfait ! ${word} correspond au chiffre ${number} !`);
      if (stopSignalRef.current) return;
      await wait(1200);
      
      await playAudio("Tu peux choisir un autre nombre pour continuer à apprendre l'écriture !");
      
    } catch (error) {
      console.error('Erreur dans explainNumber:', error);
    } finally {
      console.log('🔢 explainNumber - Fin (normale ou interrompue)');
      setIsPlayingVocal(false);
      setAnimatingWriting(false);
      setWritingStep(null);
      setCurrentLetterIndex(-1);
      setExampleAnimating(false);
      setExampleLetterIndex(-1);
    }
  };

  // Fonction pour rendre les cercles CSS - SIMPLE
  const renderCircles = (number: number) => {
    if (!number || number > 20) return null;

    const circles = [];
    
    // Créer simplement le bon nombre de cercles rouges
    for (let i = 1; i <= number; i++) {
      const isAnimated = animatingPoints.includes(i);
      
      circles.push(
        <div
          key={i}
          className={`inline-block w-8 h-8 rounded-full mx-1 my-1 transition-all duration-300 bg-red-500 ${
            isAnimated ? 'ring-4 ring-yellow-400 bg-yellow-300 animate-bounce scale-125' : ''
          }`}
        />
      );
    }
    
    return circles;
  };

  // Initialisation côté client
  useEffect(() => {
    setIsClient(true);
  }, []);

  // EFFET pour arrêter les audios lors du changement de page/onglet
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopAllVocalsAndAnimations();
      }
    };

    const handleBeforeUnload = () => {
      stopAllVocalsAndAnimations();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      stopAllVocalsAndAnimations();
    };
  }, []);

  // EFFET pour gérer les changements d'onglet interne (cours ↔ exercices)
  useEffect(() => {
    stopAllVocalsAndAnimations();
    setHasStarted(false);
  }, [showExercises]);

  // Sauvegarder les progrès
  const saveProgress = (score: number, maxScore: number) => {
    const progress = {
      sectionId: 'ecriture',
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
      const existingIndex = allProgress.findIndex((p: any) => p.sectionId === 'ecriture');
      
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

  // Correspondances nombres/mots
  const numberWords = {
    1: 'un', 2: 'deux', 3: 'trois', 4: 'quatre', 5: 'cinq',
    6: 'six', 7: 'sept', 8: 'huit', 9: 'neuf', 10: 'dix',
    11: 'onze', 12: 'douze', 13: 'treize', 14: 'quatorze', 15: 'quinze',
    16: 'seize', 17: 'dix-sept', 18: 'dix-huit', 19: 'dix-neuf', 20: 'vingt'
  };

  // Exercices d'écriture
  const exercises = [
    { question: 'Écris en chiffres : cinq', correctAnswer: '5', choices: ['5', '4', '6'], word: 'cinq' },
    { question: 'Écris en chiffres : huit', correctAnswer: '8', choices: ['8', '7', '9'], word: 'huit' },
    { question: 'Écris en chiffres : douze', correctAnswer: '12', choices: ['12', '11', '13'], word: 'douze' },
    { question: 'Écris en chiffres : quinze', correctAnswer: '15', choices: ['15', '14', '16'], word: 'quinze' },
    { question: 'Écris en chiffres : trois', correctAnswer: '3', choices: ['3', '2', '4'], word: 'trois' },
    { question: 'Écris en chiffres : dix-sept', correctAnswer: '17', choices: ['17', '16', '18'], word: 'dix-sept' },
    { question: 'Écris en chiffres : neuf', correctAnswer: '9', choices: ['9', '8', '10'], word: 'neuf' },
    { question: 'Écris en chiffres : onze', correctAnswer: '11', choices: ['11', '10', '12'], word: 'onze' },
    { question: 'Écris en chiffres : six', correctAnswer: '6', choices: ['6', '5', '7'], word: 'six' },
    { question: 'Écris en chiffres : quatorze', correctAnswer: '14', choices: ['14', '13', '15'], word: 'quatorze' },
    { question: 'Écris en chiffres : vingt', correctAnswer: '20', choices: ['20', '19', '21'], word: 'vingt' },
    { question: 'Écris en chiffres : treize', correctAnswer: '13', choices: ['13', '12', '14'], word: 'treize' },
    { question: 'Écris en chiffres : dix-huit', correctAnswer: '18', choices: ['18', '17', '19'], word: 'dix-huit' },
    { question: 'Écris en chiffres : sept', correctAnswer: '7', choices: ['7', '6', '8'], word: 'sept' },
    { question: 'Écris en chiffres : seize', correctAnswer: '16', choices: ['16', '15', '17'], word: 'seize' }
  ];

  // Initialiser les choix mélangés pour l'exercice actuel
  const initializeShuffledChoices = () => {
    const currentChoices = exercises[currentExercise].choices;
    const shuffled = shuffleArray(currentChoices);
    setShuffledChoices(shuffled);
  };

  // Effet pour mélanger les choix quand on change d'exercice
  useEffect(() => {
    if (exercises.length > 0) {
      initializeShuffledChoices();
    }
  }, [currentExercise]);

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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/chapitre/cp-nombres-jusqu-20" 
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour au chapitre</span>
          </Link>
          
          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              ✍️ Écrire les nombres
            </h1>
            <p className="text-lg text-gray-600">
              Apprends à écrire les nombres en chiffres !
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
                  ? 'bg-orange-500 text-white shadow-md' 
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
                  ? 'bg-orange-500 text-white shadow-md' 
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
            {/* Bouton Démarrer toujours visible */}
            <div className="text-center mb-8">
              <button
                onClick={explainChapter}
                disabled={isPlayingVocal}
                className={`bg-gradient-to-r from-orange-500 to-red-500 text-white px-12 py-6 rounded-2xl font-bold text-3xl shadow-2xl hover:shadow-3xl transition-all transform hover:scale-105 ${
                  isPlayingVocal ? 'opacity-75 cursor-not-allowed animate-pulse' : 'hover:from-orange-600 hover:to-red-600 animate-bounce'
                }`}
                style={{
                  animationDuration: isPlayingVocal ? '1s' : '2s',
                  animationIterationCount: 'infinite'
                }}
              >
                <Volume2 className={`inline w-8 h-8 mr-4 ${isPlayingVocal ? 'animate-spin' : ''}`} />
                {isPlayingVocal ? '🎤 JE PARLE...' : (hasStarted ? '🔄 RECOMMENCER !' : '🎉 DÉMARRER !')}
              </button>
              <p className="text-lg text-gray-600 mt-4 font-semibold">
                {isPlayingVocal 
                  ? "🔊 Écoute bien l'explication..." 
                  : (hasStarted 
                    ? "Clique pour réécouter l'explication !" 
                    : "Clique ici pour commencer ton aventure avec l'écriture des nombres !")}
              </p>
            </div>

            {/* Indicateur audio global */}
            {hasStarted && isPlayingVocal && (
              <div className="fixed top-4 right-4 bg-orange-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-pulse">
                <Volume2 className="inline w-5 h-5 mr-2 animate-spin" />
                🎤 Audio en cours...
              </div>
            )}

            {/* Introduction */}
            <div 
              id="example-section"
              className={`bg-white rounded-xl p-8 shadow-lg transition-all duration-500 ${
                highlightedElement === 'example-section' ? 'ring-4 ring-yellow-400 bg-yellow-50 scale-105' : ''
              }`}
            >
              <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
                🤔 Pourquoi apprendre à écrire les nombres ?
              </h2>
              
              <div className="bg-orange-50 rounded-lg p-6 mb-6">
                <p className="text-lg text-center text-orange-800 font-semibold mb-4">
                  Savoir écrire les nombres en chiffres, c'est très important pour les maths !
                </p>
                
                <div className="bg-white rounded-lg p-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600 mb-2">
                      Exemple : "cinq" → 5
                  </div>
                    <div className="text-xl text-gray-700 mb-4">
                      Le mot devient un chiffre
                </div>

                    {/* Animation des lettres pour l'exemple */}
                    {exampleAnimating ? (
                      <div className="mb-4">
                        {renderWordWithHighlight("cinq", exampleLetterIndex)}
                  </div>
                    ) : (
                      <div className="text-2xl font-bold text-purple-600 mb-4">
                        CINQ
                </div>
                    )}
                    
                    <div className="text-lg text-gray-600">
                      {renderCircles(5)} = 5
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sélecteur de nombre */}
            <div 
              id="number-choice-grid"
              className={`bg-white rounded-xl p-8 shadow-lg transition-all duration-500 ${
                highlightedElement === 'number-choice' ? 'ring-4 ring-yellow-400 bg-yellow-50 scale-105' : ''
              }`}
            >
              <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
                🎯 Choisis un nombre pour voir son écriture
              </h2>
              
              <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-10 gap-3 mb-6">
                {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (
                  <button
                    key={num}
                    onClick={() => {
                      setSelectedNumber(num);
                      explainNumber(num);
                    }}
                    className={`p-3 rounded-lg font-bold text-lg transition-all min-h-[44px] min-w-[44px] ${
                      selectedNumber === num
                        ? 'bg-orange-500 text-white shadow-lg scale-105'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            {/* Affichage détaillé */}
            <div 
              id="number-illustration"
              className={`bg-white rounded-xl p-8 shadow-lg transition-all duration-500 ${
                animatingWriting ? 'ring-4 ring-orange-400 bg-orange-50 scale-105' : ''
              }`}
            >
              <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
                🔍 Analyse du nombre {selectedNumber}
              </h2>
              
              <div className="bg-yellow-50 rounded-lg p-6">
                <div className="text-center space-y-6">
                  <div className={`text-6xl font-bold text-yellow-600 transition-all duration-500 ${
                    writingStep === 'digit' ? 'ring-4 ring-yellow-400 bg-yellow-200 rounded-lg p-4 scale-110' : ''
                  }`}>
                    {selectedNumber}
                  </div>
                  
                  <div className={`text-4xl font-bold text-orange-600 transition-all duration-500 ${
                    writingStep === 'word' ? 'ring-4 ring-orange-400 bg-orange-200 rounded-lg p-4 scale-110' : ''
                  }`}>
                    {numberWords[selectedNumber as keyof typeof numberWords]}
                            </div>
                  
                  <div className="bg-white rounded-lg p-6">
                    {/* Affichage simplifié - focus sur l'écriture */}
                    <div className={`mb-4 flex flex-wrap justify-center gap-1 min-h-[40px] transition-all duration-500 ${
                      writingStep === 'showing' ? 'ring-4 ring-blue-400 bg-blue-50 rounded-lg p-2' : ''
                    }`}>
                      {/* Affichage minimaliste - juste pour montrer la quantité */}
                      {selectedNumber <= 10 ? renderCircles(selectedNumber) : (
                        <div className="text-lg text-gray-600">
                          {selectedNumber} objets
                          </div>
                      )}
                        </div>

                    {writingStep === 'spelling' && (
                      <div className="mb-4 p-4 bg-purple-100 rounded-lg">
                        <div className="text-lg font-bold text-purple-600 mb-3 text-center">
                          📝 Épelons lettre par lettre :
                        </div>
                        {renderWordWithHighlight(numberWords[selectedNumber as keyof typeof numberWords], currentLetterIndex)}
                      </div>
                    )}
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className={`bg-orange-100 rounded-lg p-4 transition-all duration-500 ${
                        writingStep === 'digit' || writingStep === 'final' ? 'ring-2 ring-orange-400 scale-105' : ''
                      }`}>
                        <div className="font-bold text-orange-800 mb-2">En chiffres :</div>
                        <div className="text-3xl font-bold text-orange-600">{selectedNumber}</div>
                            </div>
                      
                      <div className={`bg-yellow-100 rounded-lg p-4 transition-all duration-500 ${
                        writingStep === 'word' || writingStep === 'final' ? 'ring-2 ring-yellow-400 scale-105' : ''
                      }`}>
                        <div className="font-bold text-yellow-800 mb-2">En lettres :</div>
                        <div className="text-2xl font-bold text-yellow-600">
                          {numberWords[selectedNumber as keyof typeof numberWords]}
                        </div>
                      </div>
                    </div>

                    {writingStep === 'final' && (
                      <div className="mt-4 p-3 bg-green-100 rounded-lg border-2 border-green-300 animate-pulse">
                        <p className="text-lg font-bold text-green-800 text-center">
                          ✅ Parfait ! {numberWords[selectedNumber as keyof typeof numberWords]} = {selectedNumber} !
                        </p>
                      </div>
                    )}
                    </div>
                    </div>
                  </div>
            </div>

            {/* Tableau de correspondance */}
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
                📊 Tableau de correspondance
              </h2>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(numberWords).map(([num, word]) => (
                  <div key={num} className="bg-gradient-to-r from-orange-100 to-yellow-100 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-orange-600 mb-2">
                      {num}
                    </div>
                    <div className="text-lg font-semibold text-yellow-700">
                      {word}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Nombres difficiles */}
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
                ⚠️ Nombres à retenir
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-red-50 rounded-lg p-6">
                  <h3 className="text-xl font-bold mb-4 text-red-800">
                    🔥 Les plus difficiles
                    </h3>
                    <div className="space-y-3">
                      {[
                      { num: '11', word: 'onze' },
                      { num: '12', word: 'douze' },
                      { num: '13', word: 'treize' },
                      { num: '14', word: 'quatorze' },
                      { num: '15', word: 'quinze' },
                      { num: '16', word: 'seize' }
                    ].map((item, index) => (
                      <div key={index} className="bg-white rounded-lg p-3 flex justify-between">
                        <span className="font-bold text-red-600">{item.num}</span>
                        <span className="text-gray-700">{item.word}</span>
                      </div>
                      ))}
                    </div>
                  </div>

                <div className="bg-blue-50 rounded-lg p-6">
                  <h3 className="text-xl font-bold mb-4 text-blue-800">
                    📝 Avec trait d'union
                    </h3>
                    <div className="space-y-3">
                      {[
                      { num: '17', word: 'dix-sept' },
                      { num: '18', word: 'dix-huit' },
                      { num: '19', word: 'dix-neuf' }
                    ].map((item, index) => (
                      <div key={index} className="bg-white rounded-lg p-3 flex justify-between">
                        <span className="font-bold text-blue-600">{item.num}</span>
                        <span className="text-gray-700">{item.word}</span>
                      </div>
                    ))}
                  </div>
                    </div>
                  </div>
                </div>

            {/* Conseils */}
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
                💡 Trucs pour retenir
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-green-50 rounded-lg p-6">
                  <h3 className="text-xl font-bold mb-4 text-green-800">
                    🎯 Méthodes
                  </h3>
                  <ul className="space-y-2 text-green-700">
                    <li>• Lis le mot à voix haute</li>
                    <li>• Compte avec tes doigts</li>
                    <li>• Écris plusieurs fois le chiffre</li>
                    <li>• Associe à des objets familiers</li>
                  </ul>
                </div>

                <div className="bg-purple-50 rounded-lg p-6">
                  <h3 className="text-xl font-bold mb-4 text-purple-800">
                    🧠 Astuces
                  </h3>
                  <ul className="space-y-2 text-purple-700">
                    <li>• "onze" ressemble à "1+1"</li>
                    <li>• "quinze" → "quin" = 15</li>
                    <li>• "dix-sept" = 10 + 7</li>
                    <li>• Fais des groupes de mots similaires</li>
                  </ul>
                  </div>
              </div>
            </div>

            {/* Mini-jeu */}
            <div className="bg-gradient-to-r from-orange-400 to-yellow-400 rounded-xl p-6 text-white">
              <h3 className="text-xl font-bold mb-3">🎮 Mini-jeu : Écris en chiffres !</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { word: 'trois', answer: '3' },
                  { word: 'huit', answer: '8' },
                  { word: 'douze', answer: '12' },
                  { word: 'seize', answer: '16' }
                ].map((item, index) => (
                  <div key={index} className="bg-white bg-opacity-20 rounded-lg p-3 text-center">
                    <div className="font-bold mb-2">{item.word}</div>
                    <div className="text-2xl font-bold">{item.answer}</div>
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
                  className="bg-orange-500 h-4 rounded-full transition-all duration-500"
                  style={{ width: `${((currentExercise + 1) / exercises.length) * 100}%` }}
                ></div>
              </div>
              
              {/* Score */}
              <div className="text-center">
                <div className="text-xl font-bold text-orange-600">
                  Score : {score}/{exercises.length}
                </div>
              </div>
            </div>

            {/* Question */}
            <div className="bg-white rounded-xl p-8 shadow-lg text-center">
              <h3 className="text-2xl font-bold mb-8 text-gray-900">
                {exercises[currentExercise].question}
              </h3>
              
              {/* Affichage du mot */}
              <div className="bg-orange-50 rounded-lg p-6 mb-8">
                <div className="text-6xl font-bold text-orange-600 mb-4">
                  {exercises[currentExercise].word}
                </div>
                <p className="text-lg text-gray-700 font-semibold">
                  Écris ce nombre en chiffres !
                </p>
              </div>
              
              {/* Choix multiples */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-md mx-auto mb-8">
                {shuffledChoices.map((choice) => (
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
                            : 'bg-orange-500 text-white'
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
                          Excellent ! "{exercises[currentExercise].word}" = {exercises[currentExercise].correctAnswer} !
                        </span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-8 h-8" />
                        <span className="font-bold text-xl">
                          Pas tout à fait... "{exercises[currentExercise].word}" = {exercises[currentExercise].correctAnswer} !
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
                              "{exercises[currentExercise].word}" s'écrit {exercises[currentExercise].correctAnswer}
                        </div>
                            <div className="mb-4 flex justify-center items-center min-h-[40px]">
                              {parseInt(exercises[currentExercise].correctAnswer) <= 10 ? (
                                <div className="flex flex-wrap justify-center gap-1">
                                  {renderCircles(parseInt(exercises[currentExercise].correctAnswer))}
                        </div>
                              ) : (
                                <div className="text-2xl font-bold text-gray-600">
                                  {exercises[currentExercise].correctAnswer} objets
                      </div>
                              )}
                    </div>
                            <div className="text-lg text-gray-700">
                              Vois-tu la correspondance entre le mot et le chiffre ?
                          </div>
                        </div>
                        
                        <div className="bg-gradient-to-r from-orange-100 to-yellow-100 rounded-lg p-3 text-center">
                          <div className="text-lg">🌟</div>
                          <p className="text-sm font-semibold text-orange-800">
                            Maintenant tu sais écrire "{exercises[currentExercise].word}" !
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
                    className="bg-orange-500 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-orange-600 transition-colors"
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
                  if (percentage >= 90) return { title: "🎉 Expert de l'écriture des nombres !", message: "Tu maîtrises parfaitement !", emoji: "🎉" };
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
                    <div className="bg-orange-100 rounded-lg p-4 mb-6">
                      <p className="text-xl font-bold text-gray-900">
                        Score : {finalScore}/{exercises.length}
                      </p>
                      <div className="text-4xl mt-2">
                        {finalScore >= 12 ? '⭐⭐⭐' : finalScore >= 8 ? '⭐⭐' : '⭐'}
                      </div>
                      <p className="text-sm text-gray-600 mt-2">
                        Savoir écrire les nombres est très important !
                      </p>
                    </div>
                    <div className="flex space-x-3">
                      <button
                        onClick={resetAll}
                        className="flex-1 bg-orange-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-orange-600 transition-colors"
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