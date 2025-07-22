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
  const [exerciseType, setExerciseType] = useState<'ranger' | 'encadrer' | 'suites' | 'comparer'>('ranger');
  const [answeredCorrectly, setAnsweredCorrectly] = useState<Set<string>>(new Set());
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [finalScore, setFinalScore] = useState(0);

  // Sauvegarder les progrès dans localStorage
  const saveProgress = (score: number, maxScore: number) => {
    const progress = {
      sectionId: 'ordonner',
      completed: true,
      score: score,
      maxScore: maxScore,
      completedAt: new Date().toISOString(),
      attempts: 1
    };

    // Charger les progrès existants
    const existingProgress = localStorage.getItem('ce1-nombres-progress');
    let allProgress = [];
    
    if (existingProgress) {
      allProgress = JSON.parse(existingProgress);
      // Chercher si cette section existe déjà
      const existingIndex = allProgress.findIndex((p: any) => p.sectionId === 'ordonner');
      
      if (existingIndex >= 0) {
        // Mettre à jour seulement si le score est meilleur
        if (score > allProgress[existingIndex].score) {
          allProgress[existingIndex] = {
            ...progress,
            attempts: allProgress[existingIndex].attempts + 1
          };
        } else {
          // Juste incrémenter les tentatives
          allProgress[existingIndex].attempts += 1;
        }
      } else {
        allProgress.push(progress);
      }
    } else {
      allProgress = [progress];
    }

    localStorage.setItem('ce1-nombres-progress', JSON.stringify(allProgress));
  };

  // Exercices de rangement CE1 (nombres jusqu'à 1000) - nombres complexes
  const rangerExercises = [
    { numbers: [807, 509, 853, 187, 583], answer: [187, 509, 583, 807, 853], order: 'croissant' },
    { numbers: [749, 379, 479, 739, 439], answer: [749, 739, 479, 439, 379], order: 'décroissant' },
    { numbers: [919, 179, 719, 197, 793], answer: [179, 197, 719, 793, 919], order: 'croissant' },
    { numbers: [487, 847, 409, 89, 809], answer: [847, 809, 487, 409, 89], order: 'décroissant' },
    { numbers: [237, 569, 127, 459, 791], answer: [127, 237, 459, 569, 791], order: 'croissant' },
    { numbers: [679, 349, 793, 237, 569], answer: [793, 679, 569, 349, 237], order: 'décroissant' },
    { numbers: [159, 349, 237, 127, 459], answer: [127, 159, 237, 349, 459], order: 'croissant' },
    { numbers: [793, 569, 237, 459, 127], answer: [793, 569, 459, 237, 127], order: 'décroissant' },
    { numbers: [329, 537, 259, 527, 239], answer: [239, 259, 329, 527, 537], order: 'croissant' },
    { numbers: [469, 769, 649, 479, 749], answer: [769, 749, 649, 479, 469], order: 'décroissant' },
    { numbers: [149, 547, 159, 457, 519], answer: [149, 159, 457, 519, 547], order: 'croissant' },
    { numbers: [687, 829, 269, 629, 867], answer: [867, 829, 687, 629, 269], order: 'décroissant' },
    { numbers: [399, 739, 379, 793, 937], answer: [379, 399, 739, 793, 937], order: 'croissant' },
    { numbers: [149, 847, 419, 189, 819], answer: [847, 819, 419, 189, 149], order: 'décroissant' },
    { numbers: [259, 657, 529, 269, 629], answer: [259, 269, 529, 629, 657], order: 'croissant' },
    { numbers: [419, 217, 129, 427, 247], answer: [129, 217, 247, 419, 427], order: 'croissant' },
    { numbers: [967, 797, 679, 697, 979], answer: [979, 967, 797, 697, 679], order: 'décroissant' },
    { numbers: [587, 359, 837, 389, 857], answer: [359, 389, 587, 837, 857], order: 'croissant' },
    { numbers: [729, 927, 279, 797, 299], answer: [927, 797, 729, 299, 279], order: 'décroissant' },
    { numbers: [167, 467, 149, 619, 647], answer: [149, 167, 467, 619, 647], order: 'croissant' },
    { numbers: [839, 399, 897, 389, 939], answer: [939, 897, 839, 399, 389], order: 'décroissant' }
  ];



  // Exercices de suites CE1 (nombres jusqu'à 1000) - nombres complexes
  const suitesExercises = [
    { sequence: [97, 99, 101, '?', '?'], step: 2, answers: ['103', '105'] },
    { sequence: [179, 184, 189, '?', '?'], step: 5, answers: ['194', '199'] },
    { sequence: [139, 149, 159, '?', '?'], step: 10, answers: ['169', '179'] },
    { sequence: [159, 157, 155, '?', '?'], step: -2, answers: ['153', '151'] },
    { sequence: [89, 91, 93, '?', '?'], step: 2, answers: ['95', '97'] },
    { sequence: [119, 117, 115, '?', '?'], step: -2, answers: ['113', '111'] },
    { sequence: [79, 84, 89, '?', '?'], step: 5, answers: ['94', '99'] },
    { sequence: [169, 159, 149, '?', '?'], step: -10, answers: ['139', '129'] },
    { sequence: [239, 241, 243, '?', '?'], step: 2, answers: ['245', '247'] },
    { sequence: [359, 354, 349, '?', '?'], step: -5, answers: ['344', '339'] },
    { sequence: [129, 139, 149, '?', '?'], step: 10, answers: ['159', '169'] },
    { sequence: [197, 195, 193, '?', '?'], step: -2, answers: ['191', '189'] },
    { sequence: [469, 474, 479, '?', '?'], step: 5, answers: ['484', '489'] },
    { sequence: [679, 669, 659, '?', '?'], step: -10, answers: ['649', '639'] },
    { sequence: [149, 151, 153, '?', '?'], step: 2, answers: ['155', '157'] },
    { sequence: [269, 271, 273, '?', '?'], step: 2, answers: ['275', '277'] },
    { sequence: [389, 394, 399, '?', '?'], step: 5, answers: ['404', '409'] },
    { sequence: [549, 539, 529, '?', '?'], step: -10, answers: ['519', '509'] },
    { sequence: [429, 427, 425, '?', '?'], step: -2, answers: ['423', '421'] },
    { sequence: [619, 624, 629, '?', '?'], step: 5, answers: ['634', '639'] },
    { sequence: [759, 749, 739, '?', '?'], step: -10, answers: ['729', '719'] }
  ];

  // Exercices de comparaison CE1 (nombres jusqu'à 1000) - nombres complexes
  const comparerExercises = [
    { number1: 459, number2: 349, answer: '>', explanation: '459 > 349' },
    { number1: 129, number2: 239, answer: '<', explanation: '129 < 239' },
    { number1: 793, number2: 793, answer: '=', explanation: '793 = 793' },
    { number1: 569, number2: 459, answer: '>', explanation: '569 > 459' },
    { number1: 239, number2: 349, answer: '<', explanation: '239 < 349' },
    { number1: 507, number2: 507, answer: '=', explanation: '507 = 507' },
    { number1: 679, number2: 237, answer: '>', explanation: '679 > 237' },
    { number1: 149, number2: 459, answer: '<', explanation: '149 < 459' },
    { number1: 327, number2: 327, answer: '=', explanation: '327 = 327' },
    { number1: 897, number2: 237, answer: '>', explanation: '897 > 237' },
    { number1: 237, number2: 569, answer: '<', explanation: '237 < 569' },
    { number1: 459, number2: 459, answer: '=', explanation: '459 = 459' },
    { number1: 729, number2: 349, answer: '>', explanation: '729 > 349' },
    { number1: 159, number2: 237, answer: '<', explanation: '159 < 237' },
    { number1: 679, number2: 679, answer: '=', explanation: '679 = 679' },
    { number1: 849, number2: 237, answer: '>', explanation: '849 > 237' },
    { number1: 237, number2: 793, answer: '<', explanation: '237 < 793' },
    { number1: 569, number2: 569, answer: '=', explanation: '569 = 569' },
    { number1: 917, number2: 459, answer: '>', explanation: '917 > 459' },
    { number1: 129, number2: 459, answer: '<', explanation: '129 < 459' }
  ];

  // Exercices d'encadrement par unités, dizaines, centaines CE1 (20 exercices) - nombres complexes
  const encadrerExercises = [
    { number: 459, type: 'unité', before: 458, after: 460, explanation: '458 < 459 < 460' },
    { number: 237, type: 'unité', before: 236, after: 238, explanation: '236 < 237 < 238' },
    { number: 569, type: 'unité', before: 568, after: 570, explanation: '568 < 569 < 570' },
    { number: 127, type: 'unité', before: 126, after: 128, explanation: '126 < 127 < 128' },
    { number: 793, type: 'unité', before: 792, after: 794, explanation: '792 < 793 < 794' },
    { number: 349, type: 'unité', before: 348, after: 350, explanation: '348 < 349 < 350' },
    { number: 679, type: 'unité', before: 678, after: 680, explanation: '678 < 679 < 680' },
    { number: 459, type: 'dizaine', before: 450, after: 460, explanation: '450 < 459 < 460' },
    { number: 237, type: 'dizaine', before: 230, after: 240, explanation: '230 < 237 < 240' },
    { number: 793, type: 'dizaine', before: 790, after: 800, explanation: '790 < 793 < 800' },
    { number: 569, type: 'dizaine', before: 560, after: 570, explanation: '560 < 569 < 570' },
    { number: 127, type: 'dizaine', before: 120, after: 130, explanation: '120 < 127 < 130' },
    { number: 849, type: 'dizaine', before: 840, after: 850, explanation: '840 < 849 < 850' },
    { number: 327, type: 'dizaine', before: 320, after: 330, explanation: '320 < 327 < 330' },
    { number: 569, type: 'centaine', before: 500, after: 600, explanation: '500 < 569 < 600' },
    { number: 127, type: 'centaine', before: 100, after: 200, explanation: '100 < 127 < 200' },
    { number: 349, type: 'centaine', before: 300, after: 400, explanation: '300 < 349 < 400' },
    { number: 793, type: 'centaine', before: 700, after: 800, explanation: '700 < 793 < 800' },
    { number: 237, type: 'centaine', before: 200, after: 300, explanation: '200 < 237 < 300' },
    { number: 459, type: 'centaine', before: 400, after: 500, explanation: '400 < 459 < 500' }
  ];

    const getCurrentExercises = () => {
    switch (exerciseType) {
      case 'ranger': return rangerExercises;
      case 'encadrer': return encadrerExercises;
      case 'suites': return suitesExercises;
      case 'comparer': return comparerExercises;
      default: return rangerExercises;
    }
  };

  const handleNext = () => {
    // Si aucune réponse vérifiée encore, on vérifie
    if (isCorrect === null) {
      const exercises = getCurrentExercises();
      let correct = false;

      if (exerciseType === 'ranger') {
        const correctOrder = ((exercises[currentExercise] as any).answer as number[]).map((n: number) => n.toString());
        correct = JSON.stringify(userAnswers) === JSON.stringify(correctOrder);
      } else if (exerciseType === 'encadrer') {
        const exercise = exercises[currentExercise] as any;
        correct = userAnswers[0] === exercise.before.toString() && userAnswers[1] === exercise.after.toString();
      } else if (exerciseType === 'suites') {
        const exercise = exercises[currentExercise] as any;
        correct = userAnswers[0] === exercise.answers[0] && userAnswers[1] === exercise.answers[1];
      } else if (exerciseType === 'comparer') {
        const exercise = exercises[currentExercise] as any;
        correct = userAnswers[0] === exercise.answer;
      }

      setIsCorrect(correct);
      
      const exerciseKey = `${exerciseType}-${currentExercise}`;
      
      if (correct && !answeredCorrectly.has(exerciseKey)) {
        setScore(prevScore => prevScore + 1);
        setAnsweredCorrectly(prev => {
          const newSet = new Set(prev);
          newSet.add(exerciseKey);
          return newSet;
        });
      }

      // Si bonne réponse → passage automatique après 1.5s
      if (correct) {
        setTimeout(() => {
          const exercises = getCurrentExercises();
          if (currentExercise + 1 < exercises.length) {
            setCurrentExercise(Math.min(currentExercise + 1, exercises.length - 1));
            setUserAnswer('');
            setUserAnswers([]);
            setIsCorrect(null);
                } else {
        // Dernier exercice terminé, afficher la modale
        const finalScoreValue = score + (!answeredCorrectly.has(`${exerciseType}-${currentExercise}`) ? 1 : 0);
        setFinalScore(finalScoreValue);
        setShowCompletionModal(true);
        
        // Sauvegarder les progrès
        const maxScore = getCurrentExercises().length;
        saveProgress(finalScoreValue, maxScore);
      }
        }, 1500);
      }
      // Si mauvaise réponse, on affiche la correction et on attend le clic suivant
    } else {
      // Réponse déjà vérifiée, on passe au suivant
      const exercises = getCurrentExercises();
      if (currentExercise + 1 < exercises.length) {
        setCurrentExercise(Math.min(currentExercise + 1, exercises.length - 1));
        setUserAnswer('');
        setUserAnswers([]);
        setIsCorrect(null);
      } else {
        // Dernier exercice, afficher la modale
        setFinalScore(score);
        setShowCompletionModal(true);
        
        // Sauvegarder les progrès
        const maxScore = getCurrentExercises().length;
        saveProgress(score, maxScore);
      }
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
    setAnsweredCorrectly(new Set());
    setShowCompletionModal(false);
    setFinalScore(0);
  };

  const switchExerciseType = (type: 'ranger' | 'encadrer' | 'suites' | 'comparer') => {
    setExerciseType(type);
    setCurrentExercise(0);
    setUserAnswer('');
    setUserAnswers([]);
    setIsCorrect(null);
    setScore(0); // Remettre le score à zéro quand on change de type d'exercice
    setAnsweredCorrectly(new Set());
    setShowCompletionModal(false);
    setFinalScore(0);
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
      <div className="max-w-6xl mx-auto px-4 py-4 md:py-8">
        {/* Header */}
        <div className="mb-4 md:mb-8">
          <Link href="/chapitre/ce1-nombres-jusqu-1000" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-2 md:mb-4">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm md:text-base">Retour au chapitre</span>
          </Link>
          
          <div className="bg-white rounded-xl p-4 md:p-6 shadow-lg text-center">
            <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-2 md:mb-4">
              🔢 Ordonner les nombres
            </h1>
            <p className="text-sm md:text-lg text-gray-600">
              Apprends à comparer et ranger les nombres jusqu'à 1000 !
            </p>
          </div>
        </div>

        {/* Navigation entre cours et exercices */}
        <div className="flex justify-center mb-4 md:mb-8">
          <div className="bg-white rounded-xl p-1 md:p-2 shadow-lg border-2 border-gray-200">
            <button
              onClick={() => setShowExercises(false)}
              className={`px-4 md:px-8 py-2 md:py-4 rounded-xl font-bold transition-all transform hover:scale-105 shadow-md text-sm md:text-base ${
                !showExercises 
                  ? 'bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-lg' 
                  : 'text-gray-700 hover:bg-gradient-to-r hover:from-pink-100 hover:to-rose-100 hover:text-pink-800'
              }`}
            >
              📖 Cours
            </button>
            <button
              onClick={() => setShowExercises(true)}
              className={`px-4 md:px-8 py-2 md:py-4 rounded-xl font-bold transition-all transform hover:scale-105 shadow-md ml-1 md:ml-2 text-sm md:text-base ${
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
          <div className="space-y-4 md:space-y-8">
            {/* Header exercices */}
            <div className="bg-white rounded-xl p-4 md:p-6 shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                  ✏️ Exercice {currentExercise + 1} sur {getCurrentExercises().length}
                </h2>
                <button
                  onClick={resetAll}
                  className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white px-3 md:px-4 py-2 rounded-xl font-bold transition-all transform hover:scale-105 shadow-lg text-sm md:text-base"
                >
                  <RotateCcw className="inline w-3 md:w-4 h-3 md:h-4 mr-1 md:mr-2" />
                  Recommencer
                </button>
              </div>
              
              {/* Sélecteur type d'exercice */}
              <div className="flex justify-center mb-3 md:mb-4">
                <div className="bg-gray-50 rounded-xl p-2 md:p-3 shadow-lg border-2 border-gray-200">
                  <div className="grid grid-cols-2 gap-2">
                    {/* Première ligne */}
                    <button
                      onClick={() => switchExerciseType('ranger')}
                      className={`px-4 md:px-6 py-2 md:py-3 rounded-xl font-bold transition-all transform hover:scale-105 shadow-md text-sm md:text-base ${
                        exerciseType === 'ranger' 
                          ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-xl border-2 border-blue-400 scale-105' 
                          : 'bg-gradient-to-r from-blue-200 to-purple-200 text-blue-800 hover:from-blue-300 hover:to-purple-300 hover:text-blue-900 border-2 border-blue-300'
                      }`}
                    >
                      📊 Ranger
                    </button>
                    <button
                      onClick={() => switchExerciseType('encadrer')}
                      className={`px-4 md:px-6 py-2 md:py-3 rounded-xl font-bold transition-all transform hover:scale-105 shadow-md text-sm md:text-base ${
                        exerciseType === 'encadrer' 
                          ? 'bg-gradient-to-r from-green-500 to-teal-600 text-white shadow-xl border-2 border-green-400 scale-105' 
                          : 'bg-gradient-to-r from-green-200 to-teal-200 text-green-800 hover:from-green-300 hover:to-teal-300 hover:text-green-900 border-2 border-green-300'
                      }`}
                    >
                      🎯 Encadrer
                    </button>
                    {/* Deuxième ligne */}
                    <button
                      onClick={() => switchExerciseType('suites')}
                      className={`px-4 md:px-6 py-2 md:py-3 rounded-xl font-bold transition-all transform hover:scale-105 shadow-md text-sm md:text-base ${
                        exerciseType === 'suites' 
                          ? 'bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-xl border-2 border-red-400 scale-105' 
                          : 'bg-gradient-to-r from-red-200 to-pink-200 text-red-800 hover:from-red-300 hover:to-pink-300 hover:text-red-900 border-2 border-red-300'
                      }`}
                    >
                      🔢 Suites
                    </button>
                    <button
                      onClick={() => switchExerciseType('comparer')}
                      className={`px-4 md:px-6 py-2 md:py-3 rounded-xl font-bold transition-all transform hover:scale-105 shadow-md text-sm md:text-base ${
                        exerciseType === 'comparer' 
                          ? 'bg-gradient-to-r from-yellow-500 to-orange-600 text-white shadow-xl border-2 border-yellow-400 scale-105' 
                          : 'bg-gradient-to-r from-yellow-200 to-orange-200 text-yellow-800 hover:from-yellow-300 hover:to-orange-300 hover:text-yellow-900 border-2 border-yellow-300'
                      }`}
                    >
                      🔀 Comparer
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Barre de progression */}
              <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
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
              
              {/* Score sous la barre */}
              <div className="text-center">
                <div className="text-lg font-bold text-pink-600">
                  Score : {score}/{getCurrentExercises().length}
                </div>
              </div>
            </div>

            {/* Question */}
            <div className="bg-white rounded-xl p-2 md:p-8 shadow-lg text-center">
              {exerciseType === 'ranger' && (
                <>
                  <h3 className="text-base md:text-xl font-bold mb-2 md:mb-6 text-gray-900">
                    📊 Range ces nombres dans l'ordre {rangerExercises[currentExercise].order}
                  </h3>
                  
                  <div className="mb-2 md:mb-8">
                    <h4 className="font-bold text-gray-700 mb-1 md:mb-4 text-xs md:text-base">Nombres à ranger :</h4>
                    <div className="flex justify-center space-x-0.5 md:space-x-2 mb-2 md:mb-6 flex-wrap">
                      {rangerExercises[currentExercise].numbers.map((num, index) => (
                        <div key={index} className="text-sm md:text-2xl font-bold text-purple-600 bg-purple-100 rounded-lg px-1 py-0.5 md:p-3 mb-1">
                          {num}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mb-2 md:mb-8">
                    <h4 className="font-bold text-gray-700 mb-1 md:mb-4 text-xs md:text-base">Ta réponse :</h4>
                    <div className="flex justify-center space-x-0.5 md:space-x-2 flex-wrap">
                      {[0, 1, 2, 3, 4].map((index) => (
                        <input
                          key={index}
                          type="text"
                          value={userAnswers[index] || ''}
                          onChange={(e) => updateOrderAnswer(index, e.target.value)}
                          placeholder="?"
                          className="w-10 md:w-20 h-10 md:h-20 text-center text-xs md:text-lg font-bold border-2 border-gray-300 rounded-lg focus:border-rose-500 focus:outline-none bg-white text-gray-900 mb-1"
                        />
                      ))}
                    </div>
                  </div>
                </>
              )}

              {exerciseType === 'encadrer' && (
                <>
                  <h3 className="text-base md:text-xl font-bold mb-2 md:mb-6 text-gray-900">
                    🎯 Encadre ce nombre à l'unité
                  </h3>
                  
                  <div className="flex justify-center items-center space-x-0.5 md:space-x-4 mb-2 md:mb-8">
                    <input
                      type="text"
                      value={userAnswers[0] || ''}
                      onChange={(e) => updateOrderAnswer(0, e.target.value)}
                      placeholder="?"
                      className="w-10 md:w-24 h-10 md:h-24 text-center text-xs md:text-2xl font-bold border-2 border-gray-300 rounded-lg focus:border-cyan-500 focus:outline-none bg-white text-gray-900"
                    />
                    <div className="text-base md:text-3xl font-bold text-gray-600">&lt;</div>
                    <div className="text-sm md:text-4xl font-bold text-cyan-600 bg-cyan-100 rounded-lg px-1 py-0.5 md:p-4">
                      {encadrerExercises[currentExercise].number}
                    </div>
                    <div className="text-base md:text-3xl font-bold text-gray-600">&lt;</div>
                    <input
                      type="text"
                      value={userAnswers[1] || ''}
                      onChange={(e) => updateOrderAnswer(1, e.target.value)}
                      placeholder="?"
                      className="w-10 md:w-24 h-10 md:h-24 text-center text-xs md:text-2xl font-bold border-2 border-gray-300 rounded-lg focus:border-cyan-500 focus:outline-none bg-white text-gray-900"
                    />
                  </div>
                  
                  <div className="mb-2 md:mb-8">
                    <p className="text-gray-500 text-xs md:text-sm">
                      {encadrerExercises[currentExercise].type === 'unité' 
                        ? 'Ex: 455 < 456 < 457' 
                        : encadrerExercises[currentExercise].type === 'dizaine' 
                        ? 'Ex: 450 < 456 < 460' 
                        : 'Ex: 400 < 456 < 500'}
                    </p>
                  </div>
                </>
              )}

              {exerciseType === 'suites' && (
                <>
                  <h3 className="text-base md:text-xl font-bold mb-2 md:mb-6 text-gray-900">
                    🔢 Trouve les nombres manquants
                  </h3>
                  
                  <div className="flex justify-center space-x-0.5 md:space-x-4 mb-2 md:mb-8 overflow-x-auto">
                    {suitesExercises[currentExercise].sequence.map((item, index) => (
                      <div key={index} className={`w-12 md:w-24 h-12 md:h-24 rounded-lg flex items-center justify-center text-xs md:text-2xl font-bold ${
                        item === '?' 
                          ? 'bg-yellow-200 text-yellow-800' 
                          : 'bg-gray-200 text-gray-800'
                      }`}>
                        {item}
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex justify-center space-x-1 md:space-x-4 mb-2 md:mb-8">
                    <div className="text-center">
                      <label className="block font-bold text-gray-700 mb-0.5 md:mb-2 text-xs md:text-sm">1er :</label>
                      <input
                        type="text"
                        value={userAnswers[0] || ''}
                        onChange={(e) => updateOrderAnswer(0, e.target.value)}
                        placeholder="?"
                        className="w-12 md:w-24 h-8 md:h-16 text-center text-xs md:text-xl font-bold border-2 border-gray-300 rounded-lg focus:border-yellow-500 focus:outline-none bg-white text-gray-900"
                      />
                    </div>
                    <div className="text-center">
                      <label className="block font-bold text-gray-700 mb-0.5 md:mb-2 text-xs md:text-sm">2ème :</label>
                      <input
                        type="text"
                        value={userAnswers[1] || ''}
                        onChange={(e) => updateOrderAnswer(1, e.target.value)}
                        placeholder="?"
                        className="w-12 md:w-24 h-8 md:h-16 text-center text-xs md:text-xl font-bold border-2 border-gray-300 rounded-lg focus:border-yellow-500 focus:outline-none bg-white text-gray-900"
                      />
                    </div>
                  </div>
                </>
              )}

              {exerciseType === 'comparer' && (
                <>
                  <h3 className="text-base md:text-xl font-bold mb-2 md:mb-6 text-gray-900">
                    🔀 Compare ces nombres
                  </h3>
                  
                  <div className="flex justify-center items-center space-x-1 md:space-x-4 mb-2 md:mb-8">
                    <div className="text-sm md:text-4xl font-bold text-blue-600 bg-blue-100 rounded-lg px-1 py-0.5 md:p-4">
                      {comparerExercises[currentExercise].number1}
                    </div>
                    <input
                      type="text"
                      value={userAnswers[0] || ''}
                      onChange={(e) => updateOrderAnswer(0, e.target.value)}
                      placeholder="?"
                      className="w-10 md:w-24 h-10 md:h-24 text-center text-lg md:text-4xl font-bold border-2 border-gray-300 rounded-lg focus:border-yellow-500 focus:outline-none bg-white text-gray-900"
                    />
                    <div className="text-sm md:text-4xl font-bold text-green-600 bg-green-100 rounded-lg px-1 py-0.5 md:p-4">
                      {comparerExercises[currentExercise].number2}
                    </div>
                  </div>
                  
                  <div className="mb-2 md:mb-8">
                    <p className="text-gray-600 text-xs md:text-lg mb-1 md:mb-4">Clique sur le bon signe :</p>
                    <div className="flex justify-center space-x-1 md:space-x-4">
                      <button
                        onClick={() => updateOrderAnswer(0, '>')}
                        className="px-2 md:px-6 py-1 md:py-3 bg-red-200 hover:bg-red-300 text-red-800 font-bold rounded-lg text-lg md:text-2xl transition-all"
                      >
                        &gt;
                      </button>
                      <button
                        onClick={() => updateOrderAnswer(0, '<')}
                        className="px-2 md:px-6 py-1 md:py-3 bg-blue-200 hover:bg-blue-300 text-blue-800 font-bold rounded-lg text-lg md:text-2xl transition-all"
                      >
                        &lt;
                      </button>
                      <button
                        onClick={() => updateOrderAnswer(0, '=')}
                        className="px-2 md:px-6 py-1 md:py-3 bg-green-200 hover:bg-green-300 text-green-800 font-bold rounded-lg text-lg md:text-2xl transition-all"
                      >
                        =
                      </button>
                    </div>
                  </div>
                </>
              )}


              
              <div className="flex justify-center space-x-4 mb-2 md:mb-6">
                <button
                  onClick={resetExercise}
                  className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white px-3 md:px-8 py-1 md:py-4 rounded-xl font-bold transition-all transform hover:scale-105 shadow-lg text-xs md:text-base"
                >
                  🔄 Effacer
                </button>
              </div>
              
              {/* Résultat */}
              {isCorrect !== null && (
                <div className={`p-2 md:p-6 rounded-xl mb-2 md:mb-6 shadow-lg ${
                  isCorrect ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-2 border-green-300' : 'bg-gradient-to-r from-red-100 to-rose-100 text-red-800 border-2 border-red-300'
                }`}>
                  <div className="flex items-center justify-center space-x-1 md:space-x-2">
                    {isCorrect ? (
                      <>
                        <CheckCircle className="w-4 md:w-8 h-4 md:h-8" />
                        <span className="font-bold text-xs md:text-xl">🎉 Excellent ! 🎉</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-4 md:w-8 h-4 md:h-8" />
                        <span className="font-bold text-xs md:text-xl">
                          {exerciseType === 'ranger' && 
                            `Réponse : ${((getCurrentExercises()[currentExercise] as any).answer as number[]).join(', ')}`
                          }
                          {exerciseType === 'encadrer' && 
                            `Réponse : ${(getCurrentExercises()[currentExercise] as any).before} < ${(getCurrentExercises()[currentExercise] as any).number} < ${(getCurrentExercises()[currentExercise] as any).after}`
                          }
                          {exerciseType === 'suites' && 
                            `Réponse : ${((getCurrentExercises()[currentExercise] as any).answers as string[]).join(', ')}`
                          }
                          {exerciseType === 'comparer' && 
                            `Réponse : ${((getCurrentExercises()[currentExercise] as any).explanation as string)}`
                          }
                        </span>
                      </>
                    )}
                  </div>
                </div>
              )}
              
              {/* Navigation */}
              <div className="flex justify-center space-x-1 md:space-x-4">
                <button
                  onClick={() => setCurrentExercise(Math.max(0, currentExercise - 1))}
                  disabled={currentExercise === 0}
                  className="bg-gradient-to-r from-indigo-400 to-purple-500 hover:from-indigo-500 hover:to-purple-600 text-white px-3 md:px-6 py-1 md:py-3 rounded-xl font-bold transition-all transform hover:scale-105 shadow-lg disabled:opacity-50 text-xs md:text-base"
                >
                  ← Précédent
                </button>
                <button
                  onClick={handleNext}
                  disabled={
                    isCorrect === null && (
                      (exerciseType === 'ranger' && userAnswers.length < 5) ||
                      (exerciseType === 'encadrer' && userAnswers.length < 2) ||
                      (exerciseType === 'suites' && userAnswers.length < 2) ||
                      (exerciseType === 'comparer' && userAnswers.length < 1)
                    )
                  }
                  className={`text-white px-3 md:px-6 py-1 md:py-3 rounded-xl font-bold transition-all transform hover:scale-105 shadow-lg disabled:opacity-50 text-xs md:text-base ${
                    exerciseType === 'ranger' ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700' :
                    exerciseType === 'encadrer' ? 'bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700' :
                    exerciseType === 'suites' ? 'bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700' :
                    exerciseType === 'comparer' ? 'bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700' :
                    'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700'
                  }`}
                >
                  {isCorrect === null ? 'Vérifier' : 'Suivant →'}
                </button>
              </div>
            </div>


          </div>
        )}

        {/* Modale de fin d'exercices */}
        {showCompletionModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-2xl transform transition-all">
              {(() => {
                const totalExercises = getCurrentExercises().length;
                const percentage = Math.round((finalScore / totalExercises) * 100);
                const getMessage = () => {
                  const activities = {
                    'ranger': 'le rangement',
                    'encadrer': 'l\'encadrement',
                    'suites': 'les suites numériques',
                    'comparer': 'la comparaison'
                  };
                  const activity = activities[exerciseType];
                  
                  if (percentage >= 90) return { title: "🎉 Excellent !", message: `Tu maîtrises parfaitement ${activity} des nombres jusqu'à 1000 !`, emoji: "🎉" };
                  if (percentage >= 70) return { title: "👏 Bien joué !", message: `Tu sais bien faire ${activity} ! Continue comme ça !`, emoji: "👏" };
                  if (percentage >= 50) return { title: "👍 C'est un bon début !", message: "Tu progresses bien. Entraîne-toi encore un peu !", emoji: "😊" };
                  return { title: "💪 Continue à t'entraîner !", message: `Recommence les exercices pour mieux maîtriser ${activity}.`, emoji: "📚" };
                };
                const result = getMessage();
                return (
                  <>
                    <div className="text-6xl mb-4">{result.emoji}</div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">{result.title}</h3>
                    <p className="text-lg text-gray-700 mb-6">{result.message}</p>
                    <div className="bg-gray-100 rounded-lg p-4 mb-6">
                      <p className="text-xl font-bold text-gray-900">
                        Score final : {finalScore}/{totalExercises} ({percentage}%)
                      </p>
                    </div>
                    <div className="flex space-x-3">
                      <button
                        onClick={resetAll}
                        className="flex-1 bg-pink-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-pink-600 transition-colors"
                      >
                        Recommencer
                      </button>
                      <button
                        onClick={() => setShowCompletionModal(false)}
                        className="flex-1 bg-gray-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-gray-600 transition-colors"
                      >
                        Fermer
                      </button>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 