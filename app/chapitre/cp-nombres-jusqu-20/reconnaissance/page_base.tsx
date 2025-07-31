'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, XCircle, RotateCcw, Volume2 } from 'lucide-react';

export default function ReconnaissanceNombresCP() {
  const [selectedNumber, setSelectedNumber] = useState('5');
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
  const [samSizeExpanded, setSamSizeExpanded] = useState(false); // Pour garder la taille de Sam
  const [animatingPoints, setAnimatingPoints] = useState<number[]>([]);
  const [countingNumber, setCountingNumber] = useState<number | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [numbersData, setNumbersData] = useState<any>({});
  const [exercises, setExercises] = useState<any[]>([]);
  const [animatingFingers, setAnimatingFingers] = useState(false);
  const [animatingGroups, setAnimatingGroups] = useState(false);
  const [animatingStep, setAnimatingStep] = useState<string | null>(null);
  const [fingerCount, setFingerCount] = useState(0);
  
  // États pour les exercices améliorés avec Sam le Pirate
  const [exerciseStarted, setExerciseStarted] = useState(false);
  const [showNextButton, setShowNextButton] = useState(false);
  const [highlightNextButton, setHighlightNextButton] = useState(false);
  const [isExplainingError, setIsExplainingError] = useState(false);
  
  // États pour l'introduction de Sam le Pirate
  const [pirateIntroStarted, setPirateIntroStarted] = useState(false);
  const [showExercisesList, setShowExercisesList] = useState(false);
  const [highlightNumber3, setHighlightNumber3] = useState(false);
  const [showFinalNumber, setShowFinalNumber] = useState(false);
  const [finalNumber, setFinalNumber] = useState<string>('');
  
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

  // Sauvegarder les progrès
  const saveProgress = (score: number, maxScore: number) => {
    const progress = {
      sectionId: 'reconnaissance',
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
      const existingIndex = allProgress.findIndex((p: any) => p.sectionId === 'reconnaissance');
      
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

  // Fonction pour arrêter tous les vocaux et animations
  const stopAllVocalsAndAnimations = () => {
    stopSignalRef.current = true;
    if (currentAudioRef.current) {
      speechSynthesis.cancel();
      currentAudioRef.current = null;
    }
    setIsPlayingVocal(false);
    setHighlightedElement(null);
    setAnimatingPoints([]);
    setCountingNumber(null);
    setAnimatingFingers(false);
    setAnimatingGroups(false);
    setAnimatingStep(null);
    setFingerCount(0);
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
    const element = document.getElementById('number-choice-table');
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'center'
      });
    }
  };

  // Fonction pour scroller vers les méthodes de comptage
  const scrollToCountingMethods = () => {
    const element = document.getElementById('counting-methods-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // Fonction pour jouer un audio avec gestion d'interruption
  const playAudio = (text: string): Promise<void> => {
    return new Promise((resolve) => {
      if (stopSignalRef.current) {
        resolve();
        return;
      }

      // Vérifier si l'API est disponible
      if (typeof speechSynthesis === 'undefined') {
        console.warn('SpeechSynthesis API non disponible');
        resolve();
        return;
      }
      
      speechSynthesis.cancel();
      
      // Fonction pour créer et jouer l'utterance
      const createAndPlayUtterance = () => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'fr-FR';
        utterance.rate = 0.8;  // Plus lent pour être plus naturel
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
        
        utterance.onerror = (event) => {
          console.error('Erreur audio:', event);
          currentAudioRef.current = null;
          resolve();
        };
        
        console.log('Lancement audio:', text);
          speechSynthesis.speak(utterance);
      };

      // Attendre que les voix soient chargées
      if (speechSynthesis.getVoices().length === 0) {
        speechSynthesis.addEventListener('voiceschanged', function handler() {
          speechSynthesis.removeEventListener('voiceschanged', handler);
          createAndPlayUtterance();
        });
            } else {
        createAndPlayUtterance();
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

  // Fonction pour rendre les cercles CSS - SIMPLE
  const renderCircles = (number: string) => {
    const count = parseInt(number);
    console.log('renderCircles appelé avec:', number, 'count:', count);
    
    if (!count || count > 20) {
      console.log('Retourne null pour count:', count);
      return null;
    }

    const circles = [];
    
    // Créer simplement le bon nombre de cercles rouges
    for (let i = 1; i <= count; i++) {
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
    
    console.log('Retourne', circles.length, 'cercles');
    return circles;
  };


  
  // Fonction pour expliquer le chapitre au démarrage
  const explainChapter = async () => {
    stopSignalRef.current = false;
      setIsPlayingVocal(true);
    setHasStarted(true);

    try {
      // Détection Chrome locale pour l'audio
      const isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
      console.log('Début explainChapter - Chrome:', isChrome);
      
      if (isChrome) {
        // Pour Chrome : activation plus agressive
        speechSynthesis.cancel();
        await new Promise(resolve => setTimeout(resolve, 200));
        
        // Vérification des voix pour Chrome
        let voices = speechSynthesis.getVoices();
        if (voices.length === 0) {
          console.log('Attente des voix Chrome...');
          await new Promise((resolve) => {
            const checkVoices = () => {
              voices = speechSynthesis.getVoices();
              if (voices.length > 0) {
                console.log('Voix Chrome chargées:', voices.length);
                resolve(voices);
              } else {
                setTimeout(checkVoices, 100);
              }
            };
            checkVoices();
          });
        }
      } else {
        // Test silencieux pour Safari et autres
        const testUtterance = new SpeechSynthesisUtterance(' ');
        testUtterance.volume = 0.01;
        speechSynthesis.speak(testUtterance);
        await wait(100);
      }
      
      console.log('Début de l\'explication vocale');
      await playAudio("Bonjour ! Tu vas apprendre à reconnaître les nombres !");
      await wait(1000);
      
      // Démonstration rapide avec l'exemple des 3 cercles
      setHighlightedElement('example-box');
      await playAudio("Regarde cet exemple : pour reconnaître un nombre, on compte !");
      await wait(1500);
      
      await playAudio("Voici 3 cercles rouges. Comptons ensemble !");
      await wait(1000);
      
      // Animation rapide des 3 cercles
      await playAudio("UN !");
      setAnimatingPoints([1]);
      await wait(700);
      
      await playAudio("DEUX !");
      setAnimatingPoints([1, 2]);
      await wait(700);
      
      await playAudio("TROIS !");
      setAnimatingPoints([1, 2, 3]);
      await wait(700);
      
      setAnimatingPoints([]);
      setHighlightedElement(null);
      await playAudio("Parfait ! C'est le nombre 3 !");
      await wait(1000);
      
      // Transition vers les choix
      setHighlightedElement('examples-section');
      await playAudio("Maintenant, choisis un nombre pour t'entraîner !");
      await wait(1500);
      setHighlightedElement(null);
      
      // Scroller vers le tableau et l'illuminer
      scrollToNumberChoice();
      setHighlightedElement('choice-list');
      await playAudio("Clique sur n'importe quel nombre et je te montrerai comment le compter !");
      await wait(2000);
      setHighlightedElement(null);
      
      // Présenter les méthodes de comptage
      await playAudio("Et n'oublie pas ! Il y a plusieurs façons de compter !");
      await wait(1000);
      
      scrollToCountingMethods();
      setHighlightedElement('counting-methods');
      await playAudio("Regarde ici ! Tu peux utiliser tes doigts ou faire des groupes de 5 !");
      await wait(1500);
      
      setHighlightedElement('fingers-section');
      await playAudio("Clique sur chaque méthode pour apprendre comment elle fonctionne !");
      await wait(1500);
      setHighlightedElement(null);
      
    } catch (error) {
      console.error('Erreur dans explainChapter:', error);
    } finally {
      setIsPlayingVocal(false);
    }
  };

  // Fonction pour expliquer un nombre spécifique avec animation
  const explainNumber = async (number: string) => {
    const num = parseInt(number);
    stopSignalRef.current = false;
    setIsPlayingVocal(true);
    setCountingNumber(num);

    try {
      await playAudio(`Très bien ! Tu as choisi le nombre ${number} !`);
      await wait(1000);
      
      // Illuminer le nombre sélectionné
      setHighlightedElement('selected-number-display');
      await playAudio(`Voici le nombre ${number} !`);
      await wait(1500);
      setHighlightedElement(null);
      
      // Illuminer la représentation visuelle
      setHighlightedElement('visual-representation');
      await playAudio("Maintenant, comptons ensemble pour voir combien ça fait !");
      await wait(1500);
      
      // Animation de comptage avec points qui s'illuminent
      await playAudio("Je vais compter et les points vont s'illuminer un par un !");
      await wait(1000);
      
      // Comptage synchronisé avec animation
      for (let i = 1; i <= num; i++) {
        if (stopSignalRef.current) break;
        
        setAnimatingPoints([i]);
        await playAudio(i.toString());
        await wait(800);
      }
      
      setAnimatingPoints([]);
      setHighlightedElement('final-count');
      await playAudio(`Et voilà ! Nous avons compté ${num} points ! C'est le nombre ${number} !`);
      await wait(2000);
      setHighlightedElement(null);
      
      await playAudio("Tu peux maintenant choisir un autre nombre pour continuer à apprendre !");
      
    } catch (error) {
      console.error('Erreur dans explainNumber:', error);
    } finally {
      setIsPlayingVocal(false);
      setCountingNumber(null);
      setAnimatingPoints([]);
    }
  };

  // Détecter le navigateur côté client pour éviter l'erreur d'hydratation
  useEffect(() => {
    setIsClient(true);
    
    // Lister les voix disponibles au chargement pour diagnostic
    const listAvailableVoices = () => {
      const voices = speechSynthesis.getVoices();
      if (voices.length > 0) {
        console.log('=== VOIX DISPONIBLES ===');
        voices.forEach(voice => {
          if (voice.lang.startsWith('fr')) {
            console.log(`🇫🇷 ${voice.name} (${voice.lang}) ${voice.localService ? '[Native]' : '[Cloud]'} ${voice.default ? '[Défaut]' : ''}`);
          }
        });
        console.log('========================');
      }
    };
    
    // Attendre que les voix soient chargées
    if (speechSynthesis.getVoices().length === 0) {
      speechSynthesis.addEventListener('voiceschanged', listAvailableVoices);
    } else {
      listAvailableVoices();
    }
    
    // Initialiser les données - juste les mots
    setNumbersData({
      '1': { word: 'un' },
      '2': { word: 'deux' },
      '3': { word: 'trois' },
      '4': { word: 'quatre' },
      '5': { word: 'cinq' },
      '6': { word: 'six' },
      '7': { word: 'sept' },
      '8': { word: 'huit' },
      '9': { word: 'neuf' },
      '10': { word: 'dix' },
      '11': { word: 'onze' },
      '12': { word: 'douze' },
      '13': { word: 'treize' },
      '14': { word: 'quatorze' },
      '15': { word: 'quinze' },
      '16': { word: 'seize' },
      '17': { word: 'dix-sept' },
      '18': { word: 'dix-huit' },
      '19': { word: 'dix-neuf' },
      '20': { word: 'vingt' }
    });
    
    setExercises([
      { question: 'Quel nombre vois-tu ?', number: '5', correctAnswer: '5', choices: ['4', '5', '6'] },
      { question: 'Quel nombre vois-tu ?', number: '8', correctAnswer: '8', choices: ['7', '8', '9'] },
      { question: 'Quel nombre vois-tu ?', number: '12', correctAnswer: '12', choices: ['11', '12', '13'] },
      { question: 'Quel nombre vois-tu ?', number: '3', correctAnswer: '3', choices: ['2', '3', '4'] },
      { question: 'Quel nombre vois-tu ?', number: '16', correctAnswer: '16', choices: ['15', '16', '17'] },
      { question: 'Quel nombre vois-tu ?', number: '7', correctAnswer: '7', choices: ['6', '7', '8'] },
      { question: 'Quel nombre vois-tu ?', number: '15', correctAnswer: '15', choices: ['14', '15', '16'] },
      { question: 'Quel nombre vois-tu ?', number: '4', correctAnswer: '4', choices: ['3', '4', '5'] },
      { question: 'Quel nombre vois-tu ?', number: '18', correctAnswer: '18', choices: ['17', '18', '19'] },
      { question: 'Quel nombre vois-tu ?', number: '6', correctAnswer: '6', choices: ['5', '6', '7'] },
      { question: 'Quel nombre vois-tu ?', number: '11', correctAnswer: '11', choices: ['10', '11', '12'] },
      { question: 'Quel nombre vois-tu ?', number: '9', correctAnswer: '9', choices: ['8', '9', '10'] },
      { question: 'Quel nombre vois-tu ?', number: '13', correctAnswer: '13', choices: ['12', '13', '14'] },
      { question: 'Quel nombre vois-tu ?', number: '20', correctAnswer: '20', choices: ['19', '20', '21'] },
      { question: 'Quel nombre vois-tu ?', number: '17', correctAnswer: '17', choices: ['16', '17', '18'] }
    ]);
  }, []);

  // Arrêter les vocaux quand on change d'onglet ou de page
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

  // Arrêter les vocaux quand on va aux exercices ET remettre le bouton démarrer quand on revient au cours
  useEffect(() => {
    if (showExercises) {
      stopAllVocalsAndAnimations();
    } else {
      // Quand on revient dans la section cours, remettre le bouton DÉMARRER
      setHasStarted(false);
    }
  }, [showExercises]);

  // Liste de choix pour la sélection - réduite à 3 exemples
  const choiceNumbers = ['3', '7', '15'];

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-100">
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
              👁️ Reconnaître les nombres
            </h1>
            <p className="text-lg text-gray-600">
              Apprends à reconnaître et compter les nombres de 1 à 20 !
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
            {/* Bouton Démarrer toujours visible */}
            <div className="text-center mb-8">
                <button
                onClick={explainChapter}
                  disabled={isPlayingVocal}
                className={`bg-gradient-to-r from-green-500 to-blue-500 text-white px-12 py-6 rounded-2xl font-bold text-3xl shadow-2xl hover:shadow-3xl transition-all transform hover:scale-105 ${
                  isPlayingVocal ? 'opacity-75 cursor-not-allowed animate-pulse' : 'hover:from-green-600 hover:to-blue-600 animate-bounce'
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
                    : "Clique ici pour commencer ton aventure avec les nombres !")}
              </p>
            </div>

            {/* Indicateur audio global */}
            {hasStarted && isPlayingVocal && (
              <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-pulse">
                <Volume2 className="inline w-5 h-5 mr-2 animate-spin" />
                🎤 Audio en cours...
              </div>
            )}

            {/* Introduction */}
            <div 
              className={`bg-white rounded-xl p-8 shadow-lg transition-all duration-500 ${
                highlightedElement === 'introduction-section' ? 'ring-4 ring-yellow-400 bg-yellow-50 scale-105' : ''
              }`}
            >
              <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
                🤔 Qu'est-ce que reconnaître un nombre ?
              </h2>
              
              <div 
                className={`bg-blue-50 rounded-lg p-6 mb-6 transition-all duration-500 ${
                  highlightedElement === 'definition-box' ? 'ring-4 ring-yellow-400 bg-yellow-100' : ''
                }`}
              >
                <p className="text-lg text-center text-blue-800 font-semibold mb-4">
                  Reconnaître un nombre, c'est savoir combien il y a d'objets en les comptant !
                </p>
                
                <div 
                  className={`bg-white rounded-lg p-4 transition-all duration-500 ${
                    highlightedElement === 'example-box' ? 'ring-4 ring-yellow-400 bg-yellow-50' : ''
                  }`}
                >
                  <div className="text-center">
                    <div className="text-xl font-bold text-blue-600 mb-4">
                      <div className="mb-2">Exemple :</div>
                      <div className="flex justify-center items-center gap-2 mb-2">
                        <div className="flex gap-2">
                          {[1, 2, 3].map((i) => (
                            <div
                              key={i}
                              className={`w-8 h-8 bg-red-500 rounded-full transition-all duration-300 ${
                                animatingPoints.includes(i) ? 'ring-4 ring-yellow-400 bg-yellow-300 animate-bounce scale-125' : ''
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-2xl font-bold mx-2">=</span>
                        <span className="text-2xl font-bold">3</span>
                      </div>
                    </div>
                    <div 
                      className={`text-xl text-gray-700 mb-4 transition-all duration-500 ${
                        highlightedElement === 'counting-explanation' ? 'bg-yellow-200 rounded-lg p-2 scale-110' : ''
                      }`}
                    >
                      Je compte : 1, 2, 3 → C'est le nombre 3 !
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sélecteur de nombre principal */}
            {/* UN SEUL tableau unifié */}
            <div 
              id="number-choice-table"
              className={`bg-white rounded-xl p-4 md:p-8 shadow-lg transition-all duration-500 ${
                highlightedElement === 'choice-list' ? 'ring-4 ring-yellow-400 bg-yellow-50 scale-105' : ''
              }`}
            >
              <h2 className="text-xl md:text-2xl font-bold text-center mb-6 text-gray-900">
                🎯 Choisis un nombre
              </h2>
              
              {/* Grille responsive optimisée mobile */}
              <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-10 gap-3 md:gap-3 max-w-4xl mx-auto">
                {['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20'].map((num) => {
                  const isExample = choiceNumbers.includes(num);
                  return (
                  <button
                      key={num}
                      id={`number-${num}`}
                    onClick={() => {
                        stopAllVocalsAndAnimations();
                        setSelectedNumber(num);
                        // Scroll vers l'illustration après une courte pause pour voir le bouton sélectionné
                        setTimeout(() => {
                          scrollToIllustration();
                          explainNumber(num);
                        }, 300);
                      }}
                      className={`p-3 sm:p-2 md:p-3 rounded-lg font-bold text-base sm:text-sm md:text-lg transition-all hover:scale-105 min-h-[44px] min-w-[44px] flex items-center justify-center ${
                        selectedNumber === num
                          ? 'bg-blue-500 text-white shadow-lg ring-2 ring-blue-300'
                          : isExample 
                            ? 'bg-gradient-to-r from-green-100 to-green-200 text-green-700 hover:from-green-200 hover:to-green-300'
                            : 'bg-gray-100 text-gray-700 hover:bg-blue-100'
                      } ${
                        highlightedElement === `number-${num}` ? 'ring-4 ring-yellow-400 bg-yellow-200 scale-110' : ''
                      } ${
                        isExample && highlightedElement === 'examples-section' ? 'ring-2 ring-green-400 bg-green-200' : ''
                      }`}
                    >
                      {num}
                  </button>
                  );
                })}
              </div>
            </div>

            {/* Affichage du nombre sélectionné */}
            <div 
              id="number-illustration"
              className="bg-white rounded-xl p-8 shadow-lg"
            >
              <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
                🔍 Découvrons le nombre {selectedNumber}
              </h2>
              
              <div className="bg-green-50 rounded-lg p-6">
                <div className="text-center space-y-6">
                  <div 
                    className={`text-8xl font-bold text-green-600 transition-all duration-500 ${
                      highlightedElement === 'selected-number-display' ? 'ring-4 ring-yellow-400 bg-yellow-200 rounded-lg p-4 scale-110' : ''
                    }`}
                  >
                  {selectedNumber}
                </div>
                
                  <div className="text-3xl font-bold text-blue-600">
                    {numbersData[selectedNumber as keyof typeof numbersData]?.word || 
                     ['', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf', 'dix', 'onze', 'douze', 'treize', 'quatorze', 'quinze', 'seize', 'dix-sept', 'dix-huit', 'dix-neuf', 'vingt'][parseInt(selectedNumber)] || selectedNumber}
                  </div>
                  
                  <div 
                    className={`bg-white rounded-lg p-6 transition-all duration-500 ${
                      highlightedElement === 'visual-representation' ? 'ring-4 ring-yellow-400 bg-yellow-50 scale-105' : ''
                    }`}
                  >
                                        <div className="mb-4 flex flex-wrap justify-center items-center gap-1 min-h-[60px]">
                      {renderCircles(selectedNumber)}
                    </div>

                    <div 
                      className={`text-xl font-bold text-gray-700 transition-all duration-500 ${
                        highlightedElement === 'final-count' ? 'bg-yellow-200 rounded-lg p-4 scale-110' : ''
                      }`}
                    >
                      {countingNumber !== null ? `Nous comptons : ${countingNumber} !` : `C'est le nombre ${selectedNumber} !`}
                </div>
              </div>
                </div>
                  </div>
                </div>

            {/* Différentes façons de compter */}
            <div 
              id="counting-methods-section"
              className={`bg-white rounded-xl p-8 shadow-lg transition-all duration-500 ${
                highlightedElement === 'counting-methods' ? 'ring-4 ring-yellow-400 bg-yellow-50 scale-105' : ''
              }`}
            >
              <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
                ✋ Différentes façons de compter
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Avec les doigts */}
                <div 
                  id="fingers-method"
                  onClick={async () => {
                    if (!isPlayingVocal) {
                      // Arrêter toutes les animations et voix en cours
                      stopAllVocalsAndAnimations();
                      await new Promise(resolve => setTimeout(resolve, 100));
                      
                      // Réinitialiser le signal d'arrêt et démarrer la nouvelle animation
                      stopSignalRef.current = false;
                      setIsPlayingVocal(true);
                      setAnimatingFingers(true);
                      setAnimatingStep('one-hand');
                      
                      try {
                        console.log('Début animation doigts');
                        await playAudio("Avec tes doigts, tu peux compter jusqu'à 10 !");
                      if (stopSignalRef.current) return;
                      await new Promise(resolve => setTimeout(resolve, 800));
                      
                      await playAudio("Une main égale 5 doigts ! Regardons :");
                      if (stopSignalRef.current) return;
                      await new Promise(resolve => setTimeout(resolve, 500));
                      
                      // Compter les 5 doigts un par un
                      setFingerCount(0);
                      for (let i = 1; i <= 5; i++) {
                        if (stopSignalRef.current) break;
                        setFingerCount(i);
                        await playAudio(i.toString());
                        if (stopSignalRef.current) break;
                        await new Promise(resolve => setTimeout(resolve, 600));
                      }
                      
                      await playAudio("Cinq doigts sur une main !");
                      if (stopSignalRef.current) return;
                      await new Promise(resolve => setTimeout(resolve, 1000));
                      
                      setAnimatingStep('two-hands');
                      setFingerCount(0);
                      await playAudio("Maintenant, deux mains égalent 10 doigts ! Comptons :");
                      if (stopSignalRef.current) return;
                      await new Promise(resolve => setTimeout(resolve, 500));
                      
                      // Compter les 10 doigts un par un
                      for (let i = 1; i <= 10; i++) {
                        if (stopSignalRef.current) break;
                        setFingerCount(i);
                        await playAudio(i.toString());
                        if (stopSignalRef.current) break;
                        await new Promise(resolve => setTimeout(resolve, 500));
                      }
                      
                      await playAudio("Dix doigts avec les deux mains ! C'est pratique pour compter jusqu'à 10 !");
                      if (stopSignalRef.current) return;
                      await new Promise(resolve => setTimeout(resolve, 1500));
                      
                      } finally {
                        setAnimatingFingers(false);
                        setAnimatingStep(null);
                        setFingerCount(0);
                        setIsPlayingVocal(false);
                      }
                    }
                  }}
                  className={`bg-pink-50 rounded-lg p-6 cursor-pointer hover:bg-pink-100 transition-all duration-300 ${
                    highlightedElement === 'fingers-section' ? 'ring-4 ring-yellow-400 bg-yellow-100 scale-105' : ''
                  } ${
                    animatingFingers ? 'ring-2 ring-pink-400 bg-pink-100' : ''
                  }`}
                >
                  <h3 className="text-xl font-bold mb-4 text-pink-800 text-center">
                    ✋ Avec tes doigts (jusqu'à 10)
                  </h3>
                  <div className="text-center space-y-4">
                    <div className={`text-6xl transition-all duration-500 ${animatingFingers ? 'scale-110' : ''}`}>
                      {animatingFingers && animatingStep === 'two-hands' ? '✋✋' : '✋'}
                    </div>
                    
                    {/* Animation avec les cercles pour illustrer */}
                    {animatingFingers && (
                      <div className="bg-white rounded-lg p-4 border-2 border-pink-300">
                        <div className="text-lg font-bold text-pink-800 mb-3">
                          {animatingStep === 'one-hand' ? 'Une main → 5 objets' : 'Deux mains → 10 objets'}
                        </div>
                        <div className="flex flex-wrap justify-center gap-1 mb-3">
                          {Array.from({length: animatingStep === 'one-hand' ? 5 : 10}, (_, i) => (
                            <div
                              key={`finger-circle-${i}`}
                              className={`w-6 h-6 rounded-full transition-all duration-500 ${
                                i < fingerCount 
                                  ? 'bg-yellow-400 ring-2 ring-yellow-600 scale-110' 
                                  : 'bg-pink-500'
                              }`}
                            />
                          ))}
                        </div>
                        <div className="text-sm text-pink-600">
                          {animatingStep === 'one-hand' ? 
                            'Compte sur tes 5 doigts : 1, 2, 3, 4, 5 !' : 
                            'Avec tes 10 doigts : 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 !'}
                        </div>
                      </div>
                    )}
                    
                    <p className="text-lg text-pink-700 font-semibold">
                      <span className={animatingFingers && animatingStep === 'one-hand' ? 'bg-yellow-200 font-bold' : ''}>
                        1 main = 5 doigts
                      </span>
                      <br/>
                      <span className={animatingFingers && animatingStep === 'two-hands' ? 'bg-yellow-200 font-bold' : ''}>
                        2 mains = 10 doigts
                      </span>
                    </p>
                  </div>
                </div>

                {/* Avec des groupes de 5 */}
                <div 
                  id="groups-method"
                  onClick={async () => {
                    if (!isPlayingVocal) {
                      // Arrêter toutes les animations et voix en cours
                      stopAllVocalsAndAnimations();
                      await new Promise(resolve => setTimeout(resolve, 100));
                      
                      // Réinitialiser le signal d'arrêt et démarrer la nouvelle animation
                      stopSignalRef.current = false;
                      setIsPlayingVocal(true);
                      setAnimatingGroups(true);
                      
                      try {
                        console.log('Début animation groupes');
                        await playAudio("Avec des groupes de 5, c'est plus facile !");
                      if (stopSignalRef.current) return;
                      await new Promise(resolve => setTimeout(resolve, 800));
                      
                      await playAudio("Pourquoi 5 ? Parce que 5, c'est comme une main avec 5 doigts !");
                      if (stopSignalRef.current) return;
                      await new Promise(resolve => setTimeout(resolve, 1000));
                      
                      setAnimatingStep('group1');
                      await playAudio("Regarde : ce premier groupe de 5, c'est comme une main !");
                      if (stopSignalRef.current) return;
                      await new Promise(resolve => setTimeout(resolve, 1200));
                      
                      setAnimatingStep('group2');
                      await playAudio("Ce deuxième groupe de 5, c'est comme une autre main !");
                      if (stopSignalRef.current) return;
                      await new Promise(resolve => setTimeout(resolve, 1200));
                      
                      setAnimatingStep('group3');
                      await playAudio("Et ces 2 derniers, ça fait 5 plus 5 plus 2 égale 12 !");
                      if (stopSignalRef.current) return;
                      await new Promise(resolve => setTimeout(resolve, 1500));
                      
                      // Explication pourquoi on groupe par 5
                      setAnimatingStep('explanation');
                      await playAudio("C'est pour ça que quand on compte avec des points, on aime bien les regrouper par 5 !");
                      if (stopSignalRef.current) return;
                      await new Promise(resolve => setTimeout(resolve, 800));
                      
                      await playAudio("Car on peut les représenter avec une main !");
                      if (stopSignalRef.current) return;
                      await new Promise(resolve => setTimeout(resolve, 500));
                      
                      setAnimatingStep('show-hands');
                      await playAudio("Regardez : une main pour ce groupe de 5...");
                      if (stopSignalRef.current) return;
                      await new Promise(resolve => setTimeout(resolve, 1200));
                      
                      await playAudio("...et une autre main pour cet autre groupe de 5 !");
                      if (stopSignalRef.current) return;
                      await new Promise(resolve => setTimeout(resolve, 1500));
                      
                      await playAudio("C'est beaucoup plus facile de compter comme ça !");
                      if (stopSignalRef.current) return;
                      await new Promise(resolve => setTimeout(resolve, 1000));
                      
                      } finally {
                        setAnimatingGroups(false);
                        setAnimatingStep(null);
                        setIsPlayingVocal(false);
                      }
                    }
                  }}
                  className={`bg-purple-50 rounded-lg p-6 cursor-pointer hover:bg-purple-100 transition-all duration-300 ${
                    highlightedElement === 'groups-section' ? 'ring-4 ring-yellow-400 bg-yellow-100 scale-105' : ''
                  } ${
                    animatingGroups ? 'ring-2 ring-purple-400 bg-purple-100' : ''
                  }`}
                >
                  <h3 className="text-xl font-bold mb-4 text-purple-800 text-center">
                    📦 Avec des groupes de 5
                  </h3>
                  <div className="text-center space-y-3">
                    <div className="flex justify-center items-center flex-wrap gap-2">
                      {/* Premier groupe de 5 */}
                      <div className="flex flex-col items-center gap-1">
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((i) => (
                            <div
                              key={`group1-${i}`}
                              className={`w-6 h-6 bg-red-500 rounded-full transition-all duration-500 ${
                                animatingGroups && (animatingStep === 'group1' || animatingStep === null || animatingStep === 'show-hands') ? 'scale-110' : ''
                              } ${
                                (animatingStep === 'group1' || animatingStep === 'show-hands') ? 'ring-2 ring-yellow-400' : ''
                              }`}
                              style={{ animationDelay: `${i * 200}ms` }}
                            />
                          ))}
                </div>
                        {/* Main sous le premier groupe */}
                        {animatingGroups && (animatingStep === 'group1' || animatingStep === 'show-hands') && (
                          <div className={`text-2xl transition-all duration-300 ${
                            animatingStep === 'show-hands' ? 'scale-125 animate-pulse' : 'scale-110'
                          }`}>✋</div>
                        )}
              </div>

                      {/* Séparateur */}
                      <span className={`mx-2 text-2xl font-bold text-purple-600 ${animatingGroups ? 'opacity-70' : ''}`}>|</span>
                      
                      {/* Deuxième groupe de 5 */}
                      <div className="flex flex-col items-center gap-1">
                        <div className="flex gap-1">
                          {[6, 7, 8, 9, 10].map((i) => (
                            <div
                              key={`group2-${i}`}
                              className={`w-6 h-6 bg-red-500 rounded-full transition-all duration-500 ${
                                animatingGroups && (animatingStep === 'group2' || animatingStep === null || animatingStep === 'show-hands') ? 'scale-110' : ''
                              } ${
                                (animatingStep === 'group2' || animatingStep === 'show-hands') ? 'ring-2 ring-yellow-400' : ''
                              }`}
                              style={{ animationDelay: `${i * 200}ms` }}
                            />
                          ))}
                        </div>
                        {/* Main sous le deuxième groupe */}
                        {animatingGroups && (animatingStep === 'group2' || animatingStep === 'show-hands') && (
                          <div className={`text-2xl transition-all duration-300 ${
                            animatingStep === 'show-hands' ? 'scale-125 animate-pulse' : 'scale-110'
                          }`}>✋</div>
                        )}
                      </div>
                      
                      {/* Séparateur */}
                      <span className={`mx-2 text-2xl font-bold text-purple-600 ${animatingGroups ? 'opacity-70' : ''}`}>|</span>
                      
                      {/* Groupe de 2 */}
                      <div className="flex flex-col items-center gap-1">
                        <div className="flex gap-1">
                          {[11, 12].map((i) => (
                            <div
                              key={`group3-${i}`}
                              className={`w-6 h-6 bg-red-500 rounded-full transition-all duration-500 ${
                                animatingGroups && (animatingStep === 'group3' || animatingStep === null) ? 'scale-110' : ''
                              } ${
                                animatingStep === 'group3' ? 'ring-2 ring-yellow-400' : ''
                              }`}
                              style={{ animationDelay: `${i * 200}ms` }}
                            />
                          ))}
                        </div>
                        {/* Pas de main pour le groupe de 2, juste highlight */}
                      </div>
                    </div>
                    <p className={`text-lg text-purple-700 font-semibold transition-all duration-300 ${
                      animatingGroups && animatingStep === 'group3' ? 'scale-110 font-bold bg-yellow-200 rounded px-2' : ''
                    }`}>
                      5 + 5 + 2 = 12
                    </p>
                    
                    {/* Explication supplémentaire */}
                    {animatingGroups && (animatingStep === 'explanation' || animatingStep === 'show-hands') && (
                      <div className="mt-4 p-3 bg-yellow-100 rounded-lg border-2 border-yellow-300 animate-fade-in">
                        <p className="text-sm text-purple-800 font-bold text-center">
                          💡 Grouper par 5 = utiliser ses mains !
                        </p>
                        <p className="text-xs text-purple-600 text-center mt-1">
                          {animatingStep === 'show-hands' ? 
                            'Chaque groupe de 5 points = 1 main ✋' : 
                            'C\'est pour ça qu\'on aime les groupes de 5 !'}
                        </p>
                      </div>
                    )}
                </div>
              </div>
            </div>

              <div className="mt-6 text-center">
                <p className="text-lg text-gray-600 font-semibold">
                  💡 Clique sur chaque méthode pour l'entendre !
                </p>
              </div>
            </div>

            {/* Conseils pratiques */}
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
                💡 Trucs pour bien reconnaître
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-yellow-50 rounded-lg p-6">
                  <h3 className="text-xl font-bold mb-4 text-yellow-800">
                    🧠 Méthodes
                  </h3>
                  <ul className="space-y-2 text-yellow-700">
                    <li>• Compte un par un avec ton doigt</li>
                    <li>• Utilise tes mains pour les petits nombres</li>
                    <li>• Regarde bien tous les objets</li>
                    <li>• Compte lentement sans te tromper</li>
              </ul>
                </div>
                
                <div className="bg-green-50 rounded-lg p-6">
                  <h3 className="text-xl font-bold mb-4 text-green-800">
                    🎯 Astuces
                  </h3>
                  <ul className="space-y-2 text-green-700">
                    <li>• 🔵 = 10 (une dizaine)</li>
                    <li>• 🔴 = 1 (une unité)</li>
                    <li>• Compte d'abord les 🔵 puis les 🔴</li>
                    <li>• Vérifie toujours ton comptage</li>
                  </ul>
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
              <h3 className="text-2xl font-bold mb-8 text-gray-900">
                {exercises[currentExercise].question}
              </h3>
              
                            {/* Affichage visuel */}
              <div className="bg-blue-50 rounded-lg p-6 mb-8">
                <div className="mb-4 flex flex-wrap justify-center items-center gap-1">
                  {renderCircles(exercises[currentExercise].number)}
                    </div>
                <p className="text-lg text-gray-700 font-semibold">
                  Compte les objets et trouve le bon nombre !
                </p>
              </div>
              
              {/* Choix multiples */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-md mx-auto mb-8">
                {shuffledChoices.map((choice) => (
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
                  <div className="flex items-center justify-center space-x-3 mb-4">
                    {isCorrect ? (
                      <>
                        <CheckCircle className="w-8 h-8" />
                        <span className="font-bold text-xl">Excellent ! C'est bien {exercises[currentExercise].correctAnswer} !</span>
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
                            La bonne réponse est {exercises[currentExercise].correctAnswer}
                        </div>
                          <div className="mb-2 flex flex-wrap justify-center items-center gap-1">
                            {renderCircles(exercises[currentExercise].number)}
                          </div>
                        <div className="text-lg text-gray-700">
                            Compte un par un : {Array.from({length: parseInt(exercises[currentExercise].correctAnswer)}, (_, i) => i + 1).join(', ')} = {exercises[currentExercise].correctAnswer} !
                          </div>
                        </div>
                        
                        <div className="bg-gradient-to-r from-blue-100 to-green-100 rounded-lg p-3 text-center">
                          <div className="text-lg">🌟</div>
                          <p className="text-sm font-semibold text-blue-800">
                            Maintenant tu sais reconnaître {exercises[currentExercise].correctAnswer} !
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
                const percentage = Math.round((finalScore / exercises.length) * 100);
                const getMessage = () => {
                  if (percentage >= 90) return { title: "🎉 Champion de la reconnaissance !", message: "Tu reconnais parfaitement les nombres !", emoji: "🎉" };
                  if (percentage >= 70) return { title: "👏 Très bien !", message: "Tu progresses super bien !", emoji: "👏" };
                  if (percentage >= 50) return { title: "👍 C'est bien !", message: "Tu apprends à bien reconnaître !", emoji: "😊" };
                  return { title: "💪 Continue !", message: "Recommence pour mieux maîtriser !", emoji: "📚" };
                };
                const result = getMessage();
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
                        {finalScore >= 12 ? '⭐⭐⭐' : finalScore >= 8 ? '⭐⭐' : '⭐'}
                      </div>
                      <p className="text-sm text-gray-600 mt-2">
                        Savoir reconnaître les nombres est très important !
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