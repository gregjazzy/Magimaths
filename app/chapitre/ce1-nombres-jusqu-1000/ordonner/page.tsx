'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, XCircle, RotateCcw, ArrowUp, ArrowDown } from 'lucide-react';

export default function OrdonnerNombresCE1Page() {
  const [currentExercise, setCurrentExercise] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showExercises, setShowExercises] = useState(false);
  const [score, setScore] = useState(0);
  const [exerciseType, setExerciseType] = useState<'ranger' | 'encadrer' | 'suites'>('ranger');

  // Exercices de rangement (comme exercices 14-17)
  const rangerExercises = [
    { numbers: [805, 508, 850, 185, 580], answer: [185, 508, 580, 805, 850], order: 'croissant' },
    { numbers: [743, 374, 473, 734, 437], answer: [743, 734, 473, 437, 374], order: 'décroissant' },
    { numbers: [917, 179, 719, 197, 791], answer: [179, 197, 719, 791, 917], order: 'croissant' },
    { numbers: [480, 840, 408, 84, 804], answer: [840, 804, 480, 408, 84], order: 'décroissant' },
    { numbers: [234, 567, 123, 456, 789], answer: [123, 234, 456, 567, 789], order: 'croissant' },
    { numbers: [678, 345, 789, 234, 567], answer: [789, 678, 567, 345, 234], order: 'décroissant' },
    { numbers: [156, 345, 234, 123, 456], answer: [123, 156, 234, 345, 456], order: 'croissant' },
    { numbers: [789, 567, 234, 456, 123], answer: [789, 567, 456, 234, 123], order: 'décroissant' },
    { numbers: [325, 532, 253, 523, 235], answer: [235, 253, 325, 523, 532], order: 'croissant' },
    { numbers: [467, 764, 647, 476, 746], answer: [764, 746, 647, 476, 467], order: 'décroissant' },
    { numbers: [145, 541, 154, 451, 514], answer: [145, 154, 451, 514, 541], order: 'croissant' },
    { numbers: [682, 826, 268, 628, 862], answer: [862, 826, 682, 628, 268], order: 'décroissant' },
    { numbers: [397, 739, 379, 793, 937], answer: [379, 397, 739, 793, 937], order: 'croissant' },
    { numbers: [148, 841, 418, 184, 814], answer: [841, 814, 418, 184, 148], order: 'décroissant' },
    { numbers: [256, 652, 526, 265, 625], answer: [256, 265, 526, 625, 652], order: 'croissant' },
    // 6 exercices supplémentaires
    { numbers: [412, 214, 124, 421, 241], answer: [124, 214, 241, 412, 421], order: 'croissant' },
    { numbers: [967, 796, 679, 697, 976], answer: [976, 967, 796, 697, 679], order: 'décroissant' },
    { numbers: [583, 358, 835, 385, 853], answer: [358, 385, 583, 835, 853], order: 'croissant' },
    { numbers: [729, 927, 279, 792, 297], answer: [927, 792, 729, 297, 279], order: 'décroissant' },
    { numbers: [164, 461, 146, 614, 641], answer: [146, 164, 461, 614, 641], order: 'croissant' },
    { numbers: [839, 398, 893, 389, 938], answer: [938, 893, 839, 398, 389], order: 'décroissant' }
  ];

  // Exercices d'encadrement (comme exercices 18-19)
  const encadrerExercises = [
    { number: 540, before: 539, after: 541 },
    { number: 708, before: 707, after: 709 },
    { number: 856, before: 855, after: 857 },
    { number: 900, before: 899, after: 901 },
    { number: 601, before: 600, after: 602 },
    { number: 784, before: 783, after: 785 },
    { number: 370, before: 369, after: 371 },
    { number: 337, before: 336, after: 338 },
    { number: 307, before: 306, after: 308 },
    { number: 733, before: 732, after: 734 },
    { number: 401, before: 400, after: 402 },
    { number: 299, before: 298, after: 300 },
    { number: 500, before: 499, after: 501 },
    { number: 650, before: 649, after: 651 },
    { number: 199, before: 198, after: 200 },
    // 6 exercices supplémentaires
    { number: 425, before: 424, after: 426 },
    { number: 687, before: 686, after: 688 },
    { number: 150, before: 149, after: 151 },
    { number: 764, before: 763, after: 765 },
    { number: 829, before: 828, after: 830 },
    { number: 491, before: 490, after: 492 }
  ];

  // Exercices de suites (comme exercices 20-21)
  const suitesExercises = [
    { sequence: [92, 94, 96, '?', '?'], step: 2, answers: ['98', '100'] },
    { sequence: [175, 180, 185, '?', '?'], step: 5, answers: ['190', '195'] },
    { sequence: [133, 143, 153, '?', '?'], step: 10, answers: ['163', '173'] },
    { sequence: [157, 155, 153, '?', '?'], step: -2, answers: ['151', '149'] },
    { sequence: [85, 87, 89, '?', '?'], step: 2, answers: ['91', '93'] },
    { sequence: [112, 110, 108, '?', '?'], step: -2, answers: ['106', '104'] },
    { sequence: [73, 78, 83, '?', '?'], step: 5, answers: ['88', '93'] },
    { sequence: [160, 150, 140, '?', '?'], step: -10, answers: ['130', '120'] },
    { sequence: [234, 236, 238, '?', '?'], step: 2, answers: ['240', '242'] },
    { sequence: [350, 345, 340, '?', '?'], step: -5, answers: ['335', '330'] },
    { sequence: [125, 135, 145, '?', '?'], step: 10, answers: ['155', '165'] },
    { sequence: [198, 196, 194, '?', '?'], step: -2, answers: ['192', '190'] },
    { sequence: [465, 470, 475, '?', '?'], step: 5, answers: ['480', '485'] },
    { sequence: [670, 660, 650, '?', '?'], step: -10, answers: ['640', '630'] },
    { sequence: [147, 149, 151, '?', '?'], step: 2, answers: ['153', '155'] },
    // 6 exercices supplémentaires
    { sequence: [267, 269, 271, '?', '?'], step: 2, answers: ['273', '275'] },
    { sequence: [380, 385, 390, '?', '?'], step: 5, answers: ['395', '400'] },
    { sequence: [540, 530, 520, '?', '?'], step: -10, answers: ['510', '500'] },
    { sequence: [426, 424, 422, '?', '?'], step: -2, answers: ['420', '418'] },
    { sequence: [615, 620, 625, '?', '?'], step: 5, answers: ['630', '635'] },
    { sequence: [758, 748, 738, '?', '?'], step: -10, answers: ['728', '718'] }
  ];

    const getCurrentExercises = () => {
    switch (exerciseType) {
      case 'ranger': return rangerExercises;
      case 'encadrer': return encadrerExercises;
      case 'suites': return suitesExercises;
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

  const switchExerciseType = (type: 'ranger' | 'encadrer' | 'suites') => {
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

  const moveNumber = (fromIndex: number, toIndex: number) => {
    const newAnswers = [...userAnswers];
    const temp = newAnswers[fromIndex];
    newAnswers[fromIndex] = newAnswers[toIndex];
    newAnswers[toIndex] = temp;
    setUserAnswers(newAnswers);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/chapitre/ce1-nombres-jusqu-1000" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-4">
            <ArrowLeft className="w-4 h-4" />
            <span>Retour au chapitre</span>
          </Link>
          
          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              🔢 Ordonner les nombres
            </h1>
            <p className="text-lg text-gray-600">
              Apprends à comparer et ranger les nombres jusqu'à 1000 !
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
                  ? 'bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-lg' 
                  : 'text-gray-700 hover:bg-gradient-to-r hover:from-pink-100 hover:to-rose-100 hover:text-pink-800'
              }`}
            >
              📖 Cours
            </button>
            <button
              onClick={() => setShowExercises(true)}
              className={`px-8 py-4 rounded-xl font-bold transition-all transform hover:scale-105 shadow-md ml-2 ${
                showExercises 
                  ? 'bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-lg' 
                  : 'text-gray-700 hover:bg-gradient-to-r hover:from-rose-100 hover:to-pink-100 hover:text-rose-800'
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
                  <p className="text-red-700">567 &gt; 234</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-6 text-center">
                  <div className="text-6xl mb-3">🔵</div>
                  <h3 className="font-bold text-blue-800 mb-2">Plus petit que</h3>
                  <div className="text-4xl font-bold text-blue-600 mb-2">&lt;</div>
                  <p className="text-blue-700">234 &lt; 567</p>
                </div>
                <div className="bg-green-50 rounded-lg p-6 text-center">
                  <div className="text-6xl mb-3">🟢</div>
                  <h3 className="font-bold text-green-800 mb-2">Égal à</h3>
                  <div className="text-4xl font-bold text-green-600 mb-2">=</div>
                  <p className="text-green-700">345 = 345</p>
                </div>
              </div>
            </div>

            {/* Comment comparer */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
                🧠 Comment comparer deux nombres ?
              </h2>
              <div className="space-y-4">
                <div className="bg-yellow-50 rounded-lg p-4">
                  <h3 className="font-bold text-yellow-800 mb-2">1. Compare le nombre de chiffres</h3>
                  <p className="text-yellow-700">567 (3 chiffres) &gt; 89 (2 chiffres)</p>
                </div>
                <div className="bg-orange-50 rounded-lg p-4">
                  <h3 className="font-bold text-orange-800 mb-2">2. Compare les centaines</h3>
                  <p className="text-orange-700">567 vs 234 → 5 &gt; 2 donc 567 &gt; 234</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4">
                  <h3 className="font-bold text-purple-800 mb-2">3. Si égales, compare les dizaines</h3>
                  <p className="text-purple-700">567 vs 534 → 6 &gt; 3 donc 567 &gt; 534</p>
                </div>
                <div className="bg-indigo-50 rounded-lg p-4">
                  <h3 className="font-bold text-indigo-800 mb-2">4. Si égales, compare les unités</h3>
                  <p className="text-indigo-700">567 vs 562 → 7 &gt; 2 donc 567 &gt; 562</p>
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
                      <div className="font-bold text-gray-700">Avant : 567, 234, 789</div>
                      <div className="text-2xl">⬇️</div>
                      <div className="font-bold text-green-700">Après : 234, 567, 789</div>
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
                      <div className="font-bold text-gray-700">Avant : 234, 567, 789</div>
                      <div className="text-2xl">⬇️</div>
                      <div className="font-bold text-red-700">Après : 789, 567, 234</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Conseils */}
            <div className="bg-gradient-to-r from-pink-400 to-rose-400 rounded-xl p-6 text-white">
              <h3 className="text-xl font-bold mb-3">💡 Astuces pour bien ordonner</h3>
              <ul className="space-y-2">
                <li>• Regarde d'abord les centaines</li>
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
                  <div className="text-lg font-bold text-pink-600">
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
                </div>
              </div>
              
              {/* Barre de progression */}
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className={`h-3 rounded-full transition-all duration-500 ${
                    exerciseType === 'ranger' ? 'bg-blue-500' : 
                    exerciseType === 'encadrer' ? 'bg-green-500' : 'bg-red-500'
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
                          {num}
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
                          className="w-20 h-20 text-center text-lg font-bold border-2 border-gray-300 rounded-lg focus:border-rose-500 focus:outline-none bg-white text-gray-900 mb-2"
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
                      className="w-24 h-24 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none bg-white text-gray-900"
                    />
                    <div className="text-3xl font-bold text-gray-600">&lt;</div>
                    <div className="text-4xl font-bold text-red-600 bg-red-100 rounded-lg p-4">
                      {encadrerExercises[currentExercise].number}
                    </div>
                    <div className="text-3xl font-bold text-gray-600">&lt;</div>
                    <input
                      type="text"
                      value={userAnswers[1] || ''}
                      onChange={(e) => updateOrderAnswer(1, e.target.value)}
                      placeholder="?"
                      className="w-24 h-24 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none bg-white text-gray-900"
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
                      <div key={index} className={`w-24 h-24 rounded-lg flex items-center justify-center text-2xl font-bold ${
                        item === '?' 
                          ? 'bg-yellow-200 text-yellow-800' 
                          : 'bg-gray-200 text-gray-800'
                      }`}>
                        {item}
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
                        className="w-24 h-16 text-center text-xl font-bold border-2 border-gray-300 rounded-lg focus:border-yellow-500 focus:outline-none bg-white text-gray-900"
                      />
                    </div>
                    <div className="text-center">
                      <label className="block font-bold text-gray-700 mb-2">2ème nombre manquant :</label>
                      <input
                        type="text"
                        value={userAnswers[1] || ''}
                        onChange={(e) => updateOrderAnswer(1, e.target.value)}
                        placeholder="?"
                        className="w-24 h-16 text-center text-xl font-bold border-2 border-gray-300 rounded-lg focus:border-yellow-500 focus:outline-none bg-white text-gray-900"
                      />
                    </div>
                  </div>
                </>
              )}
              
              <div className="flex justify-center space-x-4 mb-6">
                <button
                  onClick={checkAnswer}
                  disabled={
                    (exerciseType === 'ranger' && userAnswers.length < 5) ||
                    (exerciseType === 'encadrer' && userAnswers.length < 2) ||
                    (exerciseType === 'suites' && userAnswers.length < 2)
                  }
                  className={`text-white px-8 py-4 rounded-xl font-bold transition-all transform hover:scale-105 shadow-lg disabled:opacity-50 ${
                    exerciseType === 'ranger' ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700' :
                    exerciseType === 'encadrer' ? 'bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700' :
                    'bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700'
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
                            `Pas tout à fait... La bonne réponse est : ${((getCurrentExercises()[currentExercise] as any).answer as number[]).join(', ')}`
                          }
                          {exerciseType === 'encadrer' && 
                            `Pas tout à fait... La bonne réponse est : ${(getCurrentExercises()[currentExercise] as any).before} < ${(getCurrentExercises()[currentExercise] as any).number} < ${(getCurrentExercises()[currentExercise] as any).after}`
                          }
                          {exerciseType === 'suites' && 
                            `Pas tout à fait... La bonne réponse est : ${((getCurrentExercises()[currentExercise] as any).answers as string[]).join(', ')}`
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
                    'bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700'
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
                'bg-gradient-to-r from-red-400 to-pink-400'
              }`}>
                <div className="text-4xl mb-3">🎉</div>
                <h3 className="text-2xl font-bold mb-2">Fantastique !</h3>
                <p className="text-lg">
                  {exerciseType === 'ranger' && 'Tu sais maintenant comparer tous les nombres jusqu\'à 1000 !'}
                  {exerciseType === 'encadrer' && 'Tu sais maintenant ordonner tous les nombres jusqu\'à 1000 !'}
                  {exerciseType === 'suites' && 'Tu sais maintenant trouver les nombres manquants !'}
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