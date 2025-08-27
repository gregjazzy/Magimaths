'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, RefreshCw, CheckCircle, XCircle, Eye, Lightbulb, Target, Trophy, Grid, Calculator, Book, Sparkles, ChevronRight, Ruler } from 'lucide-react';

export default function DroiteSection() {
  const [animationStep, setAnimationStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [selectedFraction, setSelectedFraction] = useState({ num: 3, den: 4 });

  // États pour les exercices
  const [currentExercise, setCurrentExercise] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [showHelp, setShowHelp] = useState(false);
  const [correctAnimationStep, setCorrectAnimationStep] = useState(0);
  const [isCorrectAnimating, setIsCorrectAnimating] = useState(false);

  const renderMathFraction = (num: number, den: number) => {
    return (
      <div className="text-center">
        <div className="text-2xl font-bold text-blue-600">{num}</div>
        <div className="h-0.5 w-12 bg-gray-400 my-1"></div>
        <div className="text-2xl font-bold text-purple-600">{den}</div>
      </div>
    );
  };

  const renderNumberLine = (fraction: { num: number, den: number }, animationPhase = 0) => {
    return (
      <div className="flex flex-col items-center space-y-8 p-6 bg-white rounded-lg">
        {/* Visualisation de la décomposition de l'unité */}
        <div className="w-full">
          <div className="text-center mb-6">
            <div className="font-bold text-purple-800 text-lg">
              Décomposition de l'unité
            </div>
            <div className="text-purple-600 text-sm">
              Je divise 1 unité en {fraction.den} parties égales
            </div>
          </div>

                    <div className="flex flex-col space-y-4">
            <div className="flex items-center justify-center space-x-16">
              {/* Unité complète avec son titre */}
              <div>
                <div className="text-gray-700 mb-2">Unité complète</div>
                <div className="w-24 h-16 bg-blue-200 border-2 border-blue-400 rounded flex items-center justify-center">
                  <span className="text-2xl font-bold text-blue-800">1</span>
                </div>
              </div>

              {/* Flèche */}
              <div className="text-3xl text-purple-600">→</div>

              {/* Unité divisée avec son titre */}
              <div>
                <div className="text-gray-700 mb-2">Je prends {fraction.num} parties</div>
                <div className="flex">
                  {Array.from({ length: fraction.den }, (_, i) => (
                    <div
                      key={i}
                      className={`w-8 h-16 border-2 flex items-center justify-center
                        ${i < fraction.num ? 'bg-green-200 border-green-400' : 'bg-purple-100 border-purple-300'}
                      `}
                      style={{
                        borderLeftWidth: i === 0 ? '2px' : '1px',
                      }}
                    >
                      {i < fraction.num && (
                        <span className="text-sm font-bold transform rotate-90">✓</span>
                      )}
                    </div>
                  ))}
                </div>
                <div className="text-center mt-2 text-green-700 font-bold">
                  = {fraction.num}/{fraction.den}
                </div>
              </div>
            </div>
                  </div>
                </div>

        {/* Droite graduée */}
        <div className="relative h-32 w-full mt-12">
          {/* Ligne principale */}
          <div className="absolute left-0 right-0 top-1/2 h-1 bg-gray-800"></div>
          
          {/* Graduations principales avec nombres */}
          {[0, 1, 2].map(num => (
            <div key={num} className="absolute top-1/2 -translate-y-1/2" style={{ left: `${num * 50}%` }}>
              <div className="h-8 w-0.5 bg-gray-800"></div>
              <div className="absolute -top-8 transform -translate-x-1/2 text-xl font-bold">
                  {num}
              </div>
            </div>
          ))}

          {/* Graduations des quarts */}
          {Array.from({ length: 8 }, (_, i) => (
            <div
                key={i}
              className="absolute top-1/2 -translate-y-1/2"
              style={{ left: `${(i + 1) * 12.5}%` }}
            >
              <div className="h-4 w-0.5 bg-purple-500 -translate-y-1/2"></div>
              <div className="mt-4 text-sm text-purple-600">{i + 1}/4</div>
            </div>
          ))}

          {/* Point de la fraction */}
          <div
            className="absolute top-1/2 -translate-y-1/2"
            style={{ left: '75%' }}
          >
            <div className="w-4 h-4 bg-red-500 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute -top-16 left-1/2 -translate-x-1/2 bg-white border-2 border-red-500 rounded-lg p-2 shadow-lg">
              <div className="text-center">
                {renderMathFraction(fraction.num, fraction.den)}
                <div className="text-sm text-gray-600 mt-1">= 0.750</div>
                <div className="text-xs text-red-500 font-bold mt-1">Position exacte</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Copie du contenu de la page de représentation des fractions
  const exercises = [
    {
      question: 'Où se situe la fraction sur la droite graduée ?',
      fraction: { num: 1, den: 2 },
      type: 'simple',
      options: [
        { position: 0.25, correct: false },
        { position: 0.5, correct: true },
        { position: 0.75, correct: false },
        { position: 1, correct: false }
      ]
    },
    {
      question: 'Où se situe la fraction sur la droite graduée ?',
      fraction: { num: 3, den: 4 },
      type: 'simple',
      options: [
        { position: 0.5, correct: false },
        { position: 0.6, correct: false },
        { position: 0.75, correct: true },
        { position: 0.8, correct: false }
      ]
    }
    // ... autres exercices
  ];

  const getCurrentExercise = () => exercises[currentExercise];

  const renderMiniNumberLine = (fraction: { num: number, den: number }, pointPosition: number, isSelected: boolean = false, isCorrect: boolean = false, showResult: boolean = false) => {
    const width = 200;
    const maxValue = Math.max(2, Math.ceil(Math.max(fraction.num / fraction.den, pointPosition) + 0.5));
    const segmentWidth = width / maxValue;
    const pointX = pointPosition * segmentWidth;
    
    return (
      <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
        <div className="relative" style={{ width: `${width}px`, height: '60px' }}>
          {/* Ligne principale */}
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-600 transform -translate-y-1/2"></div>
          
          {/* Graduations principales */}
          {Array.from({ length: maxValue + 1 }, (_, i) => (
            <div key={i} className="absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2" style={{ left: `${i * segmentWidth}px` }}>
              <div className="w-0.5 h-4 bg-gray-600 -translate-y-2"></div>
              <div className="text-xs font-medium text-gray-700 mt-1 text-center">{i}</div>
            </div>
          ))}
          
          {/* Point de la position proposée */}
          <div className="absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2 z-10" 
               style={{ left: `${pointX}px` }}>
            <div className={`w-3 h-3 rounded-full border-2 border-white shadow-md ${
              showResult && isCorrect ? 'bg-green-500' : 
              showResult && !isCorrect ? 'bg-red-500' : 
              isSelected ? 'bg-blue-500' : 'bg-purple-500'
            }`}></div>
          </div>
        </div>
      </div>
    );
  };

  const checkAnswer = () => {
    const exercise = getCurrentExercise();
    if (selectedOption === null) return;
    
    const correct = exercise.options[selectedOption].correct;
    
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
      setSelectedOption(null);
      setShowAnswer(false);
      setIsCorrect(false);
      setShowHelp(false);
      setCorrectAnimationStep(0);
      setIsCorrectAnimating(false);
    }
  };

  const resetExercises = () => {
    setCurrentExercise(0);
    setSelectedOption(null);
    setShowAnswer(false);
    setIsCorrect(false);
    setScore(0);
    setAttempts(0);
    setShowHelp(false);
    setCorrectAnimationStep(0);
    setIsCorrectAnimating(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-8">
      {/* Introduction */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Fractions sur la droite graduée
        </h2>
        <p className="text-gray-600">
          Une droite graduée nous aide à visualiser et à ordonner les fractions.
        </p>
      </div>

      {/* Démonstration */}
      <div className="bg-white rounded-xl p-8 shadow-lg">
        {renderNumberLine(selectedFraction, animationStep)}
      </div>

      {/* Section Cours */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Book className="w-6 h-6 text-purple-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-800">📚 Comment placer une fraction sur une droite ?</h2>
          </div>

        <div className="mb-6">
          <div className="bg-purple-50 rounded-lg p-4 mb-4">
            <h3 className="font-bold text-purple-800 mb-2">📝 La méthode :</h3>
            <div className="space-y-3">
              <div className="bg-blue-100 rounded-lg p-3">
                <h4 className="font-bold text-blue-800">1. Je regarde le dénominateur</h4>
                <p className="text-blue-700 text-sm">Il m'indique en combien de parties égales je dois diviser chaque unité</p>
              </div>
              <div className="bg-green-100 rounded-lg p-3">
                <h4 className="font-bold text-green-800">2. Je divise la droite</h4>
                <p className="text-green-700 text-sm">Chaque segment entre deux nombres entiers est divisé selon le dénominateur</p>
              </div>
              <div className="bg-orange-100 rounded-lg p-3">
                <h4 className="font-bold text-orange-800">3. Je compte les parties</h4>
                <p className="text-orange-700 text-sm">Le numérateur m'indique combien de parties je dois compter depuis 0</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Exercices pratiques */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Target className="w-6 h-6 text-purple-600" />
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
              <div className="text-lg font-medium text-gray-800">
                {getCurrentExercise().question}
              </div>
              <div className="mt-4">
                {renderMathFraction(getCurrentExercise().fraction.num, getCurrentExercise().fraction.den)}
              </div>
            </div>

            {/* Options de QCM avec droites graduées */}
            <div className="my-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">Choisis la bonne droite graduée :</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
                {getCurrentExercise().options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedOption(index)}
                    disabled={showAnswer}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                      selectedOption === index
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-purple-300 hover:bg-purple-25'
                    } ${
                      showAnswer && option.correct
                        ? 'border-green-500 bg-green-50'
                        : showAnswer && selectedOption === index && !option.correct
                        ? 'border-red-500 bg-red-50'
                        : ''
                    } ${showAnswer ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    <div className="space-y-3">
                      {/* Indicateur de sélection */}
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                          selectedOption === index
                            ? 'border-purple-500 bg-purple-500'
                            : 'border-gray-300'
                        }`}>
                          {selectedOption === index && (
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          )}
                        </div>
                        <span className="text-sm font-medium text-gray-700">
                          Option {String.fromCharCode(65 + index)}
                        </span>
                        {showAnswer && option.correct && (
                          <CheckCircle className="w-5 h-5 text-green-600 ml-auto" />
                        )}
                        {showAnswer && selectedOption === index && !option.correct && (
                          <XCircle className="w-5 h-5 text-red-600 ml-auto" />
                        )}
                      </div>
                      
                      {/* Droite graduée miniature */}
                      {renderMiniNumberLine(
                        getCurrentExercise().fraction,
                        option.position,
                        selectedOption === index,
                        option.correct,
                        showAnswer
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowHelp(!showHelp)}
                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2"
              >
                <Lightbulb className="w-4 h-4" />
                {showHelp ? 'Masquer l\'aide' : 'Aide'}
              </button>
              
              <button
                onClick={checkAnswer}
                disabled={selectedOption === null || showAnswer}
                className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:opacity-50 transition-colors flex items-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                Vérifier
              </button>
            </div>

            {/* Aide */}
            {showHelp && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <h3 className="font-bold text-orange-800 mb-2">💡 Aide :</h3>
                <div className="text-orange-700 text-sm space-y-1">
                  <div>• Regarde le dénominateur : {getCurrentExercise().fraction.den}</div>
                  <div>• Divise chaque unité en {getCurrentExercise().fraction.den} parties égales</div>
                  <div>• Compte {getCurrentExercise().fraction.num} parties depuis 0</div>
                  <div>• La fraction {getCurrentExercise().fraction.num}/{getCurrentExercise().fraction.den} = {(getCurrentExercise().fraction.num / getCurrentExercise().fraction.den).toFixed(2)}</div>
                </div>
              </div>
            )}

            {/* Résultat */}
            {showAnswer && (
              <div className={`rounded-lg p-4 ${isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
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
                
                <div className="mt-4 text-center">
          <button
                    onClick={nextExercise}
                    className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors flex items-center gap-2 mx-auto"
          >
                    <ChevronRight className="w-4 h-4" />
                    Exercice suivant
          </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Félicitations !</h3>
            <p className="text-gray-600 mb-4">
              Tu as terminé tous les exercices ! Score : {score}/{attempts}
            </p>
          <button
              onClick={resetExercises}
              className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors flex items-center gap-2 mx-auto"
          >
              <RefreshCw className="w-5 h-5" />
              Recommencer
          </button>
        </div>
        )}
      </div>
    </div>
  );
}