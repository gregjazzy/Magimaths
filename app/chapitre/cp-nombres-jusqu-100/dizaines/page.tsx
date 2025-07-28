'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Play, CheckCircle, XCircle, RotateCcw, Volume2 } from 'lucide-react';

export default function DizainesCP() {
  // Styles CSS pour les animations
  const animationStyles = `
    @keyframes slideInFromLeft {
      0% { transform: translateX(-100px); opacity: 0; }
      100% { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes bounceIn {
      0% { transform: scale(0); opacity: 0; }
      50% { transform: scale(1.2); opacity: 0.8; }
      100% { transform: scale(1); opacity: 1; }
    }
    
    @keyframes glow {
      0%, 100% { box-shadow: 0 0 5px rgba(34, 197, 94, 0.5); }
      50% { box-shadow: 0 0 20px rgba(34, 197, 94, 0.8), 0 0 30px rgba(34, 197, 94, 0.6); }
    }
    
    @keyframes wiggle {
      0%, 100% { transform: rotate(0deg); }
      25% { transform: rotate(-3deg); }
      75% { transform: rotate(3deg); }
    }
    
    @keyframes fadeInUp {
      0% { transform: translateY(30px); opacity: 0; }
      100% { transform: translateY(0); opacity: 1; }
    }
    
    .animate-slide-in { animation: slideInFromLeft 0.8s ease-out; }
    .animate-bounce-in { animation: bounceIn 0.6s ease-out; }
    .animate-glow { animation: glow 2s ease-in-out infinite; }
    .animate-wiggle { animation: wiggle 1s ease-in-out infinite; }
    .animate-fade-in-up { animation: fadeInUp 0.6s ease-out; }
  `;

  // Ajouter les styles au document
  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = animationStyles;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);
  const [selectedNumber, setSelectedNumber] = useState('30');
  const [currentExercise, setCurrentExercise] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showExercises, setShowExercises] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredCorrectly, setAnsweredCorrectly] = useState<Set<number>>(new Set());
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [shuffledChoices, setShuffledChoices] = useState<string[]>([]);
  const [animationStep, setAnimationStep] = useState(0);

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

  // Réinitialiser l'animation quand on change de dizaine
  useEffect(() => {
    setAnimationStep(0);
  }, [selectedNumber]);

  // Fonctions de contrôle de l'animation
  const nextStep = () => {
    if (animationStep < 3) {
      setAnimationStep(animationStep + 1);
    }
  };
  
  const restartAnimation = () => {
    setAnimationStep(0);
  };

  // Fonction pour convertir les nombres en mots français
  const numberToWords = (num: string): string => {
    const numbers: { [key: string]: string } = {
      '1': 'un', '2': 'deux', '3': 'trois', '4': 'quatre', '5': 'cinq',
      '6': 'six', '7': 'sept', '8': 'huit', '9': 'neuf', '10': 'dix',
      '20': 'vingt', '30': 'trente', '40': 'quarante', '50': 'cinquante',
      '60': 'soixante', '70': 'soixante-dix', '80': 'quatre-vingts', '90': 'quatre-vingt-dix', '100': 'cent'
    };
    return numbers[num] || num;
  };

  // Fonction pour énoncer la décomposition selon le type de question
  const speakDecomposition = (exercise: any) => {
    if (exercise.question.includes('Combien de groupes') || exercise.question.includes('Combien de dizaines')) {
      // Pour "Combien de groupes/dizaines dans X ?"
      const visual = exercise.visual;
      const groupCount = visual.split('📦').length - 1;
      const text = `${numberToWords(groupCount.toString())} dizaines égale ${numberToWords((groupCount * 10).toString())}`;
      speakText(text);
    } else if (exercise.question.includes('Que vaut') || exercise.question.includes('dizaines =')) {
      // Pour "X dizaines = ?" ou "Que vaut X groupes de 10 ?"
      const correctAnswer = exercise.correctAnswer;
      const groupCount = parseInt(correctAnswer) / 10;
      const text = `${numberToWords(groupCount.toString())} dizaines égale ${numberToWords(correctAnswer)}`;
      speakText(text);
    }
  };

  // Déclencher l'animation au chargement initial
  useEffect(() => {
    const timer = setTimeout(() => {
      // Déclencher l'animation pour la dizaine par défaut
      const initialAnimation = () => {
        const steps = [
          () => {}, // placeholder pour étape 0
          () => {}, // étape 1
          () => {}, // étape 2  
          () => {}, // étape 3
        ];
        // L'animation sera gérée dans le composant
      };
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Sauvegarder les progrès dans localStorage
  const saveProgress = (score: number, maxScore: number) => {
    const progress = {
      sectionId: 'dizaines',
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
      const existingIndex = allProgress.findIndex((p: any) => p.sectionId === 'dizaines');
      
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

  // Nombres dizaines pour le cours - 4 exemples essentiels
  const dizaines = [
    { value: '20', label: '20', reading: 'vingt', visual: '📦📦', groups: 2 },
    { value: '30', label: '30', reading: 'trente', visual: '📦📦📦', groups: 3 },
    { value: '50', label: '50', reading: 'cinquante', visual: '📦📦📦📦📦', groups: 5 },
    { value: '80', label: '80', reading: 'quatre-vingts', visual: '📦📦📦📦📦📦📦📦', groups: 8 }
  ];

  // Exercices sur les dizaines - positions des bonnes réponses variées
  const exercises = [
    { question: 'Combien de groupes de 10 dans 40 ?', visual: '📦📦📦📦', correctAnswer: '4', choices: ['4', '3', '5'] },
    { question: 'Que vaut 3 groupes de 10 ?', visual: '📦📦📦', correctAnswer: '30', choices: ['40', '20', '30'] },
    { question: 'Combien de dizaines dans 70 ?', visual: '📦📦📦📦📦📦📦', correctAnswer: '7', choices: ['6', '8', '7'] },
    { question: '2 dizaines = ?', visual: '📦📦', correctAnswer: '20', choices: ['10', '30', '20'] },
    { question: 'Combien de groupes de 10 dans 60 ?', visual: '📦📦📦📦📦📦', correctAnswer: '6', choices: ['5', '6', '7'] },
    { question: 'Que vaut 5 groupes de 10 ?', visual: '📦📦📦📦📦', correctAnswer: '50', choices: ['50', '40', '60'] },
    { question: '8 dizaines = ?', visual: '📦📦📦📦📦📦📦📦', correctAnswer: '80', choices: ['70', '90', '80'] },
    { question: 'Combien de dizaines dans 90 ?', visual: '📦📦📦📦📦📦📦📦📦', correctAnswer: '9', choices: ['8', '9', '10'] },
    { question: 'Que vaut 1 groupe de 10 ?', visual: '📦', correctAnswer: '10', choices: ['10', '1', '20'] },
    { question: 'Combien de groupes de 10 dans 100 ?', visual: '📦📦📦📦📦📦📦📦📦📦', correctAnswer: '10', choices: ['9', '10', '11'] }
  ];

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'fr-FR';
      utterance.rate = 0.9;
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/chapitre/cp-nombres-jusqu-100" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-4">
            <ArrowLeft className="w-4 h-4" />
            <span>Retour au chapitre</span>
          </Link>
          
          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              📦 Les dizaines jusqu'à 100
            </h1>
            <p className="text-lg text-gray-600">
              Découvre les groupes de 10 : 10, 20, 30... jusqu'à 100 !
            </p>
          </div>
        </div>

        {/* Navigation entre cours et exercices */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-1 shadow-md flex">
            <button
              onClick={() => setShowExercises(false)}
              className={`px-6 py-3 rounded-lg font-bold transition-all ${
                !showExercises 
                  ? 'bg-green-500 text-white shadow-md' 
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
              ✏️ Exercices ({score}/{exercises.length})
            </button>
          </div>
        </div>

        {!showExercises ? (
          /* COURS */
          <div className="space-y-8">
            {/* Explication des dizaines */}
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
                🧠 Qu'est-ce qu'une dizaine ?
              </h2>
              
              <div className="bg-green-50 rounded-lg p-6 mb-6">
                <p className="text-xl text-center text-gray-800 mb-4">
                  Une dizaine, c'est <strong>un groupe de 10 objets</strong> !
                </p>
                <div className="text-center">
                  <div className="text-6xl mb-4">📦</div>
                  <div className="text-2xl font-bold text-green-600 mb-2">1 dizaine = 10</div>
                  <p className="text-lg text-gray-700">Cette boîte contient 10 objets !</p>
                </div>
              </div>

              {/* Visualisation 10 = 1 dizaine */}
              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="text-xl font-bold mb-4 text-blue-800 text-center">
                  🔢 Regarde : 10 points = 1 boîte de 10
                </h3>
                <div className="flex justify-center items-center space-x-8">
                  <div className="text-center">
                    <div className="text-2xl mb-2 text-blue-600">● ● ● ● ●</div>
                    <div className="text-2xl mb-2 text-blue-600">● ● ● ● ●</div>
                    <div className="font-bold text-lg text-gray-800">10 points</div>
                  </div>
                  <div className="text-4xl font-bold text-green-600">=</div>
                  <div className="text-center">
                    <div className="text-6xl mb-2">📦</div>
                    <div className="font-bold text-lg text-gray-800">1 dizaine</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sélecteur de dizaines */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
                🎯 Choisis une dizaine à explorer
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
                {dizaines.map((diz) => (
                  <button
                    key={diz.value}
                    onClick={() => setSelectedNumber(diz.value)}
                    className={`p-4 rounded-lg font-bold text-lg transition-all ${
                      selectedNumber === diz.value
                        ? 'bg-green-500 text-white shadow-lg scale-105'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {diz.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Affichage détaillé de la dizaine sélectionnée */}
            <div className="bg-white rounded-xl p-8 shadow-lg text-center">
              <h3 className="text-2xl font-bold mb-6 text-gray-900">
                🔍 Découvrons {selectedNumber}
              </h3>
              
              {(() => {
                const selected = dizaines.find(d => d.value === selectedNumber);
                if (!selected) return null;
                
                return (
                  <div className="space-y-8">
                    {/* Boutons de contrôle - bien visibles en haut */}
                    <div className="flex justify-center space-x-4 mb-8">
                      {animationStep < 3 && (
                        <button
                          onClick={nextStep}
                          className="bg-gradient-to-r from-blue-500 to-green-500 text-white px-8 py-4 rounded-xl font-bold text-xl hover:from-blue-600 hover:to-green-600 transition-all shadow-lg transform hover:scale-105 animate-pulse"
                        >
                          ▶️ Suivant
                        </button>
                      )}
                      {animationStep > 0 && (
                        <button
                          onClick={restartAnimation}
                          className="bg-gray-500 text-white px-6 py-4 rounded-xl font-bold text-lg hover:bg-gray-600 transition-colors shadow-md"
                        >
                          🔄 Recommencer
                        </button>
                      )}
                    </div>
                    
                    {/* Message de démarrage */}
                    {animationStep === 0 && (
                      <div className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg p-8 text-center">
                        <div className="text-6xl mb-4">🚀</div>
                        <h4 className="text-2xl font-bold mb-4 text-gray-800">
                          Prêt à explorer {selected.value} ?
                        </h4>
                        <p className="text-lg text-gray-700 mb-4">
                          Appuie sur "Suivant" pour commencer l'aventure !
                        </p>
                        <div className="text-4xl animate-bounce">⬆️</div>
                      </div>
                    )}
                    
                    {/* Étape 1: Le nombre */}
                    {animationStep >= 1 && (
                      <div className="bg-gradient-to-r from-green-100 to-blue-100 rounded-lg p-8 text-center animate-slide-in">
                        <h4 className="text-xl font-bold mb-4 text-green-800">
                          📍 Étape 1 : Voici le nombre
                        </h4>
                        <div className="flex items-center justify-center space-x-4 mb-4">
                          <div className="text-9xl font-bold text-green-600 animate-bounce-in">
                            {selected.value}
                          </div>
                          <div className="text-2xl font-semibold text-gray-600">
                            {selected.reading}
                          </div>
                        </div>
                        <p className="text-xl text-gray-700">
                          Comment peut-on faire {selected.value} avec des groupes de 10 ?
                        </p>
                      </div>
                    )}
                    
                    {/* Étape 2: Les boîtes de 10 */}
                    {animationStep >= 2 && (
                      <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg p-8 animate-slide-in">
                        <h4 className="text-xl font-bold mb-4 text-blue-800">
                          📦 Étape 2 : Comptons les boîtes de 10
                        </h4>
                        <div className="text-7xl mb-6 animate-bounce-in">
                          {selected.visual}
                        </div>
                        <p className="text-xl text-gray-700 font-semibold">
                          Je vois {selected.groups} boîte{selected.groups > 1 ? 's' : ''} de 10
                        </p>
                      </div>
                    )}
                    
                    {/* Étape 3: La décomposition */}
                    {animationStep >= 3 && (
                      <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-lg p-8 animate-slide-in">
                        <h4 className="text-xl font-bold mb-4 text-orange-800">
                          ✨ Étape 3 : La décomposition magique
                        </h4>
                        <div className="text-4xl font-bold text-blue-600 mb-4 animate-glow">
                          {selected.groups} × 10 = {selected.value}
                        </div>
                        <p className="text-lg text-gray-700 mb-6">
                          {selected.groups} fois 10 égale {selected.value}
                        </p>
                        <div className="flex justify-center space-x-3">
                          <button
                            onClick={() => speakText(`${selected.groups} fois 10 égale ${selected.value}`)}
                            className="bg-green-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-green-600 transition-colors"
                          >
                            <Volume2 className="inline w-4 h-4 mr-2" />
                            Écouter la décomposition
                          </button>
                        </div>
                      </div>
                    )}
                    
                    {/* Indicateur de progression amélioré */}
                    <div className="text-center">
                      <div className="inline-flex space-x-3 bg-white rounded-full px-6 py-3 shadow-md">
                        {[0, 1, 2, 3].map((step) => (
                          <div
                            key={step}
                            className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                              animationStep >= step 
                                ? 'bg-green-500 text-white shadow-lg' 
                                : 'bg-gray-300 text-gray-600'
                            }`}
                          >
                            {step === 0 ? '🚀' : step}
                          </div>
                        ))}
                      </div>
                      <p className="text-sm text-gray-600 mt-2 font-semibold">
                        {animationStep === 0 && "Prêt à commencer"}
                        {animationStep === 1 && "Étape 1/3 : Le nombre"}
                        {animationStep === 2 && "Étape 2/3 : Les boîtes"}
                        {animationStep === 3 && "Étape 3/3 : La décomposition"}
                      </p>
                    </div>
                    
                    {/* Message de fin */}
                    {animationStep === 3 && (
                      <div className="bg-gradient-to-r from-green-100 to-blue-100 rounded-lg p-6 text-center animate-fade-in-up">
                        <div className="text-4xl mb-3">🎉</div>
                        <p className="text-lg font-bold text-green-700">
                          Bravo ! Tu as découvert comment faire {selected.value} avec des dizaines !
                        </p>
                        <p className="text-sm text-gray-600 mt-2">
                          Choisis une autre dizaine ou recommence cette animation !
                        </p>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>

            {/* Tableau récapitulatif avec animations */}
            <div className="bg-white rounded-xl p-8 shadow-lg animate-fade-in-up">
              <h2 className="text-2xl font-bold text-center mb-6 text-gray-900 animate-bounce">
                📊 Tableau magique des dizaines
              </h2>
              
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border-2 border-green-600 bg-white rounded-lg overflow-hidden animate-glow">
                  <thead>
                    <tr className="bg-green-200">
                      <th className="border-2 border-green-600 p-4 text-green-800 font-bold animate-wiggle">Nombre de boîtes</th>
                      <th className="border-2 border-green-600 p-4 text-green-800 font-bold animate-wiggle">Dizaine</th>
                      <th className="border-2 border-green-600 p-4 text-green-800 font-bold animate-wiggle">Comment on dit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dizaines.map((diz, index) => (
                      <tr key={diz.value} className="hover:bg-green-50 animate-slide-in" style={{ animationDelay: `${index * 0.3}s`, animationFillMode: 'both' }}>
                        <td className="border-2 border-green-600 p-4 text-center text-3xl hover:animate-bounce cursor-pointer">
                          {diz.visual}
                        </td>
                        <td className="border-2 border-green-600 p-4 text-center text-2xl font-bold text-green-600 hover:animate-wiggle cursor-pointer">
                          {diz.value}
                        </td>
                        <td className="border-2 border-green-600 p-4 text-center text-xl font-semibold hover:animate-wiggle cursor-pointer">
                          {diz.reading}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Conseils */}
            <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-xl p-6 text-white">
              <h3 className="text-xl font-bold mb-3">💡 Trucs pour retenir les dizaines</h3>
              <ul className="space-y-2 text-lg">
                <li>• Une dizaine = 10 objets dans une boîte</li>
                <li>• 2 dizaines = 2 boîtes = 20</li>
                <li>• Compte les boîtes pour trouver les dizaines</li>
                <li>• 100 = 10 dizaines (une grande maison !)</li>
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
                  className="bg-green-500 h-4 rounded-full transition-all duration-500"
                  style={{ width: `${((currentExercise + 1) / exercises.length) * 100}%` }}
                ></div>
              </div>
              
              {/* Score sous la barre */}
              <div className="text-center">
                <div className="text-xl font-bold text-green-600">
                  Score : {score}/{exercises.length}
                </div>
              </div>
            </div>

            {/* Question */}
            <div className="bg-white rounded-xl p-3 sm:p-6 md:p-8 shadow-lg text-center">
              <h3 className="text-base sm:text-xl md:text-2xl font-bold mb-3 sm:mb-6 md:mb-8 text-gray-900">
                {exercises[currentExercise].question}
              </h3>
              
              {/* Affichage visuel de la question */}
              <div className="bg-green-50 rounded-lg p-2 sm:p-4 md:p-8 mb-3 sm:mb-6 md:mb-8">
                <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl mb-3 sm:mb-4 md:mb-6">
                  {exercises[currentExercise].visual}
                </div>
              </div>
              
              {/* Choix multiples avec gros boutons */}
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

              {/* Feedback détaillé pour les réponses incorrectes */}
              {!isCorrect && isCorrect !== null && (
                <div className="bg-white rounded-lg p-6 border-2 border-blue-300 mb-6">
                  <h4 className="text-lg font-bold mb-4 text-blue-800 text-center">
                    🎯 Écoute la bonne réponse !
                  </h4>
                  <div className="space-y-4">
                    <div className="bg-blue-50 rounded-lg p-4">
                      <div className="text-center">
                        <div className="text-3xl mb-4">
                          {exercises[currentExercise].visual}
                        </div>
                        <div className="text-2xl font-bold text-blue-600 mb-2">
                          {(() => {
                            const exercise = exercises[currentExercise];
                            if (exercise.question.includes('Combien de groupes') || exercise.question.includes('Combien de dizaines')) {
                              const groupCount = exercise.visual.split('📦').length - 1;
                              return `${groupCount} dizaines = ${groupCount * 10}`;
                            } else if (exercise.question.includes('Que vaut') || exercise.question.includes('dizaines =')) {
                              const groupCount = parseInt(exercise.correctAnswer) / 10;
                              return `${groupCount} dizaines = ${exercise.correctAnswer}`;
                            }
                            return `Réponse : ${exercise.correctAnswer}`;
                          })()}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <button 
                        onClick={() => speakDecomposition(exercises[currentExercise])}
                        className="bg-blue-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-600 transition-colors inline-flex items-center space-x-2"
                      >
                        <Volume2 className="w-4 h-4" />
                        <span>Écouter la décomposition</span>
                      </button>
                    </div>
                    
                    <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-3 text-center">
                      <p className="text-sm font-semibold text-purple-800">
                        Maintenant tu sais ! {(() => {
                          const exercise = exercises[currentExercise];
                          if (exercise.question.includes('Combien de groupes') || exercise.question.includes('Combien de dizaines')) {
                            const groupCount = exercise.visual.split('📦').length - 1;
                            return `${groupCount} groupes de 10 font ${groupCount * 10} !`;
                          } else {
                            const groupCount = parseInt(exercise.correctAnswer) / 10;
                            return `${groupCount} dizaines font ${exercise.correctAnswer} !`;
                          }
                        })()}
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
                    className="bg-green-500 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-green-600 transition-colors"
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
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-2xl">
              {(() => {
                const percentage = Math.round((finalScore / exercises.length) * 100);
                const getMessage = () => {
                  if (percentage >= 90) return { title: "🎉 Expert des dizaines !", message: "Tu maîtrises parfaitement les dizaines jusqu'à 100 !", emoji: "🎉" };
                  if (percentage >= 70) return { title: "👏 Très bien !", message: "Tu comprends bien les dizaines ! Continue comme ça !", emoji: "👏" };
                  if (percentage >= 50) return { title: "👍 C'est bien !", message: "Tu progresses ! Les dizaines sont importantes !", emoji: "😊" };
                  return { title: "💪 Continue !", message: "Recommence pour mieux comprendre les dizaines !", emoji: "📚" };
                };
                const result = getMessage();
                return (
                  <>
                    <div className="text-6xl mb-4">{result.emoji}</div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">{result.title}</h3>
                    <p className="text-lg text-gray-700 mb-6">{result.message}</p>
                    <div className="bg-green-100 rounded-lg p-4 mb-6">
                      <p className="text-xl font-bold text-gray-900">
                        Score : {finalScore}/{exercises.length}
                      </p>
                      <div className="text-4xl mt-2">
                        {finalScore >= 8 ? '⭐⭐⭐' : finalScore >= 6 ? '⭐⭐' : '⭐'}
                      </div>
                      <p className="text-sm text-gray-600 mt-2">
                        Les dizaines t'aident à compter jusqu'à 100 !
                      </p>
                    </div>
                    <div className="flex space-x-3">
                      <button
                        onClick={resetAll}
                        className="flex-1 bg-green-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-green-600 transition-colors"
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