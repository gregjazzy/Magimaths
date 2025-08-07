'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, XCircle, RotateCcw, Lightbulb } from 'lucide-react';

interface Exercise {
  question: string;
  fraction1?: string;
  fraction2?: string;
  mathExpression?: string;
  correctAnswer: string;
  hint: string;
  hasVisual: boolean;
}

// Composant pour afficher une fraction mathématique
function FractionMath({a, b, size = 'text-xl'}: {a: string|number, b: string|number, size?: string}) {
  return (
    <span className={`inline-block align-middle ${size} text-gray-900 font-bold`} style={{ minWidth: 24 }}>
      <span className="flex flex-col items-center" style={{lineHeight:1}}>
        <span className="border-b-2 border-gray-800 px-1 text-gray-900">{a}</span>
        <span className="px-1 text-gray-900">{b}</span>
      </span>
    </span>
  );
}

export default function CE2AdditionFractionsPage() {
  const [currentExercise, setCurrentExercise] = useState(0);
  const [numerator, setNumerator] = useState('');
  const [denominator, setDenominator] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showExercises, setShowExercises] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredCorrectly, setAnsweredCorrectly] = useState<Set<number>>(new Set());
  const [showHint, setShowHint] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [finalScore, setFinalScore] = useState(0);

  // États et références nécessaires selon readmeanim
  const [isPlayingVocal, setIsPlayingVocal] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [characterSizeExpanded, setCharacterSizeExpanded] = useState(false);
  const [highlightedElement, setHighlightedElement] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const stopSignalRef = useRef(false);
  const currentAudioRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Fonction pour sauvegarder le progrès et calculer les XP
  const saveProgress = (finalScore: number) => {
    const sectionId = 'ce2-addition';
    const maxScore = exercises.length;
    const percentage = finalScore / maxScore;
    const baseXP = 20; // XP de base pour cette section CE2
    const earnedXP = Math.round(baseXP * percentage);
    
    const progressData = {
      sectionId,
      score: finalScore,
      maxScore,
      attempts: 1,
      completed: true,
      completionDate: new Date().toISOString(),
      xpEarned: earnedXP
    };

    // Sauvegarder dans localStorage
    const savedProgress = localStorage.getItem('ce2-fractions-addition-progress');
    let allProgress = [];
    
    if (savedProgress) {
      allProgress = JSON.parse(savedProgress);
    }
    
    // Mettre à jour ou ajouter le progrès de cette section
    const existingIndex = allProgress.findIndex((p: any) => p.sectionId === sectionId);
    if (existingIndex >= 0) {
      allProgress[existingIndex] = progressData;
    } else {
      allProgress.push(progressData);
    }
    
    localStorage.setItem('ce2-fractions-addition-progress', JSON.stringify(allProgress));
    
    // Déclencher un événement pour notifier les autres composants
    window.dispatchEvent(new Event('storage'));
  };

  // Fonctions de contrôle vocal selon readmeanim
  const stopAllVocalsAndAnimations = () => {
    stopSignalRef.current = true;
    setIsPlayingVocal(false);
    setIsAnimating(false);
    setHighlightedElement(null);
    
    if (currentAudioRef.current) {
      window.speechSynthesis.cancel();
      currentAudioRef.current = null;
    }
  };

  const playAudio = (text: string): Promise<void> => {
    return new Promise((resolve) => {
      if (stopSignalRef.current) {
        resolve();
        return;
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'fr-FR';
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      
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
      window.speechSynthesis.speak(utterance);
    });
  };

  // Fonctions de scrolling et mise en évidence selon readmeanim
  const scrollToElement = (elementId: string) => {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      });
    }
  };

  const highlightElement = (elementId: string) => {
    setHighlightedElement(elementId);
    setTimeout(() => {
      if (!stopSignalRef.current) {
        setHighlightedElement(null);
      }
    }, 3000);
  };

  const highlightElementsSequentially = async (elementIds: string[], delay: number = 1500) => {
    for (const elementId of elementIds) {
      if (stopSignalRef.current) break;
      highlightElement(elementId);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  };

  // Structure du tutoriel avec scrolling selon readmeanim
  const explainChapter = async () => {
    stopSignalRef.current = false;
    setIsAnimating(true);

    if (!showExercises) {
      // Mode COURS
      await playAudio("Salut jeune architecte ! Bienvenue dans l'atelier des additions magiques !");
      if (stopSignalRef.current) return;

      scrollToElement('intro-section');
      highlightElement('intro-section');
      await playAudio("Ici, tu vas apprendre à additionner des fractions comme un vrai maître bâtisseur !");
      if (stopSignalRef.current) return;

      scrollToElement('rules-section');
      highlightElement('rules-section');
      await playAudio("Voici la règle d'or : pour additionner des fractions, on additionne les numérateurs et on garde le même dénominateur !");
      if (stopSignalRef.current) return;

      scrollToElement('examples-section');
      highlightElement('examples-section');
      await playAudio("Regarde bien ces exemples avec leurs dessins. Les cercles colorés t'aident à comprendre !");
      if (stopSignalRef.current) return;

      scrollToElement('method-section');
      highlightElement('method-section');
      await playAudio("Et voici la méthode en 4 étapes pour ne jamais te tromper ! Maintenant, passe aux exercices pour t'entraîner !");

    } else {
      // Mode EXERCICES
      await playAudio("Parfait ! Tu es maintenant dans l'arène des défis mathématiques !");
      if (stopSignalRef.current) return;

      scrollToElement('progress-bar');
      highlightElement('progress-bar');
      await playAudio("Cette barre montre ta progression. Plus tu avances, plus tu deviens fort !");
      if (stopSignalRef.current) return;

      scrollToElement('question-zone');
      highlightElement('question-zone');
      await playAudio("Ici tu vois la question avec ses dessins magiques pour t'aider !");
      if (stopSignalRef.current) return;

      scrollToElement('answer-input');
      highlightElement('answer-input');
      await playAudio("Écris tes réponses dans ces cases : numérateur en haut, dénominateur en bas !");
      if (stopSignalRef.current) return;

      scrollToElement('action-buttons');
      highlightElement('action-buttons');
      await playAudio("Utilise ces boutons pour t'aider, effacer ou vérifier tes réponses ! Bonne chance, champion !");
    }

    setIsAnimating(false);
  };

  // useEffect pour arrêt automatique selon readmeanim
  useEffect(() => {
    return () => {
      stopAllVocalsAndAnimations();
    };
  }, [showExercises, currentExercise]);

  const examples = [
    { 
      fraction1: '1/4', 
      fraction2: '1/4', 
      result: '2/4', 
      explanation: 'On additionne les parts : 1 + 1 = 2'
    },
    { 
      fraction1: '1/3', 
      fraction2: '1/3', 
      result: '2/3', 
      explanation: 'On additionne les parts : 1 + 1 = 2'
    },
    { 
      fraction1: '2/6', 
      fraction2: '1/6', 
      result: '3/6', 
      explanation: 'On additionne les parts : 2 + 1 = 3'
    }
  ];

  const exercises: Exercise[] = [
    {
      question: 'Calcule : 1/4 + 1/4 = ?',
      fraction1: '1/4',
      fraction2: '1/4',
      correctAnswer: '2/4',
      hint: 'On additionne les nombres du haut : 1 + 1 = 2, le nombre du bas reste le même',
      hasVisual: true
    },
    {
      question: 'Calcule : 1/3 + 1/3 = ?',
      fraction1: '1/3',
      fraction2: '1/3',
      correctAnswer: '2/3',
      hint: 'On additionne les nombres du haut : 1 + 1 = 2, le nombre du bas reste 3',
      hasVisual: true
    },
    {
      question: 'Calcule : 1/6 + 2/6 = ?',
      fraction1: '1/6',
      fraction2: '2/6',
      correctAnswer: '3/6',
      hint: 'On additionne les nombres du haut : 1 + 2 = 3, le nombre du bas reste 6',
      hasVisual: true
    },
    {
      question: 'Calcule cette addition de fractions :',
      mathExpression: '\\frac{1}{5} + \\frac{1}{5} = ?',
      correctAnswer: '2/5',
      hint: 'On additionne les numérateurs : 1 + 1 = 2, le dénominateur reste 5',
      hasVisual: false
    },
    {
      question: 'Calcule cette addition de fractions :',
      mathExpression: '\\frac{2}{8} + \\frac{1}{8} = ?',
      correctAnswer: '3/8',
      hint: 'On additionne les numérateurs : 2 + 1 = 3, le dénominateur reste 8',
      hasVisual: false
    },
    {
      question: 'Calcule cette addition de fractions :',
      mathExpression: '\\frac{1}{4} + \\frac{2}{4} = ?',
      correctAnswer: '3/4',
      hint: 'On additionne les numérateurs : 1 + 2 = 3, le dénominateur reste 4',
      hasVisual: false
    },
    {
      question: 'Calcule cette addition de fractions :',
      mathExpression: '\\frac{3}{6} + \\frac{1}{6} = ?',
      correctAnswer: '4/6',
      hint: 'On additionne les numérateurs : 3 + 1 = 4, le dénominateur reste 6',
      hasVisual: false
    },
    {
      question: 'Calcule cette addition de fractions :',
      mathExpression: '\\frac{2}{5} + \\frac{2}{5} = ?',
      correctAnswer: '4/5',
      hint: 'On additionne les numérateurs : 2 + 2 = 4, le dénominateur reste 5',
      hasVisual: false
    },
    {
      question: 'Calcule cette addition de fractions :',
      mathExpression: '\\frac{1}{7} + \\frac{3}{7} = ?',
      correctAnswer: '4/7',
      hint: 'On additionne les numérateurs : 1 + 3 = 4, le dénominateur reste 7',
      hasVisual: false
    },
    {
      question: 'Calcule cette addition de fractions :',
      mathExpression: '\\frac{2}{9} + \\frac{1}{9} = ?',
      correctAnswer: '3/9',
      hint: 'On additionne les numérateurs : 2 + 1 = 3, le dénominateur reste 9',
      hasVisual: false
    }
  ];

  // Fonction pour créer la visualisation SVG des fractions en pie chart
  const renderFractionVisual = (fraction: string, x: number, color: string) => {
    const [numerator, denominator] = fraction.split('/').map(Number);
    const radius = 35;
    const centerX = x;
    const centerY = 50;
    
    const svgParts = [];
      const anglePerPart = 360 / denominator;
      
      for (let i = 0; i < denominator; i++) {
      const startAngle = i * anglePerPart - 90; // Commence en haut (-90°)
        const endAngle = (i + 1) * anglePerPart - 90;
        
      const startAngleRad = (startAngle * Math.PI) / 180;
      const endAngleRad = (endAngle * Math.PI) / 180;
      
      const x1 = centerX + radius * Math.cos(startAngleRad);
      const y1 = centerY + radius * Math.sin(startAngleRad);
      const x2 = centerX + radius * Math.cos(endAngleRad);
      const y2 = centerY + radius * Math.sin(endAngleRad);
        
        const largeArcFlag = anglePerPart > 180 ? 1 : 0;
      
      const pathData = [
        `M ${centerX} ${centerY}`, // Move to center
        `L ${x1} ${y1}`, // Line to start of arc
        `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`, // Arc
        'Z' // Close path
      ].join(' ');
      
      const fillColor = i < numerator ? color : '#f3f4f6';
      const strokeColor = '#6b7280';
        
        svgParts.push(
          <path
            key={i}
            d={pathData}
          fill={fillColor}
          stroke={strokeColor}
          strokeWidth="2"
          />
        );
      }
      
      return svgParts;
    };

  const renderFractionVisualExample = (fraction1: string, fraction2: string, result?: string) => {
    return (
      <div className="flex items-center justify-center space-x-4 mb-6">
        <div className="text-center">
          <svg width="80" height="100" viewBox="0 0 80 100" className="mx-auto border-2 border-gray-300 rounded-lg">
            {renderFractionVisual(fraction1, 40, "#ef4444")}
          </svg>
          <div className="mt-2">
            <FractionMath a={fraction1.split('/')[0]} b={fraction1.split('/')[1]} size="text-lg" />
          </div>
        </div>
        <div className="text-3xl font-bold text-blue-600">+</div>
        <div className="text-center">
          <svg width="80" height="100" viewBox="0 0 80 100" className="mx-auto border-2 border-gray-300 rounded-lg">
            {renderFractionVisual(fraction2, 40, "#3b82f6")}
          </svg>
          <div className="mt-2">
            <FractionMath a={fraction2.split('/')[0]} b={fraction2.split('/')[1]} size="text-lg" />
          </div>
        </div>
        {result && (
          <>
            <div className="text-3xl font-bold text-blue-600">=</div>
            <div className="text-center">
              <svg width="80" height="100" viewBox="0 0 80 100" className="mx-auto border-2 border-gray-300 rounded-lg">
                {renderFractionVisual(result, 40, "#10b981")}
              </svg>
              <div className="mt-2">
                <FractionMath a={result.split('/')[0]} b={result.split('/')[1]} size="text-lg" />
              </div>
            </div>
          </>
        )}
      </div>
    );
  };

  const checkAnswer = () => {
    const userAnswer = `${numerator}/${denominator}`;
      const correct = userAnswer === exercises[currentExercise].correctAnswer;
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
          scrollToElement('result-feedback');
          if (currentExercise + 1 < exercises.length) {
            setCurrentExercise(Math.min(currentExercise + 1, exercises.length - 1));
            setNumerator('');
            setDenominator('');
            setIsCorrect(null);
            setShowHint(false);
            setTimeout(() => scrollToElement('question-zone'), 100);
          } else {
            const newFinalScore = score + (!answeredCorrectly.has(currentExercise) ? 1 : 0);
            setFinalScore(newFinalScore);
            saveProgress(newFinalScore); // Sauvegarder les XP
            setShowCompletionModal(true);
          }
        }, 1500);
      } else {
        setTimeout(() => scrollToElement('result-feedback'), 100);
      }
  };

  const handleNext = () => {
    if (isCorrect !== null) {
      if (currentExercise + 1 < exercises.length) {
        setCurrentExercise(Math.min(currentExercise + 1, exercises.length - 1));
        setNumerator('');
        setDenominator('');
        setIsCorrect(null);
        setShowHint(false);
        setTimeout(() => scrollToElement('question-zone'), 100);
      } else {
        setFinalScore(score);
        saveProgress(score); // Sauvegarder les XP
        setShowCompletionModal(true);
      }
    }
  };

  const resetExercise = () => {
    setNumerator('');
    setDenominator('');
    setIsCorrect(null);
    setShowHint(false);
  };

  const resetAll = () => {
    setCurrentExercise(0);
    setNumerator('');
    setDenominator('');
    setIsCorrect(null);
    setScore(0);
    setShowHint(false);
    setAnsweredCorrectly(new Set());
    setShowCompletionModal(false);
    setFinalScore(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <Link href="/chapitre/ce2-fractions-mesures" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-4 touch-manipulation">
            <ArrowLeft className="w-4 h-4" />
            <span>Retour aux fractions et mesures</span>
          </Link>
          
          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg text-center">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              🧮 Addition de fractions simples
            </h1>
            <p className="text-base sm:text-lg text-gray-600">
              Apprends à additionner des fractions qui ont le même dénominateur ! (Niveau CE2)
            </p>
          </div>
        </div>

        {/* Personnage Minecraft avec bouton DÉMARRER selon readmeanim */}
        <div className="bg-gradient-to-r from-green-400 to-blue-500 rounded-xl p-6 shadow-lg mb-8">
          <div className="flex items-center justify-center gap-6 flex-wrap">
            <div id="minecraft-character" className={`relative transition-all duration-500 border-4 border-green-300 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 shadow-lg ${
              isPlayingVocal
                ? 'w-20 sm:w-24 h-20 sm:h-24' // Quand il parle - plus gros
                : characterSizeExpanded
                  ? 'w-16 sm:w-20 h-16 sm:h-20' // Après DÉMARRER - normal
                  : 'w-12 sm:w-16 h-12 sm:h-16' // Initial - plus petit
            }`}>
              <img
                src="/image/Minecraftstyle.png"
                alt="Personnage Minecraft"
                className="w-full h-full rounded-full object-cover"
              />
              {/* Mégaphone quand il parle */}
              {isPlayingVocal && (
                <div className="absolute -top-1 -right-1 bg-red-500 text-white p-1 rounded-full shadow-lg">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.77L4.916 14H2a1 1 0 01-1-1V7a1 1 0 011-1h2.916l3.467-2.77a1 1 0 011.617.77zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.983 5.983 0 01-1.757 4.243 1 1 0 01-1.415-1.414A3.983 3.983 0 0013 10a3.983 3.983 0 00-1.172-2.829 1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
            
            <button
              id="start-button"
              onClick={() => {
                setHasStarted(true);
                setCharacterSizeExpanded(true);
                explainChapter();
              }}
              disabled={isPlayingVocal}
              className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-4 px-8 rounded-lg text-xl shadow-lg transition-all pulse-interactive-yellow disabled:opacity-50 flex items-center justify-center"
            >
              🚀 DÉMARRER
            </button>
          </div>
        </div>

        {/* Bouton STOP flottant global selon readmeanim */}
        {(isPlayingVocal || isAnimating) && (
          <button
            onClick={stopAllVocalsAndAnimations}
            className="fixed top-4 right-4 z-[60] bg-red-500 hover:bg-red-600 text-white p-3 rounded-full shadow-lg transition-all flex items-center gap-2 pulse-interactive-gray"
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

        {/* Onglets Cours/Exercices */}
        <div id="tab-navigation" className={`flex justify-center mb-6 sm:mb-8 ${highlightedElement === 'tab-navigation' ? 'animate-pulse bg-yellow-200 rounded-xl p-2' : ''}`}>
          <div className="bg-white rounded-lg p-1 shadow-md">
            <button
              id="tab-cours"
              onClick={() => setShowExercises(false)}
              disabled={isPlayingVocal}
              className={`px-6 py-3 rounded-lg font-bold transition-all pulse-interactive ${
                !showExercises 
                  ? 'bg-blue-500 text-white shadow-md' 
                  : 'text-gray-600 hover:bg-gray-100'
              } disabled:opacity-50 ${highlightedElement === 'tab-cours' ? 'animate-pulse bg-yellow-200' : ''}`}
            >
              📖 Cours
            </button>
            <button
              id="tab-exercices"
              onClick={() => setShowExercises(true)}
              disabled={isPlayingVocal}
              className={`px-6 py-3 rounded-lg font-bold transition-all pulse-interactive ${
                showExercises 
                  ? 'bg-green-500 text-white shadow-md' 
                  : 'text-gray-600 hover:bg-gray-100'
              } disabled:opacity-50 ${highlightedElement === 'tab-exercices' ? 'animate-pulse bg-yellow-200' : ''}`}
            >
              ✏️ Exercices ({score}/{exercises.length})
            </button>
          </div>
        </div>

        {!showExercises ? (
          /* COURS */
          <div className="space-y-8">
            {/* Introduction */}
            <div id="intro-section" className={`bg-gradient-to-r from-blue-400 to-green-500 rounded-xl p-6 text-white text-center ${highlightedElement === 'intro-section' ? 'animate-pulse ring-4 ring-yellow-300' : ''}`}>
              <div className="text-6xl mb-4">🧮</div>
              <h2 className="text-3xl font-bold mb-4">L'atelier des additions magiques !</h2>
              <p className="text-xl">Découvre comment additionner des fractions comme un vrai maître bâtisseur !</p>
            </div>

            {/* Règle principale */}
            <div id="rules-section" className={`bg-white rounded-xl p-6 shadow-lg ${highlightedElement === 'rules-section' ? 'animate-pulse ring-4 ring-yellow-300' : ''}`}>
              <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
                🎯 Règle d'or pour additionner des fractions
              </h2>
              <div className="bg-blue-50 rounded-xl p-6 border-2 border-blue-200">
              <div className="text-center">
                  <div className="text-xl font-bold text-blue-800 mb-4">
                    Pour additionner deux fractions avec le même dénominateur :
                  </div>
                  <div className="text-lg text-blue-700 mb-4">
                    ✅ On additionne les numérateurs (nombres du haut)
                  </div>
                  <div className="text-lg text-blue-700">
                    ✅ On garde le même dénominateur (nombre du bas)
                  </div>
                </div>
              </div>
            </div>

            {/* Exemples visuels */}
            <div id="examples-section" className={`bg-white rounded-xl p-6 shadow-lg ${highlightedElement === 'examples-section' ? 'animate-pulse ring-4 ring-yellow-300' : ''}`}>
              <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
                📚 Exemples avec visualisation
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {examples.map((example, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-6">
                    <div className="text-center">
                      <h3 className="text-lg font-bold text-gray-800 mb-4">
                        <FractionMath a={example.fraction1.split('/')[0]} b={example.fraction1.split('/')[1]} size="text-2xl" />
                        <span className="mx-1 text-2xl align-middle">+</span>
                        <FractionMath a={example.fraction2.split('/')[0]} b={example.fraction2.split('/')[1]} size="text-2xl" />
                        <span className="mx-1 text-2xl align-middle">=</span>
                        <FractionMath a={example.result.split('/')[0]} b={example.result.split('/')[1]} size="text-2xl" />
                      </h3>
                      <div className="mb-4">
                        {renderFractionVisualExample(example.fraction1, example.fraction2, example.result)}
                      </div>
                      <p className="text-sm text-gray-600 bg-yellow-100 p-3 rounded-lg">
                        {example.explanation}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Conseils pratiques */}
            <div className="bg-gradient-to-r from-yellow-400 to-orange-400 rounded-xl p-6 text-white">
              <h3 className="text-xl font-bold mb-4">💡 Conseils pour réussir</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="text-yellow-200 mr-2">•</span>
                    Vérifie que les dénominateurs sont identiques
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-200 mr-2">•</span>
                    Additionne seulement les numérateurs
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-200 mr-2">•</span>
                    Le dénominateur reste le même
                  </li>
                </ul>
                <ul className="space-y-2">
                  <li className="flex items-start">
                     <span className="text-yellow-200 mr-2">•</span>
                     <span className="flex items-center">
                       Exemple : 
                       <span className="ml-2 flex items-center space-x-1">
                         <FractionMath a="1" b="4" size="text-sm" />
                         <span>+</span>
                         <FractionMath a="1" b="4" size="text-sm" />
                         <span>=</span>
                         <FractionMath a="2" b="4" size="text-sm" />
                       </span>
                     </span>
                   </li>
                  <li className="flex items-start">
                    <span className="text-yellow-200 mr-2">•</span>
                    Utilise les dessins pour t'aider
                  </li>
                  <li className="flex items-start">
                    <span className="text-yellow-200 mr-2">•</span>
                    Vérifie toujours ton résultat
                  </li>
                </ul>
              </div>
            </div>

            {/* Méthode étape par étape */}
            <div id="method-section" className={`bg-white rounded-xl p-6 shadow-lg ${highlightedElement === 'method-section' ? 'animate-pulse ring-4 ring-yellow-300' : ''}`}>
              <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
                📝 Méthode étape par étape
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-red-50 rounded-lg p-4 text-center">
                  <div className="text-2xl mb-2">1️⃣</div>
                  <h3 className="font-bold text-red-800 mb-2">Vérifier</h3>
                  <p className="text-red-700 text-sm">Les dénominateurs sont-ils identiques ?</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <div className="text-2xl mb-2">2️⃣</div>
                  <h3 className="font-bold text-blue-800 mb-2">Additionner</h3>
                  <p className="text-blue-700 text-sm">Additionne les numérateurs</p>
            </div>
                <div className="bg-green-50 rounded-lg p-4 text-center">
                  <div className="text-2xl mb-2">3️⃣</div>
                  <h3 className="font-bold text-green-800 mb-2">Conserver</h3>
                  <p className="text-green-700 text-sm">Garde le même dénominateur</p>
                  </div>
                <div className="bg-purple-50 rounded-lg p-4 text-center">
                  <div className="text-2xl mb-2">4️⃣</div>
                  <h3 className="font-bold text-purple-800 mb-2">Vérifier</h3>
                  <p className="text-purple-700 text-sm">Contrôle ton résultat</p>
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
                  disabled={isPlayingVocal}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-gray-600 transition-colors pulse-interactive disabled:opacity-50"
                >
                  <RotateCcw className="inline w-4 h-4 mr-2" />
                  Recommencer
                </button>
              </div>
              
              {/* Barre de progression */}
              <div id="progress-bar" className={`w-full bg-gray-200 rounded-full h-3 mb-3 ${highlightedElement === 'progress-bar' ? 'animate-pulse ring-4 ring-yellow-300' : ''}`}>
                <div 
                  className="bg-blue-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${((currentExercise + 1) / exercises.length) * 100}%` }}
                ></div>
              </div>
              
              {/* Score sous la barre */}
              <div className="text-center">
                <div className="text-lg font-bold text-blue-600">
                  Score : {score}/{exercises.length}
                </div>
              </div>
            </div>

            {/* Question */}
            <div id="question-zone" className={`bg-white rounded-xl p-6 shadow-lg ${highlightedElement === 'question-zone' ? 'animate-pulse ring-4 ring-yellow-300' : ''}`}>
              <div className="text-center mb-6">
                 <h3 className="text-2xl font-bold text-gray-900 mb-6">
                   {exercises[currentExercise].hasVisual && exercises[currentExercise].fraction1 && exercises[currentExercise].fraction2 ? (
                     <div className="flex items-center justify-center space-x-3">
                       <span>Calcule :</span>
                       <FractionMath a={exercises[currentExercise].fraction1!.split('/')[0]} b={exercises[currentExercise].fraction1!.split('/')[1]} size="text-2xl" />
                       <span>+</span>
                       <FractionMath a={exercises[currentExercise].fraction2!.split('/')[0]} b={exercises[currentExercise].fraction2!.split('/')[1]} size="text-2xl" />
                       <span>=</span>
                       <span>?</span>
                     </div>
                   ) : (
                     exercises[currentExercise].question
                   )}
                 </h3>

                {/* Visualisation si applicable */}
                {exercises[currentExercise].hasVisual && exercises[currentExercise].fraction1 && exercises[currentExercise].fraction2 && (
                  <div className="mb-6">
                    {renderFractionVisualExample(
                      exercises[currentExercise].fraction1!, 
                      exercises[currentExercise].fraction2!
                    )}
                  </div>
                )}

                {/* Expression mathématique si applicable */}
                 {exercises[currentExercise].mathExpression && (
                   <div className="text-3xl font-bold text-gray-800 mb-6">
                     {(() => {
                       const expression = exercises[currentExercise].mathExpression!;
                       // Parse \\frac{1}{5} + \\frac{1}{5} = ?
                       const fractionPattern = /\\frac\{(\d+)\}\{(\d+)\}/g;
                       const matches = [];
                       let match;
                       
                       while ((match = fractionPattern.exec(expression)) !== null) {
                         matches.push(match);
                       }
                       
                       if (matches.length >= 2) {
                         const [num1, den1] = [matches[0][1], matches[0][2]];
                         const [num2, den2] = [matches[1][1], matches[1][2]];
                         
                         return (
                           <div className="flex items-center justify-center space-x-4">
                             <FractionMath a={num1} b={den1} size="text-3xl" />
                             <span className="text-3xl">+</span>
                             <FractionMath a={num2} b={den2} size="text-3xl" />
                             <span className="text-3xl">=</span>
                             <span className="text-3xl">?</span>
                           </div>
                         );
                       }
                       
                       return <div>{expression}</div>;
                     })()}
                   </div>
                 )}

                {/* Template de réponse fraction */}
                 <div id="answer-input" className={`flex flex-col items-center mb-6 ${highlightedElement === 'answer-input' ? 'animate-pulse ring-4 ring-yellow-300 rounded-lg p-4' : ''}`}>
                   <div className="flex flex-col items-center bg-gray-50 rounded-lg p-6 border-2 border-gray-300">
                     <input
                       type="text"
                       value={numerator}
                       onChange={(e) => setNumerator(e.target.value)}
                       onKeyPress={(e) => {
                         if (e.key === 'Enter' && numerator.trim() && denominator.trim() && isCorrect === null) {
                           checkAnswer();
                         }
                       }}
                       placeholder="?"
                       className="w-16 sm:w-20 h-12 sm:h-14 text-center text-lg sm:text-xl font-bold border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none mb-2 touch-manipulation"
                       disabled={isCorrect !== null || isPlayingVocal}
                     />
                     <div className="w-20 sm:w-24 h-1 bg-gray-800 mb-2"></div>
                     <input
                       type="text"
                       value={denominator}
                       onChange={(e) => setDenominator(e.target.value)}
                       onKeyPress={(e) => {
                         if (e.key === 'Enter' && numerator.trim() && denominator.trim() && isCorrect === null) {
                           checkAnswer();
                         }
                       }}
                       placeholder="?"
                       className="w-16 sm:w-20 h-12 sm:h-14 text-center text-lg sm:text-xl font-bold border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none touch-manipulation"
                       disabled={isCorrect !== null || isPlayingVocal}
                     />
                   </div>
                 </div>

                {/* Affichage de l'indice */}
                 {showHint && (
                   <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 mb-4 rounded">
                     <div className="flex">
                       <Lightbulb className="w-5 h-5 text-yellow-600 mr-2" />
                       <p className="text-yellow-800">{exercises[currentExercise].hint}</p>
                     </div>
                   </div>
                 )}

                 {/* Navigation */}
                 <div id="action-buttons" className={`flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4 mt-4 ${highlightedElement === 'action-buttons' ? 'animate-pulse ring-4 ring-yellow-300 rounded-lg p-4' : ''}`}>
                   {/* Bouton indice */}
                   {!showHint && isCorrect === null && (
              <button
                       id="hint-button"
                       onClick={() => setShowHint(true)}
                       disabled={isPlayingVocal}
                       className="bg-yellow-500 text-white px-4 py-3 sm:px-6 sm:py-3 rounded-lg font-bold hover:bg-yellow-600 transition-colors pulse-interactive w-full sm:w-auto touch-manipulation min-h-[44px] disabled:opacity-50"
              >
                <Lightbulb className="inline w-4 h-4 mr-2" />
                       Aide
              </button>
                   )}
              <button
                id="reset-exercise-button"
                onClick={resetExercise}
                disabled={isPlayingVocal}
                     className="bg-gray-500 text-white px-4 py-3 sm:px-6 sm:py-3 rounded-lg font-bold hover:bg-gray-600 transition-colors pulse-interactive w-full sm:w-auto touch-manipulation min-h-[44px] disabled:opacity-50"
              >
                Effacer
              </button>
                   <button
                     id="prev-exercise-button"
                     onClick={() => setCurrentExercise(Math.max(0, currentExercise - 1))}
                     disabled={currentExercise === 0 || isPlayingVocal}
                     className="bg-gray-600 text-white px-4 py-3 sm:px-6 sm:py-3 rounded-lg font-bold hover:bg-gray-700 transition-colors pulse-interactive disabled:opacity-50 w-full sm:w-auto touch-manipulation min-h-[44px]"
                   >
                     ← Précédent
                   </button>
                   <button
                     id="check-next-button"
                     onClick={() => {
                       // Si l'utilisateur a rempli les champs mais n'a pas encore vérifié, on vérifie d'abord
                       if (numerator.trim() && denominator.trim() && isCorrect === null) {
                         checkAnswer();
                       } else {
                         handleNext();
                       }
                     }}
                     disabled={(isCorrect === null && (!numerator.trim() || !denominator.trim())) || isPlayingVocal}
                     className="bg-blue-500 text-white px-4 py-3 sm:px-6 sm:py-3 rounded-lg font-bold hover:bg-blue-600 transition-colors pulse-interactive disabled:opacity-50 w-full sm:w-auto touch-manipulation min-h-[44px]"
                   >
                     {numerator.trim() && denominator.trim() && isCorrect === null 
                       ? '✅ Vérifier' 
                       : currentExercise + 1 < exercises.length 
                         ? 'Suivant →' 
                         : 'Terminer ✨'}
                   </button>
                </div>
              </div>

              {/* Résultat */}
            {isCorrect !== null && (
                <div id="result-feedback" className={`p-4 rounded-lg ${
                  isCorrect ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
              }`}>
                <div className="flex items-center justify-center space-x-2">
                  {isCorrect ? (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      <span className="font-bold">Fantastique ! Tu maîtrises l'addition !</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-5 h-5" />
                      <span className="font-bold">
                        Pas tout à fait ! La bonne réponse est : {exercises[currentExercise].correctAnswer}
                      </span>
                    </>
                  )}
                </div>
              </div>
            )}
            </div>
          </div>
        )}

        {/* Modal de fin d'exercices */}
        {showCompletionModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-2xl transform transition-all duration-300 scale-100">
              {(() => {
                const percentage = Math.round((finalScore / exercises.length) * 100);
                const getMessage = () => {
                  if (percentage >= 90) return { 
                    title: "🧮 Expert en fractions !", 
                    message: "Tu maîtrises parfaitement l'addition de fractions !", 
                    color: "text-green-600",
                    bgColor: "bg-green-50" 
                  };
                  if (percentage >= 70) return { 
                    title: "🎯 Très bien !", 
                    message: "Tu comprends bien les fractions !", 
                    color: "text-blue-600",
                    bgColor: "bg-blue-50" 
                  };
                  if (percentage >= 50) return { 
                    title: "📚 En progression !", 
                    message: "Continue à t'entraîner avec les fractions !", 
                    color: "text-yellow-600",
                    bgColor: "bg-yellow-50" 
                  };
                  return { 
                    title: "💪 Continue !", 
                    message: "Les fractions demandent de l'entraînement !", 
                    color: "text-gray-600",
                    bgColor: "bg-gray-50" 
                  };
                };
                const result = getMessage();
                return (
                  <div className={`${result.bgColor} rounded-2xl p-6`}>
                    <div className="text-6xl mb-4">{percentage >= 70 ? "🎉" : percentage >= 50 ? "😊" : "📖"}</div>
                    <h3 className={`text-2xl font-bold mb-3 ${result.color}`}>{result.title}</h3>
                    <p className={`text-lg mb-4 ${result.color}`}>{result.message}</p>
                    <p className={`text-xl font-bold mb-4 ${result.color}`}>
                       Score final : {finalScore}/{exercises.length} ({percentage}%)
                     </p>
                     <div className="bg-yellow-100 rounded-lg p-4 mb-6">
                       <p className="text-lg font-bold text-yellow-800">
                         🌟 {Math.round(20 * (finalScore / exercises.length))} XP gagnés !
                </p>
              </div>
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-3 justify-center">
                <button
                  onClick={() => setShowCompletionModal(false)}
                        className="bg-gray-500 text-white px-4 py-3 sm:px-6 sm:py-3 rounded-xl font-bold hover:bg-gray-600 transition-colors touch-manipulation min-h-[44px] w-full sm:w-auto"
                >
                  Fermer
                </button>
                      <button
                        onClick={() => {
                          setShowCompletionModal(false);
                          resetAll();
                        }}
                        className="bg-blue-500 text-white px-4 py-3 sm:px-6 sm:py-3 rounded-xl font-bold hover:bg-blue-600 transition-colors touch-manipulation min-h-[44px] w-full sm:w-auto"
                      >
                        Recommencer
                      </button>
                    </div>
              </div>
                );
              })()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}