'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, XCircle, RotateCcw, Volume2, Split, Copy } from 'lucide-react';

export default function DoublesCP() {
  const [selectedType, setSelectedType] = useState<'doubles' | 'moities'>('doubles');
  const [currentExercise, setCurrentExercise] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showExercises, setShowExercises] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredCorrectly, setAnsweredCorrectly] = useState<Set<number>>(new Set());
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [finalScore, setFinalScore] = useState(0);

  // Sauvegarder les progrès
  const saveProgress = (score: number, maxScore: number) => {
    const progress = {
      sectionId: 'doubles-moities',
      completed: true,
      score: score,
      maxScore: maxScore,
      completedAt: new Date().toISOString(),
      attempts: 1
    };

    const existingProgress = localStorage.getItem('cp-nombres-100-progress');
    let allProgress = [];
    
    if (existingProgress) {
      allProgress = JSON.parse(existingProgress);
      const existingIndex = allProgress.findIndex((p: any) => p.sectionId === 'doubles-moities');
      
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

    localStorage.setItem('cp-nombres-100-progress', JSON.stringify(allProgress));
  };

  // Doubles des nombres < 10
  const doubles = [
    { number: 1, double: 2, visual: '🔴 + 🔴 = 🔴🔴', formula: '1 + 1 = 2' },
    { number: 2, double: 4, visual: '🔴🔴 + 🔴🔴 = 🔴🔴🔴🔴', formula: '2 + 2 = 4' },
    { number: 3, double: 6, visual: '🔴🔴🔴 + 🔴🔴🔴 = 🔴🔴🔴🔴🔴🔴', formula: '3 + 3 = 6' },
    { number: 4, double: 8, visual: '🔴🔴🔴🔴 + 🔴🔴🔴🔴 = 🔴🔴🔴🔴🔴🔴🔴🔴', formula: '4 + 4 = 8' },
    { number: 5, double: 10, visual: '✋ + ✋ = 🙌', formula: '5 + 5 = 10' },
    { number: 6, double: 12, visual: '👐 + 👐 = 👏👏', formula: '6 + 6 = 12' },
    { number: 7, double: 14, visual: '🔴🔴🔴🔴🔴🔴🔴 × 2', formula: '7 + 7 = 14' },
    { number: 8, double: 16, visual: '🔴🔴🔴🔴🔴🔴🔴🔴 × 2', formula: '8 + 8 = 16' },
    { number: 9, double: 18, visual: '🔴🔴🔴🔴🔴🔴🔴🔴🔴 × 2', formula: '9 + 9 = 18' }
  ];

  // Moitiés des nombres pairs < 20
  const moities = [
    { number: 2, moitie: 1, visual: '🔴🔴 ÷ 2 = 🔴', formula: '2 ÷ 2 = 1' },
    { number: 4, moitie: 2, visual: '🔴🔴🔴🔴 ÷ 2 = 🔴🔴', formula: '4 ÷ 2 = 2' },
    { number: 6, moitie: 3, visual: '🔴🔴🔴🔴🔴🔴 ÷ 2 = 🔴🔴🔴', formula: '6 ÷ 2 = 3' },
    { number: 8, moitie: 4, visual: '🔴🔴🔴🔴🔴🔴🔴🔴 ÷ 2 = 🔴🔴🔴🔴', formula: '8 ÷ 2 = 4' },
    { number: 10, moitie: 5, visual: '🙌 ÷ 2 = ✋', formula: '10 ÷ 2 = 5' },
    { number: 12, moitie: 6, visual: '👏👏 ÷ 2 = 👐', formula: '12 ÷ 2 = 6' },
    { number: 14, moitie: 7, visual: '🔴🔴🔴🔴🔴🔴🔴 × 2 ÷ 2', formula: '14 ÷ 2 = 7' },
    { number: 16, moitie: 8, visual: '🔴🔴🔴🔴🔴🔴🔴🔴 × 2 ÷ 2', formula: '16 ÷ 2 = 8' },
    { number: 18, moitie: 9, visual: '🔴🔴🔴🔴🔴🔴🔴🔴🔴 × 2 ÷ 2', formula: '18 ÷ 2 = 9' }
  ];

  // Exercices mixtes doubles et moitiés
  const exercises = [
    // Exercices sur les doubles
    { type: 'double', question: 'Quel est le double de 3 ?', number: 3, correctAnswer: '6', choices: ['5', '6', '7'] },
    { type: 'double', question: 'Quel est le double de 5 ?', number: 5, correctAnswer: '10', choices: ['9', '10', '11'] },
    { type: 'double', question: 'Quel est le double de 2 ?', number: 2, correctAnswer: '4', choices: ['3', '4', '5'] },
    { type: 'double', question: 'Quel est le double de 7 ?', number: 7, correctAnswer: '14', choices: ['13', '14', '15'] },
    { type: 'double', question: 'Quel est le double de 4 ?', number: 4, correctAnswer: '8', choices: ['7', '8', '9'] },
    { type: 'double', question: 'Quel est le double de 6 ?', number: 6, correctAnswer: '12', choices: ['11', '12', '13'] },
    
    // Exercices sur les moitiés
    { type: 'moitie', question: 'Quelle est la moitié de 8 ?', number: 8, correctAnswer: '4', choices: ['3', '4', '5'] },
    { type: 'moitie', question: 'Quelle est la moitié de 12 ?', number: 12, correctAnswer: '6', choices: ['5', '6', '7'] },
    { type: 'moitie', question: 'Quelle est la moitié de 6 ?', number: 6, correctAnswer: '3', choices: ['2', '3', '4'] },
    { type: 'moitie', question: 'Quelle est la moitié de 16 ?', number: 16, correctAnswer: '8', choices: ['7', '8', '9'] },
    { type: 'moitie', question: 'Quelle est la moitié de 10 ?', number: 10, correctAnswer: '5', choices: ['4', '5', '6'] },
    { type: 'moitie', question: 'Quelle est la moitié de 18 ?', number: 18, correctAnswer: '9', choices: ['8', '9', '10'] },
    
    // Exercices mixtes de reconnaissance
    { type: 'double', question: '4 + 4 = ?', number: 4, correctAnswer: '8', choices: ['7', '8', '9'] },
    { type: 'moitie', question: '14 ÷ 2 = ?', number: 14, correctAnswer: '7', choices: ['6', '7', '8'] }
  ];

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'fr-FR';
      utterance.rate = 0.7;
      speechSynthesis.speak(utterance);
    }
  };

  const handleAnswerClick = (answer: string) => {
    setUserAnswer(answer);
    const correct = answer === exercises[currentExercise].correctAnswer;
    setIsCorrect(correct);
    
    if (correct && !answeredCorrectly.has(currentExercise)) {
      setScore(prevScore => prevScore + 1);
      setAnsweredCorrectly(prev => {
        const newSet = new Set(prev);
        newSet.add(currentExercise);
        return newSet;
      });
    }

    if (correct) {
      setTimeout(() => {
        if (currentExercise + 1 < exercises.length) {
          setCurrentExercise(currentExercise + 1);
          setUserAnswer('');
          setIsCorrect(null);
        } else {
          const finalScoreValue = score + (!answeredCorrectly.has(currentExercise) ? 1 : 0);
          setFinalScore(finalScoreValue);
          setShowCompletionModal(true);
          saveProgress(finalScoreValue, exercises.length);
        }
      }, 1500);
    }
  };

  const nextExercise = () => {
    if (currentExercise < exercises.length - 1) {
      setCurrentExercise(currentExercise + 1);
      setUserAnswer('');
      setIsCorrect(null);
    } else {
      setFinalScore(score);
      setShowCompletionModal(true);
      saveProgress(score, exercises.length);
    }
  };

  const resetAll = () => {
    setCurrentExercise(0);
    setUserAnswer('');
    setIsCorrect(null);
    setScore(0);
    setAnsweredCorrectly(new Set());
    setShowCompletionModal(false);
    setFinalScore(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/chapitre/cp-nombres-jusqu-100" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-4">
            <ArrowLeft className="w-4 h-4" />
            <span>Retour au chapitre</span>
          </Link>
          
          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              🎯 Doubles et moitiés
            </h1>
            <p className="text-lg text-gray-600">
              Apprends les doubles des nombres &lt; 10 et les moitiés des nombres pairs &lt; 20 !
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
                  ? 'bg-pink-500 text-white shadow-md' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              📖 Cours
            </button>
            <button
              onClick={() => setShowExercises(true)}
              className={`px-6 py-3 rounded-lg font-bold transition-all ${
                showExercises 
                  ? 'bg-blue-500 text-white shadow-md' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <div className="flex flex-col items-center">
                <span>✏️ Exercices</span>
                <span className="text-sm opacity-90">({score}/{exercises.length})</span>
              </div>
            </button>
          </div>
        </div>

        {!showExercises ? (
          /* COURS */
          <div className="space-y-8">
            {/* Explication générale */}
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
                🧠 Qu'est-ce qu'un double et une moitié ?
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-blue-50 rounded-lg p-6">
                  <h3 className="text-xl font-bold mb-4 text-blue-800 text-center">
                    <Copy className="inline w-6 h-6 mr-2" />
                    Le double
                  </h3>
                  <div className="text-center space-y-4">
                    <p className="text-lg text-blue-700">
                      Le double, c'est <strong>2 fois le nombre</strong>
                    </p>
                    <div className="bg-white rounded-lg p-4">
                      <div className="text-4xl font-bold text-blue-600 mb-2">3 + 3 = 6</div>
                      <div className="text-2xl text-blue-700">Le double de 3 est 6</div>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 rounded-lg p-6">
                  <h3 className="text-xl font-bold mb-4 text-green-800 text-center">
                    <Split className="inline w-6 h-6 mr-2" />
                    La moitié
                  </h3>
                  <div className="text-center space-y-4">
                    <p className="text-lg text-green-700">
                      La moitié, c'est <strong>diviser en 2 parts égales</strong>
                    </p>
                    <div className="bg-white rounded-lg p-4">
                      <div className="text-4xl font-bold text-green-600 mb-2">6 ÷ 2 = 3</div>
                      <div className="text-2xl text-green-700">La moitié de 6 est 3</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sélecteur de type */}
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
                🎯 Que veux-tu apprendre ?
              </h2>
              
              <div className="flex justify-center space-x-4 mb-8">
                <button
                  onClick={() => setSelectedType('doubles')}
                  className={`px-8 py-4 rounded-lg font-bold text-lg transition-all ${
                    selectedType === 'doubles'
                      ? 'bg-blue-500 text-white shadow-lg scale-105'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Copy className="inline w-6 h-6 mr-2" />
                  Les doubles
                </button>
                <button
                  onClick={() => setSelectedType('moities')}
                  className={`px-8 py-4 rounded-lg font-bold text-lg transition-all ${
                    selectedType === 'moities'
                      ? 'bg-green-500 text-white shadow-lg scale-105'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Split className="inline w-6 h-6 mr-2" />
                  Les moitiés
                </button>
              </div>
            </div>

            {/* Affichage des doubles */}
            {selectedType === 'doubles' && (
              <div className="bg-white rounded-xl p-8 shadow-lg">
                <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
                  📊 Les doubles des nombres &lt; 10
                </h2>
                
                <div className="space-y-4">
                  {doubles.map((item) => (
                    <div key={item.number} className="bg-blue-50 rounded-lg p-6">
                      <div className="grid md:grid-cols-3 gap-6 items-center">
                        {/* Question */}
                        <div className="text-center">
                          <div className="text-3xl font-bold text-blue-600 mb-2">
                            Double de {item.number} ?
                          </div>
                        </div>

                        {/* Visualisation */}
                        <div className="text-center">
                          <div className="text-2xl mb-2">{item.visual}</div>
                          <div className="text-lg font-semibold text-gray-700">
                            {item.formula}
                          </div>
                        </div>

                        {/* Réponse et audio */}
                        <div className="text-center">
                          <div className="text-4xl font-bold text-blue-600 mb-2">
                            {item.double}
                          </div>
                          <button
                            onClick={() => speakText(`Le double de ${item.number} est ${item.double}`)}
                            className="bg-blue-400 hover:bg-blue-500 text-white p-2 rounded-lg transition-colors"
                          >
                            <Volume2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Astuce pour les doubles */}
                <div className="bg-blue-100 rounded-lg p-6 mt-8">
                  <h3 className="text-xl font-bold text-blue-800 mb-4 text-center">
                    💡 Astuce pour retenir les doubles
                  </h3>
                  <div className="text-center space-y-2 text-blue-700">
                    <p>• Double = ajouter le nombre à lui-même</p>
                    <p>• Utilise tes mains : 5 + 5 = 10 (2 mains)</p>
                    <p>• Les doubles sont toujours pairs !</p>
                  </div>
                </div>
              </div>
            )}

            {/* Affichage des moitiés */}
            {selectedType === 'moities' && (
              <div className="bg-white rounded-xl p-8 shadow-lg">
                <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
                  📊 Les moitiés des nombres pairs &lt; 20
                </h2>
                
                <div className="space-y-4">
                  {moities.map((item) => (
                    <div key={item.number} className="bg-green-50 rounded-lg p-6">
                      <div className="grid md:grid-cols-3 gap-6 items-center">
                        {/* Question */}
                        <div className="text-center">
                          <div className="text-3xl font-bold text-green-600 mb-2">
                            Moitié de {item.number} ?
                          </div>
                        </div>

                        {/* Visualisation */}
                        <div className="text-center">
                          <div className="text-2xl mb-2">{item.visual}</div>
                          <div className="text-lg font-semibold text-gray-700">
                            {item.formula}
                          </div>
                        </div>

                        {/* Réponse et audio */}
                        <div className="text-center">
                          <div className="text-4xl font-bold text-green-600 mb-2">
                            {item.moitie}
                          </div>
                          <button
                            onClick={() => speakText(`La moitié de ${item.number} est ${item.moitie}`)}
                            className="bg-green-400 hover:bg-green-500 text-white p-2 rounded-lg transition-colors"
                          >
                            <Volume2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Astuce pour les moitiés */}
                <div className="bg-green-100 rounded-lg p-6 mt-8">
                  <h3 className="text-xl font-bold text-green-800 mb-4 text-center">
                    💡 Astuce pour retenir les moitiés
                  </h3>
                  <div className="text-center space-y-2 text-green-700">
                    <p>• Moitié = partager en 2 parts égales</p>
                    <p>• Seuls les nombres pairs ont une moitié entière</p>
                    <p>• La moitié de 10 = 5 (1 main)</p>
                    <p>• Double et moitié sont inverses !</p>
                  </div>
                </div>
              </div>
            )}

            {/* Jeu de correspondances */}
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
                🎮 Jeu : Doubles et moitiés sont inverses !
              </h2>
              
              <div className="bg-yellow-50 rounded-lg p-6">
                <h3 className="text-xl font-bold mb-4 text-yellow-800 text-center">
                  Si tu sais que 4 + 4 = 8, alors tu sais que 8 ÷ 2 = 4 !
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { double: '3 + 3 = 6', moitie: '6 ÷ 2 = 3' },
                    { double: '5 + 5 = 10', moitie: '10 ÷ 2 = 5' },
                    { double: '7 + 7 = 14', moitie: '14 ÷ 2 = 7' },
                    { double: '8 + 8 = 16', moitie: '16 ÷ 2 = 8' }
                  ].map((pair, index) => (
                    <div key={index} className="bg-white rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-blue-600 mb-2">
                        {pair.double}
                      </div>
                      <div className="text-3xl">⬇️⬆️</div>
                      <div className="text-2xl font-bold text-green-600">
                        {pair.moitie}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Conseils */}
            <div className="bg-gradient-to-r from-pink-400 to-purple-400 rounded-xl p-6 text-white">
              <h3 className="text-xl font-bold mb-3">💡 Trucs pour retenir doubles et moitiés</h3>
              <ul className="space-y-2 text-lg">
                <li>• Apprends-les par cœur, c'est très utile !</li>
                <li>• Double = même nombre 2 fois</li>
                <li>• Moitié = couper en 2 parts égales</li>
                <li>• Utilise tes doigts et des objets</li>
                <li>• Si tu connais un double, tu connais sa moitié !</li>
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
                  ✏️ Exercice {currentExercise + 1} sur {exercises.length}
                </h2>
                <button
                  onClick={resetAll}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-gray-600 transition-colors"
                >
                  <RotateCcw className="inline w-4 h-4 mr-2" />
                  Recommencer
                </button>
              </div>
              
              {/* Barre de progression */}
              <div className="w-full bg-gray-200 rounded-full h-4 mb-3">
                <div 
                  className="bg-pink-500 h-4 rounded-full transition-all duration-500"
                  style={{ width: `${((currentExercise + 1) / exercises.length) * 100}%` }}
                ></div>
              </div>
              
              {/* Score */}
              <div className="text-center">
                <div className="text-xl font-bold text-pink-600">
                  Score : {score}/{exercises.length}
                </div>
              </div>
            </div>

            {/* Question */}
            <div className="bg-white rounded-xl p-8 shadow-lg text-center">
              <h3 className="text-2xl font-bold mb-8 text-gray-900">
                {exercises[currentExercise].question}
              </h3>
              
              {/* Affichage de la question avec icône */}
              <div className={`rounded-lg p-8 mb-8 ${
                exercises[currentExercise].type === 'double' ? 'bg-blue-50' : 'bg-green-50'
              }`}>
                <div className="flex items-center justify-center mb-4">
                  {exercises[currentExercise].type === 'double' ? (
                    <Copy className="w-8 h-8 text-blue-600 mr-3" />
                  ) : (
                    <Split className="w-8 h-8 text-green-600 mr-3" />
                  )}
                  <span className="text-lg font-semibold text-gray-700">
                    {exercises[currentExercise].type === 'double' ? 'Double' : 'Moitié'}
                  </span>
                </div>
                <div className="text-6xl font-bold text-gray-800">
                  {exercises[currentExercise].number}
                </div>
              </div>
              
              {/* Choix multiples */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-md mx-auto mb-8">
                {exercises[currentExercise].choices.map((choice) => (
                  <button
                    key={choice}
                    onClick={() => handleAnswerClick(choice)}
                    disabled={isCorrect !== null}
                    className={`p-6 rounded-lg font-bold text-4xl transition-all ${
                      userAnswer === choice
                        ? isCorrect === true
                          ? 'bg-green-500 text-white'
                          : isCorrect === false
                            ? 'bg-red-500 text-white'
                            : 'bg-blue-500 text-white'
                        : exercises[currentExercise].correctAnswer === choice && isCorrect === false
                          ? 'bg-green-200 text-green-800 border-2 border-green-500'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50'
                    } disabled:cursor-not-allowed`}
                  >
                    {choice}
                  </button>
                ))}
              </div>
              
              {/* Résultat */}
              {isCorrect !== null && (
                <div className={`p-6 rounded-lg mb-6 ${
                  isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  <div className="flex items-center justify-center space-x-3">
                    {isCorrect ? (
                      <>
                        <CheckCircle className="w-8 h-8" />
                        <span className="font-bold text-xl">
                          Parfait ! C'est bien {exercises[currentExercise].correctAnswer} !
                        </span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-8 h-8" />
                        <span className="font-bold text-xl">
                          Pas tout à fait... C'était {exercises[currentExercise].correctAnswer} !
                        </span>
                      </>
                    )}
                  </div>
                </div>
              )}
              
              {/* Navigation */}
              {isCorrect === false && (
                <div className="flex justify-center">
                  <button
                    onClick={nextExercise}
                    className="bg-pink-500 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-pink-600 transition-colors"
                  >
                    Suivant →
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Modale de fin */}
        {showCompletionModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-2xl">
              {(() => {
                const percentage = Math.round((finalScore / exercises.length) * 100);
                const getMessage = () => {
                  if (percentage >= 90) return { title: "🎉 Champion des doubles et moitiés !", message: "Tu maîtrises parfaitement les doubles et moitiés !", emoji: "🎉" };
                  if (percentage >= 70) return { title: "👏 Très bien !", message: "Tu connais bien tes doubles et moitiés ! Continue !", emoji: "👏" };
                  if (percentage >= 50) return { title: "👍 C'est bien !", message: "Tu progresses ! Ces calculs sont importants !", emoji: "😊" };
                  return { title: "💪 Continue !", message: "Recommence pour mieux apprendre doubles et moitiés !", emoji: "📚" };
                };
                const result = getMessage();
                return (
                  <>
                    <div className="text-6xl mb-4">{result.emoji}</div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">{result.title}</h3>
                    <p className="text-lg text-gray-700 mb-6">{result.message}</p>
                    <div className="bg-pink-100 rounded-lg p-4 mb-6">
                      <p className="text-xl font-bold text-gray-900">
                        Score : {finalScore}/{exercises.length}
                      </p>
                      <div className="text-4xl mt-2">
                        {finalScore >= 12 ? '⭐⭐⭐' : finalScore >= 10 ? '⭐⭐' : '⭐'}
                      </div>
                      <p className="text-sm text-gray-600 mt-2">
                        Doubles et moitiés sont essentiels pour le calcul mental !
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