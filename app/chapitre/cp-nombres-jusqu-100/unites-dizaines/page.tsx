'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, XCircle, RotateCcw, Volume2, Package, Dot } from 'lucide-react';

// Styles CSS pour les animations personnalisées
const styles = `
  @keyframes slideInLeft {
    from { 
      opacity: 0; 
      transform: translateX(-100px) scale(0.8); 
    }
    to { 
      opacity: 1; 
      transform: translateX(0) scale(1); 
    }
  }
  
  @keyframes slideInRight {
    from { 
      opacity: 0; 
      transform: translateX(100px) scale(0.8); 
    }
    to { 
      opacity: 1; 
      transform: translateX(0) scale(1); 
    }
  }
  
  @keyframes bounceIn {
    0% { 
      opacity: 0; 
      transform: scale(0.3) translateY(-50px); 
    }
    50% { 
      opacity: 1; 
      transform: scale(1.1) translateY(-10px); 
    }
    100% { 
      opacity: 1; 
      transform: scale(1) translateY(0); 
    }
  }
  
  @keyframes glow {
    0%, 100% { 
      box-shadow: 0 0 5px rgba(59, 130, 246, 0.5); 
    }
    50% { 
      box-shadow: 0 0 20px rgba(59, 130, 246, 0.8), 0 0 30px rgba(59, 130, 246, 0.6); 
    }
  }
  
  @keyframes wiggle {
    0%, 7%, 14%, 21%, 28%, 35%, 42%, 49%, 56%, 63%, 70%, 77%, 84%, 91%, 98%, 100% {
      transform: translateX(0);
    }
    3.5%, 10.5%, 17.5%, 24.5%, 31.5%, 38.5%, 45.5%, 52.5%, 59.5%, 66.5%, 73.5%, 80.5%, 87.5%, 94.5% {
      transform: translateX(-3px);
    }
  }
  
  .animate-slide-in-left {
    animation: slideInLeft 1s ease-out;
  }
  
  .animate-slide-in-right {
    animation: slideInRight 1s ease-out 0.3s both;
  }
  
  .animate-bounce-in {
    animation: bounceIn 1.2s ease-out 0.6s both;
  }
  
  .animate-glow {
    animation: glow 2s ease-in-out infinite;
  }
  
  .animate-wiggle {
    animation: wiggle 0.8s ease-in-out;
  }
  
  .animate-fade-in-up {
    animation: fadeInUp 0.8s ease-out 0.9s both;
  }
  
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes highlightCell {
    0%, 100% { 
      background-color: rgba(252, 211, 77, 0.3); 
    }
    50% { 
      background-color: rgba(252, 211, 77, 0.8); 
    }
  }
  
  .animate-highlight {
    animation: highlightCell 1.5s ease-in-out infinite;
  }
`;

export default function UnitesDizainesCP() {
  const [selectedNumber, setSelectedNumber] = useState('34');
  const [currentExercise, setCurrentExercise] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showExercises, setShowExercises] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredCorrectly, setAnsweredCorrectly] = useState<Set<number>>(new Set());
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [shuffledChoices, setShuffledChoices] = useState<string[]>([]);

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

  // Sauvegarder les progrès
  const saveProgress = (score: number, maxScore: number) => {
    const progress = {
      sectionId: 'unites-dizaines',
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
      const existingIndex = allProgress.findIndex((p: any) => p.sectionId === 'unites-dizaines');
      
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

  // Nombres avec décomposition unités/dizaines
  const numbersDecomposition = [
    { number: '23', dizaines: 2, unites: 3, visual: '📦📦 🔴🔴🔴', explanation: '2 paquets de 10 + 3 unités' },
    { number: '34', dizaines: 3, unites: 4, visual: '📦📦📦 🔴🔴🔴🔴', explanation: '3 paquets de 10 + 4 unités' },
    { number: '56', dizaines: 5, unites: 6, visual: '📦📦📦📦📦 🔴🔴🔴🔴🔴🔴', explanation: '5 paquets de 10 + 6 unités' },
    { number: '89', dizaines: 8, unites: 9, visual: '📦📦📦📦📦📦📦📦 🔴🔴🔴🔴🔴🔴🔴🔴🔴', explanation: '8 paquets de 10 + 9 unités' }
  ];

  // Exercices sur la valeur positionnelle - positions des bonnes réponses variées
  const exercises = [
    { question: 'Dans 34, combien y a-t-il de dizaines ?', number: '34', type: 'dizaines', correctAnswer: '3', choices: ['3', '2', '4'] },
    { question: 'Dans 47, combien y a-t-il d\'unités ?', number: '47', type: 'unites', correctAnswer: '7', choices: ['6', '4', '7'] },
    { question: 'Dans 56, combien y a-t-il de dizaines ?', number: '56', type: 'dizaines', correctAnswer: '5', choices: ['6', '5', '7'] },
    { question: 'Dans 23, combien y a-t-il d\'unités ?', number: '23', type: 'unites', correctAnswer: '3', choices: ['3', '2', '4'] },
    { question: 'Combien de dizaines dans 72 ?', number: '72', type: 'dizaines', correctAnswer: '7', choices: ['8', '6', '7'] },
    { question: 'Combien d\'unités dans 89 ?', number: '89', type: 'unites', correctAnswer: '9', choices: ['8', '10', '9'] },
    { question: 'Dans 65, le chiffre des dizaines est ?', number: '65', type: 'dizaines', correctAnswer: '6', choices: ['6', '5', '7'] },
    { question: 'Dans 91, le chiffre des unités est ?', number: '91', type: 'unites', correctAnswer: '1', choices: ['9', '1', '0'] },
    
    // Exercices de composition
    { question: '4 dizaines + 7 unités = ?', display: '4 📦 + 7 🔴', correctAnswer: '47', choices: ['47', '37', '74'] },
    { question: '6 dizaines + 2 unités = ?', display: '6 📦 + 2 🔴', correctAnswer: '62', choices: ['68', '26', '62'] },
    { question: '3 dizaines + 8 unités = ?', display: '3 📦 + 8 🔴', correctAnswer: '38', choices: ['83', '38', '28'] },
    { question: '7 dizaines + 5 unités = ?', display: '7 📦 + 5 🔴', correctAnswer: '75', choices: ['75', '57', '85'] },
    { question: '2 dizaines + 9 unités = ?', display: '2 📦 + 9 🔴', correctAnswer: '29', choices: ['39', '29', '92'] },
    { question: '8 dizaines + 1 unité = ?', display: '8 📦 + 1 🔴', correctAnswer: '81', choices: ['18', '91', '81'] },
    { question: '5 dizaines + 4 unités = ?', display: '5 📦 + 4 🔴', correctAnswer: '54', choices: ['54', '45', '64'] }
  ];

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'fr-FR';
      utterance.rate = 0.9;
      speechSynthesis.speak(utterance);
    }
  };

  // Fonction pour convertir les nombres en mots français
  const numberToWords = (num: string): string => {
    const numbers: { [key: string]: string } = {
      '1': 'un', '2': 'deux', '3': 'trois', '4': 'quatre', '5': 'cinq',
      '6': 'six', '7': 'sept', '8': 'huit', '9': 'neuf', '10': 'dix',
      '20': 'vingt', '30': 'trente', '40': 'quarante', '50': 'cinquante',
      '60': 'soixante', '70': 'soixante-dix', '80': 'quatre-vingts', '90': 'quatre-vingt-dix'
    };
    return numbers[num] || num;
  };

  // Fonction pour énoncer l'explication selon le type d'exercice
  const speakExplanation = (exercise: any) => {
    const number = exercise.number || exercise.display?.replace(/[^0-9]/g, '');
    if (!number) return;
    
    const dizaines = Math.floor(parseInt(number) / 10);
    const unites = parseInt(number) % 10;
    
    if (exercise.type === 'dizaines') {
      const text = `Dans ${number}, la dizaine est ${dizaines}. ${numberToWords(dizaines.toString())} dizaines égale ${dizaines * 10}`;
      speakText(text);
    } else if (exercise.type === 'unites') {
      const text = `Dans ${number}, l'unité est ${unites}. ${numberToWords(unites.toString())} unités égale ${unites}`;
      speakText(text);
    } else if (exercise.display) {
      // Pour les exercices de composition
      const text = `${numberToWords(dizaines.toString())} dizaines plus ${numberToWords(unites.toString())} unités égale ${number}`;
      speakText(text);
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-100">
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/chapitre/cp-nombres-jusqu-100" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-4">
            <ArrowLeft className="w-4 h-4" />
            <span>Retour au chapitre</span>
          </Link>
          
          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              🔢 Unités et dizaines
            </h1>
            <p className="text-lg text-gray-600">
              Comprends la valeur des chiffres selon leur position !
            </p>
          </div>
        </div>

        {/* Navigation entre cours et exercices */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-1 shadow-md flex">
            <button
              onClick={() => setShowExercises(false)}
              className={`px-6 py-3 rounded-lg font-bold transition-all min-h-[68px] flex items-center justify-center ${
                !showExercises 
                  ? 'bg-blue-500 text-white shadow-md' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              📖 Cours
            </button>
            <button
              onClick={() => setShowExercises(true)}
              className={`px-6 py-3 rounded-lg font-bold transition-all min-h-[68px] flex flex-col items-center justify-center ${
                showExercises 
                  ? 'bg-green-500 text-white shadow-md' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <span>✏️ Exercices</span>
              <span className="text-sm opacity-90">({score}/{exercises.length})</span>
            </button>
          </div>
        </div>

        {!showExercises ? (
          /* COURS */
          <div className="space-y-8">
            {/* Explication des positions */}
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
                🧠 La place des chiffres est importante !
              </h2>
              
              <div className="bg-blue-50 rounded-lg p-8 mb-6">
                <h3 className="text-xl font-bold mb-6 text-blue-800 text-center">
                  Exemple avec le nombre 34 :
                </h3>
                
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  {/* Visualisation */}
                  <div className="text-center">
                    <div className="text-8xl font-bold text-blue-600 mb-4 animate-bounce-in transform hover:scale-110 transition-transform duration-500 cursor-pointer">
                      34
                    </div>
                    <div className="text-4xl mb-4 animate-slide-in-left">
                      🔟🔟🔟 🔴🔴🔴🔴
                    </div>
                    <p className="text-lg text-gray-700 font-semibold animate-fade-in-up">
                      3 paquets de 10 + 4 objets seuls
                    </p>
                  </div>

                  {/* Tableau des positions */}
                  <div className="bg-white rounded-lg p-6 shadow-md animate-glow">
                    <div className="text-center mb-4">
                      <h4 className="text-xl font-bold text-gray-800 animate-bounce-in">
                        🎯 Tableau magique des positions !
                      </h4>
                    </div>
                    
                    <table className="w-full border-collapse border-2 border-blue-600 overflow-hidden rounded-lg">
                      <thead>
                        <tr className="bg-gradient-to-r from-blue-400 to-purple-500 text-white">
                          <th className="border-2 border-blue-600 p-4 font-bold animate-slide-in-left">
                            <Package className="inline w-6 h-6 mr-2 animate-wiggle" />
                            🔟 Dizaines
                          </th>
                          <th className="border-2 border-blue-600 p-4 font-bold animate-slide-in-right">
                            <Dot className="inline w-6 h-6 mr-2 animate-wiggle" />
                            🔴 Unités
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border-2 border-blue-600 p-6 text-center bg-gradient-to-br from-blue-100 to-blue-200 animate-slide-in-left">
                            <div className="text-8xl font-bold text-blue-600 animate-bounce-in transform hover:scale-110 transition-transform duration-300">
                              3
                            </div>
                            <div className="text-lg font-semibold text-blue-800 mt-3 animate-fade-in-up">
                              3 × 10 = 30
                            </div>
                            <div className="text-3xl mt-2 animate-pulse">
                              🔟🔟🔟
                            </div>
                          </td>
                          <td className="border-2 border-blue-600 p-6 text-center bg-gradient-to-br from-green-100 to-green-200 animate-slide-in-right">
                            <div className="text-8xl font-bold text-green-600 animate-bounce-in transform hover:scale-110 transition-transform duration-300" style={{animationDelay: '0.2s'}}>
                              4
                            </div>
                            <div className="text-lg font-semibold text-green-800 mt-3 animate-fade-in-up" style={{animationDelay: '0.1s'}}>
                              4 × 1 = 4
                            </div>
                            <div className="text-3xl mt-2 animate-pulse" style={{animationDelay: '0.5s'}}>
                              🔴🔴🔴🔴
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    
                    {/* Animation de la somme finale */}
                    <div className="text-center mt-6 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-lg p-4 animate-bounce-in" style={{animationDelay: '1.2s'}}>
                      <div className="text-3xl font-bold text-gray-800 animate-pulse">
                        ✨ 30 + 4 = 34 ✨
                      </div>
                      <div className="text-lg text-gray-600 mt-2 animate-fade-in-up" style={{animationDelay: '1.5s'}}>
                        La magie des positions !
                      </div>
                    </div>
                    
                    {/* Flèches animées pour montrer le mouvement */}
                    <div className="flex justify-center items-center mt-4 space-x-4 animate-fade-in-up" style={{animationDelay: '1.8s'}}>
                      <div className="text-center">
                        <div className="text-2xl animate-bounce">⬇️</div>
                        <div className="text-sm font-semibold text-blue-600">Dizaines</div>
                      </div>
                      <div className="text-4xl font-bold text-purple-600 animate-pulse">+</div>
                      <div className="text-center">
                        <div className="text-2xl animate-bounce" style={{animationDelay: '0.3s'}}>⬇️</div>
                        <div className="text-sm font-semibold text-green-600">Unités</div>
                      </div>
                      <div className="text-4xl font-bold text-purple-600 animate-pulse" style={{animationDelay: '0.6s'}}>=</div>
                      <div className="text-center">
                        <div className="text-2xl animate-bounce" style={{animationDelay: '0.9s'}}>🎉</div>
                        <div className="text-sm font-semibold text-purple-600">Résultat</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Règle importante */}
              <div className="bg-yellow-50 rounded-lg p-6">
                <h3 className="text-xl font-bold mb-4 text-yellow-800 text-center">
                  📏 Règle importante
                </h3>
                <div className="text-center space-y-2 text-yellow-700 text-lg font-semibold">
                  <p>• Le chiffre de DROITE = les unités (objets seuls)</p>
                  <p>• Le chiffre de GAUCHE = les dizaines (paquets de 10)</p>
                  <p>• La position du chiffre change sa valeur !</p>
                </div>
              </div>
            </div>

            {/* Sélecteur de nombre */}
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
                🎯 Explore un nombre
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {numbersDecomposition.map((item) => (
                  <button
                    key={item.number}
                    onClick={() => setSelectedNumber(item.number)}
                    className={`p-4 rounded-lg font-bold text-2xl transition-all ${
                      selectedNumber === item.number
                        ? 'bg-blue-500 text-white shadow-lg scale-105'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {item.number}
                  </button>
                ))}
              </div>
            </div>

            {/* Analyse détaillée du nombre sélectionné */}
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
                🔍 Analysons le nombre {selectedNumber}
              </h2>
              
              {(() => {
                const selected = numbersDecomposition.find(n => n.number === selectedNumber);
                if (!selected) return null;
                
                return (
                  <div className="space-y-8">
                    {/* Affichage principal */}
                    <div className="bg-gradient-to-r from-blue-100 to-green-100 rounded-lg p-8">
                      <div className="text-center mb-6">
                        <div className="text-9xl font-bold text-gray-800 mb-4">
                          {selected.number}
                        </div>
                        <div className="text-4xl mb-4">
                          {selected.visual}
                        </div>
                        <p className="text-xl font-semibold text-gray-700">
                          {selected.explanation}
                        </p>
                      </div>
                    </div>

                    {/* Décomposition détaillée */}
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Dizaines */}
                      <div className="bg-blue-50 rounded-lg p-6">
                        <h3 className="text-xl font-bold mb-4 text-blue-800 text-center">
                          <Package className="inline w-6 h-6 mr-2" />
                          Le chiffre des dizaines
                        </h3>
                        <div className="text-center">
                          <div className="text-8xl font-bold text-blue-600 mb-4">
                            {selected.dizaines}
                          </div>
                          <div className="bg-white rounded-lg p-4 mb-4">
                            <div className="text-3xl mb-2">
                              {'📦'.repeat(selected.dizaines)}
                            </div>
                            <p className="text-lg font-semibold text-blue-700">
                              {selected.dizaines} paquets de 10
                            </p>
                          </div>
                          <div className="text-2xl font-bold text-blue-600">
                            {selected.dizaines} × 10 = {selected.dizaines * 10}
                          </div>
                          <button
                            onClick={() => speakText(`${selected.dizaines} dizaines font ${selected.dizaines * 10}`)}
                            className="bg-blue-400 hover:bg-blue-500 text-white p-2 rounded-lg transition-colors mt-3"
                          >
                            <Volume2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>

                      {/* Unités */}
                      <div className="bg-green-50 rounded-lg p-6">
                        <h3 className="text-xl font-bold mb-4 text-green-800 text-center">
                          <Dot className="inline w-6 h-6 mr-2" />
                          Le chiffre des unités
                        </h3>
                        <div className="text-center">
                          <div className="text-8xl font-bold text-green-600 mb-4">
                            {selected.unites}
                          </div>
                          <div className="bg-white rounded-lg p-4 mb-4">
                            <div className="text-3xl mb-2">
                              {'🔴'.repeat(selected.unites)}
                            </div>
                            <p className="text-lg font-semibold text-green-700">
                              {selected.unites} objets seuls
                            </p>
                          </div>
                          <div className="text-2xl font-bold text-green-600">
                            {selected.unites} × 1 = {selected.unites}
                          </div>
                          <button
                            onClick={() => speakText(`${selected.unites} unités font ${selected.unites}`)}
                            className="bg-green-400 hover:bg-green-500 text-white p-2 rounded-lg transition-colors mt-3"
                          >
                            <Volume2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Résultat final */}
                    <div className="bg-yellow-50 rounded-lg p-6 text-center">
                      <h3 className="text-xl font-bold mb-4 text-yellow-800">
                        🎯 Au final :
                      </h3>
                      <div className="text-3xl font-bold text-gray-800">
                        {selected.dizaines * 10} + {selected.unites} = {selected.number}
                      </div>
                      <button
                        onClick={() => speakText(`${selected.dizaines * 10} plus ${selected.unites} égale ${selected.number}`)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-lg font-bold mt-4 transition-colors"
                      >
                        <Volume2 className="inline w-5 h-5 mr-2" />
                        Écouter
                      </button>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Jeu de construction */}
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
                🎮 Jeu : Construis des nombres !
              </h2>
              
              <div className="bg-purple-50 rounded-lg p-6">
                <h3 className="text-xl font-bold mb-4 text-purple-800 text-center">
                  Avec quoi peut-on faire 45 ?
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  <div className="bg-white rounded-lg p-4">
                    <div className="text-3xl mb-2">4️⃣5️⃣</div>
                    <div className="text-lg font-semibold text-gray-800">En chiffres</div>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <div className="text-3xl mb-2">📦📦📦📦 🔴🔴🔴🔴🔴</div>
                    <div className="text-lg font-semibold text-gray-800">En objets</div>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <div className="text-3xl mb-2">40 + 5</div>
                    <div className="text-lg font-semibold text-gray-800">En addition</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Conseils */}
            <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-xl p-6 text-white">
              <h3 className="text-xl font-bold mb-3">💡 Trucs pour retenir</h3>
              <ul className="space-y-2 text-lg">
                <li>• DROITE = unités (objets seuls)</li>
                <li>• GAUCHE = dizaines (paquets de 10)</li>
                <li>• Utilise tes mains : 1 main = 5, 2 mains = 10</li>
                <li>• Pense aux paquets et aux objets seuls</li>
                <li>• 34 = 30 + 4 = 3 dizaines + 4 unités</li>
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
            <div className="bg-white rounded-xl p-3 sm:p-6 md:p-8 shadow-lg text-center">
              <h3 className="text-base sm:text-xl md:text-2xl font-bold mb-3 sm:mb-6 md:mb-8 text-gray-900">
                {exercises[currentExercise].question}
              </h3>
              
              {/* Affichage du nombre ou de l'expression */}
              <div className="bg-blue-50 rounded-lg p-3 sm:p-4 md:p-8 mb-3 sm:mb-6 md:mb-8">
                {exercises[currentExercise].display ? (
                  <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-blue-600 mb-2 sm:mb-3 md:mb-4">
                    {exercises[currentExercise].display}
                  </div>
                ) : (
                  <>
                    <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-blue-600 mb-2 sm:mb-3 md:mb-6">
                      {exercises[currentExercise].number}
                    </div>
                    <div className="text-sm sm:text-base md:text-lg text-gray-700">
                      {exercises[currentExercise].type === 'dizaines' ? 'Cherche les dizaines' : 'Cherche les unités'}
                    </div>
                  </>
                )}
              </div>
              
              {/* Choix multiples */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 sm:gap-3 md:gap-4 max-w-sm sm:max-w-md mx-auto mb-4 sm:mb-6 md:mb-8">
                {shuffledChoices.map((choice) => (
                  <button
                    key={choice}
                    onClick={() => handleAnswerClick(choice)}
                    disabled={isCorrect !== null}
                    className={`p-3 sm:p-4 md:p-6 rounded-lg font-bold text-xl sm:text-2xl md:text-3xl lg:text-4xl transition-all ${
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
              
              {/* Animation explicative pour les réponses incorrectes */}
              {!isCorrect && isCorrect !== null && (
                <div className="bg-white rounded-lg p-6 border-2 border-blue-300 mb-6">
                  <h4 className="text-lg font-bold mb-4 text-blue-800 text-center">
                    🎯 Regarde l'explication !
                  </h4>
                  <div className="space-y-4">
                    {/* Animation selon le type d'exercice */}
                    {(() => {
                      const exercise = exercises[currentExercise];
                      const number = exercise.number || exercise.display?.replace(/[^0-9]/g, '');
                      if (!number) return null;
                      
                      const dizaines = Math.floor(parseInt(number) / 10);
                      const unites = parseInt(number) % 10;
                      
                      return (
                        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-6">
                          {/* Affichage du nombre avec décomposition animée */}
                          <div className="text-center mb-6">
                            <div className="text-6xl font-bold text-gray-800 mb-4 animate-pulse">
                              {number}
                            </div>
                            
                            {/* Tableau de décomposition animé */}
                            <div className="bg-white rounded-lg p-4 shadow-md">
                              <table className="w-full border-collapse border-2 border-blue-500">
                                <thead>
                                  <tr className="bg-blue-200">
                                    <th className="border-2 border-blue-500 p-3 font-bold text-blue-800">
                                      📦 Dizaines
                                    </th>
                                    <th className="border-2 border-blue-500 p-3 font-bold text-blue-800">
                                      🔴 Unités
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr>
                                    <td className={`border-2 border-blue-500 p-4 text-center ${
                                      exercise.type === 'dizaines' ? 'bg-yellow-100 animate-pulse' : 'bg-blue-50'
                                    }`}>
                                      <div className="text-4xl font-bold text-blue-600 mb-2">
                                        {dizaines}
                                      </div>
                                      <div className="text-sm text-gray-700">
                                        {numberToWords(dizaines.toString())} dizaines
                                      </div>
                                      <div className="text-xs text-gray-600">
                                        = {dizaines * 10}
                                      </div>
                                    </td>
                                    <td className={`border-2 border-blue-500 p-4 text-center ${
                                      exercise.type === 'unites' ? 'bg-yellow-100 animate-pulse' : 'bg-green-50'
                                    }`}>
                                      <div className="text-4xl font-bold text-green-600 mb-2">
                                        {unites}
                                      </div>
                                      <div className="text-sm text-gray-700">
                                        {numberToWords(unites.toString())} unités
                                      </div>
                                      <div className="text-xs text-gray-600">
                                        = {unites}
                                      </div>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                            
                            {/* Explication textuelle */}
                            <div className="mt-4 text-lg font-semibold text-gray-800">
                              {exercise.type === 'dizaines' && (
                                <div className="bg-yellow-50 rounded-lg p-3">
                                  <span className="text-yellow-800">
                                    ➡️ Dans {number}, le chiffre des <strong>dizaines</strong> est <strong>{dizaines}</strong>
                                  </span>
                                </div>
                              )}
                              {exercise.type === 'unites' && (
                                <div className="bg-green-50 rounded-lg p-3">
                                  <span className="text-green-800">
                                    ➡️ Dans {number}, le chiffre des <strong>unités</strong> est <strong>{unites}</strong>
                                  </span>
                                </div>
                              )}
                              {exercise.display && (
                                <div className="bg-purple-50 rounded-lg p-3">
                                  <span className="text-purple-800">
                                    ➡️ {numberToWords(dizaines.toString())} dizaines + {numberToWords(unites.toString())} unités = <strong>{number}</strong>
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                    
                    {/* Bouton audio */}
                    <div className="text-center">
                      <button 
                        onClick={() => speakExplanation(exercises[currentExercise])}
                        className="bg-blue-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-600 transition-colors inline-flex items-center space-x-2"
                      >
                        <Volume2 className="w-4 h-4" />
                        <span>Écouter l'explication</span>
                      </button>
                    </div>
                    
                    {/* Message d'encouragement */}
                    <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-3 text-center">
                      <p className="text-sm font-semibold text-purple-800">
                        Maintenant tu comprends ! La position des chiffres est très importante ! 🎯
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Navigation */}
              {isCorrect === false && (
                <div className="flex justify-center">
                  <button
                    onClick={nextExercise}
                    className="bg-blue-500 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-blue-600 transition-colors"
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
                  if (percentage >= 90) return { title: "🎉 Expert unités/dizaines !", message: "Tu maîtrises parfaitement la valeur positionnelle !", emoji: "🎉" };
                  if (percentage >= 70) return { title: "👏 Très bien !", message: "Tu comprends bien les unités et dizaines ! Continue !", emoji: "👏" };
                  if (percentage >= 50) return { title: "👍 C'est bien !", message: "Tu progresses ! La valeur positionnelle est importante !", emoji: "😊" };
                  return { title: "💪 Continue !", message: "Recommence pour mieux comprendre unités et dizaines !", emoji: "📚" };
                };
                const result = getMessage();
                return (
                  <>
                    <div className="text-6xl mb-4">{result.emoji}</div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">{result.title}</h3>
                    <p className="text-lg text-gray-700 mb-6">{result.message}</p>
                    <div className="bg-blue-100 rounded-lg p-4 mb-6">
                      <p className="text-xl font-bold text-gray-900">
                        Score : {finalScore}/{exercises.length}
                      </p>
                      <div className="text-4xl mt-2">
                        {finalScore >= 10 ? '⭐⭐⭐' : finalScore >= 8 ? '⭐⭐' : '⭐'}
                      </div>
                      <p className="text-sm text-gray-600 mt-2">
                        Comprendre unités et dizaines, c'est la base !
                      </p>
                    </div>
                    <div className="flex space-x-3">
                      <button
                        onClick={resetAll}
                        className="flex-1 bg-blue-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-600 transition-colors"
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