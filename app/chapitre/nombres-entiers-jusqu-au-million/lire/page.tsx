'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Play, Pause, CheckCircle, XCircle } from 'lucide-react';

export default function LireNombresEntiersPage() {
  const [selectedNumber, setSelectedNumber] = useState('2674');
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationSteps, setAnimationSteps] = useState<number[]>([]);
  const [currentExercise, setCurrentExercise] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [exerciseResults, setExerciseResults] = useState<boolean[]>([]);
  const [showExercises, setShowExercises] = useState(false);
  const [animatingDigit, setAnimatingDigit] = useState<{digit: string, from: number, to: number, sourceX?: number, sourceY?: number, targetX?: number, targetY?: number} | null>(null);

  const numbers = [
    { value: '2674', label: '2 674', reading: 'Deux mille six cent soixante-quatorze' },
    { value: '47158', label: '47 158', reading: 'Quarante-sept mille cent cinquante-huit' },
    { value: '74518', label: '74 518', reading: 'Soixante-quatorze mille cinq cent dix-huit' },
    { value: '540319', label: '540 319', reading: 'Cinq cent quarante mille trois cent dix-neuf' },
    { value: '3547158', label: '3 547 158', reading: 'Trois millions cinq cent quarante-sept mille cent cinquante-huit' },
    { value: '5700000', label: '5 700 000', reading: 'Cinq millions sept cent mille' },
    { value: '89456', label: '89 456', reading: 'Quatre-vingt-neuf mille quatre cent cinquante-six' },
    { value: '123789', label: '123 789', reading: 'Cent vingt-trois mille sept cent quatre-vingt-neuf' },
    { value: '900001', label: '900 001', reading: 'Neuf cent mille un' },
    { value: '4050607', label: '4 050 607', reading: 'Quatre millions cinquante mille six cent sept' },
    { value: '7000000', label: '7 000 000', reading: 'Sept millions' }
  ];

  const exercises = [
    { number: '1234', reading: 'Mille deux cent trente-quatre' },
    { number: '5678', reading: 'Cinq mille six cent soixante-dix-huit' },
    { number: '9876', reading: 'Neuf mille huit cent soixante-seize' },
    { number: '12345', reading: 'Douze mille trois cent quarante-cinq' },
    { number: '67890', reading: 'Soixante-sept mille huit cent quatre-vingt-dix' },
    { number: '34567', reading: 'Trente-quatre mille cinq cent soixante-sept' },
    { number: '98765', reading: 'Quatre-vingt-dix-huit mille sept cent soixante-cinq' },
    { number: '123456', reading: 'Cent vingt-trois mille quatre cent cinquante-six' },
    { number: '789012', reading: 'Sept cent quatre-vingt-neuf mille douze' },
    { number: '456789', reading: 'Quatre cent cinquante-six mille sept cent quatre-vingt-neuf' },
    { number: '1000000', reading: 'Un million' },
    { number: '2500000', reading: 'Deux millions cinq cent mille' },
    { number: '1234567', reading: 'Un million deux cent trente-quatre mille cinq cent soixante-sept' },
    { number: '3000001', reading: 'Trois millions un' },
    { number: '5432109', reading: 'Cinq millions quatre cent trente-deux mille cent neuf' },
    { number: '9876543', reading: 'Neuf millions huit cent soixante-seize mille cinq cent quarante-trois' },
    { number: '6000000', reading: 'Six millions' },
    { number: '8765432', reading: 'Huit millions sept cent soixante-cinq mille quatre cent trente-deux' },
    { number: '4200000', reading: 'Quatre millions deux cent mille' },
    { number: '9999999', reading: 'Neuf millions neuf cent quatre-vingt-dix-neuf mille neuf cent quatre-vingt-dix-neuf' }
  ];

  const formatNumber = (num: string) => {
    return num.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  };

  const animateNumber = async () => {
    setIsAnimating(true);
    setAnimationSteps([]);
    
    // Calculer les positions des chiffres présents (de droite à gauche)
    // Pour 2674: positions = [6, 5, 4, 3] (unités, dizaines, centaines, milliers)
    const positions = [];
    for (let i = 0; i < selectedNumber.length; i++) {
      positions.push(6 - i); // Position dans le tableau (6 = unités, 5 = dizaines, etc.)
    }
    
    // Animer chaque chiffre un par un, en commençant par les unités
    for (let i = 0; i < positions.length; i++) {
      const position = positions[i];
      const digitIndex = selectedNumber.length - 1 - i; // Index du chiffre dans le nombre
      const digit = selectedNumber[digitIndex];
      
      // Calculer les positions réelles des éléments
      const sourceElement = document.getElementById(`source-digit-${digitIndex}`);
      const targetElement = document.getElementById(`target-cell-${position}`);
      
      if (sourceElement && targetElement) {
        const sourceRect = sourceElement.getBoundingClientRect();
        const targetRect = targetElement.getBoundingClientRect();
        
        // Animer le déplacement du chiffre avec les vraies coordonnées
        setAnimatingDigit({ 
          digit, 
          from: digitIndex, 
          to: position,
          sourceX: sourceRect.left + sourceRect.width / 2,
          sourceY: sourceRect.top + sourceRect.height / 2,
          targetX: targetRect.left + targetRect.width / 2,
          targetY: targetRect.top + targetRect.height / 2
        });
        
        // Attendre la fin de l'animation du déplacement
        await new Promise(resolve => setTimeout(resolve, 1200));
        
        // Marquer cette position comme animée
        setAnimationSteps(prev => [...prev, position]);
        
        // Effacer l'animation de déplacement
        setAnimatingDigit(null);
        
        // Attendre avant le prochain chiffre
        await new Promise(resolve => setTimeout(resolve, 300));
      }
    }
    
    // Arrêter l'animation
    setTimeout(() => {
      setIsAnimating(false);
      setAnimationSteps([]);
    }, 1000);
  };

  const checkAnswer = () => {
    const correctAnswer = exercises[currentExercise].reading.toLowerCase().trim();
    const userAnswerClean = userAnswer.toLowerCase().trim();
    const correct = userAnswerClean === correctAnswer;
    
    setIsCorrect(correct);
    setExerciseResults(prev => {
      const newResults = [...prev];
      newResults[currentExercise] = correct;
      return newResults;
    });
  };

  const nextExercise = () => {
    if (currentExercise < exercises.length - 1) {
      setCurrentExercise(currentExercise + 1);
      setUserAnswer('');
      setIsCorrect(null);
    }
  };

  const resetExercises = () => {
    setCurrentExercise(0);
    setUserAnswer('');
    setIsCorrect(null);
    setExerciseResults([]);
  };

  const calculateScore = () => {
    const correct = exerciseResults.filter(result => result === true).length;
    return Math.round((correct / exercises.length) * 100);
  };

  const positions = ['Millions', 'Cent. milliers', 'Diz. milliers', 'Milliers', 'Centaines', 'Dizaines', 'Unités'];
  const positionValues = ['1000000', '100000', '10000', '1000', '100', '10', '1'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-pink-100">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
        <Link href="/chapitre/nombres-entiers-jusqu-au-million" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-4 sm:mb-6">
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="text-sm sm:text-base">Retour</span>
        </Link>

        {/* Titre */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 px-2">
            🎯 Comprendre les nombres jusqu'au MILLION !
          </h1>
        </div>

        {/* Explication de la méthode */}
        <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-2xl sm:rounded-3xl p-4 sm:p-6 mb-6 sm:mb-8 border-2 border-yellow-300">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-center mb-3 sm:mb-4 text-gray-900">
            💡 La méthode pour placer les chiffres
          </h2>
          <div className="text-sm sm:text-base lg:text-lg text-gray-800 space-y-2 sm:space-y-3">
            <p className="text-center px-2">
              <strong>📝 Étape 1 :</strong> On commence toujours par le chiffre de la <span className="text-purple-600 font-bold">fin</span> (à droite)
            </p>
            <p className="text-center px-2">
              <strong>👉 Étape 2 :</strong> On place ce chiffre dans les <span className="text-purple-600 font-bold">unités</span>
            </p>
            <p className="text-center px-2">
              <strong>🔄 Étape 3 :</strong> On continue vers la <span className="text-purple-600 font-bold">gauche</span> : dizaines, centaines, etc.
            </p>
            <div className="text-center mt-3 sm:mt-4">
              <p className="text-sm sm:text-base lg:text-lg font-bold text-gray-800 mb-2 px-2">
                Exemple avec le nombre <span className="text-purple-600">2674</span> :
              </p>
              <div className="flex flex-wrap justify-center items-center gap-1 sm:gap-2 text-sm sm:text-base lg:text-xl px-2">
                <span>4</span>
                <span className="text-purple-600">→</span>
                <span className="text-xs sm:text-sm lg:text-base">unités</span>
                <span className="text-gray-400 hidden sm:inline">|</span>
                <span>7</span>
                <span className="text-purple-600">→</span>
                <span className="text-xs sm:text-sm lg:text-base">dizaines</span>
                <span className="text-gray-400 hidden sm:inline">|</span>
                <span>6</span>
                <span className="text-purple-600">→</span>
                <span className="text-xs sm:text-sm lg:text-base">centaines</span>
                <span className="text-gray-400 hidden sm:inline">|</span>
                <span>2</span>
                <span className="text-purple-600">→</span>
                <span className="text-xs sm:text-sm lg:text-base">milliers</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tableau magique des positions */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-xl mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-center mb-4 sm:mb-6 text-gray-900 px-2">
            📊 Le tableau magique des positions
          </h2>

          <div className="overflow-x-auto -mx-2 sm:mx-0">
            <div className="min-w-max px-2 sm:px-0">
              <table className="w-full border-collapse text-xs sm:text-sm lg:text-base">
                <thead>
                  <tr className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                    {positions.map((pos, i) => (
                      <th key={i} className="p-2 sm:p-3 lg:p-4 text-xs sm:text-sm lg:text-base font-bold border border-purple-400 first:rounded-tl-lg last:rounded-tr-lg min-w-[60px] sm:min-w-[80px]">
                        <div className="break-words leading-tight">
                          {pos.split(' ').map((word, idx) => (
                            <div key={idx} className="block sm:inline">
                              {word}{idx < pos.split(' ').length - 1 && <span className="hidden sm:inline"> </span>}
                            </div>
                          ))}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="text-center">
                    {positionValues.map((value, i) => {
                      const colors = ['bg-red-200', 'bg-orange-200', 'bg-yellow-200', 'bg-green-200', 'bg-blue-200', 'bg-indigo-200', 'bg-purple-200'];
                      return (
                        <td key={i} className={`p-2 sm:p-3 lg:p-4 text-xs sm:text-sm lg:text-lg font-bold border border-gray-300 ${colors[i]} min-w-[60px] sm:min-w-[80px]`}>
                          <div className="break-all leading-tight">
                            {value.length > 4 ? (
                              <div>
                                <div className="block sm:hidden text-[10px]">{value.slice(0, 3)}...</div>
                                <div className="hidden sm:block">{value}</div>
                              </div>
                            ) : (
                              value
                            )}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Section interactive */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-xl mb-6 sm:mb-8 relative">
          <h2 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-center mb-4 sm:mb-6 text-gray-900 px-2">
            🎮 Choisis un nombre et regarde la magie !
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
            {numbers.map((num) => (
              <button
                key={num.value}
                onClick={() => setSelectedNumber(num.value)}
                className={`p-3 sm:p-4 rounded-lg sm:rounded-xl border-2 sm:border-3 transition-all transform hover:scale-105 ${
                  selectedNumber === num.value 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white border-blue-500 shadow-lg' 
                    : 'bg-white border-gray-300 hover:border-blue-300 text-gray-900'
                }`}
              >
                <div className="text-base sm:text-lg font-bold">{num.label}</div>
                <div className="text-xs sm:text-sm opacity-75 leading-tight mt-1">{num.reading}</div>
              </button>
            ))}
          </div>

          {/* Bouton animation */}
          <div className="text-center mb-4 sm:mb-6">
            <button 
              onClick={animateNumber}
              disabled={isAnimating}
              className={`px-6 sm:px-8 py-3 rounded-lg sm:rounded-xl font-bold text-sm sm:text-base lg:text-lg transition-all transform hover:scale-105 shadow-lg ${
                isAnimating 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600'
              }`}
            >
              {isAnimating ? <Pause className="w-4 h-4 sm:w-5 sm:h-5 inline mr-2" /> : <Play className="w-4 h-4 sm:w-5 sm:h-5 inline mr-2" />}
              <span className="hidden sm:inline">{isAnimating ? 'Animation en cours...' : 'Voir l\'animation !'}</span>
              <span className="sm:hidden">{isAnimating ? 'En cours...' : 'Animation !'}</span>
            </button>
            {isAnimating && (
              <div className="mt-3 sm:mt-4 p-3 bg-blue-100 border border-blue-300 rounded-lg mx-2 sm:mx-0">
                <p className="text-xs sm:text-sm font-bold text-blue-800">
                  👀 Regarde bien : chaque chiffre se déplace vers sa position !
                </p>
                {animatingDigit && (
                  <p className="text-xs text-blue-600 mt-1 leading-tight">
                    Le chiffre <span className="font-bold text-red-600">{animatingDigit.digit}</span> se place dans les {' '}
                    <span className="font-bold">
                      {animatingDigit.to === 6 ? 'UNITÉS' : 
                       animatingDigit.to === 5 ? 'DIZAINES' :
                       animatingDigit.to === 4 ? 'CENTAINES' :
                       animatingDigit.to === 3 ? 'MILLIERS' :
                       animatingDigit.to === 2 ? 'DIZ. MILLIERS' :
                       animatingDigit.to === 1 ? 'CENT. MILLIERS' :
                       'MILLIONS'}
                    </span>
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Conteneur principal avec nombre et tableau côte à côte */}
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            
            {/* Nombre source */}
            <div className="flex-shrink-0 bg-blue-50 p-6 rounded-2xl border-2 border-blue-200">
              <h3 className="text-xl font-bold text-gray-700 mb-4 text-center">Nombre à décomposer :</h3>
              <div className="text-7xl font-bold text-blue-600 relative" id="source-number">
                {selectedNumber.split('').map((digit, index) => (
                  <span 
                    key={index}
                    className={`inline-block relative ${
                      animatingDigit?.from === index ? 'text-transparent' : ''
                    }`}
                    id={`source-digit-${index}`}
                  >
                    {digit}
                  </span>
                ))}
              </div>
              <div className="text-sm text-gray-600 mt-2 text-center">
                {formatNumber(selectedNumber)}
              </div>
            </div>

            {/* Tableau interactif */}
            <div className="flex-1 bg-gray-50 p-6 rounded-2xl relative">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                  {positions.map((pos, i) => (
                    <th key={i} className="p-3 text-sm font-bold border border-purple-400 first:rounded-tl-lg last:rounded-tr-lg">
                      {pos}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="text-center">
                  {Array.from({ length: 7 }, (_, i) => {
                    const digitIndex = 6 - i;
                    const digit = selectedNumber.length > digitIndex ? selectedNumber[selectedNumber.length - 1 - digitIndex] : '';
                    const isPresent = selectedNumber.length > digitIndex && digit !== '';
                    const colors = ['bg-red-200', 'bg-orange-200', 'bg-yellow-200', 'bg-green-200', 'bg-blue-200', 'bg-indigo-200', 'bg-purple-200'];
                    
                    // Animation séquentielle
                    const hasBeenAnimated = animationSteps.includes(i);
                    const isTargetPosition = animatingDigit?.to === i;
                    
                    return (
                      <td 
                        key={i} 
                        className={`p-4 text-3xl font-bold border-2 transition-all duration-500 relative ${
                          isPresent ? `${colors[i]} text-gray-900 border-gray-400 ${
                            hasBeenAnimated ? 'scale-105 shadow-lg' : ''
                          } ${isTargetPosition ? 'ring-4 ring-yellow-400 animate-pulse' : ''}` : 'bg-gray-100 text-gray-400 border-gray-200'
                        }`}
                        id={`target-cell-${i}`}
                      >
                        {hasBeenAnimated || !isAnimating ? (digit || '') : ''}
                      </td>
                    );
                  })}
                </tr>
              </tbody>
            </table>
              
              {/* Animation du déplacement */}
              {animatingDigit && animatingDigit.sourceX && animatingDigit.sourceY && animatingDigit.targetX && animatingDigit.targetY && (
                <div className="fixed inset-0 pointer-events-none z-50">
                  <div className="absolute text-5xl font-bold text-red-600 bg-yellow-200 px-3 py-2 rounded-full border-3 border-yellow-400 shadow-2xl"
                       style={{
                         animation: 'moveDigit 1s ease-in-out forwards',
                         left: `${animatingDigit.sourceX}px`,
                         top: `${animatingDigit.sourceY}px`,
                         transform: 'translate(-50%, -50%)',
                         '--target-x': `${animatingDigit.targetX - animatingDigit.sourceX}px`,
                         '--target-y': `${animatingDigit.targetY - animatingDigit.sourceY}px`
                       } as React.CSSProperties}>
                    {animatingDigit.digit}
                  </div>
                </div>
              )}
              
              {/* Flèche indicatrice */}
              {animatingDigit && (
                <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 z-40">
                  <div className="text-3xl animate-pulse">
                    ➡️
                  </div>
                  <div className="text-xs font-bold text-gray-700 mt-1 text-center bg-white px-2 py-1 rounded shadow">
                    {animatingDigit.to === 6 ? 'UNITÉS' : 
                     animatingDigit.to === 5 ? 'DIZAINES' :
                     animatingDigit.to === 4 ? 'CENTAINES' :
                     animatingDigit.to === 3 ? 'MILLIERS' :
                     animatingDigit.to === 2 ? 'DIZ. MILLIERS' :
                     animatingDigit.to === 1 ? 'CENT. MILLIERS' :
                     'MILLIONS'}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Affichage du nombre et lecture */}
          <div className="mt-6 text-center">
            <div className="text-3xl font-bold text-gray-900 mb-2">
              Se lit : "{numbers.find(n => n.value === selectedNumber)?.reading}"
            </div>
          </div>
        </div>

        {/* Section d'exercices */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-xl mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-center mb-4 sm:mb-6 text-gray-900 px-2">
            🎯 Série d'exercices - Lecture des nombres
          </h2>
          
          {!showExercises ? (
            <div className="text-center">
              <p className="text-sm sm:text-base lg:text-lg text-gray-600 mb-4 sm:mb-6 px-2">
                Maintenant que tu as compris la méthode, entraîne-toi avec 20 exercices !
              </p>
              <button 
                onClick={() => setShowExercises(true)}
                className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg sm:rounded-xl font-bold text-sm sm:text-base lg:text-lg hover:from-green-600 hover:to-blue-600 transition-all transform hover:scale-105 shadow-lg"
              >
                🚀 Commencer les exercices !
              </button>
            </div>
          ) : (
            <div>
              {/* Rappel des règles d'orthographe */}
              <div className="bg-blue-50 border-l-4 border-blue-500 p-3 sm:p-4 lg:p-6 mb-4 sm:mb-6 rounded-r-lg">
                <h3 className="text-sm sm:text-base lg:text-lg font-bold text-blue-800 mb-3 sm:mb-4 flex items-center">
                  📝 Rappel des règles d'orthographe
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm">
                  <div className="space-y-2 sm:space-y-3">
                    <div className="flex items-start space-x-2">
                      <span className="text-green-600 font-bold text-sm">✓</span>
                      <div className="flex-1">
                        <strong className="text-gray-900">MILLE</strong> <span className="text-gray-800">est invariable</span><br/>
                        <span className="text-gray-700 text-xs">Ex: deux mille, trois mille</span>
                      </div>
                    </div>
                    <div className="flex items-start space-x-2">
                      <span className="text-green-600 font-bold text-sm">✓</span>
                      <div className="flex-1">
                        <strong className="text-gray-900">CENT</strong> <span className="text-gray-800">prend un "s" seulement s'il est multiplié et en fin de nombre</span><br/>
                        <span className="text-gray-700 text-xs">Ex: deux cents, mais deux cent un</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2 sm:space-y-3">
                    <div className="flex items-start space-x-2">
                      <span className="text-green-600 font-bold text-sm">✓</span>
                      <div className="flex-1">
                        <strong className="text-gray-900">MILLION</strong> <span className="text-gray-800">prend un "s" au pluriel</span><br/>
                        <span className="text-gray-700 text-xs">Ex: deux millions, trois millions</span>
                      </div>
                    </div>
                    <div className="flex items-start space-x-2">
                      <span className="text-green-600 font-bold text-sm">✓</span>
                      <div className="flex-1">
                        <strong className="text-gray-900">VINGT</strong> <span className="text-gray-800">prend un "s" dans "quatre-vingts" seulement</span><br/>
                        <span className="text-gray-700 text-xs">Ex: quatre-vingts, mais quatre-vingt-un</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Progression */}
              <div className="mb-6">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Exercice {currentExercise + 1} sur {exercises.length}</span>
                  <span>Score: {exerciseResults.filter(r => r === true).length}/{exerciseResults.length}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${((currentExercise + 1) / exercises.length) * 100}%` }}
                  ></div>
                </div>
              </div>

              {currentExercise < exercises.length ? (
                <div className="text-center">
                  <div className="bg-gray-50 p-4 sm:p-6 rounded-xl sm:rounded-2xl mb-4 sm:mb-6">
                    <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-3 sm:mb-4 px-2">
                      Comment se lit ce nombre ?
                    </h3>
                    <div className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-purple-600 mb-3 sm:mb-4 break-all">
                      {formatNumber(exercises[currentExercise].number)}
                    </div>
                  </div>

                  <div className="mb-4 sm:mb-6">
                    <input
                      type="text"
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      placeholder="Écris comment se lit ce nombre..."
                      className="w-full p-3 sm:p-4 border-2 border-gray-300 rounded-lg sm:rounded-xl text-sm sm:text-base lg:text-lg focus:border-purple-500 focus:outline-none text-gray-900 placeholder-gray-600 bg-white"
                      disabled={isCorrect !== null}
                    />
                  </div>

                  {isCorrect === null ? (
                    <button
                      onClick={checkAnswer}
                      disabled={!userAnswer.trim()}
                      className={`px-8 py-3 rounded-xl font-bold text-lg transition-all transform hover:scale-105 ${
                        userAnswer.trim() 
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 shadow-lg' 
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      Vérifier ma réponse
                    </button>
                  ) : (
                    <div className="space-y-4">
                      <div className={`p-4 rounded-xl ${isCorrect ? 'bg-green-100 border-2 border-green-400' : 'bg-red-100 border-2 border-red-400'}`}>
                        <div className="flex items-center justify-center mb-2">
                          {isCorrect ? (
                            <CheckCircle className="w-6 h-6 text-green-600 mr-2" />
                          ) : (
                            <XCircle className="w-6 h-6 text-red-600 mr-2" />
                          )}
                          <span className={`font-bold ${isCorrect ? 'text-green-800' : 'text-red-800'}`}>
                            {isCorrect ? 'Correct ! 🎉' : 'Pas tout à fait...'}
                          </span>
                        </div>
                        {!isCorrect && (
                          <p className="text-gray-700">
                            <strong>Réponse correcte :</strong> {exercises[currentExercise].reading}
                          </p>
                        )}
                      </div>
                      
                      {currentExercise < exercises.length - 1 ? (
                        <button
                          onClick={nextExercise}
                          className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-3 rounded-xl font-bold text-lg hover:from-blue-600 hover:to-purple-600 transition-all transform hover:scale-105 shadow-lg"
                        >
                          Exercice suivant →
                        </button>
                      ) : (
                        <div className="text-center">
                          <div className="bg-gradient-to-r from-yellow-100 to-orange-100 border-2 border-yellow-400 rounded-2xl p-6 mb-4">
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">
                              🎊 Série terminée !
                            </h3>
                            <p className="text-lg text-gray-700">
                              Score final : <span className="font-bold text-purple-600">{calculateScore()}%</span>
                            </p>
                            <p className="text-sm text-gray-600 mt-2">
                              {exerciseResults.filter(r => r === true).length} bonnes réponses sur {exercises.length}
                            </p>
                          </div>
                          <button
                            onClick={resetExercises}
                            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-xl font-bold text-lg hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105 shadow-lg mr-4"
                          >
                            🔄 Recommencer
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          )}
        </div>

        {/* Bouton final */}
        <div className="text-center px-2">
          <Link 
            href="/chapitre/nombres-entiers-jusqu-au-million/ecrire"
            className="inline-flex items-center space-x-2 sm:space-x-3 bg-gradient-to-r from-green-500 to-blue-500 text-white px-4 sm:px-6 lg:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold text-sm sm:text-base lg:text-lg xl:text-xl hover:from-green-600 hover:to-blue-600 transition-all transform hover:scale-105 shadow-lg"
          >
            <span className="text-lg sm:text-xl lg:text-2xl">🎉</span>
            <span className="text-center leading-tight">Maintenant j'apprends à écrire !</span>
            <span className="text-lg sm:text-xl lg:text-2xl">✏️</span>
          </Link>
        </div>
            </div>

      {/* Styles pour l'animation de déplacement */}
      <style jsx>{`
        @keyframes moveDigit {
          0% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
          }
          50% {
            transform: translate(calc(-50% + var(--target-x) * 0.5), calc(-50% + var(--target-y) * 0.5)) scale(1.3);
            opacity: 0.9;
          }
          100% {
            transform: translate(calc(-50% + var(--target-x)), calc(-50% + var(--target-y))) scale(1);
            opacity: 0.8;
          }
        }
      `}</style>
    </div>
  );
} 