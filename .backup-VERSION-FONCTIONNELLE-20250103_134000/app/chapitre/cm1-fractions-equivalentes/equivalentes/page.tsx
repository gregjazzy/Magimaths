'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Play, RefreshCw, CheckCircle, XCircle, Eye, Lightbulb, Target, Trophy, Grid, Calculator, Book, Sparkles, ChevronRight, RotateCcw } from 'lucide-react';

export default function FractionsEquivalentesPage() {
  const [currentExercise, setCurrentExercise] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [showAnswer, setShowAnswer] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [showHelp, setShowHelp] = useState(false);

  // Animation states pour la démonstration d'équivalence
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationStep, setAnimationStep] = useState(0);
  const [selectedFraction, setSelectedFraction] = useState({ num: 1, den: 2 });

  // Animation states pour la correction
  const [isCorrectAnimating, setIsCorrectAnimating] = useState(false);
  const [correctAnimationStep, setCorrectAnimationStep] = useState(0);

  const exercises = [
    {
      question: 'Quelle fraction est équivalente à 1/2 ?',
      fractions: ['2/4', '3/5', '1/3', '3/6'],
      answer: '2/4',
      explanation: {
        originalFraction: { num: 1, den: 2 },
        targetFraction: { num: 2, den: 4 },
        multiplier: 2
      }
    },
    {
      question: 'Trouve la fraction équivalente à 2/3 :',
      fractions: ['4/6', '6/8', '3/4', '2/5'],
      answer: '4/6',
      explanation: {
        originalFraction: { num: 2, den: 3 },
        targetFraction: { num: 4, den: 6 },
        multiplier: 2
      }
    },
    {
      question: 'Quelle fraction équivaut à 3/4 ?',
      fractions: ['6/8', '4/5', '5/6', '7/9'],
      answer: '6/8',
      explanation: {
        originalFraction: { num: 3, den: 4 },
        targetFraction: { num: 6, den: 8 },
        multiplier: 2
      }
    },
    {
      question: 'Trouve l\'équivalent de 1/3 :',
      fractions: ['2/6', '3/8', '4/9', '1/4'],
      answer: '2/6',
      explanation: {
        originalFraction: { num: 1, den: 3 },
        targetFraction: { num: 2, den: 6 },
        multiplier: 2
      }
    },
    {
      question: 'Quelle fraction est équivalente à 2/5 ?',
      fractions: ['4/10', '3/7', '5/8', '6/12'],
      answer: '4/10',
      explanation: {
        originalFraction: { num: 2, den: 5 },
        targetFraction: { num: 4, den: 10 },
        multiplier: 2
      }
    },
    {
      question: 'Trouve la fraction équivalente à 1/4 :',
      fractions: ['3/12', '2/8', '4/16', '1/8'],
      answer: '3/12',
      explanation: {
        originalFraction: { num: 1, den: 4 },
        targetFraction: { num: 3, den: 12 },
        multiplier: 3
      }
    },
    {
      question: 'Quelle fraction équivaut à 3/5 ?',
      fractions: ['6/10', '9/12', '12/15', '15/20'],
      answer: '6/10',
      explanation: {
        originalFraction: { num: 3, den: 5 },
        targetFraction: { num: 6, den: 10 },
        multiplier: 2
      }
    },
    {
      question: 'Trouve l\'équivalent de 2/7 :',
      fractions: ['4/14', '6/21', '8/28', '3/10'],
      answer: '4/14',
      explanation: {
        originalFraction: { num: 2, den: 7 },
        targetFraction: { num: 4, den: 14 },
        multiplier: 2
      }
    },
    {
      question: 'Quelle fraction est équivalente à 4/9 ?',
      fractions: ['8/18', '12/27', '16/36', '6/12'],
      answer: '8/18',
      explanation: {
        originalFraction: { num: 4, den: 9 },
        targetFraction: { num: 8, den: 18 },
        multiplier: 2
      }
    },
    {
      question: 'Trouve la fraction équivalente à 1/6 :',
      fractions: ['2/12', '3/18', '4/24', '1/12'],
      answer: '2/12',
      explanation: {
        originalFraction: { num: 1, den: 6 },
        targetFraction: { num: 2, den: 12 },
        multiplier: 2
      }
    },
    {
      question: 'Quelle fraction équivaut à 5/8 ?',
      fractions: ['10/16', '15/24', '20/32', '7/12'],
      answer: '10/16',
      explanation: {
        originalFraction: { num: 5, den: 8 },
        targetFraction: { num: 10, den: 16 },
        multiplier: 2
      }
    },
    {
      question: 'Trouve l\'équivalent de 3/7 :',
      fractions: ['6/14', '9/21', '12/28', '4/9'],
      answer: '6/14',
      explanation: {
        originalFraction: { num: 3, den: 7 },
        targetFraction: { num: 6, den: 14 },
        multiplier: 2
      }
    },
    {
      question: 'Quelle fraction est équivalente à 2/9 ?',
      fractions: ['4/18', '6/27', '8/36', '3/12'],
      answer: '4/18',
      explanation: {
        originalFraction: { num: 2, den: 9 },
        targetFraction: { num: 4, den: 18 },
        multiplier: 2
      }
    },
    {
      question: 'Trouve la fraction équivalente à 5/6 :',
      fractions: ['10/12', '15/18', '20/24', '8/10'],
      answer: '10/12',
      explanation: {
        originalFraction: { num: 5, den: 6 },
        targetFraction: { num: 10, den: 12 },
        multiplier: 2
      }
    },
    {
      question: 'Quelle fraction équivaut à 7/10 ?',
      fractions: ['14/20', '21/30', '28/40', '9/12'],
      answer: '14/20',
      explanation: {
        originalFraction: { num: 7, den: 10 },
        targetFraction: { num: 14, den: 20 },
        multiplier: 2
      }
    }
  ];

  const getCurrentExercise = () => exercises[currentExercise];

  // Fonction pour rendre une fraction en format mathématique
  const renderMathFraction = (fractionString: string, size: 'small' | 'medium' | 'large' = 'medium') => {
    const [num, den] = fractionString.split('/').map(Number);
    const sizeClasses = {
      small: 'text-lg',
      medium: 'text-2xl',
      large: 'text-4xl'
    };
    const lineClasses = {
      small: 'h-0.5 w-8',
      medium: 'h-0.5 w-12',
      large: 'h-1 w-16'
    };
    
    return (
      <div className="text-center">
        <div className={`font-bold text-blue-600 leading-none ${sizeClasses[size]}`}>{num}</div>
        <div className={`bg-gray-400 mx-auto my-1 rounded ${lineClasses[size]}`}></div>
        <div className={`font-bold text-purple-600 leading-none ${sizeClasses[size]}`}>{den}</div>
      </div>
    );
  };

  // useEffect pour déclencher l'animation de correction
  useEffect(() => {
    if (showAnswer) {
      animateCorrection();
    }
  }, [showAnswer]);

  const renderMathematicalExplanation = (explanation: any) => {
    return (
      <div className={`${isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'} border rounded-lg p-4 mt-2`}>
        {/* Message d'erreur si incorrect */}
        {!isCorrect && (
          <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-lg">
            <div className="text-red-800 font-semibold mb-2">❌ Ta réponse ({userAnswer}) n'est pas équivalente à {explanation.originalFraction.num}/{explanation.originalFraction.den}</div>
            <div className="text-red-700 text-sm">
              Voici la bonne méthode pour trouver une fraction équivalente :
            </div>
          </div>
        )}

        <div className="flex items-center justify-center gap-6 mb-3">
          {/* Fraction originale */}
          <div className="text-center">
            <div className="text-lg font-bold text-blue-600">{explanation.originalFraction.num}</div>
            <div className="h-0.5 bg-gray-400 w-6 mx-auto my-1"></div>
            <div className="text-lg font-bold text-purple-600">{explanation.originalFraction.den}</div>
            <div className="text-xs text-gray-600 mt-1">Fraction de départ</div>
          </div>
          
          {/* Flèche et multiplication */}
          {correctAnimationStep >= 1 && (
            <div className="flex items-center gap-2 animate-slide-in-right">
              <div className="text-xl text-gray-700">→</div>
              <div className="text-center bg-yellow-100 rounded-lg p-2 border border-yellow-300 animate-bounce-gentle">
                <div className="text-lg font-bold text-yellow-700">×{explanation.multiplier}</div>
                <div className="text-xs text-yellow-600">même nombre</div>
                <div className="text-xs text-yellow-600">en haut et en bas</div>
              </div>
              <div className="text-xl text-gray-700">→</div>
            </div>
          )}
          
          {/* Fraction équivalente */}
          {correctAnimationStep >= 2 && (
            <div className="text-center animate-slide-in-right">
              <div className="text-lg font-bold text-green-600">{explanation.targetFraction.num}</div>
              <div className="h-0.5 bg-gray-400 w-6 mx-auto my-1"></div>
              <div className="text-lg font-bold text-green-600">{explanation.targetFraction.den}</div>
              <div className="text-xs text-green-600 mt-1">Bonne réponse</div>
            </div>
          )}
        </div>
        
        {/* Explication du calcul détaillé */}
        {correctAnimationStep >= 3 && (
          <div className="text-center text-sm text-gray-700 animate-fade-in-up">
            <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
              <div className="font-semibold text-gray-800 mb-3">✨ Calcul détaillé :</div>
              <div className="grid grid-cols-1 gap-3">
                <div className="flex items-center justify-center gap-2 p-2 bg-blue-50 rounded-lg">
                  <span className="text-sm text-gray-600">Numérateur :</span>
                  <span className="text-blue-600 font-semibold">{explanation.originalFraction.num}</span>
                  <span>×</span>
                  <span className="text-yellow-600 font-semibold">{explanation.multiplier}</span>
                  <span>=</span>
                  <span className="text-green-600 font-bold">{explanation.targetFraction.num}</span>
                </div>
                <div className="flex items-center justify-center gap-2 p-2 bg-purple-50 rounded-lg">
                  <span className="text-sm text-gray-600">Dénominateur :</span>
                  <span className="text-purple-600 font-semibold">{explanation.originalFraction.den}</span>
                  <span>×</span>
                  <span className="text-yellow-600 font-semibold">{explanation.multiplier}</span>
                  <span>=</span>
                  <span className="text-green-600 font-bold">{explanation.targetFraction.den}</span>
                </div>
              </div>
              
              <div className="mt-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="text-green-800 font-semibold text-sm mb-3 text-center">🎯 Résultat :</div>
                <div className="flex items-center justify-center gap-4">
                  {renderMathFraction(`${explanation.originalFraction.num}/${explanation.originalFraction.den}`, 'medium')}
                  <span className="text-2xl font-bold text-green-600">=</span>
                  {renderMathFraction(`${explanation.targetFraction.num}/${explanation.targetFraction.den}`, 'medium')}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

     const renderVisualFraction = (numerator: number, denominator: number, label?: string, color = '#fbbf24') => {
     // Représentation visuelle sous forme de barres
     const parts = Array.from({ length: denominator }, (_, i) => i);
     
     return (
       <div className="flex flex-col items-center space-y-2 p-2">
         <div className="flex justify-center gap-1">
           {parts.map((part) => (
             <div
               key={part}
               className={`w-6 h-10 border-2 border-gray-400 ${
                 part < numerator ? `bg-yellow-400` : 'bg-gray-100'
               }`}
               style={{ backgroundColor: part < numerator ? color : '#f3f4f6' }}
             />
           ))}
         </div>
         <div className="text-sm font-bold text-gray-800">
           {numerator}/{denominator}
         </div>
         {label && <div className="text-xs text-gray-600">{label}</div>}
       </div>
     );
   };

  const getDemoFractions = () => {
    const { num, den } = selectedFraction;
    return [
      { num, den, color: '#fbbf24' },
      { num: num * 2, den: den * 2, color: '#f59e0b' },
      { num: num * 3, den: den * 3, color: '#d97706' },
      { num: num * 4, den: den * 4, color: '#b45309' }
    ];
  };

  const animateEquivalence = async () => {
    setIsAnimating(true);
    setAnimationStep(0);
    
    // Étape 1 : Montrer la flèche et la multiplication
    setAnimationStep(1);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Étape 2 : Montrer le calcul détaillé
    setAnimationStep(2);
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Étape 3 : Montrer le résultat
    setAnimationStep(3);
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Étape 4 : Montrer l'explication finale
    setAnimationStep(4);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsAnimating(false);
  };

  const animateCorrection = async () => {
    setIsCorrectAnimating(true);
    setCorrectAnimationStep(0);
    
    // Étape 1 : Montrer la flèche et la multiplication
    setCorrectAnimationStep(1);
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Étape 2 : Montrer le résultat
    setCorrectAnimationStep(2);
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Étape 3 : Montrer le calcul détaillé
    setCorrectAnimationStep(3);
    await new Promise(resolve => setTimeout(resolve, 800));
    
    setIsCorrectAnimating(false);
  };

  const checkAnswer = () => {
    const exercise = getCurrentExercise();
    const correct = userAnswer === exercise.answer;
    setIsCorrect(correct);
    setShowAnswer(true);
    setAttempts(attempts + 1);
    
    if (correct) {
      setScore(score + 1);
    }
  };

  const nextExercise = () => {
    if (currentExercise < exercises.length - 1) {
      setCurrentExercise(currentExercise + 1);
      setUserAnswer('');
      setShowAnswer(false);
      setIsCorrect(false);
      setShowHelp(false);
      setCorrectAnimationStep(0);
      setIsCorrectAnimating(false);
    }
  };

  const resetExercises = () => {
    setCurrentExercise(0);
    setUserAnswer('');
    setShowAnswer(false);
    setIsCorrect(false);
    setScore(0);
    setAttempts(0);
    setShowHelp(false);
    setCorrectAnimationStep(0);
    setIsCorrectAnimating(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100 p-4">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/chapitre/cm1-fractions-equivalentes" className="p-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Fractions équivalentes</h1>
            <p className="text-gray-600 mt-2">Découvrir les fractions qui représentent la même quantité</p>
          </div>
        </div>

        {/* Section Cours */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Book className="w-6 h-6 text-blue-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">📚 Qu'est-ce que des fractions équivalentes ?</h2>
          </div>
          
          <div className="mb-6">
            <div className="bg-blue-50 rounded-lg p-4 mb-4">
              <h3 className="font-bold text-blue-800 mb-2">📝 Définition :</h3>
              <p className="text-gray-700">
                Deux fractions sont <span className="font-bold text-blue-600">équivalentes</span> quand elles représentent 
                la <span className="font-bold">même quantité</span>. Pour obtenir une fraction équivalente, 
                on <span className="font-bold text-green-600">multiplie</span> ou on <span className="font-bold text-purple-600">divise</span> 
                le numérateur et le dénominateur par le même nombre.
              </p>
            </div>
          </div>

          {/* Animation de multiplication */}
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">
              ✨ Animation : Multiplier en haut et en bas
            </h3>
            
            {/* Sélecteur de fraction */}
            <div className="mb-6 text-center">
              <h4 className="font-bold text-gray-700 mb-3">Choisis une fraction de départ :</h4>
              <div className="flex justify-center gap-4">
                {[
                  { num: 1, den: 2 },
                  { num: 1, den: 3 },
                  { num: 2, den: 3 },
                  { num: 1, den: 4 },
                  { num: 3, den: 4 }
                ].map((frac) => (
                  <button
                    key={`${frac.num}/${frac.den}`}
                    onClick={() => setSelectedFraction(frac)}
                    className={`px-4 py-3 rounded-lg border-2 transition-all ${
                      selectedFraction.num === frac.num && selectedFraction.den === frac.den
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 hover:border-blue-300 bg-white'
                    }`}
                  >
                    {renderMathFraction(`${frac.num}/${frac.den}`, 'small')}
                  </button>
                ))}
              </div>
            </div>

            {/* Animation de transformation */}
            <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-200 mb-6">
              <div className="flex items-center justify-center gap-8">
                
                {/* Fraction de départ */}
                <div className="text-center">
                  {renderMathFraction(`${selectedFraction.num}/${selectedFraction.den}`, 'large')}
                  <div className="text-sm text-gray-600 mt-3">Fraction de départ</div>
                </div>

                {/* Flèche et multiplication */}
                {animationStep >= 1 && (
                  <div className="flex items-center gap-4 animate-slide-in-right">
                    <div className="text-4xl text-gray-700">→</div>
                    <div className="text-center bg-yellow-100 rounded-lg p-4 border-2 border-yellow-300">
                      <div className="text-3xl font-bold text-yellow-700 mb-1">×2</div>
                      <div className="text-sm text-yellow-600">Même nombre</div>
                      <div className="text-sm text-yellow-600">en haut et en bas</div>
                    </div>
                    <div className="text-4xl text-gray-700">→</div>
                  </div>
                )}

                {/* Calcul détaillé */}
                {animationStep >= 2 && (
                  <div className="text-center animate-fade-in-up">
                    <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                      <div className="text-lg font-semibold text-gray-700 mb-3">Calcul :</div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-center gap-3">
                          <span className="text-sm text-gray-600">Numérateur :</span>
                          <span className="text-xl font-bold text-blue-600">{selectedFraction.num}</span>
                          <span className="text-xl text-gray-600">×</span>
                          <span className="text-xl font-bold text-yellow-600">2</span>
                          <span className="text-xl text-gray-600">=</span>
                          <span className="text-xl font-bold text-green-600">{selectedFraction.num * 2}</span>
                        </div>
                        <div className="flex items-center justify-center gap-3">
                          <span className="text-sm text-gray-600">Dénominateur :</span>
                          <span className="text-xl font-bold text-purple-600">{selectedFraction.den}</span>
                          <span className="text-xl text-gray-600">×</span>
                          <span className="text-xl font-bold text-yellow-600">2</span>
                          <span className="text-xl text-gray-600">=</span>
                          <span className="text-xl font-bold text-green-600">{selectedFraction.den * 2}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Résultat */}
                {animationStep >= 3 && (
                  <div className="flex items-center gap-4 animate-slide-in-right">
                    <div className="text-4xl text-gray-700">=</div>
                    <div className="text-center bg-green-100 rounded-lg p-4 border-2 border-green-300">
                      {renderMathFraction(`${selectedFraction.num * 2}/${selectedFraction.den * 2}`, 'large')}
                      <div className="text-sm text-green-600 mt-3">Fraction équivalente</div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Bouton d'animation */}
            <div className="text-center mb-6">
              <button
                onClick={animateEquivalence}
                disabled={isAnimating}
                className={`px-6 py-3 rounded-lg font-bold text-white transition-all ${
                  isAnimating 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-blue-500 hover:bg-blue-600 transform hover:scale-105'
                }`}
              >
                {isAnimating ? 'Animation en cours...' : '🎬 Voir l\'animation'}
              </button>
            </div>

            {/* Explication finale */}
            {animationStep >= 4 && (
              <div className="bg-white rounded-lg p-6 border-2 border-green-500 animate-fade-in-up">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                    <span className="font-bold text-green-800 text-xl">Conclusion :</span>
                  </div>
                  <div className="flex items-center justify-center gap-6 mb-4">
                    {renderMathFraction(`${selectedFraction.num}/${selectedFraction.den}`, 'medium')}
                    <span className="text-3xl font-bold text-green-600">=</span>
                    {renderMathFraction(`${selectedFraction.num*2}/${selectedFraction.den*2}`, 'medium')}
                  </div>
                  <div className="text-lg text-gray-700 mb-4">
                    Multiplier le numérateur ET le dénominateur par le même nombre ne change pas la valeur de la fraction !
                  </div>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="text-yellow-800 font-bold">✨ Règle d'or :</div>
                    <div className="text-yellow-700">Pour obtenir une fraction équivalente, on peut multiplier (ou diviser) le haut et le bas par le même nombre.</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Exercices pratiques */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Target className="w-6 h-6 text-blue-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Exercices pratiques</h2>
            <div className="ml-auto flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-600" />
              <span className="font-medium text-gray-700">{score}/{attempts}</span>
            </div>
          </div>

          {currentExercise < exercises.length ? (
            <div className="space-y-6">
              <div className="text-center">
                <div className="text-sm text-gray-600 mb-2">
                  Exercice {currentExercise + 1} sur {exercises.length}
                </div>
                <div className="flex items-center justify-center gap-4 mb-6">
                  <span className="text-lg font-medium text-gray-800">Quelle fraction est équivalente à</span>
                  {renderMathFraction(`${getCurrentExercise().explanation.originalFraction.num}/${getCurrentExercise().explanation.originalFraction.den}`, 'medium')}
                  <span className="text-lg font-medium text-gray-800">?</span>
                </div>
              </div>

              {/* Options de réponse */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
                {getCurrentExercise().fractions.map((fraction) => (
                  <button
                    key={fraction}
                    onClick={() => setUserAnswer(fraction)}
                    className={`p-3 rounded-lg border-2 transition-all transform hover:scale-105 min-h-[120px] flex flex-col items-center justify-center ${
                      userAnswer === fraction
                        ? 'border-blue-500 bg-blue-50 text-blue-600'
                        : 'border-gray-200 hover:border-blue-300 bg-white text-gray-900'
                    }`}
                  >
                    <div className="mb-2">
                      {renderMathFraction(fraction, 'medium')}
                    </div>
                    <div className="flex-1 flex items-center justify-center">
                      {renderVisualFraction(
                        parseInt(fraction.split('/')[0]), 
                        parseInt(fraction.split('/')[1]),
                        undefined,
                        userAnswer === fraction ? '#3b82f6' : '#9ca3af'
                      )}
                    </div>
                  </button>
                ))}
              </div>

              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setShowHelp(!showHelp)}
                  className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2"
                >
                  <Lightbulb className="w-4 h-4" />
                  {showHelp ? 'Masquer l\'aide' : 'Aide'}
                </button>
                
                <button
                  onClick={checkAnswer}
                  disabled={!userAnswer || showAnswer}
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors"
                >
                  Vérifier
                </button>
                
                {showAnswer && (
                  <button
                    onClick={nextExercise}
                    className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                  >
                    Suivant
                  </button>
                )}
              </div>

              {/* Aide */}
              {showHelp && (
                <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Lightbulb className="w-5 h-5 text-orange-600" />
                    <span className="font-bold text-orange-800">Méthode pour trouver une fraction équivalente :</span>
                  </div>
                  <ol className="list-decimal list-inside space-y-1 text-orange-700 text-sm">
                    <li>Regarde la fraction de départ</li>
                    <li>Trouve par quel nombre multiplier le numérateur et le dénominateur</li>
                    <li>Vérifie que les deux nombres ont été multipliés par le même nombre</li>
                    <li>Compare visuellement : les deux fractions doivent représenter la même quantité</li>
                  </ol>
                </div>
              )}

              {/* Résultat */}
              {showAnswer && (
                <div className={`p-4 rounded-lg border ${
                  isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    {isCorrect ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600" />
                    )}
                    <span className={`font-bold ${isCorrect ? 'text-green-800' : 'text-red-800'}`}>
                      {isCorrect ? 'Correct !' : `Incorrect - La bonne réponse est ${getCurrentExercise().answer}`}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    {renderMathematicalExplanation(getCurrentExercise().explanation)}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Félicitations !</h3>
              <p className="text-gray-600 mb-4">
                Tu maîtrises les fractions équivalentes ! Score : {score}/{attempts}
              </p>
              <button
                onClick={resetExercises}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Recommencer
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 