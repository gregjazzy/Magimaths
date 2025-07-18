'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, XCircle, RefreshCw, Trophy, Target, Eye, Zap, Calculator, Clock, Play, Pause, RotateCcw, ArrowRight } from 'lucide-react';

interface Exercise {
  type: 'double' | 'moitié';
  number: number;
  operation: string;
  question: string;
  answer: number;
  explanation: string;
}

export default function DoublesMoitiesPage() {
  const [currentSection, setCurrentSection] = useState<'cours' | 'exercices'>('cours');
  const [currentExercise, setCurrentExercise] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [operationType, setOperationType] = useState<'double' | 'moitié'>('double');
  const [animatedExample, setAnimatedExample] = useState('');
  const [visualDemo, setVisualDemo] = useState<{ number: number; operation: 'double' | 'moitié' }>({ number: 24, operation: 'double' });

  // Générer les exercices
  const generateExercises = (): Exercise[] => {
    const exercises: Exercise[] = [];
    
    // Doubles
    const doublesNumbers = [15, 25, 35, 45, 55, 65, 75, 85, 95, 125, 135, 145, 155, 165, 175, 185, 195, 250, 350, 450];
    doublesNumbers.forEach(num => {
      const result = num * 2;
      let explanation = `${num} × 2 = ${result}`;
      
      // Ajouter des explications détaillées selon le nombre
      if (num < 100) {
        // Pour les nombres < 100, montrer la décomposition
        const dizaines = Math.floor(num / 10) * 10;
        const unites = num % 10;
        if (unites > 0) {
          explanation += ` (Astuce : ${dizaines} × 2 + ${unites} × 2 = ${dizaines * 2} + ${unites * 2} = ${result})`;
        }
      } else {
        // Pour les nombres ≥ 100, montrer une méthode simple
        explanation += ` (Astuce : pour doubler ${num}, je peux multiplier par 2 directement)`;
      }
      
      exercises.push({
        type: 'double',
        number: num,
        operation: `Double de ${num}`,
        question: `Quel est le double de ${num} ?`,
        answer: result,
        explanation: explanation
      });
    });
    
    // Moitiés
    const moitiesNumbers = [30, 50, 70, 90, 110, 130, 150, 170, 190, 250, 270, 290, 310, 330, 350, 370, 390, 500, 700, 900];
    moitiesNumbers.forEach(num => {
      const result = num / 2;
      let explanation = `${num} ÷ 2 = ${result}`;
      
      // Ajouter des explications détaillées selon le nombre
      if (num < 100) {
        // Pour les nombres < 100, montrer la décomposition
        const dizaines = Math.floor(num / 10) * 10;
        const unites = num % 10;
        if (unites > 0) {
          explanation += ` (Astuce : ${dizaines} ÷ 2 + ${unites} ÷ 2 = ${dizaines / 2} + ${unites / 2} = ${result})`;
        } else {
          explanation += ` (Astuce : ${dizaines} ÷ 2 = ${result})`;
        }
      } else if (num % 100 === 0) {
        // Pour les centaines rondes
        explanation += ` (Astuce : ${num} ÷ 2 = ${num / 100} centaines ÷ 2 = ${result})`;
      } else {
        // Pour les nombres ≥ 100, montrer une décomposition simple
        const centaines = Math.floor(num / 100) * 100;
        const reste = num % 100;
        if (reste > 0) {
          explanation += ` (Astuce : ${centaines} ÷ 2 + ${reste} ÷ 2 = ${centaines / 2} + ${reste / 2} = ${result})`;
        }
      }
      
      exercises.push({
        type: 'moitié',
        number: num,
        operation: `Moitié de ${num}`,
        question: `Quelle est la moitié de ${num} ?`,
        answer: result,
        explanation: explanation
      });
    });
    
    return exercises.sort(() => Math.random() - 0.5);
  };

  const [exercises, setExercises] = useState(generateExercises());

  // Animation des exemples
  useEffect(() => {
    if (currentSection === 'cours') {
      const examples = [
        'Double de 25 = 50',
        'Moitié de 60 = 30',
        'Double de 45 = 90',
        'Moitié de 140 = 70'
      ];
      
      let index = 0;
      const interval = setInterval(() => {
        setAnimatedExample(examples[index]);
        index = (index + 1) % examples.length;
      }, 2000);
      
      return () => clearInterval(interval);
    }
  }, [currentSection]);

  // Exemples prédéfinis pour la démonstration visuelle
  const visualExamples: { number: number; operation: 'double' | 'moitié' }[] = [
    { number: 24, operation: 'double' },
    { number: 36, operation: 'moitié' },
    { number: 48, operation: 'double' },
    { number: 60, operation: 'moitié' },
    { number: 72, operation: 'double' },
    { number: 84, operation: 'moitié' }
  ];
  
  const [currentVisualIndex, setCurrentVisualIndex] = useState(0);
  
  // Fonction pour passer à l'exemple suivant
  const nextVisualExample = () => {
    setCurrentVisualIndex((prevIndex) => (prevIndex + 1) % visualExamples.length);
  };
  
  // Initialiser avec le premier exemple
  useEffect(() => {
    setVisualDemo(visualExamples[currentVisualIndex]);
  }, [currentVisualIndex]);

  const filterExercises = () => {
    return exercises.filter(ex => ex.type === operationType);
  };

  const getCurrentExercises = () => {
    return filterExercises();
  };

  const checkAnswer = () => {
    const currentExercises = getCurrentExercises();
    const isCorrect = parseInt(userAnswer) === currentExercises[currentExercise].answer;
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

  const changeOperationType = (type: 'double' | 'moitié') => {
    setOperationType(type);
    setCurrentExercise(0);
    setUserAnswer('');
    setShowAnswer(false);
  };

  // Fonction pour créer une représentation visuelle
  const createVisualRepresentation = (number: number, operation: string) => {
    const dots = [];
    const displayNumber = Math.min(number, 20); // Limiter à 20 pour l'affichage
    
    for (let i = 0; i < displayNumber; i++) {
      dots.push(
        <div
          key={i}
          className={`w-3 h-3 rounded-full ${
            operation === 'double' 
              ? 'bg-blue-500' 
              : i < displayNumber / 2 
                ? 'bg-green-500' 
                : 'bg-gray-300'
          } transition-all duration-300`}
        />
      );
    }
    
    return dots;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-violet-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/chapitre/cm1-calcul-mental" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-4">
            <ArrowLeft className="w-4 h-4" />
            <span>Retour au chapitre</span>
          </Link>
          
          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              ⚡ Doubles et moitiés
            </h1>
            <p className="text-lg text-gray-600">
              Calculer rapidement les doubles et moitiés de nombres plus grands
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
                  ? 'bg-gradient-to-r from-purple-500 to-violet-600 text-white shadow-lg' 
                  : 'text-gray-700 hover:bg-gradient-to-r hover:from-purple-100 hover:to-violet-100 hover:text-purple-800'
              }`}
            >
              📖 Cours
            </button>
            <button
              onClick={() => setCurrentSection('exercices')}
              className={`px-8 py-4 rounded-xl font-bold transition-all transform hover:scale-105 shadow-md ml-2 ${
                currentSection === 'exercices' 
                  ? 'bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-lg' 
                  : 'text-gray-700 hover:bg-gradient-to-r hover:from-violet-100 hover:to-purple-100 hover:text-violet-800'
              }`}
            >
              ✏️ Exercices ({score}/{attempts})
            </button>
          </div>
        </div>

        {currentSection === 'cours' ? (
          /* COURS */
          <div className="space-y-8">
            {/* Définitions */}
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">
                📚 Doubles et moitiés : c'est quoi ?
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Double */}
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-6">
                  <h3 className="text-2xl font-bold text-blue-800 mb-6 text-center">
                    ✖️ Le double
                  </h3>
                  
                  <div className="bg-white rounded-lg p-4 mb-4 shadow-md">
                    <p className="text-blue-700 font-semibold mb-2">
                      Le double d'un nombre = multiplier par 2
                    </p>
                    <div className="text-2xl font-bold text-center text-blue-600">
                      Double de 25 = 25 × 2 = 50
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="bg-blue-100 rounded-lg p-3 text-center">
                      <div className="text-lg font-bold text-blue-800">Double de 15 = 30</div>
                    </div>
                    <div className="bg-blue-100 rounded-lg p-3 text-center">
                      <div className="text-lg font-bold text-blue-800">Double de 35 = 70</div>
                    </div>
                    <div className="bg-blue-100 rounded-lg p-3 text-center">
                      <div className="text-lg font-bold text-blue-800">Double de 45 = 90</div>
                    </div>
                  </div>
                </div>

                {/* Moitié */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6">
                  <h3 className="text-2xl font-bold text-green-800 mb-6 text-center">
                    ➗ La moitié
                  </h3>
                  
                  <div className="bg-white rounded-lg p-4 mb-4 shadow-md">
                    <p className="text-green-700 font-semibold mb-2">
                      La moitié d'un nombre = diviser par 2
                    </p>
                    <div className="text-2xl font-bold text-center text-green-600">
                      Moitié de 60 = 60 ÷ 2 = 30
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="bg-green-100 rounded-lg p-3 text-center">
                      <div className="text-lg font-bold text-green-800">Moitié de 30 = 15</div>
                    </div>
                    <div className="bg-green-100 rounded-lg p-3 text-center">
                      <div className="text-lg font-bold text-green-800">Moitié de 70 = 35</div>
                    </div>
                    <div className="bg-green-100 rounded-lg p-3 text-center">
                      <div className="text-lg font-bold text-green-800">Moitié de 90 = 45</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Stratégies de calcul */}
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-center mb-6 text-gray-900">
                🧠 Stratégies pour calculer rapidement
              </h3>
              
              <div className="space-y-6">
                {/* Stratégie pour les doubles */}
                <div className="bg-gradient-to-r from-blue-100 to-cyan-100 rounded-lg p-6">
                  <h4 className="text-xl font-bold text-blue-800 mb-4">🎯 Stratégie pour les doubles</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white rounded-lg p-4">
                      <h5 className="font-bold text-blue-700 mb-2">Méthode 1 : Décomposer</h5>
                      <div className="space-y-1 text-blue-600">
                        <p>Double de 25 :</p>
                        <p>25 = 20 + 5</p>
                        <p>Double de 20 = 40</p>
                        <p>Double de 5 = 10</p>
                        <p className="font-bold">40 + 10 = 50</p>
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-lg p-4">
                      <h5 className="font-bold text-blue-700 mb-2">Méthode 2 : Multiplier par 2</h5>
                      <div className="space-y-1 text-blue-600">
                        <p>Double de 35 :</p>
                        <p>35 × 2</p>
                        <p>30 × 2 = 60</p>
                        <p>5 × 2 = 10</p>
                        <p className="font-bold">60 + 10 = 70</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stratégie pour les moitiés */}
                <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg p-6">
                  <h4 className="text-xl font-bold text-green-800 mb-4">🎯 Stratégie pour les moitiés</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white rounded-lg p-4">
                      <h5 className="font-bold text-green-700 mb-2">Méthode 1 : Décomposer</h5>
                      <div className="space-y-1 text-green-600">
                        <p>Moitié de 60 :</p>
                        <p>60 = 50 + 10</p>
                        <p>Moitié de 50 = 25</p>
                        <p>Moitié de 10 = 5</p>
                        <p className="font-bold">25 + 5 = 30</p>
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-lg p-4">
                      <h5 className="font-bold text-green-700 mb-2">Méthode 2 : Diviser par 2</h5>
                      <div className="space-y-1 text-green-600">
                        <p>Moitié de 140 :</p>
                        <p>140 ÷ 2</p>
                        <p>100 ÷ 2 = 50</p>
                        <p>40 ÷ 2 = 20</p>
                        <p className="font-bold">50 + 20 = 70</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Démonstration visuelle */}
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-center mb-6 text-gray-900">
                👁️ Démonstration visuelle
              </h3>
              
              <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-6">
                <h4 className="text-xl font-bold text-purple-800 mb-4 text-center">
                  {visualDemo.operation === 'double' ? 'Double' : 'Moitié'} de {visualDemo.number}
                </h4>
                
                <div className="flex justify-center mb-6">
                  <div className="grid grid-cols-10 gap-1 max-w-md">
                    {createVisualRepresentation(visualDemo.number, visualDemo.operation)}
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600 mb-4">
                    {visualDemo.operation === 'double' 
                      ? `${visualDemo.number} × 2 = ${visualDemo.number * 2}`
                      : `${visualDemo.number} ÷ 2 = ${visualDemo.number / 2}`
                    }
                  </div>
                  
                  <button
                    onClick={nextVisualExample}
                    className="bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700 text-white px-6 py-3 rounded-xl font-bold transition-all transform hover:scale-105 shadow-lg"
                  >
                    Suivant → (Exemple {currentVisualIndex + 1}/{visualExamples.length})
                  </button>
                </div>
              </div>
            </div>

            {/* Animation */}
            <div className="bg-gradient-to-r from-purple-400 to-violet-400 rounded-xl p-6 text-white">
              <h3 className="text-xl font-bold mb-4 text-center">🎨 Calcul en action</h3>
              <div className="text-center">
                <div className="text-3xl font-bold mb-4 animate-pulse">
                  {animatedExample}
                </div>
                <p className="text-lg">
                  Regarde comme c'est facile de doubler et de diviser par deux !
                </p>
              </div>
            </div>

            {/* Astuces */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-2xl font-bold text-center mb-6 text-gray-900">
                💡 Astuces pour retenir
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-yellow-50 rounded-lg p-4">
                  <h4 className="font-bold text-yellow-800 mb-2">🔄 Relation double-moitié</h4>
                  <p className="text-yellow-700">
                    Si je connais le double de 25 (= 50), alors je sais que la moitié de 50 = 25 !
                  </p>
                </div>
                
                <div className="bg-orange-50 rounded-lg p-4">
                  <h4 className="font-bold text-orange-800 mb-2">🎯 Nombres pairs</h4>
                  <p className="text-orange-700">
                    La moitié d'un nombre pair donne toujours un nombre entier !
                  </p>
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
                  <div className="text-lg font-bold text-purple-600">
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
                    onClick={() => changeOperationType('double')}
                    className={`px-6 py-3 rounded-xl font-bold transition-all transform hover:scale-105 shadow-md ${
                      operationType === 'double' 
                        ? 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow-xl border-2 border-blue-400 scale-105' 
                        : 'bg-gradient-to-r from-blue-200 to-cyan-200 text-blue-800 hover:from-blue-300 hover:to-cyan-300 hover:text-blue-900 border-2 border-blue-300'
                    }`}
                  >
                    ✖️ Doubles
                  </button>
                  <button
                    onClick={() => changeOperationType('moitié')}
                    className={`px-6 py-3 rounded-xl font-bold transition-all transform hover:scale-105 shadow-md ml-2 ${
                      operationType === 'moitié' 
                        ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-xl border-2 border-green-400 scale-105' 
                        : 'bg-gradient-to-r from-green-200 to-emerald-200 text-green-800 hover:from-green-300 hover:to-emerald-300 hover:text-green-900 border-2 border-green-300'
                    }`}
                  >
                    ➗ Moitiés
                  </button>
                </div>
              </div>
              
              {/* Barre de progression */}
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-violet-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${((currentExercise + 1) / getCurrentExercises().length) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Question */}
            <div className="bg-white rounded-xl p-8 shadow-lg text-center">
              <h3 className="text-2xl font-bold mb-6 text-gray-900">
                {getCurrentExercises()[currentExercise]?.question}
              </h3>
              
              <div className="text-5xl font-bold text-purple-600 mb-8">
                {getCurrentExercises()[currentExercise]?.operation}
              </div>
              
              <div className="max-w-md mx-auto mb-8">
                <input
                  type="number"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="Tape ta réponse"
                  className="w-full text-4xl font-bold text-center p-4 border-4 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && userAnswer && !showAnswer) {
                      checkAnswer();
                    }
                  }}
                />
              </div>
              
              <div className="flex justify-center space-x-4 mb-8">
                <button
                  onClick={checkAnswer}
                  disabled={!userAnswer || showAnswer}
                  className="bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700 text-white px-8 py-4 rounded-xl font-bold transition-all transform hover:scale-105 shadow-lg disabled:opacity-50"
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
                  parseInt(userAnswer) === getCurrentExercises()[currentExercise]?.answer 
                    ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-2 border-green-300' 
                    : 'bg-gradient-to-r from-red-100 to-rose-100 text-red-800 border-2 border-red-300'
                }`}>
                  <div className="text-center">
                    {parseInt(userAnswer) === getCurrentExercises()[currentExercise]?.answer ? (
                      <>
                        <div className="flex items-center justify-center space-x-2 mb-4">
                          <CheckCircle className="w-8 h-8" />
                          <span className="font-bold text-xl">🎉 Excellent ! C'est correct ! 🎉</span>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                          <p className="text-green-700 font-semibold">
                            ✅ Réponse : {getCurrentExercises()[currentExercise]?.answer}
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
                            ✅ Bonne réponse : {getCurrentExercises()[currentExercise]?.answer}
                          </p>
                        </div>
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                          <h4 className="font-bold text-blue-800 mb-2">💡 Explication :</h4>
                          <p className="text-blue-700 font-medium">
                            {getCurrentExercises()[currentExercise]?.explanation}
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Résultats finaux */}
            {currentExercise === getCurrentExercises().length - 1 && showAnswer && (
              <div className="bg-gradient-to-r from-purple-400 to-violet-400 rounded-xl p-6 text-white text-center">
                <div className="text-4xl mb-3">🎉</div>
                <h3 className="text-2xl font-bold mb-2">Bravo !</h3>
                <p className="text-lg mb-4">
                  Tu maîtrises maintenant les {operationType === 'double' ? 'doubles' : 'moitiés'} !
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