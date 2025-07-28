'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, XCircle, RotateCcw, ArrowUp, ArrowDown } from 'lucide-react';

export default function OrdonnerNombresCE2Page() {
  const [currentExercise, setCurrentExercise] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showExercises, setShowExercises] = useState(false);
  const [score, setScore] = useState(0);
  const [exerciseType, setExerciseType] = useState<'ranger' | 'encadrer' | 'suites' | 'comparer' | 'encadrer-unites'>('ranger');

  // Exercices de rangement pour CE2 (nombres jusqu'à 10000) - nombres variés et réalistes
  const rangerExercises = [
    { numbers: [8743, 5087, 8519, 1863, 5814], answer: [1863, 5087, 5814, 8519, 8743], order: 'croissant' },
    { numbers: [7428, 3749, 4732, 7341, 4378], answer: [7428, 7341, 4732, 4378, 3749], order: 'décroissant' },
    { numbers: [9176, 1794, 7193, 1977, 7918], answer: [1794, 1977, 7193, 7918, 9176], order: 'croissant' },
    { numbers: [4806, 8405, 4083, 849, 8047], answer: [8405, 8047, 4806, 4083, 849], order: 'décroissant' },
    { numbers: [2347, 5673, 1239, 4567, 7896], answer: [1239, 2347, 4567, 5673, 7896], order: 'croissant' },
    { numbers: [6784, 3458, 7893, 2348, 5674], answer: [7893, 6784, 5674, 3458, 2348], order: 'décroissant' },
    { numbers: [1567, 3456, 2349, 1238, 4569], answer: [1238, 1567, 2349, 3456, 4569], order: 'croissant' },
    { numbers: [7897, 5678, 2347, 4568, 1239], answer: [7897, 5678, 4568, 2347, 1239], order: 'décroissant' },
    { numbers: [3256, 5327, 2539, 5238, 2357], answer: [2357, 2539, 3256, 5238, 5327], order: 'croissant' },
    { numbers: [4679, 7648, 6479, 4768, 7469], answer: [7648, 7469, 6479, 4768, 4679], order: 'décroissant' },
    { numbers: [1457, 5419, 1549, 4519, 5149], answer: [1457, 1549, 4519, 5149, 5419], order: 'croissant' },
    { numbers: [6827, 8269, 2689, 6289, 8627], answer: [8627, 8269, 6827, 6289, 2689], order: 'décroissant' },
    { numbers: [3978, 7398, 3798, 7938, 9378], answer: [3798, 3978, 7398, 7938, 9378], order: 'croissant' },
    { numbers: [1487, 8419, 4189, 1849, 8149], answer: [8419, 8149, 4189, 1849, 1487], order: 'décroissant' },
    { numbers: [2567, 6529, 5269, 2659, 6259], answer: [2567, 2659, 5269, 6259, 6529], order: 'croissant' },
    { numbers: [4127, 2149, 1249, 4219, 2419], answer: [1249, 2149, 2419, 4127, 4219], order: 'croissant' },
    { numbers: [9678, 7968, 6798, 6978, 9768], answer: [9768, 9678, 7968, 6978, 6798], order: 'décroissant' },
    { numbers: [5837, 3587, 8357, 3857, 8537], answer: [3587, 3857, 5837, 8357, 8537], order: 'croissant' },
    { numbers: [7298, 9278, 2798, 7928, 2978], answer: [9278, 7928, 7298, 2978, 2798], order: 'décroissant' },
    { numbers: [1647, 4619, 1469, 6149, 6419], answer: [1469, 1647, 4619, 6149, 6419], order: 'croissant' },
    { numbers: [8397, 3987, 8937, 3897, 9387], answer: [9387, 8937, 8397, 3987, 3897], order: 'décroissant' }
  ];

  // Exercices d'encadrement pour CE2 (nombres jusqu'à 10000) - nombres complexes
  const encadrerExercises = [
    { number: 5463, before: 5462, after: 5464 },
    { number: 7089, before: 7088, after: 7090 },
    { number: 8571, before: 8570, after: 8572 },
    { number: 9037, before: 9036, after: 9038 },
    { number: 6019, before: 6018, after: 6020 },
    { number: 7849, before: 7848, after: 7850 },
    { number: 3728, before: 3727, after: 3729 },
    { number: 3378, before: 3377, after: 3379 },
    { number: 3079, before: 3078, after: 3080 },
    { number: 7337, before: 7336, after: 7338 },
    { number: 4017, before: 4016, after: 4018 },
    { number: 2997, before: 2996, after: 2998 },
    { number: 5043, before: 5042, after: 5044 },
    { number: 6507, before: 6506, after: 6508 },
    { number: 1997, before: 1996, after: 1998 },
    { number: 4258, before: 4257, after: 4259 },
    { number: 6879, before: 6878, after: 6880 },
    { number: 1509, before: 1508, after: 1510 },
    { number: 7647, before: 7646, after: 7648 },
    { number: 8297, before: 8296, after: 8298 },
    { number: 4919, before: 4918, after: 4920 }
  ];

  // Exercices de suites pour CE2 (nombres jusqu'à 10000) - nombres complexes
  const suitesExercises = [
    { sequence: [927, 947, 967, '?', '?'], step: 20, answers: ['987', '1007'] },
    { sequence: [1753, 1803, 1853, '?', '?'], step: 50, answers: ['1903', '1953'] },
    { sequence: [1337, 1437, 1537, '?', '?'], step: 100, answers: ['1637', '1737'] },
    { sequence: [1579, 1559, 1539, '?', '?'], step: -20, answers: ['1519', '1499'] },
    { sequence: [857, 877, 897, '?', '?'], step: 20, answers: ['917', '937'] },
    { sequence: [1129, 1109, 1089, '?', '?'], step: -20, answers: ['1069', '1049'] },
    { sequence: [739, 789, 839, '?', '?'], step: 50, answers: ['889', '939'] },
    { sequence: [1607, 1507, 1407, '?', '?'], step: -100, answers: ['1307', '1207'] },
    { sequence: [2347, 2367, 2387, '?', '?'], step: 20, answers: ['2407', '2427'] },
    { sequence: [3509, 3459, 3409, '?', '?'], step: -50, answers: ['3359', '3309'] },
    { sequence: [1259, 1359, 1459, '?', '?'], step: 100, answers: ['1559', '1659'] },
    { sequence: [1989, 1969, 1949, '?', '?'], step: -20, answers: ['1929', '1909'] },
    { sequence: [4659, 4709, 4759, '?', '?'], step: 50, answers: ['4809', '4859'] },
    { sequence: [6709, 6609, 6509, '?', '?'], step: -100, answers: ['6409', '6309'] },
    { sequence: [1479, 1499, 1519, '?', '?'], step: 20, answers: ['1539', '1559'] },
    { sequence: [2679, 2699, 2719, '?', '?'], step: 20, answers: ['2739', '2759'] },
    { sequence: [3809, 3859, 3909, '?', '?'], step: 50, answers: ['3959', '4009'] },
    { sequence: [5409, 5309, 5209, '?', '?'], step: -100, answers: ['5109', '5009'] },
    { sequence: [4269, 4249, 4229, '?', '?'], step: -20, answers: ['4209', '4189'] },
    { sequence: [6159, 6209, 6259, '?', '?'], step: 50, answers: ['6309', '6359'] },
    { sequence: [7589, 7489, 7389, '?', '?'], step: -100, answers: ['7289', '7189'] }
  ];

  // Exercices de comparaison avec >, <, = (20 exercices) pour CE2 - nombres complexes
  const comparerExercises = [
    { number1: 4863, number2: 3792, answer: '>', explanation: '4863 > 3792' },
    { number1: 1247, number2: 2349, answer: '<', explanation: '1247 < 2349' },
    { number1: 7893, number2: 7893, answer: '=', explanation: '7893 = 7893' },
    { number1: 5679, number2: 4863, answer: '>', explanation: '5679 > 4863' },
    { number1: 2349, number2: 3456, answer: '<', explanation: '2349 < 3456' },
    { number1: 5034, number2: 5034, answer: '=', explanation: '5034 = 5034' },
    { number1: 6789, number2: 2467, answer: '>', explanation: '6789 > 2467' },
    { number1: 1456, number2: 4863, answer: '<', explanation: '1456 < 4863' },
    { number1: 3217, number2: 3217, answer: '=', explanation: '3217 = 3217' },
    { number1: 8901, number2: 2573, answer: '>', explanation: '8901 > 2573' },
    { number1: 2467, number2: 5679, answer: '<', explanation: '2467 < 5679' },
    { number1: 4863, number2: 4863, answer: '=', explanation: '4863 = 4863' },
    { number1: 7298, number2: 3486, answer: '>', explanation: '7298 > 3486' },
    { number1: 1567, number2: 2749, answer: '<', explanation: '1567 < 2749' },
    { number1: 6789, number2: 6789, answer: '=', explanation: '6789 = 6789' },
    { number1: 8456, number2: 2793, answer: '>', explanation: '8456 > 2793' },
    { number1: 2467, number2: 7893, answer: '<', explanation: '2467 < 7893' },
    { number1: 5679, number2: 5679, answer: '=', explanation: '5679 = 5679' },
    { number1: 9123, number2: 4863, answer: '>', explanation: '9123 > 4863' },
    { number1: 1274, number2: 4863, answer: '<', explanation: '1274 < 4863' }
  ];

  // Exercices d'encadrement par unités, dizaines, centaines, milliers (20 exercices) pour CE2 - nombres complexes
  const encadrerUnitesExercises = [
    { number: 4863, type: 'unité', before: 4862, after: 4864, explanation: '4862 < 4863 < 4864' },
    { number: 2349, type: 'unité', before: 2348, after: 2350, explanation: '2348 < 2349 < 2350' },
    { number: 5679, type: 'unité', before: 5678, after: 5680, explanation: '5678 < 5679 < 5680' },
    { number: 1237, type: 'unité', before: 1236, after: 1238, explanation: '1236 < 1237 < 1238' },
    { number: 7893, type: 'unité', before: 7892, after: 7894, explanation: '7892 < 7893 < 7894' },
    { number: 4863, type: 'dizaine', before: 4860, after: 4870, explanation: '4860 < 4863 < 4870' },
    { number: 2349, type: 'dizaine', before: 2340, after: 2350, explanation: '2340 < 2349 < 2350' },
    { number: 7896, type: 'dizaine', before: 7890, after: 7900, explanation: '7890 < 7896 < 7900' },
    { number: 5679, type: 'dizaine', before: 5670, after: 5680, explanation: '5670 < 5679 < 5680' },
    { number: 1237, type: 'dizaine', before: 1230, after: 1240, explanation: '1230 < 1237 < 1240' },
    { number: 8456, type: 'dizaine', before: 8450, after: 8460, explanation: '8450 < 8456 < 8460' },
    { number: 5679, type: 'centaine', before: 5600, after: 5700, explanation: '5600 < 5679 < 5700' },
    { number: 1237, type: 'centaine', before: 1200, after: 1300, explanation: '1200 < 1237 < 1300' },
    { number: 3456, type: 'centaine', before: 3400, after: 3500, explanation: '3400 < 3456 < 3500' },
    { number: 7893, type: 'centaine', before: 7800, after: 7900, explanation: '7800 < 7893 < 7900' },
    { number: 2349, type: 'centaine', before: 2300, after: 2400, explanation: '2300 < 2349 < 2400' },
    { number: 5679, type: 'millier', before: 5000, after: 6000, explanation: '5000 < 5679 < 6000' },
    { number: 1237, type: 'millier', before: 1000, after: 2000, explanation: '1000 < 1237 < 2000' },
    { number: 7893, type: 'millier', before: 7000, after: 8000, explanation: '7000 < 7893 < 8000' },
    { number: 4863, type: 'millier', before: 4000, after: 5000, explanation: '4000 < 4863 < 5000' }
  ];

  const getCurrentExercises = () => {
    switch (exerciseType) {
      case 'ranger': return rangerExercises;
      case 'encadrer': return encadrerExercises;
      case 'suites': return suitesExercises;
      case 'comparer': return comparerExercises;
      case 'encadrer-unites': return encadrerUnitesExercises;
      default: return rangerExercises;
    }
  };

  const checkAnswer = () => {
    const exercises = getCurrentExercises();
    let isCorrect = false;

    if (exerciseType === 'ranger') {
      const correctOrder = ((exercises[currentExercise] as any).answer as number[]).map((n: number) => n.toString());
      isCorrect = JSON.stringify(userAnswers) === JSON.stringify(correctOrder);
    } else if (exerciseType === 'encadrer') {
      const exercise = exercises[currentExercise] as any;
      isCorrect = userAnswers[0] === exercise.before.toString() && userAnswers[1] === exercise.after.toString();
    } else if (exerciseType === 'suites') {
      const exercise = exercises[currentExercise] as any;
      isCorrect = userAnswers[0] === exercise.answers[0] && userAnswers[1] === exercise.answers[1];
    } else if (exerciseType === 'comparer') {
      const exercise = exercises[currentExercise] as any;
      isCorrect = userAnswers[0] === exercise.answer;
    } else if (exerciseType === 'encadrer-unites') {
      const exercise = exercises[currentExercise] as any;
      isCorrect = userAnswers[0] === exercise.before.toString() && userAnswers[1] === exercise.after.toString();
    }

    setIsCorrect(isCorrect);
    
    if (isCorrect) {
      setScore(score + 1);
    }
  };

  const nextExercise = () => {
    const exercises = getCurrentExercises();
    if (currentExercise < exercises.length - 1) {
      setCurrentExercise(currentExercise + 1);
      setUserAnswer('');
      setUserAnswers([]);
      setIsCorrect(null);
    }
  };

  const resetExercise = () => {
    setUserAnswer('');
    setUserAnswers([]);
    setIsCorrect(null);
  };

  const resetAll = () => {
    setCurrentExercise(0);
    setUserAnswer('');
    setUserAnswers([]);
    setIsCorrect(null);
    setScore(0);
  };

  const switchExerciseType = (type: 'ranger' | 'encadrer' | 'suites' | 'comparer' | 'encadrer-unites') => {
    setExerciseType(type);
    setCurrentExercise(0);
    setUserAnswer('');
    setUserAnswers([]);
    setIsCorrect(null);
  };

  const updateOrderAnswer = (index: number, value: string) => {
    const newAnswers = [...userAnswers];
    newAnswers[index] = value;
    setUserAnswers(newAnswers);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/chapitre/ce2-nombres-jusqu-10000" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-4">
            <ArrowLeft className="w-4 h-4" />
            <span>Retour au chapitre</span>
          </Link>
          
          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              🔢 Ordonner les nombres jusqu'à 10 000
            </h1>
            <p className="text-lg text-gray-600">
              Apprends à comparer et ranger les nombres jusqu'à 10 000 !
            </p>
          </div>
        </div>

        {/* Navigation entre cours et exercices */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-xl p-2 shadow-lg border-2 border-gray-200">
            <button
              onClick={() => setShowExercises(false)}
              className={`px-8 py-4 rounded-xl font-bold transition-all transform hover:scale-105 shadow-md ${
                !showExercises 
                  ? 'bg-gradient-to-r from-teal-500 to-cyan-600 text-white shadow-lg' 
                  : 'text-gray-700 hover:bg-gradient-to-r hover:from-teal-100 hover:to-cyan-100 hover:text-teal-800'
              }`}
            >
              📖 Cours
            </button>
            <button
              onClick={() => setShowExercises(true)}
              className={`px-8 py-4 rounded-xl font-bold transition-all transform hover:scale-105 shadow-md ml-2 ${
                showExercises 
                  ? 'bg-gradient-to-r from-cyan-500 to-teal-600 text-white shadow-lg' 
                  : 'text-gray-700 hover:bg-gradient-to-r hover:from-cyan-100 hover:to-teal-100 hover:text-cyan-800'
              }`}
            >
              ✏️ Exercices ({score}/{getCurrentExercises().length})
            </button>
          </div>
        </div>

        {!showExercises ? (
          /* COURS */
          <div className="space-y-8">
            {/* Explication des signes */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
                🎯 Les signes pour comparer
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-red-50 rounded-lg p-6 text-center">
                  <div className="text-6xl mb-3">🔴</div>
                  <h3 className="font-bold text-red-800 mb-2">Plus grand que</h3>
                  <div className="text-4xl font-bold text-red-600 mb-2">&gt;</div>
                  <p className="text-red-700">5 670 &gt; 2 340</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-6 text-center">
                  <div className="text-6xl mb-3">🔵</div>
                  <h3 className="font-bold text-blue-800 mb-2">Plus petit que</h3>
                  <div className="text-4xl font-bold text-blue-600 mb-2">&lt;</div>
                  <p className="text-blue-700">2 340 &lt; 5 670</p>
                </div>
                <div className="bg-green-50 rounded-lg p-6 text-center">
                  <div className="text-6xl mb-3">🟢</div>
                  <h3 className="font-bold text-green-800 mb-2">Égal à</h3>
                  <div className="text-4xl font-bold text-green-600 mb-2">=</div>
                  <p className="text-green-700">3 450 = 3 450</p>
                </div>
              </div>
            </div>

            {/* Comment comparer */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
                🧠 Comment comparer deux nombres jusqu'à 10 000 ?
              </h2>
              <div className="space-y-4">
                <div className="bg-yellow-50 rounded-lg p-4">
                  <h3 className="font-bold text-yellow-800 mb-2">1. Compare le nombre de chiffres</h3>
                  <p className="text-yellow-700">5 670 (4 chiffres) &gt; 890 (3 chiffres)</p>
                </div>
                <div className="bg-orange-50 rounded-lg p-4">
                  <h3 className="font-bold text-orange-800 mb-2">2. Compare les milliers</h3>
                  <p className="text-orange-700">5 670 vs 2 340 → 5 &gt; 2 donc 5 670 &gt; 2 340</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4">
                  <h3 className="font-bold text-purple-800 mb-2">3. Si égaux, compare les centaines</h3>
                  <p className="text-purple-700">5 670 vs 5 340 → 6 &gt; 3 donc 5 670 &gt; 5 340</p>
                </div>
                <div className="bg-indigo-50 rounded-lg p-4">
                  <h3 className="font-bold text-indigo-800 mb-2">4. Si égales, compare les dizaines</h3>
                  <p className="text-indigo-700">5 670 vs 5 620 → 7 &gt; 2 donc 5 670 &gt; 5 620</p>
                </div>
                <div className="bg-teal-50 rounded-lg p-4">
                  <h3 className="font-bold text-teal-800 mb-2">5. Si égales, compare les unités</h3>
                  <p className="text-teal-700">5 670 vs 5 672 → 0 &lt; 2 donc 5 670 &lt; 5 672</p>
                </div>
              </div>
            </div>

            {/* Exemples d'ordonnancement */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
                📊 Ordonner les nombres
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-green-50 rounded-lg p-6">
                  <h3 className="font-bold text-green-800 mb-4 text-center">
                    <ArrowUp className="inline w-5 h-5 mr-2" />
                    Ordre croissant (du plus petit au plus grand)
                  </h3>
                  <div className="space-y-2">
                    <div className="text-center">
                      <div className="font-bold text-gray-700">Avant : 5 670, 2 340, 7 890</div>
                      <div className="text-2xl">⬇️</div>
                      <div className="font-bold text-green-700">Après : 2 340, 5 670, 7 890</div>
                    </div>
                  </div>
                </div>
                <div className="bg-red-50 rounded-lg p-6">
                  <h3 className="font-bold text-red-800 mb-4 text-center">
                    <ArrowDown className="inline w-5 h-5 mr-2" />
                    Ordre décroissant (du plus grand au plus petit)
                  </h3>
                  <div className="space-y-2">
                    <div className="text-center">
                      <div className="font-bold text-gray-700">Avant : 2 340, 5 670, 7 890</div>
                      <div className="text-2xl">⬇️</div>
                      <div className="font-bold text-red-700">Après : 7 890, 5 670, 2 340</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Conseils */}
            <div className="bg-gradient-to-r from-teal-400 to-cyan-400 rounded-xl p-6 text-white">
              <h3 className="text-xl font-bold mb-3">💡 Astuces pour bien ordonner</h3>
              <ul className="space-y-2">
                <li>• Regarde d'abord les milliers (le premier chiffre)</li>
                <li>• Si ils sont égaux, regarde les centaines</li>
                <li>• Si elles sont égales, regarde les dizaines</li>
                <li>• Si elles sont égales, regarde les unités</li>
                <li>• Croissant = comme compter (1, 2, 3...)</li>
                <li>• Décroissant = comme décompter (3, 2, 1...)</li>
              </ul>
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
                  <div className="text-lg font-bold text-teal-600">
                    Score : {score}/{getCurrentExercises().length}
                  </div>
                  <button
                    onClick={resetAll}
                    className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white px-4 py-2 rounded-xl font-bold transition-all transform hover:scale-105 shadow-lg"
                  >
                    <RotateCcw className="inline w-4 h-4 mr-2" />
                    Recommencer
                  </button>
                </div>
              </div>
              
              {/* Sélecteur type d'exercice */}
              <div className="flex justify-center mb-4">
                <div className="bg-gray-50 rounded-xl p-3 shadow-lg border-2 border-gray-200">
                  <button
                    onClick={() => switchExerciseType('ranger')}
                    className={`px-6 py-3 rounded-xl font-bold transition-all transform hover:scale-105 shadow-md ${
                      exerciseType === 'ranger' 
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-xl border-2 border-blue-400 scale-105' 
                        : 'bg-gradient-to-r from-blue-200 to-purple-200 text-blue-800 hover:from-blue-300 hover:to-purple-300 hover:text-blue-900 border-2 border-blue-300'
                    }`}
                  >
                    📊 Ranger
                  </button>
                  <button
                    onClick={() => switchExerciseType('encadrer')}
                    className={`px-6 py-3 rounded-xl font-bold transition-all transform hover:scale-105 shadow-md ml-2 ${
                      exerciseType === 'encadrer' 
                        ? 'bg-gradient-to-r from-green-500 to-teal-600 text-white shadow-xl border-2 border-green-400 scale-105' 
                        : 'bg-gradient-to-r from-green-200 to-teal-200 text-green-800 hover:from-green-300 hover:to-teal-300 hover:text-green-900 border-2 border-green-300'
                    }`}
                  >
                    🎯 Encadrer
                  </button>
                  <button
                    onClick={() => switchExerciseType('suites')}
                    className={`px-6 py-3 rounded-xl font-bold transition-all transform hover:scale-105 shadow-md ml-2 ${
                      exerciseType === 'suites' 
                        ? 'bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-xl border-2 border-red-400 scale-105' 
                        : 'bg-gradient-to-r from-red-200 to-pink-200 text-red-800 hover:from-red-300 hover:to-pink-300 hover:text-red-900 border-2 border-red-300'
                    }`}
                  >
                    🔢 Suites
                  </button>
                  <button
                    onClick={() => switchExerciseType('comparer')}
                    className={`px-6 py-3 rounded-xl font-bold transition-all transform hover:scale-105 shadow-md ml-2 ${
                      exerciseType === 'comparer' 
                        ? 'bg-gradient-to-r from-yellow-500 to-orange-600 text-white shadow-xl border-2 border-yellow-400 scale-105' 
                        : 'bg-gradient-to-r from-yellow-200 to-orange-200 text-yellow-800 hover:from-yellow-300 hover:to-orange-300 hover:text-yellow-900 border-2 border-yellow-300'
                    }`}
                  >
                    🔀 Comparer
                  </button>
                  <button
                    onClick={() => switchExerciseType('encadrer-unites')}
                    className={`px-6 py-3 rounded-xl font-bold transition-all transform hover:scale-105 shadow-md ml-2 ${
                      exerciseType === 'encadrer-unites' 
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-xl border-2 border-cyan-400 scale-105' 
                        : 'bg-gradient-to-r from-cyan-200 to-blue-200 text-cyan-800 hover:from-cyan-300 hover:to-blue-300 hover:text-cyan-900 border-2 border-cyan-300'
                    }`}
                  >
                    🎯 Encadrer (U, D, C, M)
                  </button>
                </div>
              </div>
              
              {/* Barre de progression */}
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className={`h-3 rounded-full transition-all duration-500 ${
                    exerciseType === 'ranger' ? 'bg-blue-500' : 
                    exerciseType === 'encadrer' ? 'bg-green-500' : 
                    exerciseType === 'suites' ? 'bg-red-500' :
                    exerciseType === 'comparer' ? 'bg-yellow-500' : 'bg-cyan-500'
                  }`}
                  style={{ width: `${((currentExercise + 1) / getCurrentExercises().length) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Question */}
            <div className="bg-white rounded-xl p-8 shadow-lg text-center">
              {exerciseType === 'ranger' && (
                <>
                  <h3 className="text-xl font-bold mb-6 text-gray-900">
                    📊 Range ces nombres dans l'ordre {rangerExercises[currentExercise].order}
                  </h3>
                  
                  <div className="mb-8">
                    <h4 className="font-bold text-gray-700 mb-4">Nombres à ranger :</h4>
                    <div className="flex justify-center space-x-2 mb-6 flex-wrap">
                      {rangerExercises[currentExercise].numbers.map((num, index) => (
                        <div key={index} className="text-2xl font-bold text-purple-600 bg-purple-100 rounded-lg p-3 mb-2">
                          {num.toLocaleString()}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mb-8">
                    <h4 className="font-bold text-gray-700 mb-4">Ta réponse :</h4>
                    <div className="flex justify-center space-x-2 flex-wrap">
                      {[0, 1, 2, 3, 4].map((index) => (
                        <input
                          key={index}
                          type="text"
                          value={userAnswers[index] || ''}
                          onChange={(e) => updateOrderAnswer(index, e.target.value)}
                          placeholder="?"
                          className="w-24 h-20 text-center text-lg font-bold border-2 border-gray-300 rounded-lg focus:border-cyan-500 focus:outline-none bg-white text-gray-900 mb-2"
                        />
                      ))}
                    </div>
                  </div>
                </>
              )}

              {exerciseType === 'encadrer' && (
                <>
                  <h3 className="text-xl font-bold mb-6 text-gray-900">
                    🎯 Encadre ce nombre par le nombre précédent et le nombre suivant
                  </h3>
                  
                  <div className="flex justify-center items-center space-x-4 mb-8">
                    <input
                      type="text"
                      value={userAnswers[0] || ''}
                      onChange={(e) => updateOrderAnswer(0, e.target.value)}
                      placeholder="?"
                      className="w-28 h-24 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none bg-white text-gray-900"
                    />
                    <div className="text-3xl font-bold text-gray-600">&lt;</div>
                    <div className="text-3xl font-bold text-red-600 bg-red-100 rounded-lg p-4">
                      {encadrerExercises[currentExercise].number.toLocaleString()}
                    </div>
                    <div className="text-3xl font-bold text-gray-600">&lt;</div>
                    <input
                      type="text"
                      value={userAnswers[1] || ''}
                      onChange={(e) => updateOrderAnswer(1, e.target.value)}
                      placeholder="?"
                      className="w-28 h-24 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none bg-white text-gray-900"
                    />
                  </div>
                </>
              )}

              {exerciseType === 'suites' && (
                <>
                  <h3 className="text-xl font-bold mb-6 text-gray-900">
                    🔢 Trouve les nombres manquants dans cette suite
                  </h3>
                  
                  <div className="flex justify-center space-x-4 mb-8">
                    {suitesExercises[currentExercise].sequence.map((item, index) => (
                      <div key={index} className={`w-28 h-24 rounded-lg flex items-center justify-center text-xl font-bold ${
                        item === '?' 
                          ? 'bg-yellow-200 text-yellow-800' 
                          : 'bg-gray-200 text-gray-800'
                      }`}>
                        {item === '?' ? '?' : typeof item === 'number' ? item.toLocaleString() : item}
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex justify-center space-x-4 mb-8">
                    <div className="text-center">
                      <label className="block font-bold text-gray-700 mb-2">1er nombre manquant :</label>
                      <input
                        type="text"
                        value={userAnswers[0] || ''}
                        onChange={(e) => updateOrderAnswer(0, e.target.value)}
                        placeholder="?"
                        className="w-28 h-16 text-center text-xl font-bold border-2 border-gray-300 rounded-lg focus:border-yellow-500 focus:outline-none bg-white text-gray-900"
                      />
                    </div>
                    <div className="text-center">
                      <label className="block font-bold text-gray-700 mb-2">2ème nombre manquant :</label>
                      <input
                        type="text"
                        value={userAnswers[1] || ''}
                        onChange={(e) => updateOrderAnswer(1, e.target.value)}
                        placeholder="?"
                        className="w-28 h-16 text-center text-xl font-bold border-2 border-gray-300 rounded-lg focus:border-yellow-500 focus:outline-none bg-white text-gray-900"
                      />
                    </div>
                  </div>
                </>
              )}

              {exerciseType === 'comparer' && (
                <>
                  <h3 className="text-xl font-bold mb-6 text-gray-900">
                    🔀 Compare ces nombres en utilisant &gt;, &lt; ou =
                  </h3>
                  
                  <div className="flex justify-center items-center space-x-4 mb-8">
                    <div className="text-4xl font-bold text-blue-600 bg-blue-100 rounded-lg p-4">
                      {comparerExercises[currentExercise].number1.toLocaleString()}
                    </div>
                    <input
                      type="text"
                      value={userAnswers[0] || ''}
                      onChange={(e) => updateOrderAnswer(0, e.target.value)}
                      placeholder="?"
                      className="w-24 h-24 text-center text-4xl font-bold border-2 border-gray-300 rounded-lg focus:border-yellow-500 focus:outline-none bg-white text-gray-900"
                    />
                    <div className="text-4xl font-bold text-green-600 bg-green-100 rounded-lg p-4">
                      {comparerExercises[currentExercise].number2.toLocaleString()}
                    </div>
                  </div>
                  
                  <div className="mb-8">
                    <p className="text-gray-600 text-lg mb-4">Écris le bon signe : &gt; (plus grand), &lt; (plus petit) ou = (égal)</p>
                    <div className="flex justify-center space-x-4">
                      <button
                        onClick={() => updateOrderAnswer(0, '>')}
                        className="px-6 py-3 bg-red-200 hover:bg-red-300 text-red-800 font-bold rounded-lg text-2xl transition-all"
                      >
                        &gt;
                      </button>
                      <button
                        onClick={() => updateOrderAnswer(0, '<')}
                        className="px-6 py-3 bg-blue-200 hover:bg-blue-300 text-blue-800 font-bold rounded-lg text-2xl transition-all"
                      >
                        &lt;
                      </button>
                      <button
                        onClick={() => updateOrderAnswer(0, '=')}
                        className="px-6 py-3 bg-green-200 hover:bg-green-300 text-green-800 font-bold rounded-lg text-2xl transition-all"
                      >
                        =
                      </button>
                    </div>
                  </div>
                </>
              )}

              {exerciseType === 'encadrer-unites' && (
                <>
                  <h3 className="text-xl font-bold mb-6 text-gray-900">
                    🎯 Encadre ce nombre à {encadrerUnitesExercises[currentExercise].type === 'unité' ? 'l\'' : 'la '}
                    {encadrerUnitesExercises[currentExercise].type === 'millier' ? 'au millier' : encadrerUnitesExercises[currentExercise].type}
                  </h3>
                  
                  <div className="flex justify-center items-center space-x-4 mb-8">
                    <input
                      type="text"
                      value={userAnswers[0] || ''}
                      onChange={(e) => updateOrderAnswer(0, e.target.value)}
                      placeholder="?"
                      className="w-28 h-24 text-center text-xl font-bold border-2 border-gray-300 rounded-lg focus:border-cyan-500 focus:outline-none bg-white text-gray-900"
                    />
                    <div className="text-3xl font-bold text-gray-600">&lt;</div>
                    <div className="text-3xl font-bold text-cyan-600 bg-cyan-100 rounded-lg p-4">
                      {encadrerUnitesExercises[currentExercise].number.toLocaleString()}
                    </div>
                    <div className="text-3xl font-bold text-gray-600">&lt;</div>
                    <input
                      type="text"
                      value={userAnswers[1] || ''}
                      onChange={(e) => updateOrderAnswer(1, e.target.value)}
                      placeholder="?"
                      className="w-28 h-24 text-center text-xl font-bold border-2 border-gray-300 rounded-lg focus:border-cyan-500 focus:outline-none bg-white text-gray-900"
                    />
                  </div>
                  
                  <div className="mb-8">
                    <p className="text-gray-600 text-lg">
                      Encadre {encadrerUnitesExercises[currentExercise].number.toLocaleString()} {encadrerUnitesExercises[currentExercise].type === 'unité' ? 'à l\'' : 'à la '}
                      {encadrerUnitesExercises[currentExercise].type === 'millier' ? 'au millier' : encadrerUnitesExercises[currentExercise].type}
                    </p>
                    <p className="text-gray-500 text-sm mt-2">
                      {encadrerUnitesExercises[currentExercise].type === 'unité' 
                        ? 'Exemple : 4566 < 4567 < 4568' 
                        : encadrerUnitesExercises[currentExercise].type === 'dizaine' 
                        ? 'Exemple : 4560 < 4567 < 4570' 
                        : encadrerUnitesExercises[currentExercise].type === 'centaine'
                        ? 'Exemple : 4500 < 4567 < 4600'
                        : 'Exemple : 4000 < 4567 < 5000'}
                    </p>
                  </div>
                </>
              )}
              
              <div className="flex justify-center space-x-4 mb-6">
                <button
                  onClick={checkAnswer}
                  disabled={
                    (exerciseType === 'ranger' && userAnswers.length < 5) ||
                    (exerciseType === 'encadrer' && userAnswers.length < 2) ||
                    (exerciseType === 'suites' && userAnswers.length < 2) ||
                    (exerciseType === 'comparer' && userAnswers.length < 1) ||
                    (exerciseType === 'encadrer-unites' && userAnswers.length < 2)
                  }
                  className={`text-white px-8 py-4 rounded-xl font-bold transition-all transform hover:scale-105 shadow-lg disabled:opacity-50 ${
                    exerciseType === 'ranger' ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700' :
                    exerciseType === 'encadrer' ? 'bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700' :
                    exerciseType === 'suites' ? 'bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700' :
                    exerciseType === 'comparer' ? 'bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700' :
                    'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700'
                  }`}
                >
                  ✨ Vérifier ✨
                </button>
                <button
                  onClick={resetExercise}
                  className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white px-8 py-4 rounded-xl font-bold transition-all transform hover:scale-105 shadow-lg"
                >
                  🔄 Effacer
                </button>
              </div>
              
              {/* Résultat */}
              {isCorrect !== null && (
                <div className={`p-6 rounded-xl mb-6 shadow-lg ${
                  isCorrect ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-2 border-green-300' : 'bg-gradient-to-r from-red-100 to-rose-100 text-red-800 border-2 border-red-300'
                }`}>
                  <div className="flex items-center justify-center space-x-2">
                    {isCorrect ? (
                      <>
                        <CheckCircle className="w-8 h-8" />
                        <span className="font-bold text-xl">🎉 Excellent ! Tu as trouvé la bonne réponse ! 🎉</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-8 h-8" />
                        <span className="font-bold text-xl">
                          {exerciseType === 'ranger' && 
                            `Pas tout à fait... La bonne réponse est : ${((getCurrentExercises()[currentExercise] as any).answer as number[]).map(n => n.toLocaleString()).join(', ')}`
                          }
                          {exerciseType === 'encadrer' && 
                            `Pas tout à fait... La bonne réponse est : ${((getCurrentExercises()[currentExercise] as any).before as number).toLocaleString()} < ${((getCurrentExercises()[currentExercise] as any).number as number).toLocaleString()} < ${((getCurrentExercises()[currentExercise] as any).after as number).toLocaleString()}`
                          }
                          {exerciseType === 'suites' && 
                            `Pas tout à fait... La bonne réponse est : ${((getCurrentExercises()[currentExercise] as any).answers as string[]).join(', ')}`
                          }
                          {exerciseType === 'comparer' && 
                            `Pas tout à fait... La bonne réponse est : ${((getCurrentExercises()[currentExercise] as any).explanation as string)}`
                          }
                          {exerciseType === 'encadrer-unites' && 
                            `Pas tout à fait... La bonne réponse est : ${((getCurrentExercises()[currentExercise] as any).explanation as string)}`
                          }
                        </span>
                      </>
                    )}
                  </div>
                </div>
              )}
              
              {/* Navigation */}
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => setCurrentExercise(Math.max(0, currentExercise - 1))}
                  disabled={currentExercise === 0}
                  className="bg-gradient-to-r from-indigo-400 to-purple-500 hover:from-indigo-500 hover:to-purple-600 text-white px-6 py-3 rounded-xl font-bold transition-all transform hover:scale-105 shadow-lg disabled:opacity-50"
                >
                  ← Précédent
                </button>
                <button
                  onClick={nextExercise}
                  disabled={currentExercise === getCurrentExercises().length - 1}
                  className={`text-white px-6 py-3 rounded-xl font-bold transition-all transform hover:scale-105 shadow-lg disabled:opacity-50 ${
                    exerciseType === 'ranger' ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700' :
                    exerciseType === 'encadrer' ? 'bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700' :
                    exerciseType === 'suites' ? 'bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700' :
                    exerciseType === 'comparer' ? 'bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700' :
                    'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700'
                  }`}
                >
                  Suivant →
                </button>
              </div>
            </div>

            {/* Félicitations */}
            {currentExercise === getCurrentExercises().length - 1 && isCorrect !== null && (
              <div className={`rounded-xl p-6 text-white text-center ${
                exerciseType === 'ranger' ? 'bg-gradient-to-r from-blue-400 to-purple-400' :
                exerciseType === 'encadrer' ? 'bg-gradient-to-r from-green-400 to-teal-400' :
                exerciseType === 'suites' ? 'bg-gradient-to-r from-red-400 to-pink-400' :
                exerciseType === 'comparer' ? 'bg-gradient-to-r from-yellow-400 to-orange-400' :
                'bg-gradient-to-r from-cyan-400 to-blue-400'
              }`}>
                <div className="text-4xl mb-3">🎉</div>
                <h3 className="text-2xl font-bold mb-2">Fantastique !</h3>
                <p className="text-lg">
                  {exerciseType === 'ranger' && 'Tu sais maintenant comparer tous les nombres jusqu\'à 10 000 !'}
                  {exerciseType === 'encadrer' && 'Tu sais maintenant ordonner tous les nombres jusqu\'à 10 000 !'}
                  {exerciseType === 'suites' && 'Tu sais maintenant trouver les nombres manquants !'}
                  {exerciseType === 'comparer' && 'Tu sais maintenant comparer avec les signes <, > et = !'}
                  {exerciseType === 'encadrer-unites' && 'Tu sais maintenant encadrer à l\'unité, à la dizaine, à la centaine et au millier !'}
                </p>
                <p className="text-xl font-bold mt-4">
                  Score final : {score}/{getCurrentExercises().length}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 