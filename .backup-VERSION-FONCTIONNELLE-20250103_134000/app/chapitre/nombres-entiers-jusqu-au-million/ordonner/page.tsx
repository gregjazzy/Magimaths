'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, XCircle, RotateCcw, ArrowUp, ArrowDown } from 'lucide-react';

export default function OrdonnerNombresMillionPage() {
  const [currentExercise, setCurrentExercise] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showExercises, setShowExercises] = useState(false);
  const [score, setScore] = useState(0);
  const [exerciseType, setExerciseType] = useState<'ranger' | 'encadrer' | 'suites' | 'comparer' | 'encadrer-unites'>('ranger');

  // Exercices de rangement pour les nombres jusqu'au million - nombres complexes
  const rangerExercises = [
    { numbers: [875439, 508267, 850173, 185947, 580628], answer: [185947, 508267, 580628, 850173, 875439], order: 'croissant' },
    { numbers: [743586, 374291, 473847, 734619, 437925], answer: [743586, 734619, 473847, 437925, 374291], order: 'décroissant' },
    { numbers: [917283, 179564, 719847, 197635, 791428], answer: [179564, 197635, 719847, 791428, 917283], order: 'croissant' },
    { numbers: [480739, 840156, 408927, 84573, 804682], answer: [840156, 804682, 480739, 408927, 84573], order: 'décroissant' },
    { numbers: [234967, 567394, 123875, 456728, 789165], answer: [123875, 234967, 456728, 567394, 789165], order: 'croissant' },
    { numbers: [678294, 345867, 789156, 234739, 567418], answer: [789156, 678294, 567418, 345867, 234739], order: 'décroissant' },
    { numbers: [156847, 345629, 234958, 123674, 456793], answer: [123674, 156847, 234958, 345629, 456793], order: 'croissant' },
    { numbers: [789354, 567928, 234671, 456847, 123759], answer: [789354, 567928, 456847, 234671, 123759], order: 'décroissant' },
    { numbers: [325867, 532419, 253974, 523687, 235849], answer: [235849, 253974, 325867, 523687, 532419], order: 'croissant' },
    { numbers: [467925, 764138, 647859, 476293, 746587], answer: [764138, 746587, 647859, 476293, 467925], order: 'décroissant' },
    { numbers: [145739, 541826, 154967, 451684, 514379], answer: [145739, 154967, 451684, 514379, 541826], order: 'croissant' },
    { numbers: [682574, 826391, 268947, 628715, 862439], answer: [862439, 826391, 682574, 628715, 268947], order: 'décroissant' },
    { numbers: [397648, 739285, 379567, 793148, 937264], answer: [379567, 397648, 739285, 793148, 937264], order: 'croissant' },
    { numbers: [148739, 841526, 418967, 184635, 814279], answer: [841526, 814279, 418967, 184635, 148739], order: 'décroissant' },
    { numbers: [256847, 652394, 526789, 265473, 625918], answer: [256847, 265473, 526789, 625918, 652394], order: 'croissant' },
    { numbers: [412759, 214638, 124867, 421593, 241786], answer: [124867, 214638, 241786, 412759, 421593], order: 'croissant' },
    { numbers: [967284, 796537, 679148, 697829, 976351], answer: [976351, 967284, 796537, 697829, 679148], order: 'décroissant' },
    { numbers: [583749, 358627, 835194, 385768, 853426], answer: [358627, 385768, 583749, 835194, 853426], order: 'croissant' },
    { numbers: [729568, 927314, 279847, 792635, 297584], answer: [927314, 792635, 729568, 297584, 279847], order: 'décroissant' },
    { numbers: [164759, 461283, 146827, 614395, 641758], answer: [146827, 164759, 461283, 614395, 641758], order: 'croissant' },
    { numbers: [839476, 398529, 893167, 389764, 938251], answer: [938251, 893167, 839476, 398529, 389764], order: 'décroissant' }
  ];

  // Exercices d'encadrement pour les nombres jusqu'au million - nombres complexes
  const encadrerExercises = [
    { number: 540739, before: 540738, after: 540740 },
    { number: 708294, before: 708293, after: 708295 },
    { number: 856417, before: 856416, after: 856418 },
    { number: 900528, before: 900527, after: 900529 },
    { number: 601835, before: 601834, after: 601836 },
    { number: 784692, before: 784691, after: 784693 },
    { number: 370463, before: 370462, after: 370464 },
    { number: 337859, before: 337858, after: 337860 },
    { number: 307254, before: 307253, after: 307255 },
    { number: 733627, before: 733626, after: 733628 },
    { number: 401948, before: 401947, after: 401949 },
    { number: 299376, before: 299375, after: 299377 },
    { number: 500814, before: 500813, after: 500815 },
    { number: 650237, before: 650236, after: 650238 },
    { number: 199685, before: 199684, after: 199686 },
    { number: 425739, before: 425738, after: 425740 },
    { number: 687154, before: 687153, after: 687155 },
    { number: 150862, before: 150861, after: 150863 },
    { number: 764395, before: 764394, after: 764396 },
    { number: 829576, before: 829575, after: 829577 },
    { number: 491783, before: 491782, after: 491784 }
  ];

  // Exercices de suites pour les nombres jusqu'au million - nombres complexes
  const suitesExercises = [
    { sequence: [92357, 94357, 96357, '?', '?'], step: 2000, answers: ['98357', '100357'] },
    { sequence: [175264, 180264, 185264, '?', '?'], step: 5000, answers: ['190264', '195264'] },
    { sequence: [133859, 143859, 153859, '?', '?'], step: 10000, answers: ['163859', '173859'] },
    { sequence: [157426, 155426, 153426, '?', '?'], step: -2000, answers: ['151426', '149426'] },
    { sequence: [85739, 87739, 89739, '?', '?'], step: 2000, answers: ['91739', '93739'] },
    { sequence: [112594, 110594, 108594, '?', '?'], step: -2000, answers: ['106594', '104594'] },
    { sequence: [73482, 78482, 83482, '?', '?'], step: 5000, answers: ['88482', '93482'] },
    { sequence: [160637, 150637, 140637, '?', '?'], step: -10000, answers: ['130637', '120637'] },
    { sequence: [234758, 236758, 238758, '?', '?'], step: 2000, answers: ['240758', '242758'] },
    { sequence: [350194, 345194, 340194, '?', '?'], step: -5000, answers: ['335194', '330194'] },
    { sequence: [125683, 135683, 145683, '?', '?'], step: 10000, answers: ['155683', '165683'] },
    { sequence: [198529, 196529, 194529, '?', '?'], step: -2000, answers: ['192529', '190529'] },
    { sequence: [465374, 470374, 475374, '?', '?'], step: 5000, answers: ['480374', '485374'] },
    { sequence: [670925, 660925, 650925, '?', '?'], step: -10000, answers: ['640925', '630925'] },
    { sequence: [147638, 149638, 151638, '?', '?'], step: 2000, answers: ['153638', '155638'] },
    { sequence: [267483, 269483, 271483, '?', '?'], step: 2000, answers: ['273483', '275483'] },
    { sequence: [380756, 385756, 390756, '?', '?'], step: 5000, answers: ['395756', '400756'] },
    { sequence: [540291, 530291, 520291, '?', '?'], step: -10000, answers: ['510291', '500291'] },
    { sequence: [426847, 424847, 422847, '?', '?'], step: -2000, answers: ['420847', '418847'] },
    { sequence: [615392, 620392, 625392, '?', '?'], step: 5000, answers: ['630392', '635392'] },
    { sequence: [758649, 748649, 738649, '?', '?'], step: -10000, answers: ['728649', '718649'] }
  ];

  // Exercices de comparaison avec >, <, = (20 exercices) pour nombres jusqu'au million - nombres complexes
  const comparerExercises = [
    { number1: 486397, number2: 379248, answer: '>', explanation: '486397 > 379248' },
    { number1: 124759, number2: 234861, answer: '<', explanation: '124759 < 234861' },
    { number1: 789356, number2: 789356, answer: '=', explanation: '789356 = 789356' },
    { number1: 567829, number2: 486397, answer: '>', explanation: '567829 > 486397' },
    { number1: 234861, number2: 345679, answer: '<', explanation: '234861 < 345679' },
    { number1: 503496, number2: 503496, answer: '=', explanation: '503496 = 503496' },
    { number1: 678927, number2: 246738, answer: '>', explanation: '678927 > 246738' },
    { number1: 145629, number2: 486397, answer: '<', explanation: '145629 < 486397' },
    { number1: 321794, number2: 321794, answer: '=', explanation: '321794 = 321794' },
    { number1: 890157, number2: 257394, answer: '>', explanation: '890157 > 257394' },
    { number1: 246738, number2: 567829, answer: '<', explanation: '246738 < 567829' },
    { number1: 486397, number2: 486397, answer: '=', explanation: '486397 = 486397' },
    { number1: 729548, number2: 348679, answer: '>', explanation: '729548 > 348679' },
    { number1: 156729, number2: 237495, answer: '<', explanation: '156729 < 237495' },
    { number1: 678927, number2: 678927, answer: '=', explanation: '678927 = 678927' },
    { number1: 845629, number2: 279384, answer: '>', explanation: '845629 > 279384' },
    { number1: 237495, number2: 789356, answer: '<', explanation: '237495 < 789356' },
    { number1: 567829, number2: 567829, answer: '=', explanation: '567829 = 567829' },
    { number1: 912384, number2: 486397, answer: '>', explanation: '912384 > 486397' },
    { number1: 127495, number2: 486397, answer: '<', explanation: '127495 < 486397' }
  ];

  // Exercices d'encadrement par unités, dizaines, centaines, milliers, dizaines de milliers, centaines de milliers (20 exercices)
  const encadrerUnitesExercises = [
    { number: 486397, type: 'unité', before: 486396, after: 486398, explanation: '486396 < 486397 < 486398' },
    { number: 234861, type: 'unité', before: 234860, after: 234862, explanation: '234860 < 234861 < 234862' },
    { number: 567829, type: 'unité', before: 567828, after: 567830, explanation: '567828 < 567829 < 567830' },
    { number: 127495, type: 'dizaine', before: 127490, after: 127500, explanation: '127490 < 127495 < 127500' },
    { number: 789356, type: 'dizaine', before: 789350, after: 789360, explanation: '789350 < 789356 < 789360' },
    { number: 345679, type: 'dizaine', before: 345670, after: 345680, explanation: '345670 < 345679 < 345680' },
    { number: 567829, type: 'centaine', before: 567800, after: 567900, explanation: '567800 < 567829 < 567900' },
    { number: 123495, type: 'centaine', before: 123400, after: 123500, explanation: '123400 < 123495 < 123500' },
    { number: 345679, type: 'centaine', before: 345600, after: 345700, explanation: '345600 < 345679 < 345700' },
    { number: 789356, type: 'millier', before: 789000, after: 790000, explanation: '789000 < 789356 < 790000' },
    { number: 234861, type: 'millier', before: 234000, after: 235000, explanation: '234000 < 234861 < 235000' },
    { number: 567829, type: 'millier', before: 567000, after: 568000, explanation: '567000 < 567829 < 568000' },
    { number: 567829, type: 'dizaine de milliers', before: 560000, after: 570000, explanation: '560000 < 567829 < 570000' },
    { number: 123495, type: 'dizaine de milliers', before: 120000, after: 130000, explanation: '120000 < 123495 < 130000' },
    { number: 345679, type: 'dizaine de milliers', before: 340000, after: 350000, explanation: '340000 < 345679 < 350000' },
    { number: 789356, type: 'dizaine de milliers', before: 780000, after: 790000, explanation: '780000 < 789356 < 790000' },
    { number: 567829, type: 'centaine de milliers', before: 500000, after: 600000, explanation: '500000 < 567829 < 600000' },
    { number: 123495, type: 'centaine de milliers', before: 100000, after: 200000, explanation: '100000 < 123495 < 200000' },
    { number: 789356, type: 'centaine de milliers', before: 700000, after: 800000, explanation: '700000 < 789356 < 800000' },
    { number: 486397, type: 'centaine de milliers', before: 400000, after: 500000, explanation: '400000 < 486397 < 500000' }
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/chapitre/nombres-entiers-jusqu-au-million" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-4">
            <ArrowLeft className="w-4 h-4" />
            <span>Retour au chapitre</span>
          </Link>
          
          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              🔢 Ordonner les nombres jusqu'au million
            </h1>
            <p className="text-lg text-gray-600">
              Apprends à comparer et ranger les nombres jusqu'au million !
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
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg' 
                  : 'text-gray-700 hover:bg-gradient-to-r hover:from-indigo-100 hover:to-purple-100 hover:text-indigo-800'
              }`}
            >
              📖 Cours
            </button>
            <button
              onClick={() => setShowExercises(true)}
              className={`px-8 py-4 rounded-xl font-bold transition-all transform hover:scale-105 shadow-md ml-2 ${
                showExercises 
                  ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-lg' 
                  : 'text-gray-700 hover:bg-gradient-to-r hover:from-purple-100 hover:to-indigo-100 hover:text-purple-800'
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
                  <p className="text-red-700">567 000 &gt; 234 000</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-6 text-center">
                  <div className="text-6xl mb-3">🔵</div>
                  <h3 className="font-bold text-blue-800 mb-2">Plus petit que</h3>
                  <div className="text-4xl font-bold text-blue-600 mb-2">&lt;</div>
                  <p className="text-blue-700">234 000 &lt; 567 000</p>
                </div>
                <div className="bg-green-50 rounded-lg p-6 text-center">
                  <div className="text-6xl mb-3">🟢</div>
                  <h3 className="font-bold text-green-800 mb-2">Égal à</h3>
                  <div className="text-4xl font-bold text-green-600 mb-2">=</div>
                  <p className="text-green-700">345 000 = 345 000</p>
                </div>
              </div>
            </div>

            {/* Comment comparer */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
                🧠 Comment comparer deux nombres jusqu'au million ?
              </h2>
              <div className="space-y-4">
                <div className="bg-yellow-50 rounded-lg p-4">
                  <h3 className="font-bold text-yellow-800 mb-2">1. Compare le nombre de chiffres</h3>
                  <p className="text-yellow-700">567 000 (6 chiffres) &gt; 8 900 (4 chiffres)</p>
                </div>
                <div className="bg-orange-50 rounded-lg p-4">
                  <h3 className="font-bold text-orange-800 mb-2">2. Compare les centaines de milliers</h3>
                  <p className="text-orange-700">567 000 vs 234 000 → 5 &gt; 2 donc 567 000 &gt; 234 000</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4">
                  <h3 className="font-bold text-purple-800 mb-2">3. Si égales, compare les dizaines de milliers</h3>
                  <p className="text-purple-700">567 000 vs 534 000 → 6 &gt; 3 donc 567 000 &gt; 534 000</p>
                </div>
                <div className="bg-indigo-50 rounded-lg p-4">
                  <h3 className="font-bold text-indigo-800 mb-2">4. Si égales, compare les unités de milliers</h3>
                  <p className="text-indigo-700">567 000 vs 562 000 → 7 &gt; 2 donc 567 000 &gt; 562 000</p>
                </div>
                <div className="bg-teal-50 rounded-lg p-4">
                  <h3 className="font-bold text-teal-800 mb-2">5. Continue avec les centaines, dizaines, unités</h3>
                  <p className="text-teal-700">567 123 vs 567 089 → 123 &gt; 089 donc 567 123 &gt; 567 089</p>
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
                      <div className="font-bold text-gray-700">Avant : 567 000, 234 000, 789 000</div>
                      <div className="text-2xl">⬇️</div>
                      <div className="font-bold text-green-700">Après : 234 000, 567 000, 789 000</div>
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
                      <div className="font-bold text-gray-700">Avant : 234 000, 567 000, 789 000</div>
                      <div className="text-2xl">⬇️</div>
                      <div className="font-bold text-red-700">Après : 789 000, 567 000, 234 000</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Conseils */}
            <div className="bg-gradient-to-r from-indigo-400 to-purple-400 rounded-xl p-6 text-white">
              <h3 className="text-xl font-bold mb-3">💡 Astuces pour bien ordonner</h3>
              <ul className="space-y-2">
                <li>• Regarde d'abord les centaines de milliers (1er chiffre)</li>
                <li>• Si elles sont égales, regarde les dizaines de milliers (2ème chiffre)</li>
                <li>• Puis les unités de milliers (3ème chiffre)</li>
                <li>• Et enfin les centaines, dizaines et unités</li>
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
                  <div className="text-lg font-bold text-indigo-600">
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
                    ⚖️ Comparer
                  </button>
                  <button
                    onClick={() => switchExerciseType('encadrer-unites')}
                    className={`px-6 py-3 rounded-xl font-bold transition-all transform hover:scale-105 shadow-md ml-2 ${
                      exerciseType === 'encadrer-unites' 
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-xl border-2 border-cyan-400 scale-105' 
                        : 'bg-gradient-to-r from-cyan-200 to-blue-200 text-cyan-800 hover:from-cyan-300 hover:to-blue-300 hover:text-cyan-900 border-2 border-cyan-300'
                    }`}
                  >
                    🔵 Encadrer par unités
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
                        <div key={index} className="text-lg font-bold text-purple-600 bg-purple-100 rounded-lg p-3 mb-2">
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
                          className="w-32 h-20 text-center text-lg font-bold border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none bg-white text-gray-900 mb-2"
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
                      className="w-32 h-24 text-center text-xl font-bold border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none bg-white text-gray-900"
                    />
                    <div className="text-3xl font-bold text-gray-600">&lt;</div>
                    <div className="text-2xl font-bold text-red-600 bg-red-100 rounded-lg p-4">
                      {encadrerExercises[currentExercise].number.toLocaleString()}
                    </div>
                    <div className="text-3xl font-bold text-gray-600">&lt;</div>
                    <input
                      type="text"
                      value={userAnswers[1] || ''}
                      onChange={(e) => updateOrderAnswer(1, e.target.value)}
                      placeholder="?"
                      className="w-32 h-24 text-center text-xl font-bold border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none bg-white text-gray-900"
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
                      <div key={index} className={`w-32 h-24 rounded-lg flex items-center justify-center text-lg font-bold ${
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
                        className="w-32 h-16 text-center text-xl font-bold border-2 border-gray-300 rounded-lg focus:border-yellow-500 focus:outline-none bg-white text-gray-900"
                      />
                    </div>
                    <div className="text-center">
                      <label className="block font-bold text-gray-700 mb-2">2ème nombre manquant :</label>
                      <input
                        type="text"
                        value={userAnswers[1] || ''}
                        onChange={(e) => updateOrderAnswer(1, e.target.value)}
                        placeholder="?"
                        className="w-32 h-16 text-center text-xl font-bold border-2 border-gray-300 rounded-lg focus:border-yellow-500 focus:outline-none bg-white text-gray-900"
                      />
                    </div>
                  </div>
                </>
              )}

              {exerciseType === 'comparer' && (
                <>
                  <h3 className="text-xl font-bold mb-6 text-gray-900">
                    ⚖️ Compare ces deux nombres et clique sur le bon signe
                  </h3>
                  
                  <div className="flex justify-center items-center space-x-4 mb-8">
                    <div className="text-2xl font-bold text-blue-600 bg-blue-100 rounded-lg p-4">
                      {comparerExercises[currentExercise].number1.toLocaleString()}
                    </div>
                    <div className="text-6xl font-bold text-gray-600">?</div>
                    <div className="text-2xl font-bold text-blue-600 bg-blue-100 rounded-lg p-4">
                      {comparerExercises[currentExercise].number2.toLocaleString()}
                    </div>
                  </div>
                  
                  <div className="flex justify-center space-x-4 mb-8">
                    <button
                      onClick={() => {
                        setUserAnswers(['>']);
                      }}
                      className={`text-4xl font-bold px-8 py-4 rounded-xl transition-all transform hover:scale-105 shadow-lg ${
                        userAnswers[0] === '>' 
                          ? 'bg-red-500 text-white border-2 border-red-400 scale-105' 
                          : 'bg-red-200 text-red-800 hover:bg-red-300 border-2 border-red-300'
                      }`}
                    >
                      &gt;
                    </button>
                    <button
                      onClick={() => {
                        setUserAnswers(['<']);
                      }}
                      className={`text-4xl font-bold px-8 py-4 rounded-xl transition-all transform hover:scale-105 shadow-lg ${
                        userAnswers[0] === '<' 
                          ? 'bg-blue-500 text-white border-2 border-blue-400 scale-105' 
                          : 'bg-blue-200 text-blue-800 hover:bg-blue-300 border-2 border-blue-300'
                      }`}
                    >
                      &lt;
                    </button>
                    <button
                      onClick={() => {
                        setUserAnswers(['=']);
                      }}
                      className={`text-4xl font-bold px-8 py-4 rounded-xl transition-all transform hover:scale-105 shadow-lg ${
                        userAnswers[0] === '=' 
                          ? 'bg-green-500 text-white border-2 border-green-400 scale-105' 
                          : 'bg-green-200 text-green-800 hover:bg-green-300 border-2 border-green-300'
                      }`}
                    >
                      =
                    </button>
                  </div>
                </>
              )}

              {exerciseType === 'encadrer-unites' && (
                <>
                  <h3 className="text-xl font-bold mb-6 text-gray-900">
                    🔵 Encadre ce nombre par la {encadrerUnitesExercises[currentExercise].type}
                  </h3>
                  
                  <div className="flex justify-center items-center space-x-4 mb-8">
                    <input
                      type="text"
                      value={userAnswers[0] || ''}
                      onChange={(e) => updateOrderAnswer(0, e.target.value)}
                      placeholder="?"
                      className="w-32 h-24 text-center text-xl font-bold border-2 border-gray-300 rounded-lg focus:border-cyan-500 focus:outline-none bg-white text-gray-900"
                    />
                    <div className="text-3xl font-bold text-gray-600">&lt;</div>
                    <div className="text-2xl font-bold text-cyan-600 bg-cyan-100 rounded-lg p-4">
                      {encadrerUnitesExercises[currentExercise].number.toLocaleString()}
                    </div>
                    <div className="text-3xl font-bold text-gray-600">&lt;</div>
                    <input
                      type="text"
                      value={userAnswers[1] || ''}
                      onChange={(e) => updateOrderAnswer(1, e.target.value)}
                      placeholder="?"
                      className="w-32 h-24 text-center text-xl font-bold border-2 border-gray-300 rounded-lg focus:border-cyan-500 focus:outline-none bg-white text-gray-900"
                    />
                  </div>
                  
                  <div className="bg-cyan-50 rounded-lg p-4 mb-8">
                    <p className="text-cyan-700 font-bold">
                      💡 Trouve le nombre précédent et le nombre suivant pour la {encadrerUnitesExercises[currentExercise].type}
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
                            `Pas tout à fait... La bonne réponse est : ${((getCurrentExercises()[currentExercise] as any).answers as string[]).map(s => parseInt(s).toLocaleString()).join(', ')}`
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
                  {exerciseType === 'ranger' && 'Tu sais maintenant comparer tous les nombres jusqu\'au million !'}
                  {exerciseType === 'encadrer' && 'Tu sais maintenant ordonner tous les nombres jusqu\'au million !'}
                  {exerciseType === 'suites' && 'Tu sais maintenant trouver les nombres manquants !'}
                  {exerciseType === 'comparer' && 'Tu sais maintenant comparer tous les nombres jusqu\'au million !'}
                  {exerciseType === 'encadrer-unites' && 'Tu sais maintenant encadrer tous les nombres jusqu\'au million !'}
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