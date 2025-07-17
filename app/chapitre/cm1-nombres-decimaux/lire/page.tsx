'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Play, RefreshCw, CheckCircle, XCircle, Eye, Lightbulb, Target, Trophy, Grid, Calculator, Book, Sparkles } from 'lucide-react';

export default function LireNombresDecimauxPage() {
  const [selectedNumber, setSelectedNumber] = useState('5627.008');
  const [currentExercise, setCurrentExercise] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [showAnswer, setShowAnswer] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);

  const [isAnimating, setIsAnimating] = useState(false);
  const [animationSteps, setAnimationSteps] = useState<Array<{digit: string, position: number}>>([]);
  const [highlightedPosition, setHighlightedPosition] = useState<number | null>(null);
  const [showPositionNames, setShowPositionNames] = useState(false);
  const [explanationStep, setExplanationStep] = useState(0);
  const [isExplanationAnimating, setIsExplanationAnimating] = useState(false);

  const exercises = [
    { number: '234.7', reading: 'Deux cent trente-quatre unités et sept dixièmes' },
    { number: '1456.29', reading: 'Mille quatre cent cinquante-six unités et vingt-neuf centièmes' },
    { number: '89.134', reading: 'Quatre-vingt-neuf unités et cent trente-quatre millièmes' },
    { number: '0.425', reading: 'Quatre cent vingt-cinq millièmes' },
    { number: '672.8', reading: 'Six cent soixante-douze unités et huit dixièmes' },
    { number: '34.95', reading: 'Trente-quatre unités et quatre-vingt-quinze centièmes' },
    { number: '78.65', reading: 'Soixante-dix-huit unités et soixante-cinq centièmes' },
    { number: '36.457', reading: 'Trente-six unités et quatre cent cinquante-sept millièmes' },
    { number: '15.23', reading: 'Quinze unités et vingt-trois centièmes' },
    { number: '357.1', reading: 'Trois cent cinquante-sept unités et un dixième' },
    { number: '926.48', reading: 'Neuf cent vingt-six unités et quarante-huit centièmes' },
    { number: '0.59', reading: 'Cinquante-neuf centièmes' },
    { number: '7.57', reading: 'Sept unités et cinquante-sept centièmes' },
    { number: '18.459', reading: 'Dix-huit unités et quatre cent cinquante-neuf millièmes' },
    { number: '2.497', reading: 'Deux unités et quatre cent quatre-vingt-dix-sept millièmes' },
    { number: '359.36', reading: 'Trois cent cinquante-neuf unités et trente-six centièmes' },
    { number: '79.626', reading: 'Soixante-dix-neuf unités et six cent vingt-six millièmes' },
    { number: '17.40', reading: 'Dix-sept unités et quarante centièmes' },
    { number: '1.20', reading: 'Une unité et vingt centièmes' },
    { number: '53.2', reading: 'Cinquante-trois unités et deux dixièmes' }
  ];

  const formatNumber = (num: string) => {
    return num.replace('.', ',');
  };

  const getNumberInWords = (numStr: string): string => {
    const numberReadings: { [key: string]: string } = {
      // Nombres du sélecteur (comprendre la structure)
      '5627.008': 'cinq mille six cent vingt-sept virgule zéro zéro huit',
      '3869.263': 'trois mille huit cent soixante-neuf virgule deux six trois',
      '287.567': 'deux cent quatre-vingt-sept virgule cinq six sept',
      '0.876': 'zéro virgule huit sept six',
      '567.287': 'cinq cent soixante-sept virgule deux huit sept',
      '87.56': 'quatre-vingt-sept virgule cinq six',
      // Nombres des exercices (différents)
      '234.7': 'deux cent trente-quatre virgule sept',
      '1456.29': 'mille quatre cent cinquante-six virgule deux neuf',
      '89.134': 'quatre-vingt-neuf virgule un trois quatre',
      '0.425': 'zéro virgule quatre deux cinq',
      '672.8': 'six cent soixante-douze virgule huit',
      '34.95': 'trente-quatre virgule neuf cinq'
    };
    
    // Si le nombre n'est pas dans la liste, on retourne une version basique
    if (numberReadings[numStr]) {
      return numberReadings[numStr];
    }
    
    // Version de secours pour éviter les erreurs
    return `Lecture de ${numStr.replace('.', ' virgule ')}`;
  };

  const getPositionValue = (position: number) => {
    const values = {
      6: 1000,
      5: 100,
      4: 10,
      3: 1,
      2: 0.1,
      1: 0.01,
      0: 0.001
    };
    return values[position as keyof typeof values] || 0;
  };

  const getPositionLabel = (position: number) => {
    const labels = {
      6: 'unités de mille',
      5: 'centaines',
      4: 'dizaines',
      3: 'unités',
      2: 'dixièmes',
      1: 'centièmes',
      0: 'millièmes'
    };
    return labels[position as keyof typeof labels] || '';
  };

  const getDecimalReading = (decimalPart: string) => {
    const decimalValue = parseInt(decimalPart);
    const decimalLength = decimalPart.length;
    
    // Fonction pour convertir un nombre en lettres (version simplifiée)
    const numberToWords = (num: number): string => {
      const ones = ['', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf'];
      const teens = ['dix', 'onze', 'douze', 'treize', 'quatorze', 'quinze', 'seize', 'dix-sept', 'dix-huit', 'dix-neuf'];
      const tens = ['', '', 'vingt', 'trente', 'quarante', 'cinquante', 'soixante', 'soixante-dix', 'quatre-vingt', 'quatre-vingt-dix'];
      const hundreds = ['', 'cent', 'deux cent', 'trois cent', 'quatre cent', 'cinq cent', 'six cent', 'sept cent', 'huit cent', 'neuf cent'];
      
      if (num === 0) return 'zéro';
      if (num < 10) return ones[num];
      if (num < 20) return teens[num - 10];
      if (num < 100) {
        const ten = Math.floor(num / 10);
        const one = num % 10;
        if (ten === 7) return 'soixante-' + teens[one];
        if (ten === 9) return 'quatre-vingt-' + teens[one];
        return tens[ten] + (one ? '-' + ones[one] : '');
      }
      if (num < 1000) {
        const hundred = Math.floor(num / 100);
        const remainder = num % 100;
        let result = hundreds[hundred] || (ones[hundred] + ' cent');
        if (remainder) {
          result += ' ' + numberToWords(remainder);
        }
        return result;
      }
      return num.toString(); // Fallback pour nombres plus grands
    };
    
    const reading = numberToWords(decimalValue);
    
    let unit = '';
    if (decimalLength === 1) unit = 'dixièmes';
    else if (decimalLength === 2) unit = 'centièmes';
    else if (decimalLength === 3) unit = 'millièmes';
    
    return `${reading} ${unit}`;
  };

  const getPositionColor = (position: number) => {
    const colors = {
      6: 'bg-purple-100 border-purple-300 text-purple-900',
      5: 'bg-blue-100 border-blue-300 text-blue-900',
      4: 'bg-indigo-100 border-indigo-300 text-indigo-900',
      3: 'bg-green-100 border-green-300 text-green-900',
      2: 'bg-yellow-100 border-yellow-300 text-yellow-900',
      1: 'bg-orange-100 border-orange-300 text-orange-900',
      0: 'bg-red-100 border-red-300 text-red-900'
    };
    return colors[position as keyof typeof colors] || 'bg-gray-100 border-gray-300 text-gray-900';
  };

  const getPositionHighlight = (position: number) => {
    const highlights = {
      6: 'ring-4 ring-purple-400 bg-purple-200 scale-110 text-purple-900',
      5: 'ring-4 ring-blue-400 bg-blue-200 scale-110 text-blue-900',
      4: 'ring-4 ring-indigo-400 bg-indigo-200 scale-110 text-indigo-900',
      3: 'ring-4 ring-green-400 bg-green-200 scale-110 text-green-900',
      2: 'ring-4 ring-yellow-400 bg-yellow-200 scale-110 text-yellow-900',
      1: 'ring-4 ring-orange-400 bg-orange-200 scale-110 text-orange-900',
      0: 'ring-4 ring-red-400 bg-red-200 scale-110 text-red-900'
    };
    return highlights[position as keyof typeof highlights] || 'ring-4 ring-gray-400 bg-gray-200 scale-110 text-gray-900';
  };

  const animateNumber = async () => {
    setIsAnimating(true);
    setAnimationSteps([]);
    setHighlightedPosition(null);
    
    // Séparer partie entière et décimale
    const [integerPart, decimalPart] = selectedNumber.split('.');
    
    // Animer d'abord la partie entière (de droite à gauche)
    const steps: Array<{digit: string, position: number}> = [];
    for (let i = integerPart.length - 1; i >= 0; i--) {
      const digit = integerPart[i];
      const position = 3 + (integerPart.length - 1 - i);
      steps.push({ digit, position });
    }
    
    // Animer ensuite la partie décimale (de gauche à droite)
    if (decimalPart) {
      for (let i = 0; i < decimalPart.length; i++) {
        const digit = decimalPart[i];
        const position = 2 - i;
        steps.push({ digit, position });
      }
    }
    
    // Afficher les étapes une par une avec animation
    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 600));
      
      // Mettre en surbrillance la position
      setHighlightedPosition(steps[i].position);
      
      // Ajouter l'étape après un court délai
      setTimeout(() => {
        setAnimationSteps(prev => [...prev, steps[i]]);
      }, 200);
    }
    
    // Garder la surbrillance sur la dernière position un moment
    setTimeout(() => {
      setHighlightedPosition(null);
      setIsAnimating(false);
    }, 1000);
  };

  // Nouvelle fonction pour animer une position spécifique
  const animatePosition = async (position: number) => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setAnimationSteps([]);
    
    // Mettre en surbrillance la position cliquée
    setHighlightedPosition(position);
    
    // Ajouter l'étape après un court délai avec effet sparkle
    setTimeout(() => {
      const digit = getDigitAtPosition(position);
      setAnimationSteps([{ digit, position }]);
    }, 300);
    
    // Garder la surbrillance un moment puis l'enlever
    setTimeout(() => {
      setHighlightedPosition(null);
      setIsAnimating(false);
    }, 1500);
  };

  const animateExplanation = async () => {
    setIsExplanationAnimating(true);
    setExplanationStep(0);
    
    // Étape 1 : Montrer le nombre complet
    setExplanationStep(1);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Étape 2 : Highlight partie entière
    setExplanationStep(2);
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Étape 3 : Highlight virgule
    setExplanationStep(3);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Étape 4 : Highlight partie décimale
    setExplanationStep(4);
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Étape 5 : Montrer l'ensemble
    setExplanationStep(5);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsExplanationAnimating(false);
  };

  const checkAnswer = () => {
    const correctAnswer = exercises[currentExercise].reading;
    const userAnswerNormalized = userAnswer.toLowerCase().trim();
    const correctAnswerNormalized = correctAnswer.toLowerCase().trim();
    
    setShowAnswer(true);
    setIsCorrect(userAnswerNormalized === correctAnswerNormalized);
    setAttempts(attempts + 1);
    
    if (userAnswerNormalized === correctAnswerNormalized) {
      setScore(score + 1);
    }
  };

  const nextExercise = () => {
    if (currentExercise < exercises.length - 1) {
      setCurrentExercise(currentExercise + 1);
      setUserAnswer('');
      setShowAnswer(false);
      setIsCorrect(false);

      setAnimationSteps([]);
      setHighlightedPosition(null);
    }
  };

  const resetExercises = () => {
    setCurrentExercise(0);
    setUserAnswer('');
    setShowAnswer(false);
    setIsCorrect(false);
    setScore(0);
    setAttempts(0);

    setAnimationSteps([]);
    setHighlightedPosition(null);
  };

  const calculateScore = () => {
    return attempts > 0 ? Math.round((score / attempts) * 100) : 0;
  };

  const parseNumber = (numStr: string) => {
    const cleanNum = numStr.replace(',', '.');
    const [integerPart, decimalPart] = cleanNum.split('.');
    
    return {
      integerPart: integerPart || '0',
      decimalPart: decimalPart || ''
    };
  };

  const renderPositionTable = () => {
    const { integerPart, decimalPart } = parseNumber(selectedNumber);
    const positions = [6, 5, 4, 3, 2, 1, 0]; // milliers, centaines, dizaines, unités, dixièmes, centièmes, millièmes
    
    return (
              <div className="bg-white rounded-xl p-6 shadow-lg mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <Grid className="w-5 h-5" />
              Tableau de positions
              <span className="text-sm font-normal text-gray-600 ml-2">
                👆 Cliquez sur une cellule pour l'animer
              </span>
            </h3>
          <div className="flex gap-2">
            <button
              onClick={() => setShowPositionNames(!showPositionNames)}
              className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm hover:bg-blue-200 transition-colors"
            >
              {showPositionNames ? 'Masquer noms' : 'Afficher noms'}
            </button>
            <button
              onClick={animateNumber}
              disabled={isAnimating}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
            >
              {isAnimating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
              {isAnimating ? 'Animation...' : 'Animer'}
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="border-2 border-gray-300 bg-gray-100 p-3 text-center font-bold text-gray-800">
                  Position
                </th>
                {positions.map(pos => (
                  <>
                    <th 
                      key={pos} 
                      className={`border-2 border-gray-300 p-3 text-center font-bold text-gray-800 transition-all duration-300 ${
                        pos === 3 ? 'border-r-4 border-r-black' : ''
                      } ${
                        highlightedPosition === pos ? 'bg-yellow-200 animate-pulse' : 'bg-gray-100'
                      }`}
                    >
                      {pos >= 3 ? 'Partie entière' : 'Partie décimale'}
                    </th>
                    {pos === 3 && (
                      <th className="border-2 border-gray-300 bg-red-100 p-3 text-center font-bold text-red-800 w-8">
                        ,
                      </th>
                    )}
                  </>
                ))}
              </tr>
              {showPositionNames && (
                <tr>
                  <th className="border-2 border-gray-300 bg-gray-50 p-2 text-center text-sm font-medium text-gray-900">
                    Nom
                  </th>
                  {positions.map(pos => (
                    <>
                      <th 
                        key={pos} 
                        className={`border-2 border-gray-300 p-2 text-center text-sm font-medium text-gray-900 transition-all duration-300 ${
                          pos === 3 ? 'border-r-4 border-r-black' : ''
                        } ${
                          highlightedPosition === pos ? 'bg-yellow-100' : 'bg-gray-50'
                        }`}
                      >
                        {getPositionLabel(pos)}
                      </th>
                      {pos === 3 && (
                        <th className="border-2 border-gray-300 bg-red-100 p-2 text-center text-sm font-medium text-red-800 w-8">
                          ,
                        </th>
                      )}
                    </>
                  ))}
                </tr>
              )}
              <tr>
                <th className="border-2 border-gray-300 bg-gray-50 p-2 text-center text-sm font-medium text-gray-900">
                  Valeur
                </th>
                {positions.map(pos => (
                  <>
                    <th 
                      key={pos} 
                      className={`border-2 border-gray-300 p-2 text-center text-sm font-medium text-gray-900 transition-all duration-300 ${
                        pos === 3 ? 'border-r-4 border-r-black' : ''
                      } ${
                        highlightedPosition === pos ? 'bg-yellow-100' : 'bg-gray-50'
                      }`}
                    >
                      ×{getPositionValue(pos)}
                    </th>
                    {pos === 3 && (
                      <th className="border-2 border-gray-300 bg-red-100 p-2 text-center text-sm font-medium text-red-800 w-8">
                        ,
                      </th>
                    )}
                  </>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border-2 border-gray-300 bg-indigo-50 p-3 text-center font-bold text-indigo-900">
                  {formatNumber(selectedNumber)}
                </td>
                {positions.map(pos => {
                  const digit = getDigitAtPosition(pos);
                  const isAnimated = animationSteps.some(step => step.position === pos);
                  const isHighlighted = highlightedPosition === pos;
                  
                  return (
                    <>
                      <td 
                        key={pos} 
                        onClick={() => animatePosition(pos)}
                        className={`border-2 border-gray-300 p-3 text-center text-2xl font-bold transition-all duration-500 cursor-pointer hover:scale-105 hover:shadow-lg ${
                          pos === 3 ? 'border-r-4 border-r-black' : ''
                        } ${
                          isHighlighted ? getPositionHighlight(pos) : 
                          isAnimated ? `${getPositionColor(pos)} animate-bounce` : 
                          digit !== '0' ? getPositionColor(pos) : 'bg-gray-50 text-gray-400'
                        }`}
                        title={`Cliquer pour animer la position ${getPositionLabel(pos)}`}
                      >
                        {isAnimated || !isAnimating ? digit : ''}
                        {isAnimated && isAnimating && (
                          <div className="flex items-center justify-center">
                            <Sparkles className="w-4 h-4 animate-spin ml-1" />
                          </div>
                        )}
                      </td>
                      {pos === 3 && (
                        <td className="border-2 border-gray-300 bg-red-100 p-3 text-center text-3xl font-bold text-red-800 w-8">
                          ,
                        </td>
                      )}
                    </>
                  );
                })}
              </tr>
            </tbody>
          </table>
        </div>
        
        {/* Légende des couleurs */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold text-gray-800 mb-3">Légende des couleurs :</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
            {positions.map(pos => (
              <div key={pos} className="flex items-center gap-2">
                <div className={`w-4 h-4 rounded border-2 ${getPositionColor(pos)}`}></div>
                <span className="text-gray-700">{getPositionLabel(pos)}</span>
              </div>
            ))}
          </div>
        </div>


      </div>
    );
  };

  const getDigitAtPosition = (position: number) => {
    const { integerPart, decimalPart } = parseNumber(selectedNumber);
    
    if (position >= 3) {
      // Partie entière
      const index = position - 3;
      const reversedInteger = integerPart.split('').reverse().join('');
      return reversedInteger[index] || '0';
    } else {
      // Partie décimale
      const index = 2 - position;
      return decimalPart[index] || '0';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/chapitre/cm1-nombres-decimaux" className="p-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Comprendre la structure</h1>
            <p className="text-gray-600">Tableau de positions : partie entière et partie décimale</p>
          </div>
        </div>

        {/* Section explicative animée */}
        <div className="bg-white rounded-xl p-6 shadow-lg mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Lightbulb className="w-6 h-6 text-blue-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">💡 Comprendre un nombre décimal</h2>
          </div>
          
          <div className="space-y-6">
            {/* Exemple visuel principal */}
            <div className="text-center">
              <div className="text-6xl font-bold text-gray-800 mb-4 font-mono">
                <span className={`transition-all duration-1000 ${
                  explanationStep === 2 ? 'text-green-600 bg-green-100 px-2 py-1 rounded-lg transform scale-110' : 
                  explanationStep >= 1 ? 'text-green-600' : 'text-gray-400'
                }`}>23</span>
                <span className={`mx-2 transition-all duration-1000 ${
                  explanationStep === 3 ? 'text-red-500 bg-red-100 px-2 py-1 rounded-lg transform scale-125' : 
                  explanationStep >= 1 ? 'text-red-500' : 'text-gray-400'
                }`}>,</span>
                <span className={`transition-all duration-1000 ${
                  explanationStep === 4 ? 'text-orange-600 bg-orange-100 px-2 py-1 rounded-lg transform scale-110' : 
                  explanationStep >= 1 ? 'text-orange-600' : 'text-gray-400'
                }`}>45</span>
              </div>
              <div className="text-sm text-gray-600 mb-4">Un nombre décimal est composé de deux parties séparées par une virgule</div>
              
                             {/* Indication d'animation */}
               {isExplanationAnimating && (
                 <div className="mb-4 p-3 bg-blue-100 rounded-lg border-2 border-blue-300">
                   <div className="text-center text-blue-800 font-semibold">
                     {explanationStep === 1 && "🔍 Observons ce nombre décimal..."}
                     {explanationStep === 2 && "🟢 La partie entière : à gauche de la virgule"}
                     {explanationStep === 3 && "🔴 La virgule : sépare les deux parties"}
                     {explanationStep === 4 && "🟠 La partie décimale : à droite de la virgule"}
                     {explanationStep === 5 && "✅ Ensemble, elles forment un nombre décimal !"}
                   </div>
                 </div>
               )}
               
               {/* Bouton d'animation */}
               <button
                 onClick={animateExplanation}
                 disabled={isExplanationAnimating}
                 className="flex items-center gap-2 mx-auto px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors"
               >
                 <Play className="w-4 h-4" />
                 {isExplanationAnimating ? 'Animation en cours...' : 'Animer l\'explication'}
               </button>
            </div>
            
                         {/* Explication des parties */}
             <div className="grid md:grid-cols-3 gap-4">
               {/* Partie entière */}
               <div className={`bg-green-50 rounded-lg p-4 border-2 border-green-200 transition-all duration-1000 ${
                 explanationStep === 2 ? 'transform scale-105 shadow-lg border-green-400' : ''
               }`}>
                 <div className="text-center">
                   <div className="text-4xl font-bold text-green-600 mb-2">23</div>
                   <div className="text-lg font-semibold text-green-800 mb-2">Partie entière</div>
                   <div className="text-sm text-green-700">
                     Les unités, dizaines, centaines...
                   </div>
                   <div className="text-sm text-green-600 mt-1">
                     23 unités
                   </div>
                 </div>
               </div>
               
               {/* Virgule */}
               <div className={`bg-red-50 rounded-lg p-4 border-2 border-red-200 transition-all duration-1000 ${
                 explanationStep === 3 ? 'transform scale-105 shadow-lg border-red-400' : ''
               }`}>
                 <div className="text-center">
                   <div className="text-4xl font-bold text-red-600 mb-2">,</div>
                   <div className="text-lg font-semibold text-red-800 mb-2">Virgule</div>
                   <div className="text-sm text-red-700">
                     Sépare les deux parties
                   </div>
                   <div className="text-sm text-red-600 mt-1">
                     Séparateur décimal
                   </div>
                 </div>
               </div>
               
               {/* Partie décimale */}
               <div className={`bg-orange-50 rounded-lg p-4 border-2 border-orange-200 transition-all duration-1000 ${
                 explanationStep === 4 ? 'transform scale-105 shadow-lg border-orange-400' : ''
               }`}>
                 <div className="text-center">
                   <div className="text-4xl font-bold text-orange-600 mb-2">45</div>
                   <div className="text-lg font-semibold text-orange-800 mb-2">Partie décimale</div>
                   <div className="text-sm text-orange-700">
                     Les dixièmes, centièmes, millièmes...
                   </div>
                   <div className="text-sm text-orange-600 mt-1">
                     45 centièmes
                   </div>
                 </div>
               </div>
             </div>
            
            {/* Règles importantes */}
            <div className="bg-yellow-50 rounded-lg p-4 border-2 border-yellow-200">
              <h3 className="font-bold text-yellow-800 mb-3">📋 Règles importantes :</h3>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <span className="text-yellow-600 font-bold">1.</span>
                  <span className="text-sm text-yellow-800">La virgule sépare les unités des dixièmes</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-yellow-600 font-bold">2.</span>
                  <span className="text-sm text-yellow-800">À gauche : partie entière (unités, dizaines, centaines...)</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-yellow-600 font-bold">3.</span>
                  <span className="text-sm text-yellow-800">À droite : partie décimale (dixièmes, centièmes, millièmes...)</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-yellow-600 font-bold">4.</span>
                  <span className="text-sm text-yellow-800">Chaque position a une valeur 10 fois plus petite que la précédente</span>
                </div>
              </div>
            </div>
            
            {/* Exemple interactif */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-bold text-gray-800 mb-3">🎯 Exemple interactif :</h3>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-800 mb-2">
                  <span className="text-green-600 hover:bg-green-100 px-2 py-1 rounded cursor-pointer transition-colors" title="Partie entière">
                    123
                  </span>
                  <span className="text-red-500 mx-2">,</span>
                  <span className="text-orange-600 hover:bg-orange-100 px-2 py-1 rounded cursor-pointer transition-colors" title="Partie décimale">
                    456
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  Passe ta souris sur les parties pour voir leur rôle
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section : Comment identifier l'unité */}
        <div className="bg-white rounded-xl p-6 shadow-lg mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Calculator className="w-6 h-6 text-purple-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">🎯 Comment identifier l'unité ?</h2>
          </div>
          
          <div className="space-y-6">
            {/* Règle principale */}
            <div className="bg-purple-50 rounded-lg p-4 border-2 border-purple-200">
              <h3 className="font-bold text-purple-800 mb-2">📏 Règle importante :</h3>
              <p className="text-purple-700">
                Le nombre de chiffres après la virgule détermine l'unité de la partie décimale
              </p>
            </div>
            
            {/* Exemples visuels */}
            <div className="grid md:grid-cols-3 gap-4">
              {/* 1 chiffre = dixièmes */}
              <div className="bg-green-50 rounded-lg p-4 border-2 border-green-200">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-800 mb-2 font-mono">
                    <span className="text-gray-600">23</span>
                    <span className="text-red-500">,</span>
                    <span className="text-green-600 bg-green-200 px-1 rounded">4</span>
                  </div>
                  <div className="text-sm text-green-700 font-semibold mb-1">
                    1 chiffre après la virgule
                  </div>
                  <div className="text-lg font-bold text-green-800">
                    → dixièmes
                  </div>
                  <div className="text-sm text-green-600 mt-1">
                    "vingt-trois unités quatre dixièmes"
                  </div>
                </div>
              </div>
              
              {/* 2 chiffres = centièmes */}
              <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-200">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-800 mb-2 font-mono">
                    <span className="text-gray-600">23</span>
                    <span className="text-red-500">,</span>
                    <span className="text-blue-600 bg-blue-200 px-1 rounded">45</span>
                  </div>
                  <div className="text-sm text-blue-700 font-semibold mb-1">
                    2 chiffres après la virgule
                  </div>
                  <div className="text-lg font-bold text-blue-800">
                    → centièmes
                  </div>
                  <div className="text-sm text-blue-600 mt-1">
                    "vingt-trois unités quarante-cinq centièmes"
                  </div>
                </div>
              </div>
              
              {/* 3 chiffres = millièmes */}
              <div className="bg-orange-50 rounded-lg p-4 border-2 border-orange-200">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-800 mb-2 font-mono">
                    <span className="text-gray-600">23</span>
                    <span className="text-red-500">,</span>
                    <span className="text-orange-600 bg-orange-200 px-1 rounded">456</span>
                  </div>
                  <div className="text-sm text-orange-700 font-semibold mb-1">
                    3 chiffres après la virgule
                  </div>
                  <div className="text-lg font-bold text-orange-800">
                    → millièmes
                  </div>
                  <div className="text-sm text-orange-600 mt-1">
                    "vingt-trois unités quatre cent cinquante-six millièmes"
                  </div>
                </div>
              </div>
            </div>
            
            {/* Méthode pratique */}
            <div className="bg-yellow-50 rounded-lg p-4 border-2 border-yellow-200">
              <h3 className="font-bold text-yellow-800 mb-3">💡 Méthode pratique :</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-yellow-600 font-bold">1.</span>
                  <span className="text-sm text-yellow-800">Compte le nombre de chiffres après la virgule</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-yellow-600 font-bold">2.</span>
                  <span className="text-sm text-yellow-800">1 chiffre = dixièmes, 2 chiffres = centièmes, 3 chiffres = millièmes</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-yellow-600 font-bold">3.</span>
                  <span className="text-sm text-yellow-800">Lis la partie décimale comme un nombre entier + l'unité</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sélecteur de nombre */}
        <div className="bg-white rounded-xl p-6 shadow-lg mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">
              🔢 Choisir un nombre à analyser
            </h2>
            <div className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-blue-600" />
              <span className="text-sm text-gray-600">Nombre sélectionné</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {['5627.008', '3869.263', '287.567', '0.876', '567.287', '87.56'].map(num => (
              <button
                key={num}
                onClick={() => setSelectedNumber(num)}
                className={`p-3 rounded-lg text-lg font-bold transition-all duration-200 ${
                  selectedNumber === num
                    ? 'bg-indigo-600 text-white shadow-lg scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {formatNumber(num)}
              </button>
            ))}
          </div>
        </div>

        {/* Lecture du nombre en lettres */}
        <div className="bg-white rounded-xl p-6 shadow-lg mb-8">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            📖 Lecture du nombre en lettres
          </h3>
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600 mb-4">
              {formatNumber(selectedNumber)}
            </div>
          </div>
        </div>

        {/* Tableau de positions animé */}
        {renderPositionTable()}

        {/* Décomposition sous le tableau */}
        <div className="bg-white rounded-xl p-6 shadow-lg mb-8">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            🔍 Décomposition du nombre
          </h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-green-50 rounded-lg p-6 border-2 border-green-200">
              <h4 className="font-semibold text-green-800 mb-3 text-lg">🟢 Partie entière</h4>
              <div className="text-2xl font-bold text-green-700 mb-2">
                {(() => {
                  const [integerPart] = selectedNumber.replace(',', '.').split('.');
                  return `${integerPart} unités`;
                })()}
              </div>
              <div className="text-lg text-green-600">
                {(() => {
                  const reading = getNumberInWords(selectedNumber.replace(',', '.')).split(' virgule ')[0];
                  return reading;
                })()}
              </div>
            </div>
            
            <div className="bg-orange-50 rounded-lg p-6 border-2 border-orange-200">
              <h4 className="font-semibold text-orange-800 mb-3 text-lg">🟠 Partie décimale</h4>
              <div className="text-2xl font-bold text-orange-700 mb-2">
                {(() => {
                  const [, decimalPart] = selectedNumber.replace(',', '.').split('.');
                  if (!decimalPart) return '0';
                  
                  const decimalLength = decimalPart.length;
                  const decimalValue = parseInt(decimalPart);
                  
                  let unit = '';
                  if (decimalLength === 1) unit = 'dixièmes';
                  else if (decimalLength === 2) unit = 'centièmes'; 
                  else if (decimalLength === 3) unit = 'millièmes';
                  
                  return `${decimalValue} ${unit}`;
                })()}
              </div>
              <div className="text-lg text-orange-600">
                {(() => {
                  const [, decimalPart] = selectedNumber.replace(',', '.').split('.');
                  if (!decimalPart) return '';
                  return getDecimalReading(decimalPart);
                })()}
              </div>
            </div>
          </div>
          
          {/* Assemblage final */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
            <h4 className="font-semibold text-blue-800 mb-2">🔗 Assemblage complet :</h4>
            <div className="text-xl font-medium text-gray-800">
              <span className="text-green-600">
                {(() => {
                  const reading = getNumberInWords(selectedNumber.replace(',', '.')).split(' virgule ')[0];
                  return reading;
                })()}
              </span>
              <span className="text-red-600 mx-2">virgule</span>
              <span className="text-orange-600">
                {(() => {
                  const reading = getNumberInWords(selectedNumber.replace(',', '.')).split(' virgule ')[1];
                  return reading || '';
                })()}
              </span>
            </div>
          </div>
        </div>

        {/* Section d'exercices */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <Target className="w-5 h-5" />
              Exercices de lecture
            </h2>
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600">
                Score: {calculateScore()}% ({score}/{attempts})
              </div>
              <button
                onClick={resetExercises}
                className="flex items-center gap-2 px-3 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
              >
                <RefreshCw className="w-4 h-4" />
                Recommencer
              </button>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="text-sm text-gray-600">
                Exercice {currentExercise + 1} sur {exercises.length}
              </div>
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${((currentExercise + 1) / exercises.length) * 100}%` }}
                ></div>
              </div>
            </div>
            
            <div className="bg-indigo-50 rounded-lg p-6 text-center">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Comment lit-on ce nombre ?
              </h3>
              <div className="text-4xl font-bold text-indigo-600 mb-4">
                {formatNumber(exercises[currentExercise].number)}
              </div>
              
              <input
                type="text"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Écrivez la lecture en lettres..."
                className="w-full max-w-2xl p-3 border-2 border-gray-300 rounded-lg text-center text-gray-800 bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-colors placeholder-gray-400"
                disabled={showAnswer}
              />
              
              {!showAnswer && (
                <button
                  onClick={checkAnswer}
                  disabled={!userAnswer.trim()}
                  className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                >
                  Vérifier
                </button>
              )}
            </div>
          </div>

          {showAnswer && (
            <div className="mb-6">
              <div className={`p-4 rounded-lg ${isCorrect ? 'bg-green-50' : 'bg-red-50'}`}>
                <div className="flex items-center gap-2 mb-2">
                  {isCorrect ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600" />
                  )}
                  <span className={`font-semibold ${isCorrect ? 'text-green-800' : 'text-red-800'}`}>
                    {isCorrect ? 'Correct !' : 'Incorrect'}
                  </span>
                </div>
                
                <div className="text-sm text-gray-700">
                  <strong>Réponse correcte :</strong> {exercises[currentExercise].reading}
                </div>
                
                {!isCorrect && (
                  <div className="text-sm text-gray-700 mt-2">
                    <strong>Votre réponse :</strong> {userAnswer}
                  </div>
                )}
              </div>
              
              {currentExercise < exercises.length - 1 && (
                <button
                  onClick={nextExercise}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors mt-4"
                >
                  Exercice suivant
                  <ArrowLeft className="w-4 h-4 rotate-180" />
                </button>
              )}
              
              {/* Explication toujours visible */}
              <div className="mt-4">
                <div className="bg-yellow-50 rounded-lg p-4 border-l-4 border-yellow-400">
                  <h4 className="font-semibold text-yellow-800 mb-4">💡 Explication illustrée</h4>
                  
                  {/* Décomposition visuelle du nombre */}
                  <div className="bg-white rounded-lg p-4 mb-4">
                    <h5 className="font-medium text-gray-800 mb-3">Décomposition du nombre {formatNumber(exercises[currentExercise].number)} :</h5>
                    
                    <div className="flex items-center justify-center gap-2 mb-4">
                      {(() => {
                        const number = exercises[currentExercise].number;
                        const [integerPart, decimalPart] = number.split('.');
                        
                        return (
                          <>
                            {/* Partie entière */}
                            <div className="flex items-center gap-1">
                              {integerPart.split('').map((digit, index) => (
                                <span key={index} className="bg-green-100 text-green-800 px-2 py-1 rounded font-bold text-xl">
                                  {digit}
                                </span>
                              ))}
                            </div>
                            
                            {/* Virgule */}
                            <span className="text-red-600 font-bold text-2xl">,</span>
                            
                            {/* Partie décimale */}
                            <div className="flex items-center gap-1">
                              {decimalPart.split('').map((digit, index) => (
                                <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded font-bold text-xl">
                                  {digit}
                                </span>
                              ))}
                            </div>
                          </>
                        );
                      })()}
                    </div>
                    
                    {/* Lecture du nombre */}
                    <div className="mb-4 p-3 bg-blue-50 rounded border border-blue-200">
                      <strong className="text-blue-800 text-sm">📖 Lecture :</strong>
                      <div className="mt-2 text-lg font-medium text-gray-800">
                        {getNumberInWords(exercises[currentExercise].number)}
                      </div>
                    </div>

                    {/* Étapes de lecture */}
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-green-100 rounded"></div>
                        <span>Partie entière : {(() => {
                          const number = exercises[currentExercise].number;
                          const [integerPart] = number.split('.');
                          return integerPart;
                        })()}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-red-100 rounded"></div>
                        <span>Séparateur : "et"</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-blue-100 rounded"></div>
                        <span>Partie décimale : {(() => {
                          const number = exercises[currentExercise].number;
                          const [, decimalPart] = number.split('.');
                          const decimalLength = decimalPart.length;
                          const decimalName = decimalLength === 1 ? 'dixièmes' : 
                                             decimalLength === 2 ? 'centièmes' : 'millièmes';
                          return `${decimalPart} ${decimalName}`;
                        })()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-sm text-yellow-700">
                    <p className="font-medium mb-2">Règle générale :</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>D'abord, on lit la partie entière (en vert)</li>
                      <li>Puis on dit "et" pour séparer</li>
                      <li>Enfin, on lit la partie décimale (en bleu) avec son nom</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {!showAnswer && (
            <div className="bg-yellow-50 rounded-lg p-4 border-l-4 border-yellow-400">
              <h4 className="font-semibold text-yellow-800 mb-4">💡 Explication illustrée</h4>
              
              {/* Décomposition visuelle du nombre */}
              <div className="bg-white rounded-lg p-4 mb-4">
                <h5 className="font-medium text-gray-800 mb-3">Décomposition du nombre {formatNumber(exercises[currentExercise].number)} :</h5>
                
                <div className="flex items-center justify-center gap-2 mb-4">
                  {(() => {
                    const number = exercises[currentExercise].number;
                    const [integerPart, decimalPart] = number.split('.');
                    
                    return (
                      <>
                        {/* Partie entière */}
                        <div className="flex items-center gap-1">
                          {integerPart.split('').map((digit, index) => (
                            <span key={index} className="bg-green-100 text-green-800 px-2 py-1 rounded font-bold text-xl">
                              {digit}
                            </span>
                          ))}
                        </div>
                        
                        {/* Virgule */}
                        <span className="text-red-600 font-bold text-2xl">,</span>
                        
                        {/* Partie décimale */}
                        <div className="flex items-center gap-1">
                          {decimalPart.split('').map((digit, index) => (
                            <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded font-bold text-xl">
                              {digit}
                            </span>
                          ))}
                        </div>
                      </>
                    );
                  })()}
                </div>
                
                {/* Étapes de lecture */}
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-100 rounded"></div>
                    <span>Partie entière : {(() => {
                      const number = exercises[currentExercise].number;
                      const [integerPart] = number.split('.');
                      return integerPart;
                    })()}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-100 rounded"></div>
                    <span>Séparateur : "et"</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-100 rounded"></div>
                    <span>Partie décimale : {(() => {
                      const number = exercises[currentExercise].number;
                      const [, decimalPart] = number.split('.');
                      const decimalLength = decimalPart.length;
                      const decimalName = decimalLength === 1 ? 'dixièmes' : 
                                         decimalLength === 2 ? 'centièmes' : 'millièmes';
                      return `${decimalPart} ${decimalName}`;
                    })()}</span>
                  </div>
                </div>
              </div>
              
              <div className="text-sm text-yellow-700">
                <p className="font-medium mb-2">Règle générale :</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>D'abord, on lit la partie entière (en vert)</li>
                  <li>Puis on dit "et" pour séparer</li>
                  <li>Enfin, on lit la partie décimale (en bleu) avec son nom</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 