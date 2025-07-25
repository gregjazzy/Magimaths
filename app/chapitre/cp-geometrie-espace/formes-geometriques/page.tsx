'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, XCircle, RotateCcw, Volume2, Play } from 'lucide-react';

export default function FormesGeometriquesPage() {
  const [currentExercise, setCurrentExercise] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showExercises, setShowExercises] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredCorrectly, setAnsweredCorrectly] = useState<Set<number>>(new Set());
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [shuffledChoices, setShuffledChoices] = useState<string[]>([]);

  // Sauvegarder les progrès
  const saveProgress = (score: number, maxScore: number) => {
    const progress = {
      sectionId: 'formes-geometriques',
      completed: true,
      score: score,
      maxScore: maxScore,
      completedAt: new Date().toISOString(),
      attempts: 1
    };

    const existingProgress = localStorage.getItem('cp-geometrie-progress');
    let allProgress = [];
    
    if (existingProgress) {
      allProgress = JSON.parse(existingProgress);
      const existingIndex = allProgress.findIndex((p: any) => p.sectionId === 'formes-geometriques');
      
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

    localStorage.setItem('cp-geometrie-progress', JSON.stringify(allProgress));
  };

  // Exercices sur les formes géométriques
  const exercises = [
    { question: 'Quelle est cette forme ?', visual: '🔵', correctAnswer: 'Cercle', choices: ['Carré', 'Rectangle', 'Cercle'] },
    { question: 'Combien de côtés a un triangle ?', visual: '🔺', correctAnswer: '3 côtés', choices: ['2 côtés', '3 côtés', '4 côtés'] },
    { question: 'Quelle forme n\'a aucun côté ?', visual: '⭕', correctAnswer: 'Cercle', choices: ['Carré', 'Triangle', 'Cercle'] },
    { question: 'Quelle est cette forme ?', visual: '🟩', correctAnswer: 'Rectangle', choices: ['Carré', 'Rectangle', 'Triangle'] },
    { question: 'Combien d\'angles droits a un carré ?', visual: '🟦', correctAnswer: '4 angles', choices: ['2 angles', '3 angles', '4 angles'] },
    { question: 'Quelle est cette forme ?', visual: '🔺', correctAnswer: 'Triangle', choices: ['Carré', 'Rectangle', 'Triangle'] },
    { question: 'Combien de côtés a un rectangle ?', visual: '🟫', correctAnswer: '4 côtés', choices: ['2 côtés', '3 côtés', '4 côtés'] },
    { question: 'Quelle est cette forme ?', visual: '🟨', correctAnswer: 'Carré', choices: ['Carré', 'Rectangle', 'Triangle'] },
    { question: 'Quelle forme a tous ses côtés égaux ?', visual: '🟪', correctAnswer: 'Carré', choices: ['Rectangle', 'Carré', 'Triangle'] },
    { question: 'Combien d\'angles a un cercle ?', visual: '🔴', correctAnswer: '0 angle', choices: ['1 angle', '2 angles', '0 angle'] },
    { question: 'Quelle forme a 2 côtés longs et 2 côtés courts ?', visual: '🟩', correctAnswer: 'Rectangle', choices: ['Carré', 'Rectangle', 'Triangle'] },
    { question: 'Combien de sommets (pointes) a un triangle ?', visual: '🔺', correctAnswer: '3 sommets', choices: ['2 sommets', '3 sommets', '4 sommets'] }
  ];

  // Fonction pour mélanger un tableau
  const shuffleArray = (array: string[]) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Initialiser les choix mélangés pour l'exercice actuel
  const initializeShuffledChoices = () => {
    const currentChoices = exercises[currentExercise].choices;
    const shuffled = shuffleArray(currentChoices);
    setShuffledChoices(shuffled);
  };

  // Effet pour mélanger les choix quand on change d'exercice
  useEffect(() => {
    if (exercises.length > 0) {
      initializeShuffledChoices();
    }
  }, [currentExercise]);

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

    // Si bonne réponse → passage automatique après 1.5s
    if (correct) {
      setTimeout(() => {
        if (currentExercise + 1 < exercises.length) {
          setCurrentExercise(currentExercise + 1);
          setUserAnswer('');
          setIsCorrect(null);
        } else {
          // Dernier exercice terminé
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/chapitre/cp-geometrie-espace" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-4">
            <ArrowLeft className="w-4 h-4" />
            <span>Retour au chapitre</span>
          </Link>
          
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h1 className="text-3xl font-bold text-gray-900 mb-4 text-center">
              🔺 Les formes géométriques
            </h1>
            <p className="text-gray-600 text-center">
              Reconnaître les carrés, cercles, triangles et rectangles
            </p>
          </div>
        </div>

        {/* Modal de completion */}
        {showCompletionModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-8 shadow-2xl text-center max-w-md w-full">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Félicitations !</h2>
              <p className="text-gray-600 mb-6">
                Tu as terminé les exercices sur les formes géométriques !
              </p>
              <div className="bg-blue-50 rounded-lg p-4 mb-6">
                <div className="text-3xl font-bold text-blue-600">{finalScore}/{exercises.length}</div>
                <div className="text-sm text-gray-600">Score final</div>
              </div>
              <div className="space-y-3">
                <button
                  onClick={() => {
                    setShowCompletionModal(false);
                    resetAll();
                  }}
                  className="w-full bg-blue-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-600 transition-colors"
                >
                  Recommencer
                </button>
                <Link 
                  href="/chapitre/cp-geometrie-espace"
                  className="block w-full bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-bold hover:bg-gray-300 transition-colors"
                >
                  Retour au chapitre
                </Link>
              </div>
            </div>
          </div>
        )}

        {!showExercises ? (
          /* APPRENTISSAGE */
          <div className="space-y-8">
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <span className="text-3xl mr-3">📚</span>
                Les 4 formes de base
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <div className="text-4xl mb-3">🟦</div>
                  <h3 className="font-bold text-blue-800 mb-2">CARRÉ</h3>
                  <ul className="text-xs space-y-1 text-blue-700">
                    <li>• 4 côtés égaux</li>
                    <li>• 4 angles droits</li>
                    <li>• Tous les côtés pareils</li>
                  </ul>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg text-center">
                  <div className="text-4xl mb-3">🟩</div>
                  <h3 className="font-bold text-green-800 mb-2">RECTANGLE</h3>
                  <ul className="text-xs space-y-1 text-green-700">
                    <li>• 4 côtés (2 longs, 2 courts)</li>
                    <li>• 4 angles droits</li>
                    <li>• Côtés opposés égaux</li>
                  </ul>
                </div>
                
                <div className="bg-red-50 p-4 rounded-lg text-center">
                  <div className="text-4xl mb-3">🔺</div>
                  <h3 className="font-bold text-red-800 mb-2">TRIANGLE</h3>
                  <ul className="text-xs space-y-1 text-red-700">
                    <li>• 3 côtés</li>
                    <li>• 3 angles</li>
                    <li>• 3 sommets (pointes)</li>
                  </ul>
                </div>
                
                <div className="bg-purple-50 p-4 rounded-lg text-center">
                  <div className="text-4xl mb-3">🔵</div>
                  <h3 className="font-bold text-purple-800 mb-2">CERCLE</h3>
                  <ul className="text-xs space-y-1 text-purple-700">
                    <li>• 0 côté</li>
                    <li>• Tout rond</li>
                    <li>• Pas d'angles</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={() => setShowExercises(true)}
                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-4 rounded-xl font-bold text-lg hover:opacity-90 transition-opacity inline-flex items-center"
              >
                <Play className="w-5 h-5 mr-2" />
                Commencer les exercices !
              </button>
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
                  className="bg-blue-500 h-4 rounded-full transition-all duration-500"
                  style={{ width: `${((currentExercise + 1) / exercises.length) * 100}%` }}
                ></div>
              </div>
              
              {/* Score */}
              <div className="text-center">
                <div className="text-xl font-bold text-blue-600">
                  Score : {score}/{exercises.length}
                </div>
              </div>
            </div>

            {/* Question */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="text-center mb-6">
                <div className="text-6xl mb-4">{exercises[currentExercise].visual}</div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  {exercises[currentExercise].question}
                </h3>
              </div>

              {/* Choix de réponses */}
              <div className="grid grid-cols-1 gap-3 max-w-md mx-auto">
                {shuffledChoices.map((choice, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerClick(choice)}
                    disabled={isCorrect !== null}
                    className={`p-4 rounded-lg font-bold text-lg transition-all ${
                      userAnswer === choice
                        ? isCorrect
                          ? 'bg-green-500 text-white'
                          : 'bg-red-500 text-white'
                        : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                    } ${isCorrect !== null ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    {choice}
                    {userAnswer === choice && isCorrect && (
                      <CheckCircle className="inline w-5 h-5 ml-2" />
                    )}
                    {userAnswer === choice && isCorrect === false && (
                      <XCircle className="inline w-5 h-5 ml-2" />
                    )}
                  </button>
                ))}
              </div>

              {/* Feedback */}
              {isCorrect !== null && (
                <div className="mt-6 text-center">
                  {isCorrect ? (
                    <div className="text-green-600 font-bold text-lg">
                      ✅ Bravo ! C'est la bonne réponse !
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="text-red-600 font-bold text-lg">
                        ❌ Ce n'est pas ça, essaie encore !
                      </div>
                      <button
                        onClick={nextExercise}
                        className="bg-blue-500 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-600 transition-colors"
                      >
                        Question suivante
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 