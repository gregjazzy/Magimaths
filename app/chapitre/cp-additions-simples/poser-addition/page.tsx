'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, Play, Pause } from 'lucide-react';

export default function PoserAdditionCP() {
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
  
  // Refs pour gérer l'audio
  const stopSignalRef = useRef(false);
  const currentAudioRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Exemples d'additions posées
  const additionExamples = [
    { num1: 23, num2: 14, result: 37, hasCarry: false, description: 'sans retenue' },
    { num1: 31, num2: 26, result: 57, hasCarry: false, description: 'sans retenue' },
    { num1: 37, num2: 28, result: 65, hasCarry: true, description: 'avec retenue' },
    { num1: 49, num2: 27, result: 76, hasCarry: true, description: 'avec retenue' },
    { num1: 123, num2: 145, result: 268, hasCarry: false, description: 'nombres à 3 chiffres' }
  ];

  // Exercices progressifs
  const exercises = [
    {
      question: 'Pour poser une addition, je dois...', 
      correctAnswer: 'Aligner les chiffres en colonnes',
      choices: ['Écrire n\'importe comment', 'Aligner les chiffres en colonnes', 'Mélanger les nombres']
    },
    { 
      question: 'Par quelle colonne commence-t-on ?', 
      correctAnswer: 'Les unités (à droite)',
      choices: ['Les dizaines (à gauche)', 'Les unités (à droite)', 'N\'importe laquelle']
    },
    { 
      question: 'Calcule : 23 + 14', 
      correctAnswer: '37',
      choices: ['36', '37', '38'],
      visual: '   23\n+  14\n─────\n   ?'
    },
    { 
      question: 'Calcule : 31 + 26', 
      correctAnswer: '57',
      choices: ['56', '57', '58'],
      visual: '   31\n+  26\n─────\n   ?'
    },
    { 
      question: 'Quand faut-il faire une retenue ?', 
      correctAnswer: 'Quand le résultat dépasse 9',
      choices: ['Toujours', 'Quand le résultat dépasse 9', 'Jamais']
    },
    { 
      question: 'Calcule avec retenue : 27 + 18', 
      correctAnswer: '45',
      choices: ['44', '45', '46'],
      visual: '   27\n+  18\n─────\n   ?'
    },
    { 
      question: 'Calcule avec retenue : 39 + 16', 
      correctAnswer: '55',
      choices: ['54', '55', '56'],
      visual: '   39\n+  16\n─────\n   ?'
    },
    { 
      question: 'Pour les nombres à 3 chiffres, combien de colonnes ?', 
      correctAnswer: '3 colonnes',
      choices: ['2 colonnes', '3 colonnes', '4 colonnes']
    },
    { 
      question: 'Calcule : 123 + 145', 
      correctAnswer: '268',
      choices: ['267', '268', '269'],
      visual: '  123\n+ 145\n─────\n   ?'
    },
    { 
      question: 'L\'addition posée nous aide à...', 
      correctAnswer: 'Ne pas faire d\'erreurs',
      choices: ['Aller plus vite', 'Ne pas faire d\'erreurs', 'Faire plus joli']
    }
  ];

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
    setIsAnimationRunning(false);
    setHighlightedElement(null);
    setAnimatingStep(null);
    setCurrentExample(null);
    setHighlightedDigits([]);
    setCalculationStep(null);
    setShowingCarry(false);
    setPartialResults({units: null, tens: null, hundreds: null});
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

  // Fonction pour expliquer un exemple spécifique avec animations interactives
  const explainExample = async (index: number) => {
    if (isAnimationRunning) return;
    
    stopAllVocalsAndAnimations();
    await wait(300);
    stopSignalRef.current = false;
    setIsAnimationRunning(true);
    setCurrentExample(index);
    setPartialResults({units: null, tens: null, hundreds: null}); // Reset des résultats partiels
    
    const example = additionExamples[index];
    
    try {
      // Introduction avec focus sur le tableau U/D
      setCalculationStep('setup');
      setHighlightedElement('example-section');
      await playAudio(`Regardons ensemble cette addition posée : ${example.num1} plus ${example.num2} ! C'est parti !`, true);
      if (stopSignalRef.current) return;
      
      await wait(1000);
      await playAudio("Vois-tu le tableau au-dessus ? D pour dizaines... U pour unités ! C'est très important de bien comprendre ça !", true);
      if (stopSignalRef.current) return;
      
      await wait(1500);
      await playAudio("Chaque chiffre doit aller dans la bonne colonne ! Regarde comme ils s'alignent parfaitement... Magnifique !", true);
      if (stopSignalRef.current) return;
      
      // Focus sur les unités avec animation colorée
      await wait(2000);
      setCalculationStep('units');
      const num1Units = example.num1 % 10;
      const num2Units = example.num2 % 10;
      const unitsSum = num1Units + num2Units;
      
      await playAudio(`Maintenant, la colonne des unités devient bleue ! Regarde bien... Je calcule : ${num1Units} plus ${num2Units} égale ${unitsSum} !`, true);
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
          await playAudio(`Oh là là ! ${unitsSum} est plus grand que 9 ! Attention... Regarde la petite retenue rouge qui apparaît !`, true);
          if (stopSignalRef.current) return;
          
          await wait(1000);
          await playAudio(`Regarde à côté ! ${unitsSum} égale ${Math.floor(unitsSum / 10)} dizaine et ${unitsSum % 10} unités ! Le ${Math.floor(unitsSum / 10)} va en retenue... et le ${unitsSum % 10} reste dans les unités ! C'est magique, non ?`, true);
        if (stopSignalRef.current) return;
      }
      
      // Focus sur les dizaines avec animation orange
      await wait(2000);
      setCalculationStep('tens');
      const num1Tens = Math.floor(example.num1 / 10);
      const num2Tens = Math.floor(example.num2 / 10);
      const carry = example.hasCarry ? Math.floor(unitsSum / 10) : 0;
      
              if (num1Tens > 0 || num2Tens > 0) {
          await playAudio(`Maintenant, la colonne des dizaines devient orange ! Regarde comme elle s'anime... Fantastique !`, true);
          if (stopSignalRef.current) return;
          
          await wait(1000);
          const tensSum = num1Tens + num2Tens + carry;
          if (example.hasCarry) {
            await playAudio(`Je calcule : ${num1Tens} plus ${num2Tens}... plus ${carry} de retenue ! Ça fait ${tensSum} !`, true);
          } else {
            await playAudio(`Je calcule : ${num1Tens} plus ${num2Tens}... égale ${tensSum} !`, true);
          }
          if (stopSignalRef.current) return;
          
          // Afficher le résultat des dizaines immédiatement
          await wait(500);
          setPartialResults(prev => ({ ...prev, tens: tensSum > 0 ? tensSum.toString() : '' }));
          await wait(1000);
        } else if (carry > 0) {
          await playAudio(`Pour les dizaines... j'ai seulement ma petite retenue de ${carry} qui m'attend ! Facile !`, true);
          if (stopSignalRef.current) return;
          
          // Afficher la retenue comme résultat des dizaines
          await wait(500);
          setPartialResults(prev => ({ ...prev, tens: carry.toString() }));
          await wait(1000);
        }
      
              // Résultat final avec animation violette spectaculaire
        await wait(2000);
        setCalculationStep('result');
        await playAudio(`Et voilà ! Le résultat apparaît en violet... avec une belle animation ! C'est ${example.result} !`, true);
        if (stopSignalRef.current) return;
        
        await wait(1500);
        await playAudio("As-tu vu comme tout s'est bien aligné ? C'est ça, l'addition posée ! Parfait !", true);
        if (stopSignalRef.current) return;
        
        // Message pédagogique final
        await wait(1000);
        await playAudio("Souviens-toi : toujours commencer par les unités... puis les dizaines... et n'oublie jamais les retenues !", true);
      if (stopSignalRef.current) return;
      
      await wait(2500);
      setCurrentExample(null);
      setCalculationStep(null);
      setShowingCarry(false);
      setHighlightedElement(null);
      
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
    const maxDigits = Math.max(example.num1.toString().length, example.num2.toString().length, example.result.toString().length);
    const num1Str = example.num1.toString().padStart(maxDigits, ' ');
    const num2Str = example.num2.toString().padStart(maxDigits, ' ');
    const resultStr = example.result.toString().padStart(maxDigits, ' ');
    
    // Séparer les chiffres (unités, dizaines, centaines)
    const num1Units = num1Str[num1Str.length - 1];
    const num1Tens = num1Str[num1Str.length - 2] === ' ' ? '' : num1Str[num1Str.length - 2];
    const num1Hundreds = maxDigits >= 3 ? (num1Str[num1Str.length - 3] === ' ' ? '' : num1Str[num1Str.length - 3]) : '';
    
    const num2Units = num2Str[num2Str.length - 1];
    const num2Tens = num2Str[num2Str.length - 2] === ' ' ? '' : num2Str[num2Str.length - 2];
    const num2Hundreds = maxDigits >= 3 ? (num2Str[num2Str.length - 3] === ' ' ? '' : num2Str[num2Str.length - 3]) : '';
    
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
              <div className={`grid gap-8 font-bold text-lg ${maxDigits >= 3 ? 'grid-cols-3' : 'grid-cols-2'}`}>
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

            {/* Retenue si nécessaire */}
            {example.hasCarry && showingCarry && (
              <div className="flex justify-center">
                <div className={`grid gap-8 ${maxDigits >= 3 ? 'grid-cols-3' : 'grid-cols-2'}`}>
                  {maxDigits >= 3 && <div className="text-center"></div>}
                  <div className="text-center text-red-500 text-lg animate-carry-bounce">
                    <sup className="bg-red-100 px-2 py-1 rounded-full border-2 border-red-300">1</sup>
                  </div>
                  <div className="text-center"></div>
                </div>
              </div>
            )}
            
            {/* Premier nombre */}
            <div className="flex justify-center">
              <div className={`grid gap-8 font-mono text-3xl ${maxDigits >= 3 ? 'grid-cols-3' : 'grid-cols-2'}`}>
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
                <div className={`grid gap-8 font-mono text-3xl ${maxDigits >= 3 ? 'grid-cols-3' : 'grid-cols-2'}`}>
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
            
            {/* Ligne de séparation animée */}
            <div className="flex justify-center">
              <div className={`border-t-4 my-3 transition-all duration-700 ${
                calculationStep === 'result' ? 'border-purple-500 shadow-lg animate-pulse' : 'border-purple-400'
              }`} style={{ width: maxDigits >= 3 ? '11rem' : '7.5rem' }}></div>
            </div>
            
            {/* Résultat avec animations progressives */}
            <div className="flex justify-center">
              <div className={`grid gap-8 font-mono text-3xl font-bold ${maxDigits >= 3 ? 'grid-cols-3' : 'grid-cols-2'}`}>
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
                    🔵 On commence par les <strong>unités</strong> : {num1Units} + {num2Units} !
                  </div>
                )}
                {calculationStep === 'tens' && (
                  <div className="bg-orange-100 text-orange-800 p-3 rounded-lg animate-fade-in font-medium">
                    🟠 Puis les <strong>dizaines</strong> : {num1Tens || '0'} + {num2Tens || '0'} !
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

          {/* Panneau explicatif des retenues - Position fixe à droite */}
          {example.hasCarry && showingCarry && (
            <div className="fixed top-20 right-4 z-10 bg-yellow-100 border-2 border-yellow-300 rounded-lg p-4 shadow-lg animate-fade-in max-w-xs">
              <div className="flex items-center justify-between mb-3">
                <div className="text-sm text-yellow-700 font-medium">Calcul des unités :</div>
                <div className="text-yellow-600 text-xs">💡 Aide</div>
              </div>
              <div className="font-mono text-xl text-yellow-800 text-center mb-3">
                {example.num1 % 10} + {example.num2 % 10} = {(example.num1 % 10) + (example.num2 % 10)}
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-center gap-2 text-sm text-yellow-700">
                  <span className="bg-red-200 px-2 py-1 rounded font-bold">{Math.floor(((example.num1 % 10) + (example.num2 % 10)) / 10)}</span>
                  <span>↗ retenue</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-sm text-yellow-700">
                  <span className="bg-blue-200 px-2 py-1 rounded font-bold">{((example.num1 % 10) + (example.num2 % 10)) % 10}</span>
                  <span>↓ unités</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
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
      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
      {/* Header */}
        <div className="mb-6 sm:mb-8">
          <Link href="/chapitre/cp-additions-simples" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-3 sm:mb-4">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm sm:text-base">Retour aux additions</span>
            </Link>
          
          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg text-center">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              📝 Poser une Addition
            </h1>
            <p className="text-base sm:text-lg text-gray-600 mb-4 sm:mb-6 px-2">
              Apprends à poser tes additions en colonnes comme un vrai mathématicien !
            </p>
        </div>
      </div>

        {/* Bouton Démarrer la leçon */}
        <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-xl shadow-lg p-6 mb-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">🎯 Découvrir les additions posées</h2>
          <p className="text-green-100 mb-6 text-lg">
            Présentation rapide des techniques disponibles sur cette page !
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={startLessonPresentation}
              disabled={isAnimationRunning}
              className={`px-8 py-4 rounded-xl font-bold text-xl transition-all ${
                isAnimationRunning 
                  ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
                  : 'bg-white text-green-600 hover:bg-green-50 hover:scale-105 shadow-lg'
              }`}
            >
              {isAnimationRunning ? '⏳ Présentation en cours...' : '🚀 Découvrir les techniques'}
            </button>
            
            {isAnimationRunning && (
              <button
                onClick={stopAllVocalsAndAnimations}
                className="px-6 py-4 rounded-xl font-bold text-xl bg-red-500 text-white hover:bg-red-600 shadow-lg transition-all"
              >
                ⏹️ Arrêter
              </button>
            )}
        </div>
      </div>

        {/* Navigation entre cours et exercices */}
        <div className="flex justify-center mb-6 sm:mb-8">
          <div className="bg-white rounded-lg p-1 shadow-md flex">
            <button
              onClick={() => {
                setShowExercises(false);
                stopAllVocalsAndAnimations();
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
                setShowExercises(true);
                stopAllVocalsAndAnimations();
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
            {/* Introduction */}
            <div 
              id="intro-section"
              className={`bg-white rounded-xl p-8 shadow-lg transition-all duration-1000 ${
                highlightedElement === 'intro-section' ? 'ring-4 ring-green-400 bg-green-50 scale-105' : ''
              }`}
            >
              <div className="text-center mb-6">
                <div className="text-6xl mb-4">📝</div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Qu'est-ce que poser une addition ?
                </h2>
                <p className="text-lg text-gray-600">
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
                <h3 className="text-xl font-bold text-center mb-6 text-gray-800">
                  🎯 Exemple principal
                  </h3>

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
              className={`bg-white rounded-xl p-8 shadow-lg transition-all duration-1000 ${
                highlightedElement === 'examples-section' ? 'ring-4 ring-blue-400 bg-blue-50 scale-105' : ''
              }`}
            >
              <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
                🌟 Autres exemples d'additions posées
              </h2>
              
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
                      <div className="text-sm text-gray-600 mb-3">
                        Addition {example.description}
                    </div>
                      <button className={`px-4 py-2 rounded-lg text-sm transition-colors ${
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
            <div className="bg-gradient-to-r from-green-400 to-teal-500 rounded-xl p-6 text-white">
              <h3 className="text-xl font-bold mb-4 text-center">
                💡 Guide pour poser une addition
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-3xl mb-2">1️⃣</div>
                  <div className="font-bold">Aligner</div>
                  <div className="text-sm">Unités sous unités, dizaines sous dizaines</div>
              </div>
                <div>
                  <div className="text-3xl mb-2">2️⃣</div>
                  <div className="font-bold">Calculer</div>
                  <div className="text-sm">Commence par la droite (unités)</div>
            </div>
                <div>
                  <div className="text-3xl mb-2">3️⃣</div>
                  <div className="font-bold">Retenue</div>
                  <div className="text-sm">Si ≥ 10, écris l'unité et retiens</div>
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
            {/* Header exercices */}
            <div className={`bg-white rounded-xl p-6 shadow-lg ${
              highlightedElement === 'exercises-section' ? 'ring-4 ring-blue-400 bg-blue-50' : ''
            }`}>
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
                <div className="bg-gray-50 rounded-lg p-6 mb-8 flex justify-center">
                  <div className="font-mono text-2xl text-gray-800 leading-tight" style={{ width: '12rem' }}>
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