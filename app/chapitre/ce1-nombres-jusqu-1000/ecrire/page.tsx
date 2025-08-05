'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, XCircle, RotateCcw, Lightbulb, Play, Pause, Volume2 } from 'lucide-react';

export default function EcrireNombresCE1Page() {
  const [currentExercise, setCurrentExercise] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showExercises, setShowExercises] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredCorrectly, setAnsweredCorrectly] = useState<Set<number>>(new Set());
  const [showHint, setShowHint] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [finalScore, setFinalScore] = useState(0);

  // États pour le système audio et animations
  const [isPlayingVocal, setIsPlayingVocal] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [characterSizeExpanded, setCharacterSizeExpanded] = useState(false);
  const [highlightedElement, setHighlightedElement] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [selectedNumber, setSelectedNumber] = useState<{written: string, number: string, hint: string} | null>(null);

  // Refs pour contrôler les vocaux
  const stopSignalRef = useRef(false);
  const currentAudioRef = useRef<SpeechSynthesisUtterance | null>(null);



  // Sauvegarder les progrès dans localStorage
  const saveProgress = (score: number, maxScore: number) => {
    const progress = {
      sectionId: 'ecrire',
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
      const existingIndex = allProgress.findIndex((p: any) => p.sectionId === 'ecrire');
      
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

  // Fonction pour expliquer le chapitre (tutoriel vocal)
  const explainChapter = async () => {
    stopSignalRef.current = false;
    setHasStarted(true);
    setCharacterSizeExpanded(true);

    // Détecter les voix Chrome pour une meilleure qualité
    if ('speechSynthesis' in window) {
      const voices = speechSynthesis.getVoices();
      if (voices.length === 0) {
        // Attendre que les voix se chargent
        await new Promise<SpeechSynthesisVoice[]>((resolve) => {
          const checkVoices = () => {
            const voices = speechSynthesis.getVoices();
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
    }

    if (showExercises) {
      // Mode d'emploi pour les exercices
      if (stopSignalRef.current) return;
      await playAudio("Salut petit architecte ! Bienvenue dans l'atelier de construction des nombres !");
      if (stopSignalRef.current) return;
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (stopSignalRef.current) return;
      await playAudio("Objectif de ta mission : transformer les mots magiques en chiffres précis !");
      if (stopSignalRef.current) return;
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (stopSignalRef.current) return;
      await playAudio("Voici tes outils de construction :");
      if (stopSignalRef.current) return;
      await new Promise(resolve => setTimeout(resolve, 300));
      
      if (stopSignalRef.current) return;
      scrollToElement('score-section');
      await playAudio("D'abord, ton compteur de réussites ! Chaque nombre construit correctement te donne des points !");
      if (stopSignalRef.current) return;
      highlightElement('score-display', 3000);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (stopSignalRef.current) return;
      scrollToElement('exercise-question');
      await playAudio("Ensuite, tu verras les mots magiques à transformer, comme un sort à décoder !");
      if (stopSignalRef.current) return;
      highlightElement('word-number', 2500);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (stopSignalRef.current) return;
      await playAudio("Écris le nombre en chiffres dans le champ de construction !");
      if (stopSignalRef.current) return;
      highlightElement('answer-input', 2500);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (stopSignalRef.current) return;
      await playAudio("Le bouton Effacer, c'est ta gomme magique pour recommencer !");
      if (stopSignalRef.current) return;
      highlightElement('erase-button', 2500);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (stopSignalRef.current) return;
      scrollToElement('navigation-buttons');
      // Détection dynamique du texte du bouton
      const buttonText = isCorrect === null ? 'Vérifier' : 'Suivant';
      const buttonExplanation = isCorrect === null 
        ? "Le bouton Vérifier, c'est pour valider ta construction comme un contrôle qualité !" 
        : "Le bouton Suivant, c'est pour passer au prochain défi une fois réussi !";
      await playAudio(`${buttonExplanation} Et Précédent pour revenir en arrière !`);
      if (stopSignalRef.current) return;
      await highlightElementsSequentially(['next-button', 'previous-button'], 1000);
      if (stopSignalRef.current) return;
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (stopSignalRef.current) return;
      scrollToElement('tab-navigation');
      await playAudio("N'oublie pas, tu peux retourner au Cours en haut pour réviser les règles !");
      if (stopSignalRef.current) return;
      await highlightElementsSequentially(['tab-cours', 'tab-exercices'], 1000);
      if (stopSignalRef.current) return;
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (stopSignalRef.current) return;
      await playAudio("Allez petit constructeur, montre-moi tes talents ! C'est parti pour l'aventure !");
      
    } else {
      // Mode d'emploi pour le cours
      if (stopSignalRef.current) return;
      await playAudio("Salut petit bâtisseur ! Bienvenue dans l'école de construction des nombres !");
      if (stopSignalRef.current) return;
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (stopSignalRef.current) return;
      await playAudio("Objectif : apprendre à transformer les mots en chiffres comme un vrai architecte !");
      if (stopSignalRef.current) return;
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (stopSignalRef.current) return;
      await playAudio("Voici ta boîte à outils :");
      if (stopSignalRef.current) return;
      await new Promise(resolve => setTimeout(resolve, 300));
      
      if (stopSignalRef.current) return;
      scrollToElement('rules-section');
      await playAudio("D'abord, les règles de construction ! Centaines, dizaines et unités, comme des étages à assembler !");
      if (stopSignalRef.current) return;
      highlightElement('rules-section', 3000);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (stopSignalRef.current) return;
      scrollToElement('examples-section');
      await playAudio("Ensuite, des exemples de constructions réussies ! Clique pour voir comment ça marche !");
      if (stopSignalRef.current) return;
      highlightElement('examples-section', 3000);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (stopSignalRef.current) return;
      scrollToElement('interactive-section');
      await playAudio("Et enfin, ton atelier personnel ! Choisis un mot et vois sa transformation en chiffres !");
      if (stopSignalRef.current) return;
      highlightElement('interactive-section', 3000);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (stopSignalRef.current) return;
      scrollToElement('tab-navigation');
      await playAudio("En haut, tu as Cours pour apprendre et Exercices pour t'entraîner !");
      if (stopSignalRef.current) return;
      await highlightElementsSequentially(['tab-cours', 'tab-exercices'], 1000);
      if (stopSignalRef.current) return;
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (stopSignalRef.current) return;
      await playAudio("Alors petit architecte, prêt à construire des nombres ? C'est parti pour l'aventure !");
    }
  };

  const examples = [
    { written: 'Cent vingt-trois', number: '123' },
    { written: 'Quatre-vingt-sept', number: '87' },
    { written: 'Mille', number: '1000' }
  ];

  const exercises = [
    { written: 'Cent quarante-cinq', number: '145', hint: 'Cent = 1 centaine, quarante = 4 dizaines, cinq = 5 unités' },
    { written: 'Deux cent soixante-sept', number: '267', hint: 'Deux cent = 2 centaines, soixante = 6 dizaines, sept = 7 unités' },
    { written: 'Trois cent quatre-vingt-neuf', number: '389', hint: 'Trois cent = 3 centaines, quatre-vingt = 8 dizaines, neuf = 9 unités' },
    { written: 'Quatre cent douze', number: '412', hint: 'Quatre cent = 4 centaines, douze = 1 dizaine et 2 unités' },
    { written: 'Cinq cent trente-quatre', number: '534', hint: 'Cinq cent = 5 centaines, trente = 3 dizaines, quatre = 4 unités' },
    { written: 'Six cent cinquante-huit', number: '658', hint: 'Six cent = 6 centaines, cinquante = 5 dizaines, huit = 8 unités' },
    { written: 'Sept cent vingt-trois', number: '723', hint: 'Sept cent = 7 centaines, vingt = 2 dizaines, trois = 3 unités' },
    { written: 'Huit cent quarante-six', number: '846', hint: 'Huit cent = 8 centaines, quarante = 4 dizaines, six = 6 unités' },
    { written: 'Neuf cent sept', number: '907', hint: 'Neuf cent = 9 centaines, zéro dizaine, sept = 7 unités' },
    { written: 'Trois cent cinquante', number: '350', hint: 'Trois cent = 3 centaines, cinquante = 5 dizaines, zéro unité' },
    { written: 'Quatre cents', number: '400', hint: 'Quatre cents = 4 centaines exactes' },
    { written: 'Cinq cent un', number: '501', hint: 'Cinq cent = 5 centaines, zéro dizaine, un = 1 unité' },
    { written: 'Six cent dix', number: '610', hint: 'Six cent = 6 centaines, dix = 1 dizaine, zéro unité' },
    { written: 'Sept cent vingt', number: '720', hint: 'Sept cent = 7 centaines, vingt = 2 dizaines, zéro unité' },
    { written: 'Huit cent quatre-vingts', number: '880', hint: 'Huit cent = 8 centaines, quatre-vingts = 8 dizaines' }
  ];

  const handleNext = () => {
    // Si aucune réponse vérifiée encore, on vérifie
    if (isCorrect === null) {
      const correct = userAnswer.trim() === exercises[currentExercise].number;
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
            setCurrentExercise(Math.min(currentExercise + 1, exercises.length - 1));
            setUserAnswer('');
            setIsCorrect(null);
            setShowHint(false);
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
        setShowHint(false);
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
      setShowHint(false);
    }
  };

  const resetExercise = () => {
    setUserAnswer('');
    setIsCorrect(null);
    setShowHint(false);
  };

  const resetAll = () => {
    setCurrentExercise(0);
    setUserAnswer('');
    setIsCorrect(null);
    setScore(0);
    setShowHint(false);
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

      {showCompletionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-md mx-4 text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Bravo ! Tu as terminé !
            </h2>
            <div className="text-xl text-blue-600 font-bold mb-6">
              Score final : {finalScore}/{exercises.length}
            </div>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => {
                  setShowCompletionModal(false);
                  resetAll();
                }}
                className="bg-blue-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-600 transition-colors"
              >
                Recommencer
              </button>
              <Link
                href="/chapitre/ce1-nombres-jusqu-1000"
                className="bg-gray-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-gray-600 transition-colors"
              >
                Retour au chapitre
              </Link>
            </div>
          </div>
        </div>
      )}

    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/chapitre/ce1-nombres-jusqu-1000" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-4" onClick={stopAllVocalsAndAnimations}>
            <ArrowLeft className="w-4 h-4" />
            <span>Retour au chapitre</span>
          </Link>
          
          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              🔤➡️🔢 Passer des lettres aux chiffres
            </h1>
            <p className="text-lg text-gray-600 hidden sm:block">
              Transforme les mots en chiffres jusqu'à 1000 !
            </p>
          </div>
        </div>

        {/* Navigation entre cours et exercices */}
        <div id="tab-navigation" className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-1 shadow-md">
            <button
              id="tab-cours"
              onClick={() => setShowExercises(false)}
              className={`px-6 py-3 rounded-lg font-bold transition-all pulse-interactive ${
                !showExercises 
                  ? 'bg-blue-500 text-white shadow-md' 
                  : 'text-gray-600 hover:bg-gray-100'
              } ${highlightedElement === 'tab-cours' ? 'ring-4 ring-yellow-400 bg-yellow-200 scale-105' : ''}`}
            >
              📖 Cours
            </button>
            <button
              id="tab-exercices"
              onClick={() => setShowExercises(true)}
              className={`px-6 py-3 rounded-lg font-bold transition-all pulse-interactive ${
                showExercises 
                  ? 'bg-green-500 text-white shadow-md' 
                  : 'text-gray-600 hover:bg-gray-100'
              } ${highlightedElement === 'tab-exercices' ? 'ring-4 ring-yellow-400 bg-yellow-200 scale-105' : ''}`}
            >
              ✏️ Exercices ({score}/{exercises.length})
            </button>
          </div>
        </div>

        {!showExercises ? (
          /* COURS */
          <div className="space-y-4 sm:space-y-8">
            {/* Personnage Minecraft avec bouton DÉMARRER */}
            <div className="flex flex-row items-center justify-center gap-3 sm:gap-6 p-3 sm:p-4 mb-4 sm:mb-6">
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
                  onClick={() => {
                    setHasStarted(true);
                    setCharacterSizeExpanded(true);
                    explainChapter();
                  }}
                  disabled={isPlayingVocal}
                  className={`bg-gradient-to-r from-green-500 to-blue-500 text-white px-4 sm:px-8 py-2 sm:py-4 rounded-lg sm:rounded-xl font-bold text-sm sm:text-xl shadow-lg sm:shadow-2xl hover:shadow-xl sm:hover:shadow-3xl transition-all transform hover:scale-105 pulse-interactive ${
                    isPlayingVocal ? 'opacity-75 cursor-not-allowed' : 'hover:from-green-600 hover:to-blue-600'
                  }`}
                >
                  <Play className="inline w-4 h-4 sm:w-6 sm:h-6 mr-1 sm:mr-2" />
                  {isPlayingVocal ? '🎤 JE PARLE...' : '🎯 DÉMARRER'}
                </button>
              </div>
            </div>

            {/* Règles de base */}
            <div id="rules-section" className={`bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-lg ${
              highlightedElement === 'rules-section' ? 'ring-4 ring-yellow-400 bg-yellow-200 scale-105 animate-pulse' : ''
            }`}>
              <h2 className="text-lg sm:text-2xl font-bold text-center mb-4 sm:mb-6 text-gray-900">
                📝 Les règles pour écrire un nombre
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-green-50 rounded-lg p-4 text-center">
                  <div className="text-3xl mb-3">1️⃣</div>
                  <h3 className="font-bold text-green-800 mb-2">Les centaines</h3>
                  <p className="text-green-700">Cent, deux cent, trois cent...</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <div className="text-3xl mb-3">2️⃣</div>
                  <h3 className="font-bold text-blue-800 mb-2">Les dizaines</h3>
                  <p className="text-blue-700">Vingt, trente, quarante...</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4 text-center">
                  <div className="text-3xl mb-3">3️⃣</div>
                  <h3 className="font-bold text-purple-800 mb-2">Les unités</h3>
                  <p className="text-purple-700">Un, deux, trois...</p>
                </div>
              </div>
            </div>

            {/* Exemples interactifs */}
            <div id="examples-section" className={`bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-lg ${
              highlightedElement === 'examples-section' ? 'ring-4 ring-yellow-400 bg-yellow-200 scale-105 animate-pulse' : ''
            }`}>
              <h2 className="text-lg sm:text-2xl font-bold text-center mb-4 sm:mb-6 text-gray-900">
                🎯 Exemples pour comprendre
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {examples.map((example, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4">
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-600 mb-2">
                        {example.written}
                      </div>
                      <div className="text-xl font-bold text-red-600">
                        ↓
                      </div>
                      <div className="text-2xl font-bold text-green-600">
                        {example.number}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Section interactive - Choix d'un nombre à transformer */}
            <div id="interactive-section" className={`bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-lg ${
              highlightedElement === 'interactive-section' ? 'ring-4 ring-yellow-400 bg-yellow-200 scale-105 animate-pulse' : ''
            }`}>
              <h2 className="text-lg sm:text-2xl font-bold text-center mb-4 sm:mb-6 text-gray-900">
                🎯 Atelier de transformation
              </h2>
              <p className="text-center text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
                Choisis un nombre en lettres et découvres sa transformation en chiffres !
              </p>
              
              {/* Sélecteur de nombres */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-4 mb-4 sm:mb-6">
                {exercises.slice(0, 8).map((exercise, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSelectedNumber(exercise);
                      setTimeout(() => scrollToElement('decomposition-section'), 100);
                    }}
                    className={`bg-gradient-to-br from-purple-500 to-pink-500 text-white p-2 sm:p-4 rounded-lg font-bold text-xs sm:text-base hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105 pulse-interactive min-h-[3rem] sm:min-h-[4rem] flex items-center justify-center ${
                      selectedNumber?.written === exercise.written ? 'ring-4 ring-yellow-400 scale-110' : ''
                    }`}
                  >
                    {exercise.written}
                  </button>
                ))}
              </div>
              
              <div className="text-center text-xs sm:text-sm text-gray-500">
                Clique sur un nombre pour voir sa transformation magique ! ✨
              </div>
            </div>

            {/* Section de décomposition */}
            {selectedNumber && (
              <div id="decomposition-section" className="bg-green-50 rounded-xl p-6 shadow-lg">
                <h3 className="text-xl font-bold text-center mb-6 text-green-800">
                  ✨ Transformation magique !
                </h3>
                
                <div className="text-center mb-6">
                  <div className="bg-white rounded-lg p-4 shadow-md mb-4">
                    <div className="text-lg font-bold text-purple-600 mb-2">
                      📝 Nombre en lettres :
                    </div>
                    <div className="text-2xl font-bold text-gray-800">
                      {selectedNumber.written}
                    </div>
                  </div>
                  
                  <div className="text-4xl font-bold text-green-600 mb-2">⬇️</div>
                  
                  <div className="bg-white rounded-lg p-4 shadow-md">
                    <div className="text-lg font-bold text-blue-600 mb-2">
                      🔢 Nombre en chiffres :
                    </div>
                    <div className="text-4xl font-bold text-blue-600">
                      {selectedNumber.number}
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg p-4 shadow-md">
                  <div className="text-lg font-bold text-green-700 mb-3 text-center">
                    🧩 Décomposition :
                  </div>
                  <div className="text-center text-gray-700">
                    {selectedNumber.hint}
                  </div>
                </div>
              </div>
            )}

            {/* Conseils */}
            <div className="bg-gradient-to-r from-yellow-400 to-orange-400 rounded-xl p-6 text-white">
              <h3 className="text-xl font-bold mb-3">💡 Astuces pour réussir</h3>
              <ul className="space-y-2">
                <li>• Écoute bien chaque partie du nombre</li>
                <li>• Commence par les centaines (100, 200, 300...)</li>
                <li>• Puis ajoute les dizaines (20, 30, 40...)</li>
                <li>• Et enfin les unités (1, 2, 3...)</li>
                <li>• "Mille" s'écrit 1000</li>
              </ul>
            </div>

            {/* Tableau de référence */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-center mb-6 text-gray-900">
                📊 Tableau de référence
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-bold text-green-600 mb-3 text-center md:text-left">Centaines</h4>
                  <div className="grid grid-cols-2 md:grid-cols-1 gap-1 text-sm text-gray-800 text-center md:text-left">
                    <div>Cent = 100</div>
                    <div>Deux cent = 200</div>
                    <div>Trois cent = 300</div>
                    <div>Quatre cent = 400</div>
                    <div>Cinq cent = 500</div>
                    <div>Six cent = 600</div>
                    <div>Sept cent = 700</div>
                    <div>Huit cent = 800</div>
                    <div>Neuf cent = 900</div>
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-blue-600 mb-3 text-center md:text-left">Dizaines</h4>
                  <div className="grid grid-cols-2 md:grid-cols-1 gap-1 text-sm text-gray-800 text-center md:text-left">
                    <div>Dix = 10</div>
                    <div>Vingt = 20</div>
                    <div>Trente = 30</div>
                    <div>Quarante = 40</div>
                    <div>Cinquante = 50</div>
                    <div>Soixante = 60</div>
                    <div>Soixante-dix = 70</div>
                    <div>Quatre-vingts = 80</div>
                    <div>Quatre-vingt-dix = 90</div>
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-purple-600 mb-3 text-center md:text-left">Unités</h4>
                  <div className="grid grid-cols-2 md:grid-cols-1 gap-1 text-sm text-gray-800 text-center md:text-left">
                    <div>Un = 1</div>
                    <div>Deux = 2</div>
                    <div>Trois = 3</div>
                    <div>Quatre = 4</div>
                    <div>Cinq = 5</div>
                    <div>Six = 6</div>
                    <div>Sept = 7</div>
                    <div>Huit = 8</div>
                    <div>Neuf = 9</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* EXERCICES */
          <div className="space-y-4 sm:space-y-8">
            {/* Personnage Minecraft avec bouton DÉMARRER */}
            <div className="flex flex-row items-center justify-center gap-3 sm:gap-6 p-3 sm:p-4 mb-4 sm:mb-6">
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
                  onClick={() => {
                    setHasStarted(true);
                    setCharacterSizeExpanded(true);
                    explainChapter();
                  }}
                  disabled={isPlayingVocal}
                  className={`bg-gradient-to-r from-green-500 to-blue-500 text-white px-4 sm:px-8 py-2 sm:py-4 rounded-lg sm:rounded-xl font-bold text-sm sm:text-xl shadow-lg sm:shadow-2xl hover:shadow-xl sm:hover:shadow-3xl transition-all transform hover:scale-105 pulse-interactive ${
                    isPlayingVocal ? 'opacity-75 cursor-not-allowed' : 'hover:from-green-600 hover:to-blue-600'
                  }`}
                >
                  <Play className="inline w-4 h-4 sm:w-6 sm:h-6 mr-1 sm:mr-2" />
                  {isPlayingVocal ? '🎤 JE PARLE...' : '🎯 DÉMARRER'}
                </button>
              </div>
            </div>

            {/* Header exercices */}
            <div id="score-section" className={`bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-lg ${
              highlightedElement === 'score-section' ? 'ring-4 ring-yellow-400 bg-yellow-200 scale-105' : ''
            }`}>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 space-y-3 sm:space-y-0">
                <h2 className="text-lg sm:text-2xl font-bold text-gray-900">
                  ✏️ Exercice {currentExercise + 1} sur {exercises.length}
                </h2>
                <button
                  onClick={resetAll}
                  className="bg-gray-500 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg font-bold hover:bg-gray-600 transition-colors text-sm sm:text-base pulse-interactive"
                >
                  <RotateCcw className="inline w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  Recommencer
                </button>
              </div>
              
              {/* Barre de progression */}
              <div className="w-full bg-gray-200 rounded-full h-2 sm:h-3 mb-3">
                <div 
                  className="bg-green-500 h-2 sm:h-3 rounded-full transition-all duration-500"
                  style={{ width: `${((currentExercise + 1) / exercises.length) * 100}%` }}
                ></div>
              </div>
              
              {/* Score sous la barre */}
              <div className="text-center">
                <div id="score-display" className={`text-base sm:text-lg font-bold text-green-600 ${
                  highlightedElement === 'score-display' ? 'ring-4 ring-yellow-400 bg-yellow-200 scale-105' : ''
                }`}>
                  Score : {score}/{exercises.length}
                </div>
              </div>
            </div>

            {/* Question */}
            <div id="exercise-question" className={`bg-white rounded-lg sm:rounded-xl p-4 sm:p-8 shadow-lg text-center ${
              highlightedElement === 'exercise-question' ? 'ring-4 ring-yellow-400 bg-yellow-200 scale-105' : ''
            }`}>
              <h3 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 text-gray-900">
                ✏️ Écris ce nombre en chiffres
              </h3>
              
              <div className="bg-blue-50 rounded-lg p-4 sm:p-6 mb-6 sm:mb-8">
                <div id="word-number" className={`text-2xl sm:text-3xl font-bold text-blue-900 mb-2 sm:mb-4 ${
                  highlightedElement === 'word-number' ? 'ring-4 ring-yellow-400 bg-yellow-200 scale-105' : ''
                }`}>
                  {exercises[currentExercise].written}
                </div>
              </div>
              
              <div className="max-w-xs sm:max-w-md mx-auto mb-4 sm:mb-6">
                <input
                  id="answer-input"
                  type="text"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="Écris le nombre en chiffres..."
                  className={`w-full p-3 sm:p-4 border-2 border-gray-300 rounded-lg text-center text-lg sm:text-xl font-bold focus:border-blue-500 focus:outline-none bg-white text-gray-900 ${
                    highlightedElement === 'answer-input' ? 'ring-4 ring-yellow-400 bg-yellow-200 scale-105' : ''
                  }`}
                />
              </div>
              
              <div className="flex justify-center space-x-2 sm:space-x-4 mb-4 sm:mb-6">
                <button
                  onClick={() => setShowHint(!showHint)}
                  className="bg-yellow-500 text-white px-3 py-2 sm:px-6 sm:py-3 rounded-lg font-bold hover:bg-yellow-600 transition-colors text-sm sm:text-base pulse-interactive"
                >
                  <Lightbulb className="inline w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  Indice
                </button>
                <button
                  id="erase-button"
                  onClick={resetExercise}
                  className={`bg-gray-500 text-white px-3 py-2 sm:px-6 sm:py-3 rounded-lg font-bold hover:bg-gray-600 transition-colors text-sm sm:text-base pulse-interactive ${
                    highlightedElement === 'erase-button' ? 'ring-4 ring-yellow-400 bg-yellow-200 scale-105' : ''
                  }`}
                >
                  Effacer
                </button>
              </div>

              {/* Indice */}
              {showHint && (
                <div className="bg-yellow-50 rounded-lg p-4 mb-6">
                  <div className="flex items-center justify-center space-x-2 text-yellow-800">
                    <Lightbulb className="w-5 h-5" />
                    <span className="font-bold">{exercises[currentExercise].hint}</span>
                  </div>
                </div>
              )}
              
              {/* Résultat */}
              {isCorrect !== null && (
                <div className={`p-4 rounded-lg mb-6 ${
                  isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  <div className="flex items-center justify-center space-x-2">
                    {isCorrect ? (
                      <>
                        <CheckCircle className="w-6 h-6" />
                        <span className="font-bold">Parfait ! Tu as trouvé {exercises[currentExercise].number} !</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-6 h-6" />
                        <span className="font-bold">
                          Pas tout à fait... La bonne réponse est : {exercises[currentExercise].number}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              )}
              
              {/* Navigation */}
              <div id="navigation-buttons" className="flex flex-col sm:flex-row justify-centrime la regle er space-y-3 sm:space-y-0 sm:space-x-4">
                <button
                  id="previous-button"
                  onClick={() => setCurrentExercise(Math.max(0, currentExercise - 1))}
                  disabled={currentExercise === 0 || isPlayingVocal}
                  className={`bg-gray-300 text-gray-700 px-4 py-2 sm:px-6 sm:py-3 rounded-lg font-bold hover:bg-gray-400 transition-colors disabled:opacity-50 text-sm sm:text-base pulse-interactive-gray ${
                    highlightedElement === 'previous-button' ? 'ring-4 ring-yellow-400 bg-yellow-200 scale-105' : ''
                  }`}
                >
                  ← Précédent
                </button>
                <button
                  id="next-button"
                  onClick={handleNext}
                  disabled={(!userAnswer.trim() && isCorrect === null) || isPlayingVocal}
                  className={`bg-blue-500 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg font-bold hover:bg-blue-600 transition-colors disabled:opacity-50 text-sm sm:text-base pulse-interactive ${
                    highlightedElement === 'next-button' ? 'ring-4 ring-yellow-400 bg-yellow-200 scale-105' : ''
                  }`}
                >
                  {isCorrect === null ? 'Vérifier' : 'Suivant →'}
                </button>
              </div>
            </div>


          </div>
        )}
      </div>
    </div>
    </>
  );
} 