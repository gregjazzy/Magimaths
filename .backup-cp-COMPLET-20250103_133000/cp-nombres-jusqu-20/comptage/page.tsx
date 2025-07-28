'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, Play, Pause, CheckCircle, XCircle, RotateCcw } from 'lucide-react';

export default function ComptageCP() {
  const [selectedCount, setSelectedCount] = useState(5);
  const [currentExercise, setCurrentExercise] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showExercises, setShowExercises] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredCorrectly, setAnsweredCorrectly] = useState<Set<number>>(new Set());
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [isCountingAnimation, setIsCountingAnimation] = useState(false);
  const [currentCountingNumber, setCurrentCountingNumber] = useState(0);
  const [shuffledChoices, setShuffledChoices] = useState<string[]>([]);
  
  // NOUVEAUX ÉTATS pour audio et animations
  const [isPlayingVocal, setIsPlayingVocal] = useState(false);
  const [highlightedElement, setHighlightedElement] = useState<string | null>(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [animatingPoints, setAnimatingPoints] = useState<number[]>([]);
  const [countingNumber, setCountingNumber] = useState<number | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [numbersData, setNumbersData] = useState<{[key: string]: {word: string}}>({});

  // REFS pour contrôler l'audio
  const stopSignalRef = useRef(false);
  const currentAudioRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Initialisation côté client
  useEffect(() => {
    setIsClient(true);
    
    // Initialiser les données - juste les mots
    setNumbersData({
      '3': { word: 'trois' },
      '5': { word: 'cinq' },
      '7': { word: 'sept' },
      '10': { word: 'dix' },
      '12': { word: 'douze' },
      '15': { word: 'quinze' },
      '18': { word: 'dix-huit' },
      '20': { word: 'vingt' }
    });
  }, []);

  // FONCTION pour arrêter tous les vocaux et animations
  const stopAllVocalsAndAnimations = () => {
    stopSignalRef.current = true;
    setIsPlayingVocal(false);
    setHighlightedElement(null);
    setAnimatingPoints([]);
    setCountingNumber(null);
    setIsCountingAnimation(false);
    setCurrentCountingNumber(0);
    
    if (currentAudioRef.current) {
      speechSynthesis.cancel();
      currentAudioRef.current = null;
    }
  };

  // FONCTION audio améliorée
  const playAudio = async (text: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      try {
        if (stopSignalRef.current) {
        resolve();
        return;
      }
      
        speechSynthesis.cancel();
        
        if (!('speechSynthesis' in window)) {
          console.warn('Speech synthesis not supported');
        resolve();
        return;
      }
      
        const utterance = new SpeechSynthesisUtterance(text);
        currentAudioRef.current = utterance;
        
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

  // FONCTION pour expliquer le chapitre
  const explainChapter = async () => {
    stopSignalRef.current = false;
    setIsPlayingVocal(true);
    setHasStarted(true);

    try {
      // Scroll vers la zone de choix
      scrollToCountChoice();

      await playAudio("Bienvenue dans le chapitre comptage ! Tu vas apprendre à compter des objets jusqu'à 20.");
      if (stopSignalRef.current) return;

      // Illuminer la zone de choix
      setHighlightedElement('choice-numbers');
      await playAudio("Choisis d'abord un nombre ici pour voir combien d'objets tu veux compter.");
      if (stopSignalRef.current) return;

      // Exemple rapide avec 3
      setHighlightedElement('3-button');
      await playAudio("Par exemple, clique sur 3 pour compter jusqu'à 3.");
      if (stopSignalRef.current) return;

      // Animation rapide des 3 points
      setAnimatingPoints([1, 2, 3]);
      await playAudio("Tu verras 3 cercles rouges que nous compterons ensemble : 1, 2, 3 !");
      if (stopSignalRef.current) return;

      setAnimatingPoints([]);
      setHighlightedElement('animation-zone');
      await playAudio("Puis clique sur le bouton pour démarrer le comptage avec ma voix !");
      if (stopSignalRef.current) return;

      setHighlightedElement(null);
      await playAudio("Maintenant, choisis un nombre et amuse-toi à compter avec moi !");

    } catch (error) {
      console.error('Erreur dans explainChapter:', error);
    } finally {
      setIsPlayingVocal(false);
      setHighlightedElement(null);
      setAnimatingPoints([]);
    }
  };

  // FONCTION pour compter avec animation et audio synchronisés
  const startCountingAnimation = async () => {
    if (isPlayingVocal) return;
    
    stopSignalRef.current = false;
    setIsCountingAnimation(true);
    setCurrentCountingNumber(0);
    setIsPlayingVocal(true);
    setCountingNumber(0);
    setAnimatingPoints([]);

    try {
      // Scroll vers l'illustration
      scrollToIllustration();

      await playAudio(`Comptons ensemble jusqu'à ${selectedCount} !`);
      if (stopSignalRef.current) return;

      // Comptage synchronisé
      for (let i = 1; i <= selectedCount; i++) {
        if (stopSignalRef.current) break;
        
        setCurrentCountingNumber(i);
        setCountingNumber(i);
        setAnimatingPoints([i]);
        
        const word = getNumberWord(i);
        await playAudio(word);
        if (stopSignalRef.current) break;
        
        // Petite pause entre chaque nombre
        await new Promise(resolve => setTimeout(resolve, 300));
      }

      if (!stopSignalRef.current) {
        setAnimatingPoints([]);
        setCountingNumber(null);
        await playAudio(`Parfait ! Nous avons compté ${selectedCount} objets !`);
      }

    } catch (error) {
      console.error('Erreur dans startCountingAnimation:', error);
    } finally {
      setIsPlayingVocal(false);
      setIsCountingAnimation(false);
      setAnimatingPoints([]);
      setCountingNumber(null);
    }
  };

  // FONCTION pour obtenir le mot d'un nombre
  const getNumberWord = (num: number): string => {
    const words = ['', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf', 'dix', 'onze', 'douze', 'treize', 'quatorze', 'quinze', 'seize', 'dix-sept', 'dix-huit', 'dix-neuf', 'vingt'];
    return words[num] || num.toString();
  };

  // FONCTION pour scroll vers la zone de choix
  const scrollToCountChoice = () => {
    const element = document.getElementById('count-choice-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // FONCTION pour scroll vers l'illustration
  const scrollToIllustration = () => {
    const element = document.getElementById('animation-zone');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // FONCTION pour rendre les cercles CSS - SIMPLE
  const renderCircles = (count: number) => {
    if (!count || count > 20) return null;

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
    
    return circles;
  };

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
      sectionId: 'comptage',
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
      const existingIndex = allProgress.findIndex((p: any) => p.sectionId === 'comptage');
      
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

  // Exercices de comptage - VERSION SIMPLIFÉE avec des nombres
  const exercises = [
    { question: 'Compte les objets', number: 5, correctAnswer: '5', choices: ['5', '4', '6'] }, 
    { question: 'Combien d\'objets ?', number: 8, correctAnswer: '8', choices: ['9', '7', '8'] },
    { question: 'Compte les objets', number: 7, correctAnswer: '7', choices: ['6', '8', '7'] },
    { question: 'Combien d\'objets ?', number: 11, correctAnswer: '11', choices: ['11', '10', '12'] },
    { question: 'Compte les objets', number: 6, correctAnswer: '6', choices: ['7', '5', '6'] },
    { question: 'Combien d\'objets ?', number: 9, correctAnswer: '9', choices: ['8', '10', '9'] },
    { question: 'Compte les objets', number: 12, correctAnswer: '12', choices: ['12', '11', '13'] },
    { question: 'Combien d\'objets ?', number: 4, correctAnswer: '4', choices: ['5', '4', '3'] },
    { question: 'Compte les objets', number: 16, correctAnswer: '16', choices: ['17', '15', '16'] },
    { question: 'Combien d\'objets ?', number: 10, correctAnswer: '10', choices: ['10', '9', '11'] },
    { question: 'Compte les objets', number: 3, correctAnswer: '3', choices: ['4', '2', '3'] },
    { question: 'Combien d\'objets ?', number: 14, correctAnswer: '14', choices: ['13', '15', '14'] },
    { question: 'Compte les objets', number: 19, correctAnswer: '19', choices: ['19', '18', '20'] },
    { question: 'Combien d\'objets ?', number: 15, correctAnswer: '15', choices: ['16', '14', '15'] },
    { question: 'Compte les objets', number: 18, correctAnswer: '18', choices: ['18', '17', '19'] },
    { question: 'Combien d\'objets ?', number: 13, correctAnswer: '13', choices: ['14', '13', '12'] },
    { question: 'Compte les objets', number: 17, correctAnswer: '17', choices: ['16', '18', '17'] },
    { question: 'Combien d\'objets ?', number: 20, correctAnswer: '20', choices: ['20', '19', '21'] }
  ];

  // Fonction pour mélanger un tableau
  const shuffleArray = (array: string[]) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

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

    // Passage automatique au suivant après une bonne réponse
    if (correct) {
      setTimeout(() => {
        if (currentExercise + 1 >= exercises.length) {
          // Dernier exercice terminé
          const finalScoreValue = score + (!answeredCorrectly.has(currentExercise) ? 1 : 0);
          setFinalScore(finalScoreValue);
          setShowCompletionModal(true);
          saveProgress(finalScoreValue, exercises.length);
        } else {
          // Passer à l'exercice suivant
          nextExercise();
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

  // Fonction helper pour les messages de fin
  const getCompletionMessage = (score: number, total: number) => {
    const percentage = Math.round((score / total) * 100);
    if (percentage >= 90) return { title: "🎉 Champion du comptage !", message: "Tu sais parfaitement compter jusqu'à 20 !", emoji: "🎉" };
    if (percentage >= 70) return { title: "👏 Très bien !", message: "Tu comptes de mieux en mieux ! Continue !", emoji: "👏" };
    if (percentage >= 50) return { title: "👍 C'est bien !", message: "Tu progresses ! Le comptage demande de l'entraînement !", emoji: "😊" };
    return { title: "💪 Continue !", message: "Recommence pour mieux apprendre à compter !", emoji: "📚" };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100">
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
              🔢 Compter jusqu'à 20
            </h1>
            <p className="text-lg text-gray-600">
              Apprends à compter des objets et à réciter la suite des nombres !
            </p>
          </div>
        </div>

        {/* Navigation entre cours et exercices */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-1 shadow-md">
            <button
              onClick={() => setShowExercises(false)}
              className={`px-6 py-3 rounded-lg font-bold transition-all ${
                !showExercises 
                  ? 'bg-green-500 text-white shadow-md' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              📖 Cours
            </button>
            <button
              onClick={() => setShowExercises(true)}
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
            {/* BOUTON DÉMARRER visible et prominent */}
            <div className="bg-white rounded-xl p-6 shadow-lg text-center">
              <button
                onClick={explainChapter}
                disabled={isPlayingVocal}
                className={`px-8 py-4 rounded-lg font-bold text-xl transition-all transform ${
                  isPlayingVocal 
                    ? 'bg-orange-500 text-white cursor-not-allowed' 
                    : hasStarted 
                      ? 'bg-green-500 text-white hover:bg-green-600 hover:scale-105' 
                      : 'bg-blue-500 text-white hover:bg-blue-600 hover:scale-105 animate-pulse'
                } shadow-lg`}
              >
                {isPlayingVocal ? (
                  <>
                    <Pause className="inline w-6 h-6 mr-2" />
                    JE PARLE...
                  </>
                ) : hasStarted ? (
                  <>
                    <Play className="inline w-6 h-6 mr-2" />
                    RECOMMENCER !
                  </>
                ) : (
                  <>
                    <Play className="inline w-6 h-6 mr-2" />
                    DÉMARRER !
                  </>
                )}
              </button>
            </div>

            {/* Comptage avec animation */}
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
                🎯 Apprends à compter !
              </h2>
              
              {/* Sélecteur de quantité */}
              <div 
                id="count-choice-section"
                className={`bg-green-50 rounded-lg p-6 mb-6 transition-all duration-500 ${
                  highlightedElement === 'choice-numbers' ? 'bg-yellow-200 ring-4 ring-yellow-400 scale-105' : ''
                }`}
              >
                <h3 className="text-xl font-bold mb-4 text-green-800 text-center">
                  Choisis combien tu veux compter :
                </h3>
                <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
                  {[3, 5, 7, 10, 12, 15, 18, 20].map((num) => (
                    <button
                      key={num}
                      onClick={() => {
                        setSelectedCount(num);
                        if (!isPlayingVocal) {
                          scrollToIllustration();
                        }
                      }}
                      className={`p-3 rounded-lg font-bold text-lg transition-all ${
                        selectedCount === num
                          ? 'bg-green-500 text-white shadow-lg scale-105'
                          : 'bg-white text-gray-700 hover:bg-gray-100 border-2 border-green-200'
                      } ${
                        highlightedElement === `${num}-button` ? 'ring-4 ring-yellow-400 bg-yellow-200' : ''
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>

              {/* Zone d'animation */}
              <div 
                id="animation-zone"
                className={`bg-blue-50 rounded-lg p-8 transition-all duration-500 ${
                  highlightedElement === 'animation-zone' ? 'bg-yellow-200 ring-4 ring-yellow-400 scale-105' : ''
                }`}
              >
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-blue-800 mb-4">
                    🎪 Comptons ensemble jusqu'à {selectedCount} !
                  </h3>
                  
                  {/* Affichage des objets à compter - CERCLES CSS */}
                  <div className="flex flex-wrap justify-center gap-1 mb-6 max-w-4xl mx-auto min-h-[60px]">
                    {renderCircles(selectedCount)}
                  </div>

                  {/* Compteur affiché */}
                  <div className="text-6xl font-bold text-blue-600 mb-4">
                    {countingNumber !== null ? countingNumber : isCountingAnimation ? currentCountingNumber : selectedCount}
                  </div>
                  
                  {countingNumber !== null && (
                    <div className="text-2xl font-bold text-gray-700 mb-4">
                      Nous comptons : {getNumberWord(countingNumber)} !
                    </div>
                  )}

                  {/* Bouton pour démarrer le comptage */}
                  <button
                    onClick={startCountingAnimation}
                    disabled={isCountingAnimation || isPlayingVocal}
                    className="bg-blue-500 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isCountingAnimation || isPlayingVocal ? (
                      <>
                        <Pause className="inline w-5 h-5 mr-2" />
                        Comptage en cours...
                      </>
                    ) : (
                      <>
                        <Play className="inline w-5 h-5 mr-2" />
                        Compter avec moi !
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* La suite numérique jusqu'à 20 */}
            <div className="bg-white rounded-xl p-4 sm:p-6 lg:p-8 shadow-lg">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-center mb-4 sm:mb-6 text-gray-900">
                📝 La suite des nombres jusqu'à 20
              </h2>
              
              <div className="bg-yellow-50 rounded-lg p-4 sm:p-6">
                <h3 className="text-base sm:text-lg lg:text-xl font-bold mb-3 sm:mb-4 text-yellow-800 text-center">
                  🗣️ Récite avec moi :
                </h3>
                
                {/* Grille des nombres */}
                <div className="grid grid-cols-5 sm:grid-cols-5 md:grid-cols-10 gap-2 sm:gap-3 mb-4 sm:mb-6 max-w-full overflow-hidden">
                  {Array.from({length: 20}, (_, i) => i + 1).map((num) => (
                    <div
                      key={num}
                      className="bg-white p-2 sm:p-3 lg:p-4 rounded-lg font-bold text-lg sm:text-xl lg:text-2xl text-gray-800 border-2 border-yellow-200 flex items-center justify-center min-h-[48px] sm:min-h-[56px] lg:min-h-[64px] aspect-square"
                    >
                      <span className="select-none">{num}</span>
                    </div>
                  ))}
                </div>

                <p className="text-center text-yellow-700 font-semibold text-sm sm:text-base lg:text-lg">
                  💡 Apprends cette suite par cœur !
                </p>
              </div>
            </div>

            {/* Techniques de comptage */}
            <div className="bg-white rounded-xl p-4 sm:p-6 lg:p-8 shadow-lg">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-center mb-4 sm:mb-6 text-gray-900">
                ✋ Différentes façons de compter
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {/* Avec les doigts */}
                <div className="bg-pink-50 rounded-lg p-4 sm:p-6">
                  <h3 className="text-base sm:text-lg font-bold mb-3 sm:mb-4 text-pink-800 text-center">
                    🖐️ Avec tes doigts (jusqu'à 10)
                  </h3>
                  <div className="text-center space-y-2 sm:space-y-3">
                    <div className="text-4xl sm:text-5xl lg:text-6xl">✋</div>
                    <p className="text-sm sm:text-base lg:text-lg text-pink-700 font-semibold">
                      1 main = 5 doigts<br/>
                      2 mains = 10 doigts
                    </p>
                  </div>
                </div>

                {/* Avec des groupes */}
                <div className="bg-purple-50 rounded-lg p-4 sm:p-6">
                  <h3 className="text-base sm:text-lg font-bold mb-3 sm:mb-4 text-purple-800 text-center">
                    📦 Avec des groupes de 5
                  </h3>
                  <div className="text-center space-y-2 sm:space-y-3">
                    <div className="text-lg sm:text-xl lg:text-2xl flex justify-center items-center flex-wrap">
                      <span>🔴🔴🔴🔴🔴</span>
                      <span className="mx-1 sm:mx-2">|</span>
                      <span>🔴🔴🔴🔴🔴</span>
                      <span className="mx-1 sm:mx-2">|</span>
                      <span>🔴🔴</span>
                    </div>
                    <p className="text-sm sm:text-base lg:text-lg text-purple-700 font-semibold">
                      5 + 5 + 2 = 12
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Jeu des nombres cachés */}
            <div className="bg-white rounded-xl p-4 sm:p-6 lg:p-8 shadow-lg">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-center mb-4 sm:mb-6 text-gray-900">
                🎮 Jeu : Continue la suite !
              </h2>
              
              <div className="bg-indigo-50 rounded-lg p-4 sm:p-6">
                <h3 className="text-base sm:text-lg lg:text-xl font-bold mb-3 sm:mb-4 text-indigo-800 text-center">
                  Quel nombre vient après ?
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                  {[
                    { sequence: '5, 6, 7, ?', answer: '8' },
                    { sequence: '12, 13, 14, ?', answer: '15' },
                    { sequence: '17, 18, 19, ?', answer: '20' },
                    { sequence: '8, 9, 10, ?', answer: '11' }
                  ].map((item, index) => (
                    <div key={index} className="bg-white p-3 sm:p-4 rounded-lg text-center border-2 border-indigo-200 flex flex-col justify-center items-center min-h-[100px]">
                      <div className="text-sm sm:text-base lg:text-lg font-bold text-indigo-600 mb-2">
                        {item.sequence}
                      </div>
                      <div className="text-xl sm:text-2xl font-bold text-green-600">
                        {item.answer}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Conseils */}
            <div className="bg-gradient-to-r from-green-400 to-blue-400 rounded-xl p-6 text-white">
              <h3 className="text-xl font-bold mb-3">💡 Trucs pour bien compter</h3>
              <ul className="space-y-2 text-lg">
                <li>• Pointe chaque objet avec ton doigt</li>
                <li>• Dis le nombre à voix haute</li>
                <li>• Utilise tes doigts pour t'aider</li>
                <li>• Fais des groupes de 5 pour les grands nombres</li>
                <li>• Récite la suite dans l'ordre tous les jours</li>
              </ul>
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
            <div className="bg-white rounded-xl p-3 sm:p-6 md:p-8 shadow-lg text-center">
              <h3 className="text-base sm:text-xl md:text-2xl font-bold mb-3 sm:mb-6 md:mb-8 text-gray-900">
                {exercises[currentExercise].question}
              </h3>
              
              {/* Affichage des objets à compter - CERCLES CSS */}
              <div className="bg-green-50 rounded-lg p-2 sm:p-4 md:p-8 mb-3 sm:mb-6 md:mb-8">
                <div className="flex flex-wrap justify-center gap-1 mb-2 sm:mb-4 md:mb-6 min-h-[60px]">
                  {renderCircles(exercises[currentExercise].number)}
                </div>
                <p className="text-sm sm:text-base md:text-lg text-gray-700 font-semibold">
                  Compte bien chaque cercle !
                </p>
              </div>
              
              {/* Choix multiples */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 sm:gap-3 md:gap-4 max-w-sm sm:max-w-md mx-auto mb-4 sm:mb-6 md:mb-8">
                {shuffledChoices.map((choice) => (
                  <button
                    key={choice}
                    onClick={() => handleAnswerClick(choice)}
                    disabled={isCorrect !== null}
                    className={`p-3 sm:p-4 md:p-6 rounded-lg font-bold text-xl sm:text-2xl md:text-3xl lg:text-4xl transition-all ${
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
                        <span className="font-bold text-xl">
                          Parfait ! Il y a bien {exercises[currentExercise].correctAnswer} objets !
                        </span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-8 h-8" />
                        <span className="font-bold text-xl">
                          Pas tout à fait... Il y en a {exercises[currentExercise].correctAnswer} !
                        </span>
                      </>
                    )}
                  </div>
                  
                  {/* Illustration pour les mauvaises réponses */}
                  {!isCorrect && (
                    <div className="bg-white rounded-lg p-6 border-2 border-blue-300">
                      <h4 className="text-lg font-bold mb-4 text-blue-800 text-center">
                        🎯 Comptons ensemble la bonne réponse !
                      </h4>
                      
                      <div className="space-y-4">
                        {/* Illustration avec comptage visuel */}
                        <div className="bg-blue-50 rounded-lg p-4">
                          <div className="text-center mb-3">
                            <div className="text-xl font-bold text-blue-600 mb-3">
                              {exercises[currentExercise].question}
                            </div>
                          </div>
                          
                          {/* Cercles avec numérotation */}
                          <div className="flex flex-wrap justify-center gap-2 mb-4">
                            {Array.from({length: exercises[currentExercise].number}, (_, index) => (
                              <div key={index} className="relative">
                                <div className="w-8 h-8 bg-red-500 rounded-full"></div>
                                <div className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                                  {index + 1}
                                </div>
                              </div>
                            ))}
                          </div>
                          
                          {/* Résultat final */}
                          <div className="text-center">
                            <div className="text-3xl font-bold text-green-600 mb-2">
                              = {exercises[currentExercise].correctAnswer}
                            </div>
                            <div className="text-lg text-gray-700">
                              Il y a {exercises[currentExercise].correctAnswer} objets en tout !
                            </div>
                          </div>
                        </div>
                        
                        {/* Message d'encouragement */}
                        <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-3 text-center">
                          <div className="text-lg">🌟</div>
                          <p className="text-sm font-semibold text-purple-800">
                            Maintenant tu sais ! En comptant bien, on trouve {exercises[currentExercise].correctAnswer} objets !
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {/* Navigation - Bouton Suivant (seulement si mauvaise réponse) */}
              {isCorrect === false && currentExercise + 1 < exercises.length && (
                <div className="flex justify-center mt-6">
                  <button
                    onClick={nextExercise}
                    className="bg-green-500 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-green-600 transition-all"
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
                        {finalScore >= 10 ? '⭐⭐⭐' : finalScore >= 8 ? '⭐⭐' : '⭐'}
                      </div>
                      <p className="text-sm text-gray-600 mt-2">
                        Bien compter, c'est la base des mathématiques !
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