'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, XCircle, RotateCcw, Shuffle } from 'lucide-react';
import { VoiceInput } from '@/components/VoiceInput';

export default function DecompositionNombresCE1Page() {
  const [selectedNumber, setSelectedNumber] = useState('234');
  const [currentExercise, setCurrentExercise] = useState(0);
  const [userAnswers, setUserAnswers] = useState({ centaines: '', dizaines: '', unites: '' });
  const [userNumber, setUserNumber] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showExercises, setShowExercises] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredCorrectly, setAnsweredCorrectly] = useState<Set<string>>(new Set());
  const [isAnimating, setIsAnimating] = useState(false);
  const [exerciseType, setExerciseType] = useState<'decompose' | 'compose'>('decompose');
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [finalScore, setFinalScore] = useState(0);

  // Sauvegarder les progrès dans localStorage
  const saveProgress = (score: number, maxScore: number) => {
    const progress = {
      sectionId: 'decomposition',
      completed: true,
      score: score,
      maxScore: maxScore,
      completedAt: new Date().toISOString(),
      attempts: 1
    };

    const existingProgress = localStorage.getItem('ce1-nombres-progress');
    let allProgress = [];
    
    if (existingProgress) {
      allProgress = JSON.parse(existingProgress);
      const existingIndex = allProgress.findIndex((p: any) => p.sectionId === 'decomposition');
      
      if (existingIndex >= 0) {
        if (score > allProgress[existingIndex].score) {
          allProgress[existingIndex] = {
            ...progress,
            attempts: allProgress[existingIndex].attempts + 1
          };
        } else {
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

  const examples = [
    { number: '234', centaines: '2', dizaines: '3', unites: '4' },
    { number: '49', centaines: '0', dizaines: '4', unites: '9' },
    { number: '748', centaines: '7', dizaines: '4', unites: '8' }
  ];

  const exercises = [
    { number: '145', centaines: '1', dizaines: '4', unites: '5' },
    { number: '267', centaines: '2', dizaines: '6', unites: '7' },
    { number: '389', centaines: '3', dizaines: '8', unites: '9' },
    { number: '512', centaines: '5', dizaines: '1', unites: '2' },
    { number: '634', centaines: '6', dizaines: '3', unites: '4' },
    { number: '758', centaines: '7', dizaines: '5', unites: '8' },
    { number: '823', centaines: '8', dizaines: '2', unites: '3' },
    { number: '946', centaines: '9', dizaines: '4', unites: '6' },
    { number: '207', centaines: '2', dizaines: '0', unites: '7' },
    { number: '350', centaines: '3', dizaines: '5', unites: '0' },
    { number: '400', centaines: '4', dizaines: '0', unites: '0' },
    { number: '501', centaines: '5', dizaines: '0', unites: '1' },
    { number: '610', centaines: '6', dizaines: '1', unites: '0' },
    { number: '720', centaines: '7', dizaines: '2', unites: '0' },
    { number: '880', centaines: '8', dizaines: '8', unites: '0' }
  ];

  const composeExercises = [
    { centaines: '1', dizaines: '3', unites: '2', number: '132' },
    { centaines: '2', dizaines: '4', unites: '5', number: '245' },
    { centaines: '3', dizaines: '6', unites: '7', number: '367' },
    { centaines: '4', dizaines: '1', unites: '9', number: '419' },
    { centaines: '5', dizaines: '8', unites: '3', number: '583' },
    { centaines: '6', dizaines: '2', unites: '6', number: '626' },
    { centaines: '7', dizaines: '4', unites: '1', number: '741' },
    { centaines: '8', dizaines: '5', unites: '7', number: '857' },
    { centaines: '9', dizaines: '0', unites: '4', number: '904' },
    { centaines: '1', dizaines: '7', unites: '0', number: '170' },
    { centaines: '2', dizaines: '0', unites: '8', number: '208' },
    { centaines: '3', dizaines: '9', unites: '0', number: '390' },
    { centaines: '4', dizaines: '0', unites: '5', number: '405' },
    { centaines: '5', dizaines: '0', unites: '0', number: '500' },
    { centaines: '6', dizaines: '7', unites: '0', number: '670' }
  ];

  const decomposeNumber = (num: string) => {
    if (num === '1000') return { centaines: '10', dizaines: '0', unites: '0' };
    const padded = num.padStart(3, '0');
    return {
      centaines: padded[0],
      dizaines: padded[1],
      unites: padded[2]
    };
  };

  const animateDecomposition = async () => {
    setIsAnimating(true);
    
    // Animation des chiffres avec leurs cases colorées correspondantes
    const digits = selectedNumber.split('');
    const decomposed = decomposeNumber(selectedNumber);
    
    // Définir les correspondances selon le nombre de chiffres
    const animations = [];
    
    if (digits.length >= 3) {
      // Pour les nombres à 3 chiffres (ou plus)
      animations.push({
        digitId: 'demo-digit-0',
        boxId: 'centaines-box',
        color: 'bg-red-300',
        label: 'centaines'
      });
      animations.push({
        digitId: 'demo-digit-1', 
        boxId: 'dizaines-box',
        color: 'bg-blue-300',
        label: 'dizaines'
      });
      animations.push({
        digitId: 'demo-digit-2',
        boxId: 'unites-box', 
        color: 'bg-green-300',
        label: 'unités'
      });
    } else if (digits.length === 2) {
      // Pour les nombres à 2 chiffres
      animations.push({
        digitId: 'demo-digit-0',
        boxId: 'dizaines-box',
        color: 'bg-blue-300', 
        label: 'dizaines'
      });
      animations.push({
        digitId: 'demo-digit-1',
        boxId: 'unites-box',
        color: 'bg-green-300',
        label: 'unités'
      });
    } else {
      // Pour les nombres à 1 chiffre
      animations.push({
        digitId: 'demo-digit-0',
        boxId: 'unites-box',
        color: 'bg-green-300',
        label: 'unités'
      });
    }
    
    // Exécuter les animations
    for (const animation of animations) {
      const digitElement = document.getElementById(animation.digitId);
      const boxElement = document.getElementById(animation.boxId);
      
      if (digitElement && boxElement) {
        // Animer le chiffre
        digitElement.classList.add('animate-pulse', 'scale-125', 'text-orange-600');
        
        // Animer la case colorée correspondante
        boxElement.classList.add('animate-pulse', 'scale-110', animation.color, 'shadow-2xl', 'border-2', 'border-orange-400');
        
        await new Promise(resolve => setTimeout(resolve, 1200));
        
        // Remettre les styles normaux
        digitElement.classList.remove('animate-pulse', 'scale-125', 'text-orange-600');
        boxElement.classList.remove('animate-pulse', 'scale-110', animation.color, 'shadow-2xl', 'border-2', 'border-orange-400');
        
        // Petit délai entre chaque animation
        await new Promise(resolve => setTimeout(resolve, 300));
      }
    }
    
    setIsAnimating(false);
  };

  const handleNext = () => {
    // Si aucune réponse vérifiée encore, on vérifie
    if (isCorrect === null) {
      let correct = false;
      
      if (exerciseType === 'decompose') {
        const correctResult = decomposeNumber(exercises[currentExercise].number);
        correct = 
          userAnswers.centaines === correctResult.centaines &&
          userAnswers.dizaines === correctResult.dizaines &&
          userAnswers.unites === correctResult.unites;
      } else {
        // compose exercise
        const correctNumber = composeExercises[currentExercise].number;
        correct = userNumber.trim() === correctNumber;
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
          const maxExercises = exerciseType === 'decompose' ? exercises.length : composeExercises.length;
          if (currentExercise + 1 < maxExercises) {
            setCurrentExercise(Math.min(currentExercise + 1, maxExercises - 1));
            setUserAnswers({ centaines: '', dizaines: '', unites: '' });
            setUserNumber('');
            setIsCorrect(null);
          } else {
            // Dernier exercice terminé, afficher la modale
            const finalScoreValue = score + (!answeredCorrectly.has(exerciseKey) ? 1 : 0);
            setFinalScore(finalScoreValue);
            setShowCompletionModal(true);
            
            // Sauvegarder les progrès
            const maxExercises = exerciseType === 'decompose' ? exercises.length : composeExercises.length;
            saveProgress(finalScoreValue, maxExercises);
          }
        }, 1500);
      }
      // Si mauvaise réponse, on affiche la correction et on attend le clic suivant
    } else {
      // Réponse déjà vérifiée, on passe au suivant
      const maxExercises = exerciseType === 'decompose' ? exercises.length : composeExercises.length;
      if (currentExercise + 1 < maxExercises) {
        setCurrentExercise(Math.min(currentExercise + 1, maxExercises - 1));
        setUserAnswers({ centaines: '', dizaines: '', unites: '' });
        setUserNumber('');
        setIsCorrect(null);
      } else {
        // Dernier exercice, afficher la modale
        setFinalScore(score);
        setShowCompletionModal(true);
        
        // Sauvegarder les progrès
        const maxExercises = exerciseType === 'decompose' ? exercises.length : composeExercises.length;
        saveProgress(score, maxExercises);
      }
    }
  };

  const nextExercise = () => {
    const maxExercises = exerciseType === 'decompose' ? exercises.length : composeExercises.length;
    if (currentExercise < maxExercises - 1) {
      setCurrentExercise(currentExercise + 1);
      setUserAnswers({ centaines: '', dizaines: '', unites: '' });
      setUserNumber('');
      setIsCorrect(null);
    }
  };

  const resetExercise = () => {
    setUserAnswers({ centaines: '', dizaines: '', unites: '' });
    setUserNumber('');
    setIsCorrect(null);
  };

  const resetAll = () => {
    setCurrentExercise(0);
    setUserAnswers({ centaines: '', dizaines: '', unites: '' });
    setUserNumber('');
    setIsCorrect(null);
    setScore(0);
    setAnsweredCorrectly(new Set());
    setShowCompletionModal(false);
    setFinalScore(0);
  };

  const switchExerciseType = (type: 'decompose' | 'compose') => {
    setExerciseType(type);
    setCurrentExercise(0);
    setUserAnswers({ centaines: '', dizaines: '', unites: '' });
    setUserNumber('');
    setIsCorrect(null);
    setAnsweredCorrectly(new Set());
  };

  const updateAnswer = (type: 'centaines' | 'dizaines' | 'unites', value: string) => {
    setUserAnswers(prev => ({ ...prev, [type]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/chapitre/ce1-nombres-jusqu-1000" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-4">
            <ArrowLeft className="w-4 h-4" />
            <span>Retour au chapitre</span>
          </Link>
          
          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              🧩 Décomposer les nombres
            </h1>
            <p className="text-lg text-gray-600">
              Apprends à séparer un nombre en centaines, dizaines et unités !
            </p>
          </div>
        </div>

        {/* Navigation entre cours et exercices */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-1 shadow-md">
            <button
              onClick={() => setShowExercises(false)}
              className={`px-6 py-3 rounded-lg font-bold transition-all ${
                !showExercises 
                  ? 'bg-purple-500 text-white shadow-md' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              📖 Cours
            </button>
            <button
              onClick={() => setShowExercises(true)}
              className={`px-6 py-3 rounded-lg font-bold transition-all ${
                showExercises 
                  ? 'bg-pink-500 text-white shadow-md' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              ✏️ Exercices ({score}/{exercises.length})
            </button>
          </div>
        </div>

        {!showExercises ? (
          /* COURS */
          <div className="space-y-8">
            {/* Explication des positions */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
                📊 Les positions des chiffres
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-red-50 rounded-lg p-6 text-center">
                  <div className="text-4xl mb-3">💯</div>
                  <h3 className="font-bold text-red-800 mb-2">Centaines</h3>
                  <p className="text-red-700">Le chiffre de gauche</p>
                  <p className="text-red-700">Vaut × 100</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-6 text-center">
                  <div className="text-4xl mb-3">🔟</div>
                  <h3 className="font-bold text-blue-800 mb-2">Dizaines</h3>
                  <p className="text-blue-700">Le chiffre du milieu</p>
                  <p className="text-blue-700">Vaut × 10</p>
                </div>
                <div className="bg-green-50 rounded-lg p-6 text-center">
                  <div className="text-4xl mb-3">1️⃣</div>
                  <h3 className="font-bold text-green-800 mb-2">Unités</h3>
                  <p className="text-green-700">Le chiffre de droite</p>
                  <p className="text-green-700">Vaut × 1</p>
                </div>
              </div>
            </div>

            {/* Sélecteur de nombre pour démonstration */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
                🎯 Choisis un nombre à décomposer
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
                {examples.map((example) => (
                  <button
                    key={example.number}
                    onClick={() => setSelectedNumber(example.number)}
                    className={`p-4 rounded-lg font-bold text-xl transition-all ${
                      selectedNumber === example.number
                        ? 'bg-purple-500 text-white shadow-lg scale-105'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {example.number}
                  </button>
                ))}
              </div>
            </div>

            {/* Démonstration de décomposition */}
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <h3 className="text-xl font-bold mb-6 text-center text-gray-900">
                🔍 Décomposition du nombre {selectedNumber}
              </h3>
              
              {/* Affichage du nombre */}
              <div className="flex justify-center mb-8">
                <div className="flex space-x-2">
                  {selectedNumber.split('').map((digit, index) => (
                    <div
                      key={index}
                      id={`demo-digit-${index}`}
                      className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-3xl font-bold text-gray-900 transition-all duration-300"
                    >
                      {digit}
                    </div>
                  ))}
                </div>
              </div>

              {/* Flèches et décomposition */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6">
                {/* Centaines */}
                <div className="text-center">
                  <div className="text-lg md:text-2xl mb-1 md:mb-2">⬇️</div>
                  <div className="bg-red-100 rounded-lg p-1 md:p-4 transition-all duration-300" id="centaines-box">
                    <div className="text-xl md:text-3xl font-bold text-red-600 mb-1 md:mb-2">
                      {decomposeNumber(selectedNumber).centaines}
                    </div>
                    <div className="font-bold text-red-800 text-sm md:text-base">Centaines</div>
                    <div className="text-xs md:text-sm text-red-700">
                      {decomposeNumber(selectedNumber).centaines} × 100 = {parseInt(decomposeNumber(selectedNumber).centaines) * 100}
                    </div>
                  </div>
                </div>

                {/* Dizaines */}
                <div className="text-center">
                  <div className="text-lg md:text-2xl mb-1 md:mb-2">⬇️</div>
                  <div className="bg-blue-100 rounded-lg p-1 md:p-4 transition-all duration-300" id="dizaines-box">
                    <div className="text-xl md:text-3xl font-bold text-blue-600 mb-1 md:mb-2">
                      {decomposeNumber(selectedNumber).dizaines}
                    </div>
                    <div className="font-bold text-blue-800 text-sm md:text-base">Dizaines</div>
                    <div className="text-xs md:text-sm text-blue-700">
                      {decomposeNumber(selectedNumber).dizaines} × 10 = {parseInt(decomposeNumber(selectedNumber).dizaines) * 10}
                    </div>
                  </div>
                </div>

                {/* Unités */}
                <div className="text-center">
                  <div className="text-lg md:text-2xl mb-1 md:mb-2">⬇️</div>
                  <div className="bg-green-100 rounded-lg p-1 md:p-4 transition-all duration-300" id="unites-box">
                    <div className="text-xl md:text-3xl font-bold text-green-600 mb-1 md:mb-2">
                      {decomposeNumber(selectedNumber).unites}
                    </div>
                    <div className="font-bold text-green-800 text-sm md:text-base">Unités</div>
                    <div className="text-xs md:text-sm text-green-700">
                      {decomposeNumber(selectedNumber).unites} × 1 = {parseInt(decomposeNumber(selectedNumber).unites)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Vérification */}
              <div className="mt-8 bg-yellow-50 rounded-lg p-6 text-center">
                <h4 className="font-bold text-yellow-800 mb-2">✅ Vérification :</h4>
                <div className="text-lg text-yellow-900">
                  {parseInt(decomposeNumber(selectedNumber).centaines) * 100} + {parseInt(decomposeNumber(selectedNumber).dizaines) * 10} + {parseInt(decomposeNumber(selectedNumber).unites)} = {selectedNumber}
                </div>
              </div>

              {/* Bouton d'animation */}
              <div className="text-center mt-6">
                <button
                  onClick={animateDecomposition}
                  disabled={isAnimating}
                  className="bg-purple-500 text-white px-8 py-3 rounded-lg font-bold text-lg hover:bg-purple-600 transition-colors disabled:opacity-50"
                >
                  <Shuffle className="inline w-5 h-5 mr-2" />
                  {isAnimating ? 'Animation...' : 'Voir l\'animation'}
                </button>
              </div>
            </div>

            {/* Conseils */}
            <div className="bg-gradient-to-r from-indigo-400 to-purple-400 rounded-xl p-6 text-white">
              <h3 className="text-xl font-bold mb-3">💡 Astuces pour décomposer</h3>
              <ul className="space-y-2">
                <li>• Le premier chiffre (à gauche) = les centaines</li>
                <li>• Le deuxième chiffre (au milieu) = les dizaines</li>
                <li>• Le troisième chiffre (à droite) = les unités</li>
                <li>• Si il n'y a que 2 chiffres, il n'y a pas de centaines</li>
                <li>• Le zéro signifie "aucun" dans cette position</li>
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
                  ✏️ Exercice {currentExercise + 1} sur {exerciseType === 'decompose' ? exercises.length : composeExercises.length}
                </h2>
                <button
                  onClick={resetAll}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-gray-600 transition-colors"
                >
                  <RotateCcw className="inline w-4 h-4 mr-2" />
                  Recommencer
                </button>
              </div>
              
              {/* Sélecteur type d'exercice */}
              <div className="flex justify-center mb-4">
                <div className="bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => switchExerciseType('decompose')}
                    className={`px-4 py-2 rounded-lg font-bold transition-all ${
                      exerciseType === 'decompose' 
                        ? 'bg-purple-500 text-white shadow-md' 
                        : 'text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    🧩 Décomposer
                  </button>
                  <button
                    onClick={() => switchExerciseType('compose')}
                    className={`px-4 py-2 rounded-lg font-bold transition-all ${
                      exerciseType === 'compose' 
                        ? 'bg-green-500 text-white shadow-md' 
                        : 'text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    🔢 Composer
                  </button>
                </div>
              </div>
              
              {/* Barre de progression */}
              <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
                <div 
                  className={`h-3 rounded-full transition-all duration-500 ${
                    exerciseType === 'decompose' ? 'bg-purple-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${((currentExercise + 1) / (exerciseType === 'decompose' ? exercises.length : composeExercises.length)) * 100}%` }}
                ></div>
              </div>
              
              {/* Score sous la barre */}
              <div className="text-center">
                <div className={`text-lg font-bold ${
                  exerciseType === 'decompose' ? 'text-purple-600' : 'text-green-600'
                }`}>
                  Score : {score}/{(exerciseType === 'decompose' ? exercises.length : composeExercises.length)}
                </div>
              </div>
            </div>

            {/* Question */}
            <div className="bg-white rounded-xl p-4 md:p-8 shadow-lg text-center">
              {exerciseType === 'decompose' ? (
                <>
                  <h3 className="text-lg md:text-xl font-bold mb-4 md:mb-6 text-gray-900">
                    🧩 Décompose ce nombre
                  </h3>
                  
                  <div className="text-4xl md:text-6xl font-bold text-purple-600 mb-6 md:mb-8">
                    {exercises[currentExercise].number}
                  </div>
                  
                  {/* Champs de saisie pour décomposition */}
                  <div className="grid grid-cols-3 gap-2 md:gap-6 max-w-2xl mx-auto mb-6 md:mb-8">
                    <div className="text-center">
                      <label className="block font-bold text-red-600 mb-1 md:mb-2 text-sm md:text-base">Centaines</label>
                      <input
                        type="text"
                        value={userAnswers.centaines}
                        onChange={(e) => updateAnswer('centaines', e.target.value)}
                        placeholder="?"
                        className="w-16 h-16 md:w-20 md:h-20 mx-auto border-2 border-red-300 rounded-lg text-center text-xl md:text-2xl font-bold focus:border-red-500 focus:outline-none bg-white text-gray-900"
                        maxLength={2}
                      />
                    </div>
                    <div className="text-center">
                      <label className="block font-bold text-blue-600 mb-1 md:mb-2 text-sm md:text-base">Dizaines</label>
                      <input
                        type="text"
                        value={userAnswers.dizaines}
                        onChange={(e) => updateAnswer('dizaines', e.target.value)}
                        placeholder="?"
                        className="w-16 h-16 md:w-20 md:h-20 mx-auto border-2 border-blue-300 rounded-lg text-center text-xl md:text-2xl font-bold focus:border-blue-500 focus:outline-none bg-white text-gray-900"
                        maxLength={1}
                      />
                    </div>
                    <div className="text-center">
                      <label className="block font-bold text-green-600 mb-1 md:mb-2 text-sm md:text-base">Unités</label>
                      <input
                        type="text"
                        value={userAnswers.unites}
                        onChange={(e) => updateAnswer('unites', e.target.value)}
                        placeholder="?"
                        className="w-16 h-16 md:w-20 md:h-20 mx-auto border-2 border-green-300 rounded-lg text-center text-xl md:text-2xl font-bold focus:border-green-500 focus:outline-none bg-white text-gray-900"
                        maxLength={1}
                      />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <h3 className="text-lg md:text-xl font-bold mb-4 md:mb-6 text-gray-900">
                    🔢 Trouve le nombre avec cette décomposition
                  </h3>
                  
                  {/* Affichage de la décomposition */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6 max-w-2xl mx-auto mb-8">
                    <div className="text-center">
                      <div className="bg-red-100 rounded-lg p-1 md:p-4">
                        <div className="text-xl md:text-3xl font-bold text-red-600 mb-1 md:mb-2">
                          {composeExercises[currentExercise].centaines}
                        </div>
                        <div className="font-bold text-red-800 text-sm md:text-base">Centaines</div>
                        <div className="text-xs md:text-sm text-red-700">
                          {composeExercises[currentExercise].centaines} × 100
                        </div>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="bg-blue-100 rounded-lg p-1 md:p-4">
                        <div className="text-xl md:text-3xl font-bold text-blue-600 mb-1 md:mb-2">
                          {composeExercises[currentExercise].dizaines}
                        </div>
                        <div className="font-bold text-blue-800 text-sm md:text-base">Dizaines</div>
                        <div className="text-xs md:text-sm text-blue-700">
                          {composeExercises[currentExercise].dizaines} × 10
                        </div>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="bg-green-100 rounded-lg p-1 md:p-4">
                        <div className="text-xl md:text-3xl font-bold text-green-600 mb-1 md:mb-2">
                          {composeExercises[currentExercise].unites}
                        </div>
                        <div className="font-bold text-green-800 text-sm md:text-base">Unités</div>
                        <div className="text-xs md:text-sm text-green-700">
                          {composeExercises[currentExercise].unites} × 1
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Calcul visible */}
                  <div className="bg-yellow-50 rounded-lg p-4 mb-8">
                    <div className="text-lg font-bold text-yellow-800">
                      {parseInt(composeExercises[currentExercise].centaines) * 100} + {parseInt(composeExercises[currentExercise].dizaines) * 10} + {parseInt(composeExercises[currentExercise].unites)} = ?
                    </div>
                  </div>
                  
                  {/* Champ de saisie pour le nombre */}
                  <div className="max-w-md mx-auto mb-6 md:mb-8">
                    <input
                      type="text"
                      value={userNumber}
                      onChange={(e) => setUserNumber(e.target.value)}
                      placeholder="Écris le nombre ici..."
                      className="w-full px-3 md:px-4 py-3 md:py-4 border-2 border-green-300 rounded-lg text-center text-2xl md:text-3xl font-bold focus:border-green-500 focus:outline-none bg-white text-gray-900"
                      maxLength={4}
                    />
                    
                    {/* Reconnaissance vocale */}
                    <div className="border-t border-gray-200 pt-4 mt-4">
                      <VoiceInput
                        onTranscript={(transcript) => setUserNumber(transcript)}
                        placeholder="Ou dites le nombre à voix haute..."
                        className="justify-center"
                      />
                    </div>
                  </div>
                </>
              )}
              
              <div className="flex justify-center space-x-4 mb-4 md:mb-6">
                <button
                  onClick={resetExercise}
                  className="bg-gray-500 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg font-bold hover:bg-gray-600 transition-colors text-sm md:text-base"
                >
                  Effacer
                </button>
              </div>
              
              {/* Résultat */}
              {isCorrect !== null && (
                <div className={`p-4 rounded-lg mb-6 ${
                  isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  <div className="flex items-center justify-center space-x-2">
                    {isCorrect ? (
                      <>
                        <CheckCircle className="w-6 h-6" />
                        <span className="font-bold">
                          {exerciseType === 'decompose' 
                            ? 'Super ! Tu as bien décomposé le nombre !' 
                            : 'Excellent ! Tu as trouvé le bon nombre !'}
                        </span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-6 h-6" />
                        <span className="font-bold">
                          {exerciseType === 'decompose' 
                            ? `Pas tout à fait... La bonne réponse est : ${exercises[currentExercise].centaines} centaines, ${exercises[currentExercise].dizaines} dizaines, ${exercises[currentExercise].unites} unités`
                            : `Pas tout à fait... La bonne réponse est : ${composeExercises[currentExercise].number}`}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              )}
              
              {/* Navigation */}
              <div className="flex justify-center space-x-3 md:space-x-4">
                <button
                  onClick={() => setCurrentExercise(Math.max(0, currentExercise - 1))}
                  disabled={currentExercise === 0}
                  className="bg-gray-300 text-gray-700 px-4 md:px-6 py-2 md:py-3 rounded-lg font-bold hover:bg-gray-400 transition-colors disabled:opacity-50 text-sm md:text-base"
                >
                  ← Précédent
                </button>
                <button
                  onClick={handleNext}
                  disabled={
                    isCorrect === null && (
                      exerciseType === 'decompose' 
                        ? (!userAnswers.centaines || !userAnswers.dizaines || userAnswers.unites === '')
                        : !userNumber.trim()
                    )
                  }
                  className={`text-white px-4 md:px-6 py-2 md:py-3 rounded-lg font-bold transition-colors disabled:opacity-50 text-sm md:text-base ${
                    exerciseType === 'decompose' 
                      ? 'bg-pink-500 hover:bg-pink-600' 
                      : 'bg-lime-500 hover:bg-lime-600'
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
                const totalExercises = exerciseType === 'decompose' ? exercises.length : composeExercises.length;
                const percentage = Math.round((finalScore / totalExercises) * 100);
                const getMessage = () => {
                  if (percentage >= 90) return { title: "🎉 Excellent !", message: `Tu maîtrises parfaitement ${exerciseType === 'decompose' ? 'la décomposition' : 'la composition'} des nombres jusqu'à 1000 !`, emoji: "🎉" };
                  if (percentage >= 70) return { title: "👏 Bien joué !", message: `Tu sais bien ${exerciseType === 'decompose' ? 'décomposer' : 'composer'} les nombres ! Continue comme ça !`, emoji: "👏" };
                  if (percentage >= 50) return { title: "👍 C'est un bon début !", message: "Tu progresses bien. Entraîne-toi encore un peu !", emoji: "😊" };
                  return { title: "💪 Continue à t'entraîner !", message: `Recommence les exercices pour mieux maîtriser ${exerciseType === 'decompose' ? 'la décomposition' : 'la composition'} des nombres.`, emoji: "📚" };
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
                        className={`flex-1 text-white px-6 py-3 rounded-lg font-bold transition-colors ${
                          exerciseType === 'decompose' 
                            ? 'bg-pink-500 hover:bg-pink-600' 
                            : 'bg-lime-500 hover:bg-lime-600'
                        }`}
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