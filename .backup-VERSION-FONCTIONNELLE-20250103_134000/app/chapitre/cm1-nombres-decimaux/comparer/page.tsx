'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Play, RefreshCw, CheckCircle, XCircle, Eye, Lightbulb, Target, Trophy, Grid, Calculator, Book, Sparkles, ChevronRight } from 'lucide-react';

export default function ComparerNombresDecimauxPage() {
  const [selectedPair, setSelectedPair] = useState(['12.45', '8.789']);
  const [currentExercise, setCurrentExercise] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [showAnswer, setShowAnswer] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);

  const [isAnimating, setIsAnimating] = useState(false);
  const [animationStep, setAnimationStep] = useState(0);
  const [highlightedNumber, setHighlightedNumber] = useState<'first' | 'second' | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  
  // Animation pour le cours
  const [courseAnimating, setCourseAnimating] = useState(false);
  const [courseStep, setCourseStep] = useState(0);
  const [highlightedPosition, setHighlightedPosition] = useState<number | null>(null);

  const exercises = [
    { pair: ['5.67', '5.8'], answer: '<', explanation: 'Parties entières égales (5), dixièmes : 6 vs 8, donc 5,67 < 5,8' },
    { pair: ['12.3', '9.87'], answer: '>', explanation: 'Parties entières différentes : 12 > 9' },
    { pair: ['0.45', '0.7'], answer: '<', explanation: 'Parties entières égales (0), dixièmes : 4 vs 7, donc 0,45 < 0,7' },
    { pair: ['23.6', '23.58'], answer: '>', explanation: 'Parties entières égales (23), dixièmes : 6 vs 5, donc 23,6 > 23,58' },
    { pair: ['7.25', '72.5'], answer: '<', explanation: 'Parties entières différentes : 7 < 72' },
    { pair: ['15.4', '15.04'], answer: '>', explanation: 'Parties entières égales (15), dixièmes : 4 vs 0, donc 15,4 > 15,04' },
    { pair: ['3.789', '3.8'], answer: '<', explanation: 'Parties entières égales (3), dixièmes : 7 vs 8, donc 3,789 < 3,8' },
    { pair: ['46.2', '4.62'], answer: '>', explanation: 'Parties entières différentes : 46 > 4' },
    { pair: ['0.123', '0.13'], answer: '<', explanation: 'Parties entières égales (0), dixièmes égaux (1), centièmes : 2 vs 3, donc 0,123 < 0,13' },
    { pair: ['8.9', '8.90'], answer: '=', explanation: '8,9 = 8,90 (zéros à droite ne changent pas la valeur)' },
    { pair: ['25.67', '25.7'], answer: '>', explanation: 'Parties entières égales (25), dixièmes égaux (6), centièmes : 7 vs 0 (car 25,7 = 25,70), donc 25,67 > 25,70' },
    { pair: ['100.1', '99.9'], answer: '>', explanation: 'Parties entières différentes : 100 > 99' },
    { pair: ['6.45', '6.450'], answer: '=', explanation: '6,45 = 6,450 (zéros à droite ne changent pas la valeur)' },
    { pair: ['78.23', '78.3'], answer: '<', explanation: 'Parties entières égales (78), dixièmes : 2 vs 3, donc 78,23 < 78,3' },
    { pair: ['9.876', '98.76'], answer: '<', explanation: 'Parties entières différentes : 9 < 98' }
  ];

  const formatNumber = (num: string) => {
    return num.replace('.', ',');
  };

  const getIntegerPart = (num: string) => {
    return num.split('.')[0];
  };

  const getDecimalPart = (num: string) => {
    return num.split('.')[1] || '';
  };

  const compareDecimals = (num1: string, num2: string) => {
    const int1 = parseInt(getIntegerPart(num1));
    const int2 = parseInt(getIntegerPart(num2));
    
    // Si les parties entières sont différentes
    if (int1 !== int2) {
      return int1 > int2 ? '>' : '<';
    }
    
    // Parties entières égales, comparer les décimales chiffre par chiffre
    const dec1 = getDecimalPart(num1).padEnd(10, '0');
    const dec2 = getDecimalPart(num2).padEnd(10, '0');
    
    for (let i = 0; i < Math.max(dec1.length, dec2.length); i++) {
      const digit1 = parseInt(dec1[i] || '0');
      const digit2 = parseInt(dec2[i] || '0');
      
      if (digit1 > digit2) return '>';
      if (digit1 < digit2) return '<';
    }
    
    return '=';
  };

  const getComparisonExplanation = (num1: string, num2: string) => {
    const int1 = parseInt(getIntegerPart(num1));
    const int2 = parseInt(getIntegerPart(num2));
    
    if (int1 !== int2) {
      return `Parties entières différentes : ${int1} ${int1 > int2 ? '>' : '<'} ${int2}`;
    }
    
    const dec1 = getDecimalPart(num1);
    const dec2 = getDecimalPart(num2);
    const maxLen = Math.max(dec1.length, dec2.length);
    
    for (let i = 0; i < maxLen; i++) {
      const digit1 = parseInt(dec1[i] || '0');
      const digit2 = parseInt(dec2[i] || '0');
      
      if (digit1 !== digit2) {
        const position = i === 0 ? 'dixièmes' : i === 1 ? 'centièmes' : i === 2 ? 'millièmes' : `position ${i+1}`;
        return `Parties entières égales (${int1}), ${position} : ${digit1} ${digit1 > digit2 ? '>' : '<'} ${digit2}`;
      }
    }
    
    return 'Les nombres sont égaux';
  };

  const animateComparison = async () => {
    setIsAnimating(true);
    setAnimationStep(0);
    setShowExplanation(false);
    
    // Étape 1 : Montrer les nombres
    setAnimationStep(1);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Étape 2 : Comparer les parties entières
    setAnimationStep(2);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Étape 3 : Comparer les décimales si nécessaire
    setAnimationStep(3);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Étape 4 : Montrer la réponse
    setAnimationStep(4);
    setShowExplanation(true);
    
    setIsAnimating(false);
  };

  const prevExercise = () => {
    if (currentExercise > 0) {
      setCurrentExercise(prev => prev - 1);
      setUserAnswer('');
      setShowAnswer(false);
      setIsCorrect(false);
    }
  };

  const resetExercise = () => {
    setUserAnswer('');
    setShowAnswer(false);
    setIsCorrect(false);
  };

  const animateCourse = async () => {
    setCourseAnimating(true);
    setCourseStep(0);
    setHighlightedPosition(null);
    
    // Étape 1 : Présenter les nombres
    setCourseStep(1);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Étape 2 : Comparer les parties entières
    setCourseStep(2);
    setHighlightedPosition(-1); // -1 pour partie entière
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Étape 3 : Comparer les dixièmes
    setCourseStep(3);
    setHighlightedPosition(0);
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Étape 4 : Comparer les centièmes
    setCourseStep(4);
    setHighlightedPosition(1);
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Étape 5 : Comparer les millièmes
    setCourseStep(5);
    setHighlightedPosition(2);
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Étape 6 : Conclusion
    setCourseStep(6);
    setHighlightedPosition(null);
    
    setCourseAnimating(false);
  };

  const checkAnswer = () => {
    const exercise = exercises[currentExercise];
    const correct = userAnswer.trim() === exercise.answer;
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
    }
  };

  const resetExercises = () => {
    setCurrentExercise(0);
    setUserAnswer('');
    setShowAnswer(false);
    setIsCorrect(false);
    setScore(0);
    setAttempts(0);
  };

  const getCurrentExercise = () => exercises[currentExercise];



  const renderComparisonMethod = () => {
    const [num1, num2] = selectedPair;
    
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-orange-100 rounded-lg">
            <Calculator className="w-6 h-6 text-orange-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-800">Méthode de comparaison</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Nombre 1 */}
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="text-center mb-4">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {formatNumber(num1)}
              </div>
              <div className="text-sm text-gray-600">Premier nombre</div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">Partie entière :</span>
                <span className="font-bold text-blue-600">{getIntegerPart(num1)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">Partie décimale :</span>
                <span className="font-bold text-blue-600">{getDecimalPart(num1)}</span>
              </div>
            </div>
          </div>
          
          {/* Nombre 2 */}
          <div className="bg-green-50 rounded-lg p-4">
            <div className="text-center mb-4">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {formatNumber(num2)}
              </div>
              <div className="text-sm text-gray-600">Deuxième nombre</div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">Partie entière :</span>
                <span className="font-bold text-green-600">{getIntegerPart(num2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">Partie décimale :</span>
                <span className="font-bold text-green-600">{getDecimalPart(num2)}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Étapes de comparaison */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-bold text-gray-800 mb-3">📋 Étapes de comparaison :</h3>
          <div className="space-y-2">
            <div className={`flex items-center gap-2 p-2 rounded ${animationStep >= 2 ? 'bg-orange-100' : ''}`}>
              <span className="font-bold text-orange-600">1.</span>
              <span className="text-sm text-gray-700">Comparer les parties entières : {getIntegerPart(num1)} vs {getIntegerPart(num2)}</span>
            </div>
            <div className={`flex items-center gap-2 p-2 rounded ${animationStep >= 3 ? 'bg-orange-100' : ''}`}>
              <span className="font-bold text-orange-600">2.</span>
              <span className="text-sm text-gray-700">
                {getIntegerPart(num1) === getIntegerPart(num2)
                  ? "Parties entières égales → Comparer les décimales chiffre par chiffre"
                  : `Parties entières différentes → ${getIntegerPart(num1)} ${parseInt(getIntegerPart(num1)) > parseInt(getIntegerPart(num2)) ? '>' : '<'} ${getIntegerPart(num2)}`
                }
              </span>
            </div>
            {getIntegerPart(num1) === getIntegerPart(num2) && (
              <div className={`flex items-center gap-2 p-2 rounded ${animationStep >= 4 ? 'bg-orange-100' : ''}`}>
                <span className="font-bold text-orange-600">3.</span>
                <span className="text-sm text-gray-700">Comparer dixièmes, puis centièmes, puis millièmes...</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Résultat */}
        {showExplanation && (
          <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="font-bold text-green-800">Résultat :</span>
            </div>
            <div className="text-center text-2xl font-bold text-green-600 mb-2">
              {formatNumber(num1)} {compareDecimals(num1, num2)} {formatNumber(num2)}
            </div>
            <div className="text-sm text-gray-600 text-center">
              {getComparisonExplanation(num1, num2)}
            </div>
          </div>
        )}
        
        <div className="mt-6 flex justify-center">
          <button
            onClick={animateComparison}
            disabled={isAnimating}
            className="flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 transition-colors"
          >
            <Play className="w-5 h-5" />
            {isAnimating ? 'Animation en cours...' : 'Animer la comparaison'}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100 p-4">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/chapitre/cm1-nombres-decimaux" className="p-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Comparer les nombres décimaux</h1>
            <p className="text-gray-600 mt-2">Méthode : comparer les parties entières, puis si égales, comparer les décimales chiffre par chiffre</p>
          </div>
        </div>

        {/* Section Cours avec animation */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Book className="w-6 h-6 text-blue-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">📚 Cours : Comment comparer deux nombres décimaux ?</h2>
          </div>
          
          <div className="mb-6">
            <div className="bg-blue-50 rounded-lg p-4 mb-4">
              <h3 className="font-bold text-blue-800 mb-2">📝 Méthode :</h3>
              <ol className="list-decimal list-inside space-y-1 text-gray-700">
                <li>Je compare les <span className="font-bold text-blue-600">parties entières</span></li>
                <li>Si elles sont égales, je compare les <span className="font-bold text-blue-600">dixièmes</span></li>
                <li>Si les dixièmes sont égaux, je compare les <span className="font-bold text-blue-600">centièmes</span></li>
                <li>Si les centièmes sont égaux, je compare les <span className="font-bold text-blue-600">millièmes</span></li>
                <li>Et ainsi de suite...</li>
              </ol>
            </div>
          </div>

          {/* Exemple animé */}
          <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">
              ✨ Exemple : Comparons 12,543 et 12,546
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Premier nombre */}
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {courseStep >= 1 ? (
                    <span>
                      <span className={highlightedPosition === -1 ? 'bg-yellow-300 px-1 rounded' : ''}>12</span>
                      <span>,</span>
                      <span className={highlightedPosition === 0 ? 'bg-yellow-300 px-1 rounded' : ''}>5</span>
                      <span className={highlightedPosition === 1 ? 'bg-yellow-300 px-1 rounded' : ''}>4</span>
                      <span className={highlightedPosition === 2 ? 'bg-yellow-300 px-1 rounded' : ''}>3</span>
                    </span>
                  ) : '12,543'}
                </div>
                <div className="text-sm text-gray-600">Premier nombre</div>
              </div>
              
              {/* Deuxième nombre */}
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {courseStep >= 1 ? (
                    <span>
                      <span className={highlightedPosition === -1 ? 'bg-yellow-300 px-1 rounded' : ''}>12</span>
                      <span>,</span>
                      <span className={highlightedPosition === 0 ? 'bg-yellow-300 px-1 rounded' : ''}>5</span>
                      <span className={highlightedPosition === 1 ? 'bg-yellow-300 px-1 rounded' : ''}>4</span>
                      <span className={highlightedPosition === 2 ? 'bg-yellow-300 px-1 rounded' : ''}>6</span>
                    </span>
                  ) : '12,546'}
                </div>
                <div className="text-sm text-gray-600">Deuxième nombre</div>
              </div>
            </div>

            {/* Étapes d'explication */}
            <div className="space-y-4">
              {courseStep >= 2 && (
                <div className="bg-white rounded-lg p-4 border-l-4 border-blue-500">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-blue-600">Étape 1 :</span>
                    <span className="text-gray-700">Je compare les parties entières</span>
                  </div>
                  <div className="mt-2 text-gray-600">
                    12 = 12 → Les parties entières sont égales ! Je dois comparer les décimales.
                  </div>
                </div>
              )}

              {courseStep >= 3 && (
                <div className="bg-white rounded-lg p-4 border-l-4 border-orange-500">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-orange-600">Étape 2 :</span>
                    <span className="text-gray-700">Je compare les dixièmes</span>
                  </div>
                  <div className="mt-2 text-gray-600">
                    5 = 5 → Les dixièmes sont égaux ! Je continue avec les centièmes.
                  </div>
                </div>
              )}

              {courseStep >= 4 && (
                <div className="bg-white rounded-lg p-4 border-l-4 border-purple-500">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-purple-600">Étape 3 :</span>
                    <span className="text-gray-700">Je compare les centièmes</span>
                  </div>
                  <div className="mt-2 text-gray-600">
                    4 = 4 → Les centièmes sont égaux ! Je continue avec les millièmes.
                  </div>
                </div>
              )}

              {courseStep >= 5 && (
                <div className="bg-white rounded-lg p-4 border-l-4 border-green-500">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-green-600">Étape 4 :</span>
                    <span className="text-gray-700">Je compare les millièmes</span>
                  </div>
                  <div className="mt-2 text-gray-600">
                    3 &lt; 6 → Les millièmes sont différents ! J'ai trouvé la réponse.
                  </div>
                </div>
              )}

              {courseStep >= 6 && (
                <div className="bg-green-100 rounded-lg p-4 border-2 border-green-500">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                      <span className="font-bold text-green-800 text-lg">Conclusion :</span>
                    </div>
                    <div className="text-2xl font-bold text-green-600 mb-2">
                      12,543 &lt; 12,546
                    </div>
                    <div className="text-gray-700">
                      Car 3 millièmes &lt; 6 millièmes
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-center">
              <button
                onClick={animateCourse}
                disabled={courseAnimating}
                className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors"
              >
                <Sparkles className="w-5 h-5" />
                {courseAnimating ? 'Animation en cours...' : 'Voir l\'animation du cours'}
              </button>
            </div>
          </div>
        </div>

        {/* Sélecteur de nombres */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Eye className="w-6 h-6 text-orange-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Comprendre la méthode</h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
            {[
              ['12.45', '8.789'],
              ['25.6', '25.58'],
              ['7.25', '72.5'],
              ['0.45', '0.7'],
              ['46.2', '4.62'],
              ['8.9', '8.90']
            ].map(([num1, num2], index) => (
              <button
                key={index}
                onClick={() => setSelectedPair([num1, num2])}
                className={`p-3 rounded-lg border transition-all ${
                  selectedPair[0] === num1 && selectedPair[1] === num2
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-gray-200 hover:border-orange-300 bg-white'
                }`}
              >
                <div className="text-sm font-medium text-gray-800">
                  {formatNumber(num1)} vs {formatNumber(num2)}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Méthode de comparaison */}
        {renderComparisonMethod()}

        {/* Exercices */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Target className="w-6 h-6 text-orange-600" />
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
                <div className="text-3xl font-bold text-gray-800 mb-4">
                  {formatNumber(getCurrentExercise().pair[0])} __ {formatNumber(getCurrentExercise().pair[1])}
                </div>
                <div className="text-gray-600 mb-6">
                  Choisis le bon symbole : &lt;, &gt; ou =
                </div>
              </div>

              <div className="flex justify-center gap-4 mb-6">
                {['<', '>', '='].map((symbol) => (
                  <button
                    key={symbol}
                    onClick={() => setUserAnswer(symbol)}
                    className={`px-6 py-3 text-xl font-bold rounded-lg border-2 transition-all ${
                      userAnswer === symbol
                        ? 'border-orange-500 bg-orange-50 text-orange-600'
                        : 'border-gray-200 hover:border-orange-300 bg-white text-gray-900'
                    }`}
                  >
                    {symbol}
                  </button>
                ))}
              </div>

              <div className="space-y-4">
                {/* Boutons d'action principaux */}
                <div className="flex justify-center gap-4">
                  <button
                    onClick={checkAnswer}
                    disabled={!userAnswer || showAnswer}
                    className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 transition-colors"
                  >
                    Vérifier
                  </button>
                  
                  {showAnswer && (
                    <button
                      onClick={resetExercise}
                      className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                    >
                      Réessayer
                    </button>
                  )}
                </div>

                {/* Navigation entre exercices */}
                <div className="flex justify-between items-center">
                  <button
                    onClick={prevExercise}
                    disabled={currentExercise === 0}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight className="w-4 h-4 rotate-180" />
                    Précédent
                  </button>

                  <div className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                    {currentExercise + 1} / {exercises.length}
                  </div>

                  <button
                    onClick={nextExercise}
                    disabled={currentExercise === exercises.length - 1}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Suivant
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

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
                      {isCorrect ? 'Correct !' : 'Incorrect'}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    {getCurrentExercise().explanation}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Félicitations !</h3>
              <p className="text-gray-600 mb-4">
                Tu as terminé tous les exercices avec un score de {score}/{attempts}
              </p>
              <button
                onClick={resetExercises}
                className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
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