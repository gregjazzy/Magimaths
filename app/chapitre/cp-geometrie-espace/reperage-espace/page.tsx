'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, XCircle, RotateCcw, Volume2, Play } from 'lucide-react';

export default function ReperageEspacePage() {
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
      sectionId: 'reperage-espace',
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
      const existingIndex = allProgress.findIndex((p: any) => p.sectionId === 'reperage-espace');
      
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

  // Exercices sur le repérage dans l'espace
  const exercises = [
    { question: 'Le chat est... le canapé', visual: '🐱🛋️', correctAnswer: 'SUR', choices: ['SUR', 'SOUS', 'DEVANT'] },
    { question: 'Le ballon est... la table', visual: '⚽🏓', correctAnswer: 'SOUS', choices: ['SUR', 'SOUS', 'À CÔTÉ'] },
    { question: 'L\'enfant est... la porte', visual: '🧒🚪', correctAnswer: 'DEVANT', choices: ['DEVANT', 'DERRIÈRE', 'SUR'] },
    { question: 'Le chien est... l\'arbre', visual: '🐕🌳', correctAnswer: 'DERRIÈRE', choices: ['DEVANT', 'DERRIÈRE', 'DANS'] },
    { question: 'La fleur est... les deux arbres', visual: '🌳🌸🌳', correctAnswer: 'ENTRE', choices: ['SUR', 'SOUS', 'ENTRE'] },
    { question: 'Le livre est... l\'étagère', visual: '📚📚📚', correctAnswer: 'SUR', choices: ['SUR', 'SOUS', 'DEVANT'] },
    { question: 'La souris est... le trou', visual: '🐭🕳️', correctAnswer: 'DANS', choices: ['SUR', 'DANS', 'À CÔTÉ'] },
    { question: 'L\'oiseau est... la branche', visual: '🐦🌿', correctAnswer: 'SUR', choices: ['SUR', 'SOUS', 'DANS'] },
    { question: 'Le poisson est... l\'eau', visual: '🐠💧', correctAnswer: 'DANS', choices: ['SUR', 'SOUS', 'DANS'] },
    { question: 'La voiture est... le garage', visual: '🚗🏠', correctAnswer: 'DANS', choices: ['SUR', 'DANS', 'DEVANT'] },
    { question: 'Le nuage est... la maison', visual: '☁️🏠', correctAnswer: 'AU-DESSUS', choices: ['SUR', 'SOUS', 'AU-DESSUS'] },
    { question: 'Le crayon est... la trousse et la règle', visual: '📝✏️📏', correctAnswer: 'ENTRE', choices: ['SUR', 'ENTRE', 'DANS'] }
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/chapitre/cp-geometrie-espace" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-4">
            <ArrowLeft className="w-4 h-4" />
            <span>Retour au chapitre</span>
          </Link>
          
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h1 className="text-3xl font-bold text-gray-900 mb-4 text-center">
              🧭 Se repérer dans l'espace
            </h1>
            <p className="text-gray-600 text-center">
              Apprendre les mots : dessus, dessous, devant, derrière, à côté...
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
                Tu as terminé les exercices sur le repérage dans l'espace !
              </p>
              <div className="bg-indigo-50 rounded-lg p-4 mb-6">
                <div className="text-3xl font-bold text-indigo-600">{finalScore}/{exercises.length}</div>
                <div className="text-sm text-gray-600">Score final</div>
              </div>
              <div className="space-y-3">
                <button
                  onClick={() => {
                    setShowCompletionModal(false);
                    resetAll();
                  }}
                  className="w-full bg-indigo-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-indigo-600 transition-colors"
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
                Ce qu'il faut savoir
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-bold text-blue-800 mb-3">🎯 Vocabulaire spatial</h3>
                  <ul className="space-y-2 text-sm">
                    <li><strong>SUR</strong> = au-dessus de (le livre est sur la table)</li>
                    <li><strong>SOUS</strong> = en dessous de (le chat est sous le lit)</li>
                    <li><strong>DEVANT</strong> = face à (je suis devant la porte)</li>
                    <li><strong>DERRIÈRE</strong> = dos à (il se cache derrière l'arbre)</li>
                    <li><strong>À CÔTÉ</strong> = près de (la chaise est à côté du bureau)</li>
                    <li><strong>ENTRE</strong> = au milieu de (la fleur est entre les arbres)</li>
                  </ul>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-bold text-green-800 mb-3">💡 Méthode</h3>
                  <ol className="space-y-2 text-sm">
                    <li><strong>1.</strong> Regarde bien l'image</li>
                    <li><strong>2.</strong> Repère les deux objets</li>
                    <li><strong>3.</strong> Demande-toi : "Où est le premier objet par rapport au second ?"</li>
                    <li><strong>4.</strong> Utilise le bon mot de vocabulaire</li>
                  </ol>
                </div>
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={() => setShowExercises(true)}
                className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white px-8 py-4 rounded-xl font-bold text-lg hover:opacity-90 transition-opacity inline-flex items-center"
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
                  className="bg-indigo-500 h-4 rounded-full transition-all duration-500"
                  style={{ width: `${((currentExercise + 1) / exercises.length) * 100}%` }}
                ></div>
              </div>
              
              {/* Score */}
              <div className="text-center">
                <div className="text-xl font-bold text-indigo-600">
                  Score : {score}/{exercises.length}
                </div>
              </div>
            </div>

            {/* Question */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="text-center mb-6">
                <div className="text-4xl mb-4">{exercises[currentExercise].visual}</div>
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
                        : 'bg-indigo-100 text-indigo-800 hover:bg-indigo-200'
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
                        className="bg-indigo-500 text-white px-6 py-2 rounded-lg font-bold hover:bg-indigo-600 transition-colors"
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