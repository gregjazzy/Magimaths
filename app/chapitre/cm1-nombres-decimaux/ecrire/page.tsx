'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, XCircle, RefreshCw, Trophy, Target, Lightbulb, Calculator, Edit } from 'lucide-react';
import { VoiceInput } from '@/components/VoiceInput';

export default function EcrireNombresDecimauxPage() {
  const [currentExercise, setCurrentExercise] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [showAnswer, setShowAnswer] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);

  const exercises = [
    { reading: 'Quarante-trois unités sept dixièmes', number: '43.7', difficulty: 'Facile' },
    { reading: 'Six cent douze unités douze centièmes', number: '612.12', difficulty: 'Facile' },
    { reading: 'Quatre-vingt-cinq unités trois dixièmes', number: '85.3', difficulty: 'Facile' },
    { reading: 'Cent soixante-quatorze unités six dixièmes', number: '174.6', difficulty: 'Facile' },
    { reading: 'Vingt-neuf unités huit centièmes', number: '29.08', difficulty: 'Facile' },
    { reading: 'Trois cent cinq unités quatre dixièmes', number: '305.4', difficulty: 'Facile' },
    { reading: 'Soixante-sept unités vingt-cinq centièmes', number: '67.25', difficulty: 'Moyen' },
    { reading: 'Quatre cent vingt-huit unités un dixième', number: '428.1', difficulty: 'Moyen' },
    { reading: 'Cent trente-neuf unités quatre-vingt-sept centièmes', number: '139.87', difficulty: 'Moyen' },
    { reading: 'Cinquante-deux centièmes', number: '0.52', difficulty: 'Moyen' },
    { reading: 'Huit cent quatre unités trois dixièmes', number: '804.3', difficulty: 'Moyen' },
    { reading: 'Soixante-seize unités neuf centièmes', number: '76.09', difficulty: 'Moyen' },
    { reading: 'Mille cinq cent deux unités sept dixièmes', number: '1502.7', difficulty: 'Difficile' },
    { reading: 'Deux cent quarante-huit unités soixante-trois centièmes', number: '248.63', difficulty: 'Difficile' },
    { reading: 'Quatre-vingt-quinze centièmes', number: '0.95', difficulty: 'Difficile' },
    { reading: 'Trois mille six cent soixante-dix unités deux dixièmes', number: '3670.2', difficulty: 'Difficile' },
    { reading: 'Quatre-vingt-onze unités quarante-sept centièmes', number: '91.47', difficulty: 'Difficile' },
    { reading: 'Mille quatre-vingt-neuf unités cinq dixièmes', number: '1089.5', difficulty: 'Difficile' },
    { reading: 'Soixante-treize centièmes', number: '0.73', difficulty: 'Difficile' },
    { reading: 'Quatre cent cinquante-six unités dix-huit centièmes', number: '456.18', difficulty: 'Difficile' }
  ];

  const formatNumber = (num: string) => {
    return num.replace('.', ',');
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Facile': return 'bg-green-100 text-green-800';
      case 'Moyen': return 'bg-yellow-100 text-yellow-800';
      case 'Difficile': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const normalizeAnswer = (answer: string): string => {
    // Normaliser la réponse en remplaçant les virgules par des points
    return answer.replace(',', '.').trim();
  };

  const checkAnswer = () => {
    const exercise = exercises[currentExercise];
    const userAnswerNormalized = normalizeAnswer(userAnswer);
    const correctAnswerNormalized = exercise.number;
    
    setShowAnswer(true);
    setIsCorrect(userAnswerNormalized === correctAnswerNormalized);
    setAttempts(attempts + 1);
    
    if (userAnswerNormalized === correctAnswerNormalized) {
      setScore(score + 1);
    }
  };

  const nextExercise = () => {
    if (currentExercise < exercises.length - 1) {
      setCurrentExercise(currentExercise + 1);
      setUserAnswer('');
      setShowAnswer(false);
      setIsCorrect(false);
    }
  };

  const resetExercises = () => {
    setCurrentExercise(0);
    setUserAnswer('');
    setShowAnswer(false);
    setIsCorrect(false);
    setScore(0);
    setAttempts(0);
  };

  const calculateScore = () => {
    return attempts > 0 ? Math.round((score / attempts) * 100) : 0;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/chapitre/cm1-nombres-decimaux" className="p-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Écrire un nombre décimal</h1>
            <p className="text-gray-600">Écris en chiffres les nombres décimaux donnés en lettres</p>
          </div>
        </div>

        {/* Section explicative */}
        <div className="bg-white rounded-xl p-6 shadow-lg mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Lightbulb className="w-6 h-6 text-blue-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">💡 Comment procéder ?</h2>
          </div>
          
          <div className="space-y-6">
            {/* Exemple */}
            <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-200">
              <h3 className="font-bold text-blue-800 mb-2">📖 Exemple :</h3>
              <div className="text-center">
                <div className="text-lg text-blue-700 mb-2">
                  "Vingt-trois unités quarante-cinq centièmes"
                </div>
                <div className="text-2xl font-bold text-blue-800">
                  ↓
                </div>
                <div className="text-3xl font-bold text-blue-600 mt-2">
                  23,45
                </div>
              </div>
            </div>
            
            {/* Méthode */}
            <div className="bg-green-50 rounded-lg p-4 border-2 border-green-200">
              <h3 className="font-bold text-green-800 mb-3">🎯 Méthode :</h3>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">1.</span>
                  <span className="text-sm text-green-800">Identifie la partie entière (avant "unités")</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">2.</span>
                  <span className="text-sm text-green-800">Identifie la partie décimale et son unité (dixièmes, centièmes, millièmes)</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">3.</span>
                  <span className="text-sm text-green-800">Écris le nombre avec la virgule au bon endroit</span>
                </div>
              </div>
            </div>
            
            {/* Attention */}
            <div className="bg-orange-50 rounded-lg p-4 border-2 border-orange-200">
              <h3 className="font-bold text-orange-800 mb-2">⚠️ Attention :</h3>
              <div className="text-sm text-orange-700 space-y-1">
                <div>• Utilise la virgule (,) comme séparateur décimal</div>
                <div>• N'oublie pas les zéros si nécessaire (ex: 3,05 pour "trois unités cinq centièmes")</div>
                <div>• Pour les nombres sans partie entière, commence par 0 (ex: 0,25)</div>
              </div>
            </div>
          </div>
        </div>

        {/* Progression */}
        <div className="bg-white rounded-xl p-6 shadow-lg mb-8">
          <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">
              <Trophy className="inline w-6 h-6 mr-2 text-yellow-600" />
              Progression
              </h2>
              <div className="text-sm text-gray-600">
              Exercice {currentExercise + 1} sur {exercises.length}
            </div>
          </div>

          <div className="mb-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentExercise + 1) / exercises.length) * 100}%` }}
              ></div>
          </div>
        </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{score}</div>
              <div className="text-sm text-gray-600">Réussites</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{calculateScore()}%</div>
              <div className="text-sm text-gray-600">Score</div>
            </div>
          </div>
        </div>

        {/* Exercice actuel */}
        {currentExercise < exercises.length ? (
          <div className="bg-white rounded-xl p-8 shadow-lg">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Edit className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-800">Exercice {currentExercise + 1}</h2>
                <span className={`px-2 py-1 rounded text-sm ${getDifficultyColor(exercises[currentExercise].difficulty)}`}>
                  {exercises[currentExercise].difficulty}
                </span>
              </div>
              
              <div className="text-gray-600 mb-6">
                Écris ce nombre en chiffres :
              </div>
              
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <div className="text-2xl font-bold text-gray-800 mb-4">
                  "{exercises[currentExercise].reading}"
                </div>
              </div>
              
              <div className="max-w-md mx-auto">
                <input
                  type="text"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="Exemple : 23,45"
                  className="w-full p-4 text-2xl font-bold text-center border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none bg-white text-gray-900 placeholder-gray-400"
                  disabled={showAnswer}
                  autoComplete="off"
                />
                
                {/* Reconnaissance vocale */}
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <VoiceInput
                    onTranscript={(transcript) => setUserAnswer(transcript)}
                    placeholder="Ou dites le nombre à voix haute..."
                    className="justify-center"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-center gap-4 mb-6">
              <button
                onClick={checkAnswer}
                disabled={!userAnswer || showAnswer}
                className="px-8 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Vérifier ma réponse
              </button>
              
              {showAnswer && currentExercise < exercises.length - 1 && (
                <button
                  onClick={nextExercise}
                  className="px-8 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  Exercice suivant
                </button>
              )}
            </div>

            {showAnswer && (
              <div className={`p-6 rounded-lg border-2 ${
                isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
              }`}>
                <div className="flex items-center gap-2 mb-4">
                  {isCorrect ? (
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  ) : (
                    <XCircle className="w-6 h-6 text-red-600" />
                  )}
                  <span className={`text-xl font-bold ${isCorrect ? 'text-green-800' : 'text-red-800'}`}>
                    {isCorrect ? 'Correct !' : 'Incorrect'}
                  </span>
                </div>
                
                                 <div className="text-center">
                   <div className="text-lg text-gray-700 mb-2">
                     Réponse correcte :
                   </div>
                   <div className="text-3xl font-bold text-blue-600">
                     {formatNumber(exercises[currentExercise].number)}
                   </div>
                 </div>
                 
                 {/* Explication détaillée */}
                 <div className="mt-6 bg-blue-50 rounded-lg p-4 border-2 border-blue-200">
                   <h4 className="font-bold text-blue-800 mb-3">📚 Explication détaillée :</h4>
                   
                   {/* Décomposition visuelle */}
                   <div className="bg-white rounded-lg p-4 mb-4">
                     <div className="text-center mb-3">
                       <div className="text-lg font-semibold text-gray-800 mb-2">
                         "{exercises[currentExercise].reading}"
                       </div>
                       <div className="text-xl text-blue-600">↓ Décomposition ↓</div>
                     </div>
                     
                     <div className="grid md:grid-cols-2 gap-4">
                       {/* Partie entière */}
                       {(() => {
                         const reading = exercises[currentExercise].reading;
                         const number = exercises[currentExercise].number;
                         const [integerPart, decimalPart] = number.split('.');
                         
                         // Extraire la partie entière du texte
                         const integerMatch = reading.match(/^(.*?) unités?/i);
                         const integerText = integerMatch ? integerMatch[1].trim() : '';
                         
                         // Extraire la partie décimale du texte
                         const decimalMatch = reading.match(/(?:unités? |^)(.*?) (dixièmes?|centièmes?|millièmes?)$/i);
                         const decimalText = decimalMatch ? decimalMatch[1].trim() : '';
                         const decimalUnit = decimalMatch ? decimalMatch[2] : '';
                         
                         return (
                           <>
                             <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                               <div className="text-sm font-semibold text-green-800 mb-1">🟢 Partie entière</div>
                               <div className="text-green-700">
                                 {integerText || integerPart} = <span className="font-bold">{integerPart}</span>
                               </div>
                             </div>
                             
                             <div className="bg-orange-50 rounded-lg p-3 border border-orange-200">
                               <div className="text-sm font-semibold text-orange-800 mb-1">🟠 Partie décimale</div>
                               <div className="text-orange-700">
                                 {decimalText} {decimalUnit} = <span className="font-bold">0,{decimalPart}</span>
                               </div>
                             </div>
                           </>
                         );
                       })()}
                     </div>
                     
                     {/* Assemblage final */}
                     <div className="mt-4 text-center">
                       <div className="text-sm text-gray-600 mb-2">🔗 Assemblage :</div>
                       <div className="text-xl font-bold text-gray-800">
                         <span className="text-green-600">{exercises[currentExercise].number.split('.')[0]}</span>
                         <span className="text-red-500 mx-1">,</span>
                         <span className="text-orange-600">{exercises[currentExercise].number.split('.')[1]}</span>
                         <span className="mx-2">=</span>
                         <span className="text-blue-600">{formatNumber(exercises[currentExercise].number)}</span>
                       </div>
                     </div>
                   </div>
                   
                   {/* Méthode à retenir */}
                   <div className="bg-yellow-50 rounded-lg p-3 border border-yellow-200">
                     <div className="text-sm font-semibold text-yellow-800 mb-2">💡 Méthode à retenir :</div>
                     <div className="text-xs text-yellow-700 space-y-1">
                       <div>1. Repère la partie avant "unités" → partie entière</div>
                       <div>2. Repère la partie après "unités" + son unité → partie décimale</div>
                       <div>3. Assemble avec une virgule entre les deux parties</div>
                     </div>
                   </div>
                 </div>
                </div>
              )}
          </div>
        ) : (
          <div className="bg-white rounded-xl p-8 shadow-lg text-center">
            <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Félicitations !</h2>
            <p className="text-gray-600 mb-6">
              Tu as terminé tous les exercices avec un score de {calculateScore()}%
            </p>
            <div className="text-2xl font-bold text-blue-600 mb-6">
              {score} / {attempts} réussites
            </div>
            <button
              onClick={resetExercises}
              className="px-8 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <RefreshCw className="w-5 h-5 inline mr-2" />
              Recommencer
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 