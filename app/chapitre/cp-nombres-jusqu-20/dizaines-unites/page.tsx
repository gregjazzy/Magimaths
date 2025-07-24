'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, XCircle, RotateCcw, Volume2, Package, Dot } from 'lucide-react';

// Styles CSS pour les animations personnalisées
const styles = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fade-in {
    animation: fadeIn 0.8s ease-out;
  }
  
  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.1); }
  }
  .animate-pulse-custom {
    animation: pulse 1s ease-in-out infinite;
  }
  
  @keyframes slideInRight {
    from { transform: translateX(100px); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  .animate-slide-in-right {
    animation: slideInRight 0.8s ease-out;
  }
  
  @keyframes bounce {
    0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
    40% { transform: translateY(-10px); }
    60% { transform: translateY(-5px); }
  }
  .animate-bounce-custom {
    animation: bounce 1s ease-in-out;
  }
`;

export default function ValeurPositionnelleCP20() {
  const [selectedNumber, setSelectedNumber] = useState('15');
  const [currentExercise, setCurrentExercise] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showExercises, setShowExercises] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredCorrectly, setAnsweredCorrectly] = useState<Set<number>>(new Set());
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [shuffledChoices, setShuffledChoices] = useState<string[]>([]);
  const [animatedExplanation, setAnimatedExplanation] = useState<string>('');
  const [animationTriggered, setAnimationTriggered] = useState(false);

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

  // L'animation ne se déclenche plus automatiquement - uniquement sur clic

  // Sauvegarder les progrès dans localStorage
  const saveProgress = (score: number, maxScore: number) => {
    const progress = {
      sectionId: 'dizaines-unites',
      completed: true,
      score: score,
      maxScore: maxScore,
      completedAt: new Date().toISOString(),
      attempts: 1
    };

    const existingProgress = localStorage.getItem('cp-nombres-20-progress');
    let allProgress = [];
    
    if (existingProgress) {
      allProgress = JSON.parse(existingProgress);
      const existingIndex = allProgress.findIndex((p: any) => p.sectionId === 'dizaines-unites');
      
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

    localStorage.setItem('cp-nombres-20-progress', JSON.stringify(allProgress));
  };

  // Nombres avec décomposition unités/dizaines pour CP - 4 exemples essentiels
  const numbersDecomposition = [
    { number: '12', dizaines: 1, unites: 2, visual: '🔟 🔴🔴', explanation: '1 dizaine + 2 unités' },
    { number: '15', dizaines: 1, unites: 5, visual: '🔟 🔴🔴🔴🔴🔴', explanation: '1 dizaine + 5 unités' },
    { number: '18', dizaines: 1, unites: 8, visual: '🔟 🔴🔴🔴🔴🔴🔴🔴🔴', explanation: '1 dizaine + 8 unités' },
    { number: '20', dizaines: 2, unites: 0, visual: '🔟🔟 • ', explanation: '2 dizaines + 0 unité' }
  ];

  // Exercices sur les dizaines et unités - 8 exercices basés sur les 4 nombres choisis
  const exercises = [
    { question: 'Dans 12, combien y a-t-il de dizaines ?', number: '12', type: 'dizaines', correctAnswer: '1', choices: ['1', '2', '12'] },
    { question: 'Dans 15, combien y a-t-il d\'unités ?', number: '15', type: 'unites', correctAnswer: '5', choices: ['5', '1', '15'] },
    { question: 'Dans 18, le chiffre des unités est ?', number: '18', type: 'unites', correctAnswer: '8', choices: ['8', '1', '18'] },
    { question: 'Dans 20, combien de dizaines ?', number: '20', type: 'dizaines', correctAnswer: '2', choices: ['2', '0', '20'] },
    
    // Exercices de composition
    { question: '1 dizaine + 2 unités = ?', display: '📦 + 🔴🔴', correctAnswer: '12', choices: ['12', '3', '21'] },
    { question: '1 dizaine + 5 unités = ?', display: '📦 + 🔴🔴🔴🔴🔴', correctAnswer: '15', choices: ['15', '6', '51'] },
    { question: '1 dizaine + 8 unités = ?', display: '📦 + 🔴🔴🔴🔴🔴🔴🔴🔴', correctAnswer: '18', choices: ['9', '18', '81'] },
    { question: '2 dizaines + 0 unité = ?', display: '📦📦 + •', correctAnswer: '20', choices: ['2', '20', '02'] }
  ];

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'fr-FR';
      utterance.rate = 0.7;
      speechSynthesis.speak(utterance);
    }
  };

  // Fonction pour générer une explication simple quand c'est faux
  const generateAnimatedExplanation = (exercise: any) => {
    const correctAnswer = exercise.correctAnswer;
    
    // Rendre la fonction speakText disponible globalement pour les boutons HTML
    (window as any).speakTextGlobal = speakText;
    
    if (exercise.type === 'dizaines') {
      return `
        <div class="bg-blue-50 rounded-lg p-4 mb-4 text-center">
          <h4 class="font-bold text-blue-800 mb-4">La bonne réponse est ${correctAnswer}</h4>
          <button onclick="window.speakTextGlobal('${correctAnswer}')" class="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-bold">
            🔊 Écouter la réponse
          </button>
        </div>
      `;
    } else if (exercise.type === 'unites') {
      return `
        <div class="bg-red-50 rounded-lg p-4 mb-4 text-center">
          <h4 class="font-bold text-red-800 mb-4">La bonne réponse est ${correctAnswer}</h4>
          <button onclick="window.speakTextGlobal('${correctAnswer}')" class="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-bold">
            🔊 Écouter la réponse
          </button>
        </div>
      `;
    } else {
      // Pour les exercices de composition
      const answer = exercise.correctAnswer;
      return `
        <div class="bg-green-50 rounded-lg p-4 mb-4 text-center">
          <h4 class="font-bold text-green-800 mb-4">La bonne réponse est ${answer}</h4>
          <button onclick="window.speakTextGlobal('${answer}')" class="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-bold">
            🔊 Écouter la réponse
          </button>
        </div>
      `;
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
      // Effacer l'explication si c'est correct
      setAnimatedExplanation('');
    } else if (!correct) {
      // Générer l'explication animée si c'est faux
      const explanation = generateAnimatedExplanation(exercises[currentExercise]);
      setAnimatedExplanation(explanation);
    }

    // Si bonne réponse → passage automatique après 1.5s
    if (correct) {
      setTimeout(() => {
        if (currentExercise + 1 < exercises.length) {
          setCurrentExercise(currentExercise + 1);
          setUserAnswer('');
          setIsCorrect(null);
          setAnimatedExplanation('');
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
      setAnimatedExplanation('');
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
    setAnimatedExplanation('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
        {/* Header */}
        <div className="mb-4 sm:mb-8">
          <Link href="/chapitre/cp-nombres-jusqu-20" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-3 sm:mb-4">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm sm:text-base">Retour au chapitre</span>
          </Link>
          
          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg text-center">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2 sm:mb-4">
              🔢 Dizaines et unités
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-gray-600 px-2">
              Comprends la différence entre unités et dizaines dans les nombres de 10 à 20 !
            </p>
          </div>
        </div>

        {/* Navigation entre cours et exercices */}
        <div className="flex justify-center mb-4 sm:mb-8">
          <div className="bg-white rounded-lg p-1 shadow-md flex h-auto">
            <button
              onClick={() => setShowExercises(false)}
              className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-bold transition-all text-sm sm:text-base h-full flex items-center justify-center ${
                !showExercises 
                  ? 'bg-blue-500 text-white shadow-md' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              📖 Cours
            </button>
            <button
              onClick={() => setShowExercises(true)}
              className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-bold transition-all text-sm sm:text-base h-full flex flex-col items-center justify-center ${
                showExercises 
                  ? 'bg-blue-500 text-white shadow-md' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <span>✏️ Exercices</span>
              <span className="text-xs">({score}/{exercises.length})</span>
            </button>
          </div>
        </div>

        {!showExercises ? (
          /* COURS */
          <div className="space-y-4 sm:space-y-8">
            {/* Sélecteur de nombre */}
            <div className="bg-white rounded-xl p-3 sm:p-6 shadow-lg">
              <h2 className="text-base sm:text-lg lg:text-2xl font-bold text-center mb-3 sm:mb-6 text-gray-900">
                🎯 Choisis un nombre à analyser
              </h2>
              <div className="flex justify-center">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 lg:gap-4 max-w-lg">
                  {numbersDecomposition.map((num) => (
                    <button
                      key={num.number}
                      onClick={() => {
                        setSelectedNumber(num.number);
                        setAnimationTriggered(false);
                      }}
                      className={`p-2 sm:p-3 lg:p-4 rounded-lg font-bold text-base sm:text-lg lg:text-xl transition-all min-w-[50px] sm:min-w-[60px] lg:min-w-[80px] ${
                        selectedNumber === num.number
                          ? 'bg-blue-500 text-white shadow-lg scale-105'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-102'
                      }`}
                    >
                      {num.number}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Affichage du nombre sélectionné */}
            <div className="bg-white rounded-xl p-3 sm:p-6 lg:p-8 shadow-lg text-center">
              <h3 className="text-base sm:text-lg lg:text-2xl font-bold mb-3 sm:mb-6 text-gray-900">
                🔍 Analysons le nombre {selectedNumber}
              </h3>
              
              {/* Grande visualisation du nombre */}
              <div className="bg-blue-50 rounded-lg p-3 sm:p-6 lg:p-8 mb-3 sm:mb-6 lg:mb-8">
                <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-blue-600 mb-3 sm:mb-6 animate-pulse">
                  {selectedNumber}
                </div>
                
                {/* Animation simple de décomposition */}
                <div className="bg-white rounded-lg p-3 sm:p-6 mb-3 sm:mb-6">
                  <h4 className="text-sm sm:text-base lg:text-lg font-bold mb-3 sm:mb-4 text-gray-800 text-center">
                    Décomposition de {selectedNumber}
                  </h4>
                  
                  {/* Tableau magique des positions avec animation */}
                  <div className="space-y-3 sm:space-y-4">
                    <div className="text-center">
                      <h5 className="text-base sm:text-lg font-bold text-gray-800 mb-4 sm:mb-6">
                        🎯 Tableau magique des positions
                      </h5>
                      
                      {/* Boutons de contrôle en haut */}
                      <div className="flex justify-center mb-4 sm:mb-6">
                        <button
                          onClick={() => {
                            // Toujours lancer l'animation complète
                            setAnimationTriggered(false);
                            setTimeout(() => {
                              setAnimationTriggered(true);
                              // Remettre automatiquement à zéro après l'animation
                              setTimeout(() => setAnimationTriggered(false), 4500);
                            }, 500);
                          }}
                          className="bg-purple-500 hover:bg-purple-600 text-white px-4 sm:px-6 lg:px-8 py-2 sm:py-3 rounded-lg font-bold transition-colors flex items-center space-x-2 text-sm sm:text-base"
                        >
                          <span>🎬</span>
                          <span>Voir l'animation</span>
                        </button>
                      </div>
                      
                      <div className="relative flex flex-col items-center">
                        {/* Nombre original qui reste visible */}
                        <div className="mb-6 sm:mb-8 relative z-10">
                          <div className="bg-blue-100 rounded-lg px-4 sm:px-6 py-2 sm:py-3 border-2 border-blue-300">
                            <div className="text-3xl sm:text-4xl lg:text-6xl font-bold text-blue-600 relative">
                              <span className="relative">{selectedNumber}</span>
                              {/* Chiffres animés par-dessus */}
                              <span 
                                className="absolute top-0 left-0 transition-all duration-[4000ms] ease-in-out"
                                style={{
                                  transform: animationTriggered ? 'translateX(-120px) translateY(160px) scale(0.83)' : 'translateX(0) translateY(0) scale(1)',
                                  color: animationTriggered ? '#059669' : '#2563eb',
                                  zIndex: 50,
                                  opacity: animationTriggered ? 0 : 1,
                                  transitionDelay: animationTriggered ? '3.5s' : '0s'
                                }}
                              >
                                {selectedNumber.charAt(0)}
                              </span>
                              <span 
                                className="absolute top-0 transition-all duration-[4000ms] ease-in-out"
                                style={{
                                  left: '0.5em',
                                  transform: animationTriggered ? 'translateX(120px) translateY(160px) scale(0.83)' : 'translateX(0) translateY(0) scale(1)',
                                  color: animationTriggered ? '#ea580c' : '#2563eb',
                                  zIndex: 50,
                                  opacity: animationTriggered ? 0 : 1,
                                  transitionDelay: animationTriggered ? '3.5s' : '0s'
                                }}
                              >
                                {selectedNumber.charAt(1)}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Vrai tableau dizaines/unités */}
                        <div className="bg-white rounded-lg sm:rounded-xl shadow-lg sm:shadow-xl border-2 sm:border-4 border-gray-400 overflow-hidden">
                          <table className="border-collapse w-full">
                            <thead>
                              <tr>
                                <th className="bg-green-100 border-1 sm:border-2 border-gray-400 px-4 sm:px-8 lg:px-12 py-2 sm:py-3 lg:py-4 text-xs sm:text-sm lg:text-lg font-bold text-green-700">
                                  DIZAINES
                                </th>
                                <th className="bg-orange-100 border-1 sm:border-2 border-gray-400 px-4 sm:px-8 lg:px-12 py-2 sm:py-3 lg:py-4 text-xs sm:text-sm lg:text-lg font-bold text-orange-700">
                                  UNITÉS
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td className="bg-green-50 border-1 sm:border-2 border-gray-400 px-4 sm:px-8 lg:px-12 py-6 sm:py-8 lg:py-10 text-center w-1/2">
                                  <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-green-600 h-12 sm:h-14 lg:h-16 flex items-center justify-center">
                                    {selectedNumber.charAt(0)}
                                  </div>
                                </td>
                                <td className="bg-orange-50 border-1 sm:border-2 border-gray-400 px-4 sm:px-8 lg:px-12 py-6 sm:py-8 lg:py-10 text-center w-1/2">
                                  <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-orange-600 h-12 sm:h-14 lg:h-16 flex items-center justify-center">
                                    {selectedNumber.charAt(1)}
                                  </div>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Un seul bouton d'écoute pour le résultat complet */}
                  <div className="text-center">
                    <button
                      onClick={() => {
                        const selected = numbersDecomposition.find(n => n.number === selectedNumber);
                        if (selected) {
                          const fullExplanation = `${selected.dizaines} dizaine${selected.dizaines > 1 ? 's' : ''} et ${selected.unites} unité${selected.unites > 1 ? 's' : ''} égale ${selectedNumber}`;
                          speakText(fullExplanation);
                        }
                      }}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-bold transition-colors text-sm sm:text-base"
                    >
                      <Volume2 className="w-3 h-3 sm:w-4 sm:h-4 mr-2 inline" />
                      Écouter le résultat
                    </button>
                  </div>
                </div>

                {/* Représentation visuelle avec paquets */}
                <div className="bg-white rounded-lg p-3 sm:p-6 mb-3 sm:mb-6">
                  <h4 className="text-sm sm:text-base lg:text-lg font-bold mb-2 sm:mb-4 text-gray-800">
                    🔟 Regarde avec des paquets de 10 :
                  </h4>
                  <div className="text-lg sm:text-xl lg:text-2xl py-2 sm:py-4 animate-pulse break-all">
                    {numbersDecomposition.find(n => n.number === selectedNumber)?.visual}
                  </div>
                </div>

                {/* Décomposition détaillée avec animation */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6">
                  <div className="bg-green-50 rounded-lg p-3 sm:p-6 transform hover:scale-105 transition-transform duration-300">
                    <h4 className="text-sm sm:text-base lg:text-lg font-bold mb-2 sm:mb-3 text-green-800">
                      🔟 Dizaines
                    </h4>
                    <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-green-900 mb-2 animate-bounce">
                      {numbersDecomposition.find(n => n.number === selectedNumber)?.dizaines}
                    </div>
                    <p className="text-xs sm:text-sm lg:text-base text-green-700">
                      Le chiffre de GAUCHE
                    </p>
                  </div>
                  
                  <div className="bg-orange-50 rounded-lg p-3 sm:p-6 transform hover:scale-105 transition-transform duration-300">
                    <h4 className="text-sm sm:text-base lg:text-lg font-bold mb-2 sm:mb-3 text-orange-800">
                      🔴 Unités
                    </h4>
                    <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-orange-900 mb-2 animate-bounce" style={{animationDelay: '0.3s'}}>
                      {numbersDecomposition.find(n => n.number === selectedNumber)?.unites}
                    </div>
                    <p className="text-xs sm:text-sm lg:text-base text-orange-700">
                      Le chiffre de DROITE
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Conseils pratiques */}
            <div className="bg-gradient-to-r from-purple-400 to-blue-400 rounded-xl p-3 sm:p-4 lg:p-6 text-white">
              <h3 className="text-base sm:text-lg lg:text-xl font-bold mb-2 sm:mb-3">💡 Trucs pour retenir</h3>
              <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm lg:text-lg">
                <li>• GAUCHE = dizaines (paquets de 10) 🔟</li>
                <li>• DROITE = unités (objets seuls) 🔴</li>
                <li>• Dans 17 : 1 paquet de 10 + 7 objets seuls</li>
                <li>• Plus tu vas à gauche, plus c'est "gros" !</li>
                <li>• Le tableau t'aide à bien voir chaque position !</li>
              </ul>
            </div>
          </div>
        ) : (
          /* EXERCICES */
          <div className="space-y-4 sm:space-y-8">
            {/* Header exercices */}
            <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg">
              <div className="flex flex-col sm:flex-row justify-between items-center mb-3 sm:mb-4 space-y-2 sm:space-y-0">
                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                  ✏️ Exercice {currentExercise + 1} sur {exercises.length}
                </h2>
                <button
                  onClick={resetAll}
                  className="bg-gray-500 text-white px-3 sm:px-4 py-1 sm:py-2 rounded-lg font-bold hover:bg-gray-600 transition-colors text-sm sm:text-base"
                >
                  <RotateCcw className="inline w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  Recommencer
                </button>
              </div>
              
              {/* Barre de progression */}
              <div className="w-full bg-gray-200 rounded-full h-3 sm:h-4 mb-2 sm:mb-3">
                <div 
                  className="bg-blue-500 h-3 sm:h-4 rounded-full transition-all duration-500"
                  style={{ width: `${((currentExercise + 1) / exercises.length) * 100}%` }}
                ></div>
              </div>
              
              {/* Score sous la barre */}
              <div className="text-center">
                <div className="text-base sm:text-lg lg:text-xl font-bold text-blue-600">
                  Score : {score}/{exercises.length}
                </div>
              </div>
            </div>

            {/* Question */}
            <div className="bg-white rounded-xl p-3 sm:p-6 md:p-8 shadow-lg text-center">
              <h3 className="text-base sm:text-xl md:text-2xl font-bold mb-3 sm:mb-6 md:mb-8 text-gray-900">
                {exercises[currentExercise].question}
              </h3>
              
              {/* Affichage du nombre ou de l'expression */}
              <div className="bg-blue-50 rounded-lg p-3 sm:p-4 md:p-8 mb-3 sm:mb-6 md:mb-8">
                {exercises[currentExercise].display ? (
                  <>
                    <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-blue-600 mb-2 sm:mb-3 md:mb-4">
                      {exercises[currentExercise].display}
                    </div>
                    <p className="text-xs sm:text-sm md:text-base text-gray-700">
                      Calcule le résultat !
                    </p>
                  </>
                ) : (
                  <>
                    <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-blue-600 mb-2 sm:mb-3 md:mb-6">
                      {exercises[currentExercise].number}
                    </div>
                  </>
                )}
              </div>
              
              {/* Choix multiples */}
              <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-3 gap-2 sm:gap-3 md:gap-4 max-w-xs sm:max-w-sm md:max-w-md mx-auto mb-4 sm:mb-6 md:mb-8">
                {shuffledChoices.map((choice) => (
                  <button
                    key={choice}
                    onClick={() => handleAnswerClick(choice)}
                    disabled={isCorrect !== null}
                    className={`p-3 sm:p-4 md:p-6 rounded-lg font-bold text-lg sm:text-xl md:text-2xl lg:text-3xl transition-all flex items-center justify-center min-h-[60px] sm:min-h-[70px] md:min-h-[80px] ${
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
                <div className={`p-3 sm:p-4 lg:p-6 rounded-lg mb-4 sm:mb-6 ${
                  isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-3">
                    {isCorrect ? (
                      <>
                        <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8" />
                        <span className="font-bold text-sm sm:text-base lg:text-lg text-center">Bravo ! C'est bien {exercises[currentExercise].correctAnswer} !</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8" />
                        <span className="font-bold text-sm sm:text-base lg:text-lg text-center">
                          Pas tout à fait... C'était {exercises[currentExercise].correctAnswer} !
                        </span>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Explication animée quand c'est faux */}
              {animatedExplanation && (
                <div dangerouslySetInnerHTML={{ __html: animatedExplanation }} />
              )}
              
              {/* Navigation */}
              {isCorrect === false && (
                <div className="flex justify-center">
                  <button
                    onClick={nextExercise}
                    className="bg-blue-500 text-white px-4 sm:px-6 lg:px-8 py-2 sm:py-3 lg:py-4 rounded-lg font-bold text-sm sm:text-base lg:text-lg hover:bg-blue-600 transition-colors"
                  >
                    Suivant →
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Modale de fin d'exercices */}
        {showCompletionModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 sm:p-4">
            <div className="bg-white rounded-2xl p-4 sm:p-6 lg:p-8 max-w-sm sm:max-w-md w-full text-center shadow-2xl">
              {(() => {
                const percentage = Math.round((finalScore / exercises.length) * 100);
                const getMessage = () => {
                  if (percentage >= 90) return { title: "🎉 Excellent petit CP !", message: "Tu maîtrises parfaitement les dizaines et unités !", emoji: "🎉" };
                  if (percentage >= 70) return { title: "👏 Très bien !", message: "Tu comprends bien les unités et dizaines !", emoji: "👏" };
                  if (percentage >= 50) return { title: "👍 C'est bien !", message: "Continue à t'entraîner avec les dizaines et unités !", emoji: "😊" };
                  return { title: "💪 Continue !", message: "Refais les exercices pour mieux comprendre !", emoji: "📚" };
                };
                const result = getMessage();
                return (
                  <>
                    <div className="text-3xl sm:text-4xl lg:text-5xl mb-3 sm:mb-4">{result.emoji}</div>
                    <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 mb-2 sm:mb-3">{result.title}</h3>
                    <p className="text-sm sm:text-base lg:text-lg text-gray-700 mb-4 sm:mb-6">{result.message}</p>
                    <div className="bg-blue-100 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
                      <p className="text-base sm:text-lg lg:text-xl font-bold text-gray-900">
                        Tu as trouvé {finalScore} bonnes réponses sur {exercises.length} !
                      </p>
                      <div className="text-xl sm:text-2xl lg:text-3xl mt-2">
                        {finalScore >= 12 ? '⭐⭐⭐' : finalScore >= 8 ? '⭐⭐' : '⭐'}
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                      <button
                        onClick={resetAll}
                        className="flex-1 bg-blue-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-bold hover:bg-blue-600 transition-colors text-sm sm:text-base"
                      >
                        Recommencer
                      </button>
                      <button
                        onClick={() => setShowCompletionModal(false)}
                        className="flex-1 bg-gray-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-bold hover:bg-gray-600 transition-colors text-sm sm:text-base"
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