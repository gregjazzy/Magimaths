'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, XCircle, RefreshCw, Trophy, Target, Eye, Zap, Calculator, Clock, Play, Pause, RotateCcw, ArrowRight, TrendingUp } from 'lucide-react';
import { VoiceInput } from '@/components/VoiceInput';

interface Exercise {
  type: 'addition' | 'soustraction' | 'multiplication' | 'division';
  operation: string;
  question: string;
  exactAnswer: number;
  approxAnswer: number;
  range: number[];
  explanation: string;
}

export default function CalculsApprochesPage() {
  const [currentSection, setCurrentSection] = useState<'cours' | 'exercices'>('cours');
  const [currentExercise, setCurrentExercise] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [selectedType, setSelectedType] = useState<'addition' | 'soustraction' | 'multiplication' | 'division'>('addition');
  const [animatedExample, setAnimatedExample] = useState('');
  const [estimationRange, setEstimationRange] = useState({ min: 0, max: 100 });

  // Générer les exercices
  const generateExercises = (): Exercise[] => {
    const exercises: Exercise[] = [];
    
    // Additions
    const additionPairs = [
      { a: 23, b: 47, approx: 70, range: [60, 80] },
      { a: 89, b: 156, approx: 250, range: [200, 300] },
      { a: 234, b: 378, approx: 600, range: [500, 700] },
      { a: 567, b: 234, approx: 800, range: [700, 900] },
      { a: 123, b: 456, approx: 600, range: [500, 700] },
      { a: 789, b: 123, approx: 900, range: [800, 1000] },
      { a: 345, b: 567, approx: 900, range: [800, 1000] },
      { a: 456, b: 234, approx: 700, range: [600, 800] },
      { a: 678, b: 345, approx: 1000, range: [900, 1100] },
      { a: 234, b: 567, approx: 800, range: [700, 900] }
    ];

    additionPairs.forEach(pair => {
      exercises.push({
        type: 'addition',
        operation: `${pair.a} + ${pair.b}`,
        question: `Estime le résultat de ${pair.a} + ${pair.b}`,
        exactAnswer: pair.a + pair.b,
        approxAnswer: pair.approx,
        range: pair.range,
        explanation: `${pair.a} ≈ ${Math.round(pair.a / 10) * 10}, ${pair.b} ≈ ${Math.round(pair.b / 10) * 10}, donc environ ${pair.approx}`
      });
    });

    // Soustractions
    const subtractionPairs = [
      { a: 89, b: 34, approx: 50, range: [40, 60] },
      { a: 156, b: 67, approx: 90, range: [80, 100] },
      { a: 234, b: 89, approx: 150, range: [130, 170] },
      { a: 567, b: 234, approx: 330, range: [300, 360] },
      { a: 456, b: 123, approx: 330, range: [300, 360] },
      { a: 789, b: 345, approx: 440, range: [400, 480] },
      { a: 345, b: 167, approx: 180, range: [160, 200] },
      { a: 678, b: 234, approx: 440, range: [400, 480] },
      { a: 567, b: 123, approx: 440, range: [400, 480] },
      { a: 789, b: 234, approx: 550, range: [500, 600] }
    ];

    subtractionPairs.forEach(pair => {
      exercises.push({
        type: 'soustraction',
        operation: `${pair.a} - ${pair.b}`,
        question: `Estime le résultat de ${pair.a} - ${pair.b}`,
        exactAnswer: pair.a - pair.b,
        approxAnswer: pair.approx,
        range: pair.range,
        explanation: `${pair.a} ≈ ${Math.round(pair.a / 10) * 10}, ${pair.b} ≈ ${Math.round(pair.b / 10) * 10}, donc environ ${pair.approx}`
      });
    });

    // Multiplications
    const multiplicationPairs = [
      { a: 23, b: 4, approx: 100, range: [80, 120] },
      { a: 47, b: 3, approx: 150, range: [120, 180] },
      { a: 89, b: 2, approx: 180, range: [160, 200] },
      { a: 156, b: 3, approx: 450, range: [400, 500] },
      { a: 234, b: 2, approx: 500, range: [450, 550] },
      { a: 67, b: 5, approx: 350, range: [300, 400] },
      { a: 89, b: 4, approx: 360, range: [320, 400] },
      { a: 123, b: 3, approx: 360, range: [320, 400] },
      { a: 167, b: 2, approx: 300, range: [280, 340] },
      { a: 234, b: 4, approx: 1000, range: [900, 1100] }
    ];

    multiplicationPairs.forEach(pair => {
      exercises.push({
        type: 'multiplication',
        operation: `${pair.a} × ${pair.b}`,
        question: `Estime le résultat de ${pair.a} × ${pair.b}`,
        exactAnswer: pair.a * pair.b,
        approxAnswer: pair.approx,
        range: pair.range,
        explanation: `${pair.a} ≈ ${Math.round(pair.a / 10) * 10}, donc ${Math.round(pair.a / 10) * 10} × ${pair.b} ≈ ${pair.approx}`
      });
    });

    // Divisions
    const divisionPairs = [
      { a: 89, b: 3, approx: 30, range: [25, 35] },
      { a: 156, b: 4, approx: 40, range: [35, 45] },
      { a: 234, b: 5, approx: 50, range: [45, 55] },
      { a: 567, b: 7, approx: 80, range: [70, 90] },
      { a: 345, b: 4, approx: 90, range: [80, 100] },
      { a: 456, b: 6, approx: 80, range: [70, 90] },
      { a: 678, b: 8, approx: 85, range: [75, 95] },
      { a: 234, b: 3, approx: 80, range: [70, 90] },
      { a: 567, b: 6, approx: 95, range: [85, 105] },
      { a: 789, b: 9, approx: 90, range: [80, 100] }
    ];

    divisionPairs.forEach(pair => {
      exercises.push({
        type: 'division',
        operation: `${pair.a} ÷ ${pair.b}`,
        question: `Estime le résultat de ${pair.a} ÷ ${pair.b}`,
        exactAnswer: Math.round(pair.a / pair.b),
        approxAnswer: pair.approx,
        range: pair.range,
        explanation: `${pair.a} ≈ ${Math.round(pair.a / 10) * 10}, donc ${Math.round(pair.a / 10) * 10} ÷ ${pair.b} ≈ ${pair.approx}`
      });
    });
    
    return exercises.sort(() => Math.random() - 0.5);
  };

  const [exercises, setExercises] = useState(generateExercises());

  // Exemples prédéfinis pour l'estimation en action
  const estimationExamples = [
    '23 + 47 ≈ 70',
    '89 - 34 ≈ 50',
    '47 × 3 ≈ 150',
    '156 ÷ 4 ≈ 40',
    '234 + 378 ≈ 600',
    '567 - 123 ≈ 440'
  ];
  
  const [currentEstimationIndex, setCurrentEstimationIndex] = useState(0);
  
  // Fonction pour passer à l'exemple suivant
  const nextEstimationExample = () => {
    setCurrentEstimationIndex((prevIndex) => (prevIndex + 1) % estimationExamples.length);
  };
  
  // Initialiser avec le premier exemple
  useEffect(() => {
    setAnimatedExample(estimationExamples[currentEstimationIndex]);
  }, [currentEstimationIndex]);

  const filterExercises = () => {
    return exercises.filter(ex => ex.type === selectedType);
  };

  const getCurrentExercises = () => {
    return filterExercises();
  };

  const checkAnswer = () => {
    const currentExercises = getCurrentExercises();
    const userNum = parseInt(userAnswer);
    const exercise = currentExercises[currentExercise];
    
    // Vérifier si la réponse est dans la plage acceptable
    const isCorrect = userNum >= exercise.range[0] && userNum <= exercise.range[1];
    
    setShowAnswer(true);
    setAttempts(attempts + 1);
    
    if (isCorrect) {
      setScore(score + 1);
    }
  };

  const nextExercise = () => {
    const currentExercises = getCurrentExercises();
    if (currentExercise < currentExercises.length - 1) {
      setCurrentExercise(currentExercise + 1);
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

  const changeType = (type: 'addition' | 'soustraction' | 'multiplication' | 'division') => {
    setSelectedType(type);
    setCurrentExercise(0);
    setUserAnswer('');
    setShowAnswer(false);
  };

  // Fonction pour arrondir un nombre
  const roundToNearestTen = (num: number) => {
    return Math.round(num / 10) * 10;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/chapitre/cm1-calcul-mental" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-4">
            <ArrowLeft className="w-4 h-4" />
            <span>Retour au chapitre</span>
          </Link>
          
          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              🧠 Calculs approchés
            </h1>
            <p className="text-lg text-gray-600">
              Estimation d'un ordre de grandeur
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
                  ? 'bg-gradient-to-r from-yellow-500 to-orange-600 text-white shadow-lg' 
                  : 'text-gray-700 hover:bg-gradient-to-r hover:from-yellow-100 hover:to-orange-100 hover:text-yellow-800'
              }`}
            >
              📖 Cours
            </button>
            <button
              onClick={() => setCurrentSection('exercices')}
              className={`px-8 py-4 rounded-xl font-bold transition-all transform hover:scale-105 shadow-md ml-2 ${
                currentSection === 'exercices' 
                  ? 'bg-gradient-to-r from-orange-500 to-yellow-600 text-white shadow-lg' 
                  : 'text-gray-700 hover:bg-gradient-to-r hover:from-orange-100 hover:to-yellow-100 hover:text-orange-800'
              }`}
            >
              ✏️ Exercices ({score}/{attempts})
            </button>
          </div>
        </div>

        {currentSection === 'cours' ? (
          /* COURS */
          <div className="space-y-8">
            {/* Définition */}
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">
                📚 Qu'est-ce qu'un calcul approché ?
              </h2>
              
              <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-xl p-6 mb-8">
                <p className="text-lg text-yellow-800 font-semibold mb-4">
                  Un calcul approché, c'est donner une estimation du résultat sans faire le calcul exact !
                </p>
                <p className="text-yellow-700 mb-4">
                  Par exemple : 23 + 47, je peux estimer que c'est environ 70 (sans calculer 70 exactement).
                </p>
                <p className="text-yellow-700">
                  C'est très utile pour vérifier si un résultat est plausible ou pour calculer rapidement !
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-blue-50 rounded-lg p-6">
                  <h3 className="text-xl font-bold text-blue-800 mb-4">💡 Pourquoi c'est utile ?</h3>
                  <ul className="space-y-2 text-blue-700">
                    <li>• Vérifier si un résultat est correct</li>
                    <li>• Calculer rapidement dans la vie quotidienne</li>
                    <li>• Estimer le prix d'achats</li>
                    <li>• Prévoir la durée d'un trajet</li>
                  </ul>
                </div>
                
                <div className="bg-green-50 rounded-lg p-6">
                  <h3 className="text-xl font-bold text-green-800 mb-4">🎯 Exemple concret</h3>
                  <p className="text-green-700 mb-2">
                    J'achète un livre à 23€ et un jeu à 47€. Combien vais-je payer environ ?
                  </p>
                  <p className="text-green-600 font-bold">
                    23 ≈ 20, 47 ≈ 50 → 20 + 50 = 70€ environ
                  </p>
                </div>
              </div>
            </div>

            {/* Techniques d'estimation */}
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-center mb-6 text-gray-900">
                🎨 Techniques d'estimation
              </h3>
              
              <div className="space-y-6">
                {/* Arrondir à la dizaine */}
                <div className="bg-gradient-to-r from-blue-100 to-cyan-100 rounded-lg p-6">
                  <h4 className="text-xl font-bold text-blue-800 mb-4">1️⃣ Arrondir à la dizaine</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white rounded-lg p-4">
                      <h5 className="font-bold text-blue-700 mb-2">Règle</h5>
                      <div className="space-y-1 text-blue-600">
                        <p>• Si le chiffre des unités est 0, 1, 2, 3, 4 : arrondir vers le bas</p>
                        <p>• Si le chiffre des unités est 5, 6, 7, 8, 9 : arrondir vers le haut</p>
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-lg p-4">
                      <h5 className="font-bold text-blue-700 mb-2">Exemples</h5>
                      <div className="space-y-1 text-blue-600">
                        <p>23 → 20 (le 3 nous fait arrondir vers le bas)</p>
                        <p>47 → 50 (le 7 nous fait arrondir vers le haut)</p>
                        <p>89 → 90 (le 9 nous fait arrondir vers le haut)</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Arrondir à la centaine */}
                <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg p-6">
                  <h4 className="text-xl font-bold text-green-800 mb-4">2️⃣ Arrondir à la centaine</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white rounded-lg p-4">
                      <h5 className="font-bold text-green-700 mb-2">Règle</h5>
                      <div className="space-y-1 text-green-600">
                        <p>• Si les dizaines sont 0, 1, 2, 3, 4 : arrondir vers le bas</p>
                        <p>• Si les dizaines sont 5, 6, 7, 8, 9 : arrondir vers le haut</p>
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-lg p-4">
                      <h5 className="font-bold text-green-700 mb-2">Exemples</h5>
                      <div className="space-y-1 text-green-600">
                        <p>234 → 200 (les 34 nous font arrondir vers le bas)</p>
                        <p>567 → 600 (les 67 nous font arrondir vers le haut)</p>
                        <p>789 → 800 (les 89 nous font arrondir vers le haut)</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Estimer le résultat */}
                <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-6">
                  <h4 className="text-xl font-bold text-purple-800 mb-4">3️⃣ Estimer le résultat</h4>
                  
                  <div className="space-y-4">
                    <div className="bg-white rounded-lg p-4">
                      <h5 className="font-bold text-purple-700 mb-2">Addition : 23 + 47</h5>
                      <div className="space-y-1 text-purple-600">
                        <p>1. J'arrondis : 23 ≈ 20, 47 ≈ 50</p>
                        <p>2. Je calcule : 20 + 50 = 70</p>
                        <p>3. J'estime : le résultat est environ 70</p>
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-lg p-4">
                      <h5 className="font-bold text-purple-700 mb-2">Multiplication : 47 × 3</h5>
                      <div className="space-y-1 text-purple-600">
                        <p>1. J'arrondis : 47 ≈ 50</p>
                        <p>2. Je calcule : 50 × 3 = 150</p>
                        <p>3. J'estime : le résultat est environ 150</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Estimation en action */}
            <div className="bg-gradient-to-r from-yellow-400 to-orange-400 rounded-xl p-6 text-white">
              <h3 className="text-xl font-bold mb-4 text-center">🎨 Estimation en action</h3>
              <div className="text-center">
                <div className="text-3xl font-bold mb-4">
                  {animatedExample}
                </div>
                <p className="text-lg mb-4">
                  Regarde comme il est facile d'estimer !
                </p>
                <button
                  onClick={nextEstimationExample}
                  className="bg-white text-yellow-600 px-6 py-3 rounded-xl font-bold transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  Suivant → (Exemple {currentEstimationIndex + 1}/{estimationExamples.length})
                </button>
              </div>
            </div>

            {/* Exemples pratiques */}
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-center mb-6 text-gray-900">
                🔍 Exemples pratiques
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Additions */}
                <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-xl p-6">
                  <h4 className="text-xl font-bold text-red-800 mb-4">➕ Additions</h4>
                  <div className="space-y-3">
                    <div className="bg-white rounded-lg p-3">
                      <div className="font-bold text-red-600">89 + 156</div>
                      <div className="text-red-500 text-sm">90 + 160 ≈ 250</div>
                    </div>
                    <div className="bg-white rounded-lg p-3">
                      <div className="font-bold text-red-600">234 + 378</div>
                      <div className="text-red-500 text-sm">200 + 400 ≈ 600</div>
                    </div>
                  </div>
                </div>

                {/* Multiplications */}
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-6">
                  <h4 className="text-xl font-bold text-blue-800 mb-4">✖️ Multiplications</h4>
                  <div className="space-y-3">
                    <div className="bg-white rounded-lg p-3">
                      <div className="font-bold text-blue-600">89 × 4</div>
                      <div className="text-blue-500 text-sm">90 × 4 ≈ 360</div>
                    </div>
                    <div className="bg-white rounded-lg p-3">
                      <div className="font-bold text-blue-600">234 × 3</div>
                      <div className="text-blue-500 text-sm">200 × 3 ≈ 600</div>
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
                  ✏️ Exercice {currentExercise + 1} sur {getCurrentExercises().length}
                </h2>
                <div className="flex items-center space-x-4">
                  <div className="text-lg font-bold text-yellow-600">
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
              
              {/* Sélecteur d'opération */}
              <div className="flex justify-center mb-4">
                <div className="bg-gray-50 rounded-xl p-3 shadow-lg border-2 border-gray-200">
                  <button
                    onClick={() => changeType('addition')}
                    className={`px-6 py-3 rounded-xl font-bold transition-all transform hover:scale-105 shadow-md ${
                      selectedType === 'addition' 
                        ? 'bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-xl border-2 border-red-400 scale-105' 
                        : 'bg-gradient-to-r from-red-200 to-pink-200 text-red-800 hover:from-red-300 hover:to-pink-300 hover:text-red-900 border-2 border-red-300'
                    }`}
                  >
                    ➕ Addition
                  </button>
                  <button
                    onClick={() => changeType('soustraction')}
                    className={`px-6 py-3 rounded-xl font-bold transition-all transform hover:scale-105 shadow-md ml-2 ${
                      selectedType === 'soustraction' 
                        ? 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow-xl border-2 border-blue-400 scale-105' 
                        : 'bg-gradient-to-r from-blue-200 to-cyan-200 text-blue-800 hover:from-blue-300 hover:to-cyan-300 hover:text-blue-900 border-2 border-blue-300'
                    }`}
                  >
                    ➖ Soustraction
                  </button>
                  <button
                    onClick={() => changeType('multiplication')}
                    className={`px-6 py-3 rounded-xl font-bold transition-all transform hover:scale-105 shadow-md ml-2 ${
                      selectedType === 'multiplication' 
                        ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-xl border-2 border-green-400 scale-105' 
                        : 'bg-gradient-to-r from-green-200 to-emerald-200 text-green-800 hover:from-green-300 hover:to-emerald-300 hover:text-green-900 border-2 border-green-300'
                    }`}
                  >
                    ✖️ Multiplication
                  </button>
                  <button
                    onClick={() => changeType('division')}
                    className={`px-6 py-3 rounded-xl font-bold transition-all transform hover:scale-105 shadow-md ml-2 ${
                      selectedType === 'division' 
                        ? 'bg-gradient-to-r from-purple-500 to-violet-600 text-white shadow-xl border-2 border-purple-400 scale-105' 
                        : 'bg-gradient-to-r from-purple-200 to-violet-200 text-purple-800 hover:from-purple-300 hover:to-violet-300 hover:text-purple-900 border-2 border-purple-300'
                    }`}
                  >
                    ➗ Division
                  </button>
                </div>
              </div>
              
              {/* Barre de progression */}
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-yellow-500 to-orange-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${((currentExercise + 1) / getCurrentExercises().length) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Question */}
            <div className="bg-white rounded-xl p-8 shadow-lg text-center">
              <h3 className="text-2xl font-bold mb-6 text-gray-900">
                {getCurrentExercises()[currentExercise]?.question}
              </h3>
              
              <div className="text-5xl font-bold text-yellow-600 mb-4">
                {getCurrentExercises()[currentExercise]?.operation}
              </div>
              
              <div className="text-lg text-gray-600 mb-8">
                Donne une estimation (pas le résultat exact !)
              </div>
              
              <div className="max-w-md mx-auto mb-8">
                <input
                  type="number"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="Ton estimation"
                  className="w-full text-4xl font-bold text-center p-4 border-4 border-gray-300 rounded-xl focus:border-yellow-500 focus:outline-none"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && userAnswer && !showAnswer) {
                      checkAnswer();
                    }
                  }}
                />
                
                {/* Reconnaissance vocale */}
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <VoiceInput
                    onTranscript={(transcript) => setUserAnswer(transcript)}
                    placeholder="Ou dites votre estimation à voix haute..."
                    className="justify-center"
                  />
                </div>
              </div>
              
              <div className="flex justify-center space-x-4 mb-8">
                <button
                  onClick={checkAnswer}
                  disabled={!userAnswer || showAnswer}
                  className="bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white px-8 py-4 rounded-xl font-bold transition-all transform hover:scale-105 shadow-lg disabled:opacity-50"
                >
                  ✨ Vérifier ✨
                </button>
                
                {showAnswer && (
                  <button
                    onClick={nextExercise}
                    disabled={currentExercise === getCurrentExercises().length - 1}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-4 rounded-xl font-bold transition-all transform hover:scale-105 shadow-lg disabled:opacity-50"
                  >
                    Suivant →
                  </button>
                )}
              </div>
              
              {/* Résultat */}
              {showAnswer && (
                <div className={`p-6 rounded-xl shadow-lg ${
                  parseInt(userAnswer) >= getCurrentExercises()[currentExercise]?.range[0] && 
                  parseInt(userAnswer) <= getCurrentExercises()[currentExercise]?.range[1]
                    ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-2 border-green-300' 
                    : 'bg-gradient-to-r from-red-100 to-rose-100 text-red-800 border-2 border-red-300'
                }`}>
                  <div className="flex items-center justify-center space-x-2">
                    {parseInt(userAnswer) >= getCurrentExercises()[currentExercise]?.range[0] && 
                     parseInt(userAnswer) <= getCurrentExercises()[currentExercise]?.range[1] ? (
                      <>
                        <CheckCircle className="w-8 h-8" />
                        <span className="font-bold text-xl">🎉 Bonne estimation ! 🎉</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-8 h-8" />
                        <span className="font-bold text-xl">
                          Pas tout à fait... {getCurrentExercises()[currentExercise]?.explanation}
                        </span>
                      </>
                    )}
                  </div>
                  
                  <div className="mt-4 text-center">
                    <p className="font-semibold">
                      Résultat exact : {getCurrentExercises()[currentExercise]?.exactAnswer}
                    </p>
                    <p className="text-sm">
                      Estimation acceptable : entre {getCurrentExercises()[currentExercise]?.range[0]} et {getCurrentExercises()[currentExercise]?.range[1]}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Résultats finaux */}
            {currentExercise === getCurrentExercises().length - 1 && showAnswer && (
              <div className="bg-gradient-to-r from-yellow-400 to-orange-400 rounded-xl p-6 text-white text-center">
                <div className="text-4xl mb-3">🎉</div>
                <h3 className="text-2xl font-bold mb-2">Formidable !</h3>
                <p className="text-lg mb-4">
                  Tu sais maintenant estimer le résultat des {selectedType}s !
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