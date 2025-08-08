'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, Play, Pause } from 'lucide-react';

export default function AdditionsJusqu1000CE1() {
  // États pour l'audio et animations
  const [isPlayingVocal, setIsPlayingVocal] = useState(false);
  const [isAnimationRunning, setIsAnimationRunning] = useState(false);
  const [highlightedElement, setHighlightedElement] = useState<string | null>(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [animatingStep, setAnimatingStep] = useState<string | null>(null);
  const [currentExample, setCurrentExample] = useState<number | null>(null);

  // États pour les exercices
  const [showExercises, setShowExercises] = useState(false);
  const [currentExercise, setCurrentExercise] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [answeredCorrectly, setAnsweredCorrectly] = useState<Set<number>>(new Set());
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [finalScore, setFinalScore] = useState(0);

  // États pour Sam le Pirate
  const [pirateIntroStarted, setPirateIntroStarted] = useState(false);
  const [samSizeExpanded, setSamSizeExpanded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // État pour la détection mobile
  const [isMobile, setIsMobile] = useState(false);

  // Refs pour gérer l'audio et scroll
  const stopSignalRef = useRef(false);
  const currentAudioRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Expressions de pirate aléatoires
  const pirateExpressions = [
    "Mille sabords", "Tonnerre de Brest", "Sacré matelot", "Par Neptune", "Sang de pirate",
    "Mille millions de mille sabords", "Ventrebleu", "Sapristi", "Morbleu", "Fichtre"
  ];

  // Compliments aléatoires pour les bonnes réponses
  const correctAnswerCompliments = [
    "Parfait", "Bravo", "Excellent", "Formidable", "Magnifique", 
    "Super", "Génial", "Fantastique", "Merveilleux", "Extraordinaire"
  ];

  // Données des exemples d'additions jusqu'à 1000
  const additionExamples = [
    { 
      first: 345, 
      second: 128, 
      result: 473,
      description: 'addition de nombres à 3 chiffres',
      explanation: '345 plus 128 égale 473'
    },
    { 
      first: 567, 
      second: 234, 
      result: 801,
      description: 'addition avec centaines',
      explanation: '567 plus 234 égale 801'
    },
    { 
      first: 423, 
      second: 156, 
      result: 579,
      description: 'addition sans retenue',
      explanation: '423 plus 156 égale 579'
    },
    { 
      first: 378, 
      second: 145, 
      result: 523,
      description: 'addition avec calcul par colonnes',
      explanation: '378 plus 145 égale 523'
    },
    { 
      first: 654, 
      second: 289, 
      result: 943,
      description: 'addition proche de 1000',
      explanation: '654 plus 289 égale 943'
    }
  ];

  // Exercices sur les additions jusqu'à 1000
  const exercises = [
    { first: 234, second: 145, question: '234 + 145 = ?' },
    { first: 456, second: 123, question: '456 + 123 = ?' },
    { first: 345, second: 234, question: '345 + 234 = ?' },
    { first: 567, second: 156, question: '567 + 156 = ?' },
    { first: 678, second: 234, question: '678 + 234 = ?' },
    { first: 123, second: 456, question: '123 + 456 = ?' },
    { first: 789, second: 123, question: '789 + 123 = ?' },
    { first: 234, second: 567, question: '234 + 567 = ?' },
    { first: 345, second: 456, question: '345 + 456 = ?' },
    { first: 456, second: 345, question: '456 + 345 = ?' }
  ];

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
      currentAudioRef.current.onend = null;
      currentAudioRef.current = null;
    }
    
    setIsPlayingVocal(false);
    setIsAnimationRunning(false);
    setHighlightedElement(null);
    setAnimatingStep(null);
    setCurrentExample(null);
  };

  // Wrapper pour les gestionnaires d'événements
  const handleStopAllVocalsAndAnimations = () => {
    stopAllVocalsAndAnimations();
  };

  const playAudio = (text: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      console.log('playAudio appelée avec:', text);
      
      if (stopSignalRef.current) {
        console.log('stopSignalRef.current est true, resolve immédiat');
        resolve();
        return;
      }
      
      if (!text || text.trim() === '') {
        console.log('Texte vide, resolve immédiat');
        resolve();
        return;
      }

      if (typeof speechSynthesis === 'undefined') {
        console.error('speechSynthesis non disponible');
        reject(new Error('speechSynthesis non disponible'));
        return;
      }

      try {
        const utterance = new SpeechSynthesisUtterance(text.trim());
        utterance.rate = 0.9;
        utterance.pitch = 1.1;
        utterance.volume = 1.0;
        utterance.lang = 'fr-FR';

        utterance.onstart = () => {
          if (stopSignalRef.current) {
            speechSynthesis.cancel();
            resolve();
            return;
          }
          console.log('🔊 Audio démarré:', text.substring(0, 50));
          setIsPlayingVocal(true);
          currentAudioRef.current = utterance;
        };

        utterance.onend = () => {
          console.log('✅ Audio terminé:', text.substring(0, 50));
          setIsPlayingVocal(false);
          currentAudioRef.current = null;
          resolve();
        };

        utterance.onerror = (event) => {
          console.error('❌ Erreur audio:', event.error);
          setIsPlayingVocal(false);
          currentAudioRef.current = null;
          reject(new Error(`Erreur audio: ${event.error}`));
        };

        speechSynthesis.speak(utterance);
      } catch (error) {
        console.error('❌ Erreur lors de la création de l\'utterance:', error);
        reject(error);
      }
    });
  };

  const wait = (ms: number): Promise<void> => {
    return new Promise(resolve => setTimeout(resolve, ms));
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
      await playAudio("Bonjour ! Aujourd'hui, nous allons apprendre les additions jusqu'à 1000 !");
      if (stopSignalRef.current) return;
      
      await wait(1200);
      await playAudio("Les additions avec des nombres à 3 chiffres, c'est formidable !");
      if (stopSignalRef.current) return;
      
      // 2. Explication du concept avec animations
      await wait(1800);
      setHighlightedElement('concept-section');
      await playAudio("Regardons ensemble comment additionner 345 et 128 !");
      if (stopSignalRef.current) return;
      
      await wait(1500);
      setCurrentExample(0);
      setAnimatingStep('introduction');
      const example = additionExamples[0];
      
      await playAudio(`D'abord, j'ai ${example.first} et je veux ajouter ${example.second}.`);
      if (stopSignalRef.current) return;
      
      await wait(1200);
      await playAudio("Pour additionner des nombres à 3 chiffres, on peut utiliser la méthode par colonnes !");
      if (stopSignalRef.current) return;
      
      await wait(1500);
      await playAudio("On additionne d'abord les unités, puis les dizaines, puis les centaines !");
      if (stopSignalRef.current) return;
      
      await wait(1200);
      await playAudio(`${example.first} plus ${example.second} égale ${example.result} !`);
      if (stopSignalRef.current) return;
      
      // 3. Présentation des autres exemples
      await wait(2500);
      setHighlightedElement(null);
      setCurrentExample(null);
      await playAudio("Parfait ! Maintenant tu comprends les additions jusqu'à 1000 !");
      if (stopSignalRef.current) return;
      
      await wait(1200);
      await playAudio("Il y a d'autres exemples à découvrir !");
      if (stopSignalRef.current) return;
      
      await wait(1500);
      setHighlightedElement('examples-section');
      await playAudio("Regarde ! Tu peux essayer avec d'autres nombres !");
      if (stopSignalRef.current) return;
      
      await wait(2000);
      setHighlightedElement('exercises-tab');
      await playAudio("Quand tu es prêt, tu peux faire les exercices pour t'entraîner !");
      if (stopSignalRef.current) return;
      
      await wait(3000);
      setHighlightedElement(null);
      setIsAnimationRunning(false);
      
    } catch (error) {
      console.error('Erreur lors de l\'explication:', error);
      setIsAnimationRunning(false);
    }
  };

  // Fonction pour valider la réponse
  const handleValidateAnswer = () => {
    if (!userAnswer.trim()) return;
    
    const correctAnswer = exercises[currentExercise].first + exercises[currentExercise].second;
    const userNum = parseInt(userAnswer);
    const correct = userNum === correctAnswer;
    
    setIsCorrect(correct);
    
    if (correct && !answeredCorrectly.has(currentExercise)) {
      setScore(prevScore => prevScore + 1);
      setAnsweredCorrectly(prev => {
        const newSet = new Set(prev);
        newSet.add(currentExercise);
        return newSet;
      });
    }
    
    setTimeout(() => {
      if (currentExercise < exercises.length - 1) {
        setCurrentExercise(currentExercise + 1);
        setUserAnswer('');
        setIsCorrect(null);
      } else {
        const finalScoreValue = score + (correct ? 1 : 0);
        setFinalScore(finalScoreValue);
        setShowCompletionModal(true);
      }
    }, 1500);
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

  // Initialisation côté client
  useEffect(() => {
    setIsClient(true);
    setIsMobile(window.innerWidth < 768);
    
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!isClient) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-red-50 p-2 sm:p-4">
      <div className="max-w-6xl mx-auto">
        {/* En-tête avec navigation */}
        <div className="bg-white rounded-xl shadow-lg p-3 sm:p-6 mb-4 sm:mb-8 border-2 border-orange-200">
          <div className="flex items-center gap-2 sm:gap-4 mb-3 sm:mb-4">
            <Link href="/chapitre/ce1-quatre-operations/addition-ce1" className="bg-orange-100 hover:bg-orange-200 p-2 sm:p-3 rounded-lg transition-colors">
              <ArrowLeft className="w-4 h-4 sm:w-6 sm:h-6 text-orange-600" />
            </Link>
            <div>
              <h1 className="text-lg sm:text-3xl font-bold text-gray-900">
                🔢 Additions jusqu'à 1000 - CE1
              </h1>
              <p className="text-xs sm:text-lg text-gray-600">
                Maîtrise les additions avec les nombres à 3 chiffres !
              </p>
            </div>
          </div>

          {/* Bouton d'arrêt global */}
          <div className="flex justify-end">
            <button
              onClick={handleStopAllVocalsAndAnimations}
              className="bg-red-100 hover:bg-red-200 text-red-700 px-2 sm:px-4 py-1 sm:py-2 rounded-lg text-xs sm:text-sm font-bold transition-colors flex items-center gap-1 sm:gap-2"
            >
              <Pause className="w-3 h-3 sm:w-4 sm:h-4" />
              Arrêter
            </button>
          </div>
        </div>

        {/* Navigation entre cours et exercices */}
        <div className={`flex justify-center ${showExercises ? 'mb-2 sm:mb-6' : 'mb-8'}`}>
          <div className="bg-white rounded-lg p-0.5 sm:p-1 shadow-md flex">
            <button
              onClick={() => {
                handleStopAllVocalsAndAnimations();
                setShowExercises(false);
              }}
              className={`px-3 sm:px-6 py-1.5 sm:py-3 rounded-lg font-bold transition-all text-sm sm:text-base min-h-[44px] sm:min-h-[68px] flex items-center justify-center ${
                !showExercises 
                  ? 'bg-orange-500 text-white shadow-md' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              📖 Cours
            </button>
            <button
              id="exercises-tab"
              onClick={() => {
                handleStopAllVocalsAndAnimations();
                setShowExercises(true);
              }}
              className={`px-3 sm:px-6 py-1.5 sm:py-3 rounded-lg font-bold transition-all text-sm sm:text-base min-h-[44px] sm:min-h-[68px] flex flex-col items-center justify-center ${
                showExercises 
                  ? 'bg-green-500 text-white shadow-md' 
                  : 'text-gray-600 hover:bg-gray-100'
              } ${
                highlightedElement === 'exercises-tab' ? 'ring-4 ring-green-400 bg-green-100 animate-pulse scale-110 shadow-2xl' : ''
              }`}
            >
              <span>✏️ Exercices</span>
              <span className="text-xs sm:text-sm opacity-90">({score}/{exercises.length})</span>
            </button>
          </div>
        </div>

        {!showExercises ? (
          /* COURS */
          <div className="space-y-1 sm:space-y-6">
            {/* Image de Sam le Pirate avec bouton DÉMARRER */}
            <div className="flex items-center justify-center gap-2 sm:gap-4 p-2 sm:p-4 mb-1 sm:mb-6">
              <div className={`relative transition-all duration-500 border-2 border-orange-300 rounded-full bg-gradient-to-br from-orange-100 to-red-100 ${
                isAnimationRunning
                  ? 'w-14 sm:w-24 h-14 sm:h-24'
                  : samSizeExpanded
                    ? 'w-12 sm:w-32 h-12 sm:h-32'
                    : 'w-12 sm:w-20 h-12 sm:h-20'
                }`}>
                {!imageError ? (
                  <img 
                    src="/image/pirate-small.png" 
                    alt="Sam le Pirate" 
                    className="w-full h-full rounded-full object-cover"
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <div className="w-full h-full rounded-full flex items-center justify-center text-xs sm:text-2xl">
                    🏴‍☠️
                  </div>
                )}
                {isAnimationRunning && (
                  <div className="absolute -top-1 -right-1 bg-red-500 text-white p-1 rounded-full shadow-lg">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.77L4.916 14H2a1 1 0 01-1-1V7a1 1 0 011-1h2.916l3.467-2.77a1 1 0 011.617.77zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.983 5.983 0 01-1.757 4.243 1 1 0 01-1.415-1.414A3.983 3.983 0 0013 10a3.983 3.983 0 00-1.172-2.829 1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
              
              {/* Bouton Démarrer */}
              <div className="text-center">
                <button
                  onClick={explainChapter}
                  disabled={isAnimationRunning}
                  className={`bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 sm:px-8 py-2 sm:py-4 rounded-xl font-bold text-xs sm:text-xl shadow-2xl hover:shadow-3xl transition-all transform hover:scale-105 ${
                    isAnimationRunning ? 'opacity-75 cursor-not-allowed' : 'hover:from-orange-600 hover:to-red-600'
                  }`}
                >
                  <Play className="inline w-3 h-3 sm:w-6 sm:h-6 mr-1 sm:mr-2" />
                  {isAnimationRunning ? '⏳ JE PARLE...' : '🔢 DÉMARRER'}
                </button>
              </div>
            </div>

            {/* Explication du concept */}
            <div 
              id="concept-section"
              className={`bg-white rounded-xl p-2 sm:p-8 shadow-lg transition-all duration-1000 ${
                highlightedElement === 'concept-section' ? 'ring-4 ring-orange-400 bg-orange-50 scale-105' : ''
              }`}
            >
              <div className="flex items-center justify-center gap-1 sm:gap-3 mb-3 sm:mb-6">
                <h2 className="text-base sm:text-2xl font-bold text-gray-900">
                  🔢 Additions jusqu'à 1000
                </h2>
              </div>
              
              <div className="bg-orange-50 rounded-lg p-3 sm:p-6 mb-3 sm:mb-6">
                <p className="text-sm sm:text-lg text-center text-orange-800 font-semibold mb-3 sm:mb-6">
                  Les additions avec des nombres à 3 chiffres, c'est comme les plus petites !
                </p>
                
                <div className="bg-white rounded-lg p-3 sm:p-6">
                  <div className="text-center mb-3 sm:mb-6">
                    <div className="text-lg sm:text-2xl font-bold text-orange-600 mb-1 sm:mb-4">
                      {currentExample !== null ? 
                        `Exemple : ${additionExamples[currentExample].first} + ${additionExamples[currentExample].second} = ${additionExamples[currentExample].result}` 
                        : 'Exemple : 345 + 128 = 473'
                      }
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section des exemples */}
            <div 
              id="examples-section"
              className={`bg-white rounded-xl p-4 sm:p-8 shadow-lg transition-all duration-1000 ${
                highlightedElement === 'examples-section' ? 'ring-4 ring-orange-400 bg-orange-50 scale-105' : ''
              }`}
            >
              <h2 className="text-lg sm:text-2xl font-bold text-center text-gray-900 mb-4 sm:mb-6">
                📚 Exemples d'additions
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {additionExamples.map((example, index) => (
                  <div key={index} className="bg-gradient-to-br from-orange-100 to-yellow-100 rounded-lg p-3 sm:p-4 border-2 border-orange-200">
                    <div className="text-center">
                      <div className="text-sm sm:text-lg font-bold text-orange-700 mb-2">
                        {example.first} + {example.second}
                      </div>
                      <div className="text-lg sm:text-xl font-bold text-green-600">
                        = {example.result}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-600 mt-2">
                        {example.description}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* EXERCICES */
          <div className="bg-white rounded-xl p-4 sm:p-8 shadow-lg">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h2 className="text-lg sm:text-2xl font-bold text-gray-900">
                ✏️ Exercices - Additions jusqu'à 1000
              </h2>
              <div className="text-sm sm:text-lg font-semibold text-gray-600">
                {currentExercise + 1} / {exercises.length}
              </div>
            </div>

            <div className="text-center mb-4 sm:mb-8">
              <div className="text-xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
                {exercises[currentExercise].question}
              </div>
              
              <input
                type="number"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleValidateAnswer()}
                className="text-lg sm:text-2xl font-bold text-center border-2 border-gray-300 rounded-lg px-3 sm:px-4 py-2 sm:py-3 w-32 sm:w-48 focus:border-orange-500 focus:outline-none"
                placeholder="?"
                autoFocus
              />
              
              <div className="mt-3 sm:mt-4">
                <button
                  onClick={handleValidateAnswer}
                  disabled={!userAnswer.trim()}
                  className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 sm:px-8 py-2 sm:py-3 rounded-lg font-bold text-sm sm:text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:from-orange-600 hover:to-red-600 transition-all"
                >
                  Valider
                </button>
              </div>

              {isCorrect !== null && (
                <div className={`mt-3 sm:mt-4 text-lg sm:text-xl font-bold ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                  {isCorrect ? '✅ Correct ! Bravo !' : '❌ Oops, essaie encore !'}
                  {!isCorrect && (
                    <div className="text-sm sm:text-lg text-gray-600 mt-2">
                      La bonne réponse est : {exercises[currentExercise].first + exercises[currentExercise].second}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="flex justify-between items-center">
              <div className="text-sm sm:text-lg font-semibold text-gray-600">
                Score : {score} / {exercises.length}
              </div>
              
              <div className="flex gap-2 sm:gap-4">
                <button
                  onClick={resetAll}
                  className="bg-gray-500 text-white px-3 sm:px-6 py-1.5 sm:py-2 rounded-lg font-bold text-xs sm:text-sm hover:bg-gray-600 transition-colors"
                >
                  Recommencer
                </button>
                
                <button
                  onClick={nextExercise}
                  className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 sm:px-6 py-1.5 sm:py-2 rounded-lg font-bold text-xs sm:text-sm hover:from-orange-600 hover:to-red-600 transition-all"
                >
                  Suivant
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal de completion */}
        {showCompletionModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 sm:p-8 max-w-md w-full text-center">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
                🎉 Exercices terminés !
              </h3>
              <p className="text-lg text-gray-600 mb-6">
                Tu as obtenu un score de {finalScore} / {exercises.length}
              </p>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => {
                    setShowCompletionModal(false);
                    resetAll();
                  }}
                  className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-lg font-bold hover:from-orange-600 hover:to-red-600 transition-all"
                >
                  Recommencer
                </button>
                <button
                  onClick={() => setShowCompletionModal(false)}
                  className="bg-gray-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-gray-600 transition-colors"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}