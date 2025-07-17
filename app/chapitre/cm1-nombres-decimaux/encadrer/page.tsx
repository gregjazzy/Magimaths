'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Play, RefreshCw, CheckCircle, XCircle, Eye, Lightbulb, Target, Trophy, Grid, Calculator, Book, Sparkles, Ruler, ArrowRight } from 'lucide-react';

export default function EncadrerNombresDecimauxPage() {
  const [selectedNumber, setSelectedNumber] = useState(4.3);
  const [currentExercise, setCurrentExercise] = useState(0);
  const [userAnswers, setUserAnswers] = useState({ left: '', right: '' });
  const [showAnswer, setShowAnswer] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);

  const [isAnimating, setIsAnimating] = useState(false);
  const [animationStep, setAnimationStep] = useState(0);
  const [highlightedBounds, setHighlightedBounds] = useState<'left' | 'right' | 'both' | null>(null);

  const exercises = [
    { number: 2.7, left: 2, right: 3, explanation: '2,7 est entre 2 et 3' },
    { number: 5.1, left: 5, right: 6, explanation: '5,1 est entre 5 et 6' },
    { number: 8.9, left: 8, right: 9, explanation: '8,9 est entre 8 et 9' },
    { number: 12.45, left: 12, right: 13, explanation: '12,45 est entre 12 et 13' },
    { number: 0.6, left: 0, right: 1, explanation: '0,6 est entre 0 et 1' },
    { number: 7.23, left: 7, right: 8, explanation: '7,23 est entre 7 et 8' },
    { number: 15.8, left: 15, right: 16, explanation: '15,8 est entre 15 et 16' },
    { number: 3.05, left: 3, right: 4, explanation: '3,05 est entre 3 et 4' },
    { number: 9.99, left: 9, right: 10, explanation: '9,99 est entre 9 et 10' },
    { number: 6.4, left: 6, right: 7, explanation: '6,4 est entre 6 et 7' },
    { number: 11.67, left: 11, right: 12, explanation: '11,67 est entre 11 et 12' },
    { number: 4.02, left: 4, right: 5, explanation: '4,02 est entre 4 et 5' },
    { number: 13.8, left: 13, right: 14, explanation: '13,8 est entre 13 et 14' },
    { number: 1.5, left: 1, right: 2, explanation: '1,5 est entre 1 et 2' },
    { number: 10.34, left: 10, right: 11, explanation: '10,34 est entre 10 et 11' }
  ];

  const formatNumber = (num: number) => {
    return num.toString().replace('.', ',');
  };

  const getFloorAndCeil = (num: number) => {
    return {
      floor: Math.floor(num),
      ceil: Math.ceil(num)
    };
  };

  const animateEncadrement = async () => {
    setIsAnimating(true);
    setAnimationStep(0);
    setHighlightedBounds(null);
    
    // Étape 1 : Montrer le nombre
    setAnimationStep(1);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Étape 2 : Identifier la partie entière
    setAnimationStep(2);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Étape 3 : Montrer la borne gauche
    setAnimationStep(3);
    setHighlightedBounds('left');
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Étape 4 : Montrer la borne droite
    setAnimationStep(4);
    setHighlightedBounds('right');
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Étape 5 : Montrer l'encadrement complet
    setAnimationStep(5);
    setHighlightedBounds('both');
    
    setIsAnimating(false);
  };

  const checkAnswer = () => {
    const exercise = exercises[currentExercise];
    const leftCorrect = parseInt(userAnswers.left) === exercise.left;
    const rightCorrect = parseInt(userAnswers.right) === exercise.right;
    const correct = leftCorrect && rightCorrect;
    
    setIsCorrect(correct);
    setShowAnswer(true);
    setAttempts(attempts + 1);
    
    if (correct) {
      setScore(score + 1);
    }
  };

  const nextExercise = () => {
    if (currentExercise < exercises.length - 1) {
      setCurrentExercise(currentExercise + 1);
      setUserAnswers({ left: '', right: '' });
      setShowAnswer(false);
      setIsCorrect(false);
    }
  };

  const resetExercises = () => {
    setCurrentExercise(0);
    setUserAnswers({ left: '', right: '' });
    setShowAnswer(false);
    setIsCorrect(false);
    setScore(0);
    setAttempts(0);
  };

  const getCurrentExercise = () => exercises[currentExercise];

  const renderNumberLine = () => {
    const { floor, ceil } = getFloorAndCeil(selectedNumber);
    const position = ((selectedNumber - floor) / (ceil - floor)) * 100;
    
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-teal-100 rounded-lg">
            <Ruler className="w-6 h-6 text-teal-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-800">Droite graduée</h2>
        </div>
        
        <div className="space-y-6">
          {/* Nombre sélectionné */}
          <div className="text-center">
            <div className="text-4xl font-bold text-teal-600 mb-2">
              {formatNumber(selectedNumber)}
            </div>
            <div className="text-sm text-gray-600">Nombre à encadrer</div>
          </div>
          
          {/* Droite graduée */}
          <div className="relative mx-8">
            {/* Ligne principale */}
            <div className="h-2 bg-gray-200 rounded-full relative">
              {/* Graduations */}
              <div className="absolute -top-1 left-0 w-4 h-4 bg-gray-400 rounded-full"></div>
              <div className="absolute -top-1 right-0 w-4 h-4 bg-gray-400 rounded-full"></div>
              
              {/* Position du nombre */}
              <div 
                className="absolute -top-2 w-6 h-6 bg-teal-500 rounded-full transition-all duration-1000"
                style={{ left: `calc(${position}% - 12px)` }}
              >
                <div className="absolute top-8 -left-4 text-sm font-bold text-teal-600">
                  {formatNumber(selectedNumber)}
                </div>
              </div>
            </div>
            
            {/* Étiquettes */}
            <div className="flex justify-between mt-8">
              <div className={`text-center transition-all duration-500 ${
                highlightedBounds === 'left' || highlightedBounds === 'both' ? 'text-red-600 font-bold text-lg' : 'text-gray-600'
              }`}>
                <div className="text-2xl font-bold">{floor}</div>
                <div className="text-sm">Borne gauche</div>
              </div>
              <div className={`text-center transition-all duration-500 ${
                highlightedBounds === 'right' || highlightedBounds === 'both' ? 'text-blue-600 font-bold text-lg' : 'text-gray-600'
              }`}>
                <div className="text-2xl font-bold">{ceil}</div>
                <div className="text-sm">Borne droite</div>
              </div>
            </div>
          </div>
          
          {/* Encadrement */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-center">
              <div className="text-sm text-gray-600 mb-2">Encadrement :</div>
              <div className="text-2xl font-bold text-gray-800 flex items-center justify-center gap-3">
                <span className={`transition-all duration-500 ${
                  highlightedBounds === 'left' || highlightedBounds === 'both' ? 'text-red-600' : ''
                }`}>
                  {floor}
                </span>
                <span className="text-gray-400">&lt;</span>
                <span className="text-teal-600">{formatNumber(selectedNumber)}</span>
                <span className="text-gray-400">&lt;</span>
                <span className={`transition-all duration-500 ${
                  highlightedBounds === 'right' || highlightedBounds === 'both' ? 'text-blue-600' : ''
                }`}>
                  {ceil}
                </span>
              </div>
            </div>
          </div>
          
          {/* Étapes d'encadrement */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-bold text-gray-800 mb-3">📋 Étapes d'encadrement :</h3>
            <div className="space-y-2">
              <div className={`flex items-center gap-2 p-2 rounded ${animationStep >= 2 ? 'bg-teal-100' : ''}`}>
                <span className="font-bold text-teal-600">1.</span>
                <span className="text-sm text-gray-700">Identifier la partie entière : {Math.floor(selectedNumber)}</span>
              </div>
              <div className={`flex items-center gap-2 p-2 rounded ${animationStep >= 3 ? 'bg-teal-100' : ''}`}>
                <span className="font-bold text-teal-600">2.</span>
                <span className="text-sm text-gray-700">Borne gauche = partie entière</span>
              </div>
              <div className={`flex items-center gap-2 p-2 rounded ${animationStep >= 4 ? 'bg-teal-100' : ''}`}>
                <span className="font-bold text-teal-600">3.</span>
                <span className="text-sm text-gray-700">Borne droite = partie entière + 1</span>
              </div>
              <div className={`flex items-center gap-2 p-2 rounded ${animationStep >= 5 ? 'bg-teal-100' : ''}`}>
                <span className="font-bold text-teal-600">4.</span>
                <span className="text-sm text-gray-700">Écrire l'encadrement complet</span>
              </div>
            </div>
          </div>
          
          <div className="flex justify-center">
            <button
              onClick={animateEncadrement}
              disabled={isAnimating}
              className="flex items-center gap-2 px-6 py-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600 disabled:opacity-50 transition-colors"
            >
              <Play className="w-5 h-5" />
              {isAnimating ? 'Animation en cours...' : 'Animer l\'encadrement'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-100 p-4">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/chapitre/cm1-nombres-decimaux" className="p-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Encadrer les nombres décimaux</h1>
            <p className="text-gray-600 mt-2">Représenter sur la droite graduée (4 &lt; 4,3 &lt; 5)</p>
          </div>
        </div>

        {/* Sélecteur de nombres */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-teal-100 rounded-lg">
              <Eye className="w-6 h-6 text-teal-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Comprendre l'encadrement</h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
            {[4.3, 2.7, 8.9, 12.45, 0.6, 7.23].map((num, index) => (
              <button
                key={index}
                onClick={() => setSelectedNumber(num)}
                className={`p-3 rounded-lg border transition-all ${
                  selectedNumber === num
                    ? 'border-teal-500 bg-teal-50'
                    : 'border-gray-200 hover:border-teal-300 bg-white'
                }`}
              >
                <div className="text-sm font-medium text-gray-800">
                  {formatNumber(num)}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Droite graduée */}
        {renderNumberLine()}

        {/* Exercices */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-teal-100 rounded-lg">
              <Target className="w-6 h-6 text-teal-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Exercices pratiques</h2>
            <div className="ml-auto flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-600" />
              <span className="font-medium text-gray-700">{score}/{attempts}</span>
            </div>
          </div>

          {currentExercise < exercises.length ? (
            <div className="space-y-6">
              <div className="text-center">
                <div className="text-sm text-gray-600 mb-2">
                  Exercice {currentExercise + 1} sur {exercises.length}
                </div>
                <div className="text-3xl font-bold text-gray-800 mb-4">
                  Encadre {formatNumber(getCurrentExercise().number)}
                </div>
                <div className="text-gray-600 mb-6">
                  Trouve les deux nombres entiers qui encadrent ce nombre décimal
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-center justify-center gap-4 text-2xl font-bold">
                  <input
                    type="number"
                    value={userAnswers.left}
                    onChange={(e) => setUserAnswers({...userAnswers, left: e.target.value})}
                    placeholder="?"
                    className="w-20 text-center border-2 border-gray-300 rounded-lg focus:border-teal-500 focus:outline-none bg-white text-gray-900 placeholder-gray-400"
                  />
                  <span className="text-gray-400">&lt;</span>
                  <span className="text-teal-600">{formatNumber(getCurrentExercise().number)}</span>
                  <span className="text-gray-400">&lt;</span>
                  <input
                    type="number"
                    value={userAnswers.right}
                    onChange={(e) => setUserAnswers({...userAnswers, right: e.target.value})}
                    placeholder="?"
                    className="w-20 text-center border-2 border-gray-300 rounded-lg focus:border-teal-500 focus:outline-none bg-white text-gray-900 placeholder-gray-400"
                  />
                </div>
              </div>

              <div className="flex justify-center gap-4">
                <button
                  onClick={checkAnswer}
                  disabled={!userAnswers.left || !userAnswers.right || showAnswer}
                  className="px-6 py-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600 disabled:opacity-50 transition-colors"
                >
                  Vérifier
                </button>
                
                {showAnswer && (
                  <button
                    onClick={nextExercise}
                    className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                  >
                    Suivant
                  </button>
                )}
              </div>

              {showAnswer && (
                <div className={`p-4 rounded-lg border ${
                  isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    {isCorrect ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600" />
                    )}
                    <span className={`font-bold ${isCorrect ? 'text-green-800' : 'text-red-800'}`}>
                      {isCorrect ? 'Correct !' : 'Incorrect'}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 mb-2">
                    {getCurrentExercise().explanation}
                  </div>
                  <div className="text-center text-lg font-bold text-gray-800">
                    {getCurrentExercise().left} &lt; {formatNumber(getCurrentExercise().number)} &lt; {getCurrentExercise().right}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Félicitations !</h3>
              <p className="text-gray-600 mb-4">
                Tu as terminé tous les exercices avec un score de {score}/{attempts}
              </p>
              <button
                onClick={resetExercises}
                className="px-6 py-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
              >
                Recommencer
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 