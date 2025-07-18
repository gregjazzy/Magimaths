'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, XCircle, RefreshCw, Trophy, Target, Eye, Zap, Calculator, Clock, Play, Pause, RotateCcw, ArrowRight } from 'lucide-react';

interface Exercise {
  operation: string;
  answer: number;
  type: 'multiplication' | 'division';
  exerciseType: 'calculate' | 'find-missing';
  number: number;
  multiplier: number;
  result?: number;
  isDecimal?: boolean;
  visualSteps?: string[];
}

export default function MultiplierDiviserPage() {
  const [currentSection, setCurrentSection] = useState<'cours' | 'exercices'>('cours');
  const [currentExercise, setCurrentExercise] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [selectedMultiplier, setSelectedMultiplier] = useState(10);
  const [operationType, setOperationType] = useState<'multiplication' | 'division'>('multiplication');
  const [animatedTransformation, setAnimatedTransformation] = useState('');
  const [virgulaAnimation, setVirguleAnimation] = useState({ before: '', after: '', step: 0 });
  const [currentTransformationExample, setCurrentTransformationExample] = useState(0);

  // Exemples prédéfinis pour la transformation (difficulté croissante)
  const transformationExamples = [
    // Niveau 1 : Multiplications simples avec entiers
    { operation: '7 × 10', result: '70', type: 'multiplication' as const },
    { operation: '23 × 10', result: '230', type: 'multiplication' as const },
    { operation: '45 × 100', result: '4500', type: 'multiplication' as const },
    { operation: '12 × 1000', result: '12000', type: 'multiplication' as const },
    
    // Niveau 2 : Divisions simples avec entiers
    { operation: '80 ÷ 10', result: '8', type: 'division' as const },
    { operation: '250 ÷ 10', result: '25', type: 'division' as const },
    { operation: '3400 ÷ 100', result: '34', type: 'division' as const },
    { operation: '15000 ÷ 1000', result: '15', type: 'division' as const },
    
    // Niveau 3 : Multiplications avec décimaux
    { operation: '2,5 × 10', result: '25', type: 'multiplication' as const },
    { operation: '3,4 × 100', result: '340', type: 'multiplication' as const },
    { operation: '0,8 × 1000', result: '800', type: 'multiplication' as const },
    { operation: '12,6 × 10', result: '126', type: 'multiplication' as const },
    
    // Niveau 4 : Divisions avec décimaux (zéros à gauche)
    { operation: '56 ÷ 10', result: '5,6', type: 'division' as const },
    { operation: '5,6 ÷ 100', result: '0,056', type: 'division' as const },
    { operation: '8,3 ÷ 1000', result: '0,0083', type: 'division' as const },
    { operation: '78 ÷ 100', result: '0,78', type: 'division' as const },
    
    // Niveau 5 : Multiplications avec nombres relatifs (négatifs)
    { operation: '(-15) × 10', result: '-150', type: 'multiplication' as const },
    { operation: '(-3,2) × 100', result: '-320', type: 'multiplication' as const },
    { operation: '(-0,5) × 1000', result: '-500', type: 'multiplication' as const },
    
    // Niveau 6 : Divisions avec nombres relatifs (négatifs)
    { operation: '(-240) ÷ 10', result: '-24', type: 'division' as const },
    { operation: '(-560) ÷ 100', result: '-5,6', type: 'division' as const },
    { operation: '(-1800) ÷ 1000', result: '-1,8', type: 'division' as const }
  ];

  // Exercices générés dynamiquement
  const generateExercises = (): Exercise[] => {
    const exercises: Exercise[] = [];
    const multipliers = [10, 100, 1000];
    
    // SÉRIE 1: Calculs classiques avec entiers et relatifs (20 exercices)
    
    // Nombres entiers positifs
    const positiveNumbers = [7, 15, 23, 45, 67, 89, 156, 234];
    // Nombres relatifs (négatifs)
    const negativeNumbers = [-12, -25, -34, -56, -78, -123];
    
    // Multiplications entiers positifs
    multipliers.forEach(mult => {
      positiveNumbers.slice(0, 2).forEach(num => {
        const result = num * mult;
        exercises.push({
          operation: `${num} × ${mult}`,
          answer: result,
          type: 'multiplication',
          exerciseType: 'calculate',
          number: num,
          multiplier: mult,
          result: result,
          isDecimal: false,
          visualSteps: [`${num}`, `${result}`]
        });
      });
    });
    
    // Divisions entiers positifs
    multipliers.forEach(mult => {
      positiveNumbers.slice(0, 2).forEach(num => {
        const dividend = num * mult;
        exercises.push({
          operation: `${dividend} ÷ ${mult}`,
          answer: num,
          type: 'division',
          exerciseType: 'calculate',
          number: dividend,
          multiplier: mult,
          result: num,
          isDecimal: false,
          visualSteps: [`${dividend}`, `${num}`]
        });
      });
    });
    
    // Multiplications avec nombres relatifs (négatifs)
    [10, 100].forEach(mult => {
      negativeNumbers.slice(0, 1).forEach(num => {
        const result = num * mult;
        exercises.push({
          operation: `(${num}) × ${mult}`,
          answer: result,
          type: 'multiplication',
          exerciseType: 'calculate',
          number: num,
          multiplier: mult,
          result: result,
          isDecimal: false,
          visualSteps: [`(${num})`, `${result}`]
        });
      });
    });
    
    // Divisions avec nombres relatifs (négatifs)
    [10, 100].forEach(mult => {
      negativeNumbers.slice(0, 1).forEach(num => {
        const dividend = num * mult;
        exercises.push({
          operation: `(${dividend}) ÷ ${mult}`,
          answer: num,
          type: 'division',
          exerciseType: 'calculate',
          number: dividend,
          multiplier: mult,
          result: num,
          isDecimal: false,
          visualSteps: [`(${dividend})`, `(${num})`]
        });
      });
    });

    // SÉRIE 2: Exercices à trous (trouver le nombre manquant)
    
    // Multiplications à trous
    const holeMultiplications = [
      { missing: 8, mult: 10, result: 80 },
      { missing: 12, mult: 100, result: 1200 },
      { missing: 7, mult: 1000, result: 7000 },
      { missing: 25, mult: 10, result: 250 },
      { missing: 15, mult: 100, result: 1500 },
      { missing: 9, mult: 1000, result: 9000 },
      { missing: 34, mult: 10, result: 340 },
      { missing: 6, mult: 100, result: 600 }
    ];
    
    holeMultiplications.forEach(ex => {
      exercises.push({
        operation: `? × ${ex.mult} = ${ex.result}`,
        answer: ex.missing,
        type: 'multiplication',
        exerciseType: 'find-missing',
        number: ex.missing,
        multiplier: ex.mult,
        result: ex.result,
        isDecimal: false,
        visualSteps: [`?`, `${ex.missing}`]
      });
    });
    
    // Divisions à trous
    const holeDivisions = [
      { missing: 120, mult: 10, result: 12 },
      { missing: 1500, mult: 100, result: 15 },
      { missing: 8000, mult: 1000, result: 8 },
      { missing: 450, mult: 10, result: 45 },
      { missing: 2300, mult: 100, result: 23 },
      { missing: 6000, mult: 1000, result: 6 },
      { missing: 780, mult: 10, result: 78 },
      { missing: 4900, mult: 100, result: 49 }
    ];
    
    holeDivisions.forEach(ex => {
      exercises.push({
        operation: `? ÷ ${ex.mult} = ${ex.result}`,
        answer: ex.missing,
        type: 'division',
        exerciseType: 'find-missing',
        number: ex.missing,
        multiplier: ex.mult,
        result: ex.result,
        isDecimal: false,
        visualSteps: [`?`, `${ex.missing}`]
      });
    });
    
    return exercises.sort(() => Math.random() - 0.5);
  };

  const [exercises, setExercises] = useState(generateExercises());

  // Animation pour transformation des nombres
  useEffect(() => {
    if (currentSection === 'cours') {
      const examples = [
        '25 × 10 = 250',
        '2.5 × 100 = 250',
        '3.4 × 1000 = 3400',
        '2300 ÷ 100 = 23',
        '56.0 ÷ 10 = 5.6'
      ];
      
      let index = 0;
      const interval = setInterval(() => {
        setAnimatedTransformation(examples[index]);
        index = (index + 1) % examples.length;
      }, 2000);
      
      return () => clearInterval(interval);
    }
  }, [currentSection]);

  // Fonction pour créer l'animation de la virgule
  const createVirguleAnimation = (number: number, multiplier: number, operation: 'multiplication' | 'division') => {
    const numberStr = number.toString();
    const positions = Math.log10(multiplier); // 1 pour 10, 2 pour 100, 3 pour 1000
    
    if (operation === 'multiplication') {
      // Déplacer la virgule vers la droite
      if (numberStr.includes('.')) {
        const parts = numberStr.split('.');
        const integerPart = parts[0];
        const decimalPart = parts[1];
        const newDecimalPart = decimalPart.substring(positions);
        const movedDigits = decimalPart.substring(0, positions);
        
        if (newDecimalPart.length > 0) {
          return `${integerPart}${movedDigits}.${newDecimalPart}`;
        } else {
          return `${integerPart}${movedDigits}${'0'.repeat(positions - decimalPart.length)}`;
        }
      } else {
        // Pas de virgule, ajouter des zéros
        return `${numberStr}${'0'.repeat(positions)}`;
      }
    } else {
      // Division - déplacer la virgule vers la gauche
      if (numberStr.includes('.')) {
        const parts = numberStr.split('.');
        const integerPart = parts[0];
        const decimalPart = parts[1];
        
        if (integerPart.length > positions) {
          const newIntegerPart = integerPart.substring(0, integerPart.length - positions);
          const movedDigits = integerPart.substring(integerPart.length - positions);
          return `${newIntegerPart}.${movedDigits}${decimalPart}`;
        } else {
          const zerosToAdd = positions - integerPart.length;
          return `0.${'0'.repeat(zerosToAdd)}${integerPart}${decimalPart}`;
        }
      } else {
        // Pas de virgule, ajouter une virgule et déplacer
        if (numberStr.length > positions) {
          const newIntegerPart = numberStr.substring(0, numberStr.length - positions);
          const movedDigits = numberStr.substring(numberStr.length - positions);
          return `${newIntegerPart}.${movedDigits}`;
        } else {
          const zerosToAdd = positions - numberStr.length;
          return `0.${'0'.repeat(zerosToAdd)}${numberStr}`;
        }
      }
    }
  };

  const checkAnswer = () => {
    const isCorrect = parseFloat(userAnswer) === exercises[currentExercise].answer;
    setShowAnswer(true);
    setAttempts(attempts + 1);
    
    if (isCorrect) {
      setScore(score + 1);
    }
  };

  const nextExercise = () => {
    if (currentExercise < exercises.length - 1) {
      setCurrentExercise(currentExercise + 1);
      setUserAnswer('');
      setShowAnswer(false);
    }
  };

  const previousExercise = () => {
    if (currentExercise > 0) {
      setCurrentExercise(currentExercise - 1);
      setUserAnswer('');
      setShowAnswer(false);
    }
  };

  const resetGame = () => {
    setCurrentExercise(0);
    setScore(0);
    setAttempts(0);
    setShowAnswer(false);
    setUserAnswer('');
    setExercises(generateExercises());
  };

  const filterExercises = (type: 'multiplication' | 'division', mult: number) => {
    return exercises.filter(ex => ex.type === type && ex.multiplier === mult);
  };

  const nextTransformationExample = () => {
    setCurrentTransformationExample((prev) => (prev + 1) % transformationExamples.length);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/chapitre/cm1-calcul-mental" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-4">
            <ArrowLeft className="w-4 h-4" />
            <span>Retour au chapitre</span>
          </Link>
          
          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              🔢 Multiplier et diviser par 10, 100, 1000
            </h1>
            <p className="text-lg text-gray-600">
              Maîtriser les règles avec les nombres entiers
            </p>
          </div>
        </div>

        {/* Navigation entre cours et exercices */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-xl p-2 shadow-lg border-2 border-gray-200">
            <button
              onClick={() => setCurrentSection('cours')}
              className={`px-8 py-4 rounded-xl font-bold transition-all transform hover:scale-105 shadow-md ${
                currentSection === 'cours' 
                  ? 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow-lg' 
                  : 'text-gray-700 hover:bg-gradient-to-r hover:from-blue-100 hover:to-cyan-100 hover:text-blue-800'
              }`}
            >
              📖 Cours
            </button>
            <button
              onClick={() => setCurrentSection('exercices')}
              className={`px-8 py-4 rounded-xl font-bold transition-all transform hover:scale-105 shadow-md ml-2 ${
                currentSection === 'exercices' 
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg' 
                  : 'text-gray-700 hover:bg-gradient-to-r hover:from-cyan-100 hover:to-blue-100 hover:text-cyan-800'
              }`}
            >
              ✏️ Exercices ({score}/{attempts})
            </button>
          </div>
        </div>

        {currentSection === 'cours' ? (
          /* COURS */
          <div className="space-y-8">
            {/* Exemples concrets */}
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">
                📚 Comment ça marche ? Voyons avec des exemples !
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Exemple avec nombre entier */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6">
                  <h3 className="text-2xl font-bold text-green-800 mb-6 text-center">
                    🔢 Avec un nombre entier : 23
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="bg-white rounded-lg p-4 shadow-md">
                      <h4 className="font-bold text-green-700 mb-3 text-center">✖️ Multiplications</h4>
                      <div className="text-lg font-bold text-center space-y-2 text-gray-800">
                        <div>23 × 10 = 230</div>
                        <div>23 × 100 = 2300</div>
                        <div>23 × 1000 = 23000</div>
                      </div>
                      <p className="text-green-600 text-sm mt-3 text-center">
                        💡 On ajoute des zéros à la fin !
                      </p>
                    </div>
                    
                    <div className="bg-white rounded-lg p-4 shadow-md">
                      <h4 className="font-bold text-green-700 mb-3 text-center">➗ Divisions</h4>
                      <div className="text-lg font-bold text-center space-y-2 text-gray-800">
                        <div>23 ÷ 10 = 2,3</div>
                        <div>23 ÷ 100 = 0,23</div>
                        <div>23 ÷ 1000 = 0,023</div>
                      </div>
                      <p className="text-green-600 text-sm mt-3 text-center">
                        💡 On place une virgule et on décale vers la gauche !
                      </p>
                    </div>
                  </div>
                </div>

                {/* Exemple avec nombre décimal */}
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-6">
                  <h3 className="text-2xl font-bold text-blue-800 mb-6 text-center">
                    🔢 Avec un nombre décimal : 24,56
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="bg-white rounded-lg p-4 shadow-md">
                      <h4 className="font-bold text-blue-700 mb-3 text-center">✖️ Multiplications</h4>
                      <div className="text-lg font-bold text-center space-y-2 text-gray-800">
                        <div>24,56 × 10 = 245,6</div>
                        <div>24,56 × 100 = 2456</div>
                        <div>24,56 × 1000 = 24560</div>
                      </div>
                      <p className="text-blue-600 text-sm mt-3 text-center">
                        💡 La virgule se déplace à droite et si besoin on ajoute des zéros !
                      </p>
                    </div>
                    
                    <div className="bg-white rounded-lg p-4 shadow-md">
                      <h4 className="font-bold text-blue-700 mb-3 text-center">➗ Divisions</h4>
                      <div className="text-lg font-bold text-center space-y-2 text-gray-800">
                        <div>24,56 ÷ 10 = 2,456</div>
                        <div>24,56 ÷ 100 = 0,2456</div>
                        <div>24,56 ÷ 1000 = 0,02456</div>
                      </div>
                      <p className="text-blue-600 text-sm mt-3 text-center">
                        💡 La virgule se déplace à gauche et si besoin on ajoute des zéros !
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Transformation magique */}
            <div className="bg-gradient-to-r from-orange-400 to-red-400 rounded-xl p-6 text-white">
              <h3 className="text-xl font-bold mb-4 text-center">🎨 Transformation magique</h3>
              <div className="text-center">
                <div className="text-3xl font-bold mb-4">
                  {transformationExamples[currentTransformationExample].operation} = {transformationExamples[currentTransformationExample].result}
                </div>
                <p className="text-lg mb-4">
                  {currentTransformationExample < 4 ? "Niveau 1 : Multiplications simples" :
                   currentTransformationExample < 8 ? "Niveau 2 : Divisions simples" :
                   currentTransformationExample < 12 ? "Niveau 3 : Multiplications décimales" :
                   currentTransformationExample < 16 ? "Niveau 4 : Divisions décimales" :
                   currentTransformationExample < 19 ? "Niveau 5 : Multiplications négatives" :
                   "Niveau 6 : Divisions négatives"}
                </p>
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={nextTransformationExample}
                    className="bg-white text-orange-600 px-6 py-2 rounded-lg font-bold hover:bg-orange-50 transition-all transform hover:scale-105"
                  >
                    Suivant ({currentTransformationExample + 1}/{transformationExamples.length})
                  </button>
                </div>
              </div>
            </div>

            {/* Règle générale */}
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">
                📖 Règle générale
              </h2>
              
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Multiplication */}
                  <div className="bg-white rounded-lg p-6 shadow-md">
                    <h3 className="text-xl font-bold text-green-800 mb-4 text-center">
                      ✖️ Pour multiplier
                    </h3>
                    <div className="space-y-3">
                      <div className="bg-green-50 p-3 rounded-lg">
                        <p className="font-semibold text-green-800">× 10 :</p>
                        <p className="text-green-700">Déplacer la virgule de 1 rang vers la droite</p>
                      </div>
                      <div className="bg-green-50 p-3 rounded-lg">
                        <p className="font-semibold text-green-800">× 100 :</p>
                        <p className="text-green-700">Déplacer la virgule de 2 rangs vers la droite</p>
                      </div>
                      <div className="bg-green-50 p-3 rounded-lg">
                        <p className="font-semibold text-green-800">× 1000 :</p>
                        <p className="text-green-700">Déplacer la virgule de 3 rangs vers la droite</p>
                      </div>
                    </div>
                    <div className="mt-4 p-3 bg-green-100 rounded-lg">
                      <p className="text-sm text-green-800">
                        💡 <strong>Astuce :</strong> S'il n'y a pas de virgule, on ajoute des zéros à la fin !
                      </p>
                    </div>
                  </div>

                  {/* Division */}
                  <div className="bg-white rounded-lg p-6 shadow-md">
                    <h3 className="text-xl font-bold text-blue-800 mb-4 text-center">
                      ➗ Pour diviser
                    </h3>
                    <div className="space-y-3">
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <p className="font-semibold text-blue-800">÷ 10 :</p>
                        <p className="text-blue-700">Déplacer la virgule de 1 rang vers la gauche</p>
                      </div>
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <p className="font-semibold text-blue-800">÷ 100 :</p>
                        <p className="text-blue-700">Déplacer la virgule de 2 rangs vers la gauche</p>
                      </div>
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <p className="font-semibold text-blue-800">÷ 1000 :</p>
                        <p className="text-blue-700">Déplacer la virgule de 3 rangs vers la gauche</p>
                      </div>
                    </div>
                    <div className="mt-4 p-3 bg-blue-100 rounded-lg">
                      <p className="text-sm text-blue-800">
                        💡 <strong>Astuce :</strong> S'il n'y a pas de virgule, on l'imagine à la fin et on ajoute des zéros si nécessaire !
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Mémo visuel */}
                <div className="mt-6 bg-white rounded-lg p-6 shadow-md">
                  <h4 className="text-lg font-bold text-purple-800 mb-4 text-center">
                    🎯 Mémo visuel
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600 mb-2">MULTIPLICATION</div>
                      <div className="text-lg font-bold text-green-700">Virgule → DROITE</div>
                      <div className="text-sm text-green-600">Plus grand nombre</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600 mb-2">DIVISION</div>
                      <div className="text-lg font-bold text-blue-700">Virgule ← GAUCHE</div>
                      <div className="text-sm text-blue-600">Plus petit nombre</div>
                    </div>
                  </div>
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
                <div className="flex items-center space-x-4">
                  <div className="text-lg font-bold text-blue-600">
                    Score : {score}/{attempts}
                  </div>
                  <button
                    onClick={resetGame}
                    className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white px-4 py-2 rounded-xl font-bold transition-all transform hover:scale-105 shadow-lg"
                  >
                    <RotateCcw className="inline w-4 h-4 mr-2" />
                    Recommencer
                  </button>
                </div>
              </div>
              
              {/* Barre de progression */}
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${((currentExercise + 1) / exercises.length) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Question */}
            <div className="bg-white rounded-xl p-8 shadow-lg text-center">
              <div className="mb-4">
                <span className={`inline-block px-4 py-2 rounded-full text-sm font-bold ${
                  exercises[currentExercise].exerciseType === 'calculate' 
                    ? 'bg-blue-100 text-blue-800' 
                    : 'bg-purple-100 text-purple-800'
                }`}>
                  {exercises[currentExercise].exerciseType === 'calculate' 
                    ? 'Type 1 : Calcul' 
                    : 'Type 2 : Nombre manquant'}
                </span>
              </div>
              <h3 className="text-3xl font-bold mb-8 text-gray-900">
                {exercises[currentExercise].exerciseType === 'calculate' 
                  ? 'Combien font :' 
                  : 'Quel est le nombre manquant ?'}
              </h3>
              
              <div className="text-6xl font-bold text-blue-600 mb-8">
                {exercises[currentExercise].exerciseType === 'calculate' 
                  ? `${exercises[currentExercise].operation} = ?`
                  : exercises[currentExercise].operation}
                {showAnswer && (
                  <span className="text-green-600 ml-4">
                    {exercises[currentExercise].answer}
                  </span>
                )}
              </div>
              
              <div className="max-w-md mx-auto mb-8">
                <input
                  type="number"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="Tape ta réponse"
                  className="w-full text-4xl font-bold text-center p-4 border-4 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && userAnswer && !showAnswer) {
                      checkAnswer();
                    }
                  }}
                />
              </div>
              
              <div className="flex justify-center space-x-4 mb-8">
                <button
                  onClick={previousExercise}
                  disabled={currentExercise === 0}
                  className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white px-6 py-4 rounded-xl font-bold transition-all transform hover:scale-105 shadow-lg disabled:opacity-50"
                >
                  ← Précédent
                </button>
                
                <button
                  onClick={checkAnswer}
                  disabled={!userAnswer || showAnswer}
                  className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white px-8 py-4 rounded-xl font-bold transition-all transform hover:scale-105 shadow-lg disabled:opacity-50"
                >
                  ✨ Vérifier ✨
                </button>
                
                <button
                  onClick={nextExercise}
                  disabled={currentExercise === exercises.length - 1}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 py-4 rounded-xl font-bold transition-all transform hover:scale-105 shadow-lg disabled:opacity-50"
                >
                  Suivant →
                </button>
              </div>
              
              {/* Résultat */}
              {showAnswer && (
                <div className={`p-6 rounded-xl shadow-lg ${
                  parseFloat(userAnswer) === exercises[currentExercise].answer 
                    ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-2 border-green-300' 
                    : 'bg-gradient-to-r from-red-100 to-rose-100 text-red-800 border-2 border-red-300'
                }`}>
                  <div className="text-center">
                    {parseFloat(userAnswer) === exercises[currentExercise].answer ? (
                      <>
                        <div className="flex items-center justify-center space-x-2 mb-4">
                          <CheckCircle className="w-8 h-8" />
                          <span className="font-bold text-xl">🎉 Excellent ! C'est correct ! 🎉</span>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                          <p className="text-green-700 font-semibold">
                            ✅ Réponse : {exercises[currentExercise].answer}
                          </p>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex items-center justify-center space-x-2 mb-4">
                          <XCircle className="w-8 h-8" />
                          <span className="font-bold text-xl">Pas tout à fait...</span>
                        </div>
                        <div className="bg-red-50 p-4 rounded-lg border border-red-200 mb-4">
                          <p className="text-red-700 font-semibold">
                            ❌ Ta réponse : {userAnswer}
                          </p>
                          <p className="text-red-700 font-semibold">
                            ✅ Bonne réponse : {exercises[currentExercise].answer}
                          </p>
                        </div>
                      </>
                    )}
                    
                    {/* Explication avec déplacement de virgule */}
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mt-4">
                      <h4 className="font-bold text-blue-800 mb-2">💡 Explication :</h4>
                      <div className="text-blue-700 font-medium">
                        {exercises[currentExercise].exerciseType === 'calculate' ? (
                          /* Explication pour exercices de calcul */
                          exercises[currentExercise].type === 'multiplication' ? (
                            <div className="space-y-2">
                              <p>Pour multiplier par {exercises[currentExercise].multiplier} :</p>
                              {exercises[currentExercise].number.toString().includes('.') || exercises[currentExercise].number.toString().includes(',') ? (
                                <p>• Déplace la virgule de {exercises[currentExercise].multiplier === 10 ? '1 rang' : exercises[currentExercise].multiplier === 100 ? '2 rangs' : '3 rangs'} vers la DROITE</p>
                              ) : (
                                <p>• Ajoute {exercises[currentExercise].multiplier === 10 ? '1 zéro' : exercises[currentExercise].multiplier === 100 ? '2 zéros' : '3 zéros'} à la fin</p>
                              )}
                              <p>• Résultat : {exercises[currentExercise].answer}</p>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              <p>Pour diviser par {exercises[currentExercise].multiplier} :</p>
                              <p>• Déplace la virgule de {exercises[currentExercise].multiplier === 10 ? '1 rang' : exercises[currentExercise].multiplier === 100 ? '2 rangs' : '3 rangs'} vers la GAUCHE</p>
                              <p>• (Si pas de virgule, l'imaginer à la fin du nombre)</p>
                              <p>• Résultat : {exercises[currentExercise].answer}</p>
                            </div>
                          )
                        ) : (
                          /* Explication pour exercices à trous */
                          exercises[currentExercise].type === 'multiplication' ? (
                            <div className="space-y-2">
                              <p>Pour trouver le nombre manquant :</p>
                              <p>• On cherche : ? × {exercises[currentExercise].multiplier} = {exercises[currentExercise].result}</p>
                              <p>• On fait l'opération inverse : {exercises[currentExercise].result} ÷ {exercises[currentExercise].multiplier} = {exercises[currentExercise].answer}</p>
                              <p>• Vérification : {exercises[currentExercise].answer} × {exercises[currentExercise].multiplier} = {exercises[currentExercise].result}</p>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              <p>Pour trouver le nombre manquant :</p>
                              <p>• On cherche : ? ÷ {exercises[currentExercise].multiplier} = {exercises[currentExercise].result}</p>
                              <p>• On fait l'opération inverse : {exercises[currentExercise].result} × {exercises[currentExercise].multiplier} = {exercises[currentExercise].answer}</p>
                              <p>• Vérification : {exercises[currentExercise].answer} ÷ {exercises[currentExercise].multiplier} = {exercises[currentExercise].result}</p>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Résultats finaux */}
            {currentExercise === exercises.length - 1 && showAnswer && (
              <div className="bg-gradient-to-r from-blue-400 to-cyan-400 rounded-xl p-6 text-white text-center">
                <div className="text-4xl mb-3">🎉</div>
                <h3 className="text-2xl font-bold mb-2">Bravo !</h3>
                <p className="text-lg mb-4">
                  Tu maîtrises maintenant les multiplications et divisions par 10, 100 et 1000 !
                </p>
                <p className="text-xl font-bold">
                  Score final : {score}/{attempts}
                </p>
                <p className="text-lg mt-2">
                  Taux de réussite : {attempts > 0 ? Math.round((score / attempts) * 100) : 0}%
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 