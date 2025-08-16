'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, XCircle, RotateCcw, Lightbulb, Play, Pause } from 'lucide-react';

// Tables de multiplication pour CE1
const tablesData = {
  table2: {
    name: "Table de 2",
    icon: "✌️",
    color: "green",
    trick: "On compte de 2 en 2 ! 2, 4, 6, 8, 10, 12, 14, 16, 18, 20",
    pattern: "Les nombres pairs : 2, 4, 6, 8...",
    multiplications: [
      { operation: "2 × 1", result: 2, visual: "🟢🟢", explanation: "2" },
      { operation: "2 × 2", result: 4, visual: "🟢🟢 🟢🟢", explanation: "2 + 2 = 4" },
      { operation: "2 × 3", result: 6, visual: "🟢🟢 🟢🟢 🟢🟢", explanation: "4 + 2 = 6" },
      { operation: "2 × 4", result: 8, visual: "8", explanation: "Tu vois ? +2 à chaque fois !" },
      { operation: "2 × 5", result: 10, visual: "10", explanation: "Facile !" },
      { operation: "2 × 6", result: 12, visual: "12", explanation: "Tu maîtrises !" },
      { operation: "2 × 7", result: 14, visual: "14", explanation: "Parfait !" },
      { operation: "2 × 8", result: 16, visual: "16", explanation: "Génial !" },
      { operation: "2 × 9", result: 18, visual: "18", explanation: "Super !" },
      { operation: "2 × 10", result: 20, visual: "20", explanation: "Bravo !" }
    ]
  },
  table5: {
    name: "Table de 5",
    icon: "🖐️",
    color: "blue",
    trick: "Ça finit toujours par 5 ou 0 ! Et on compte avec ses doigts : 5, 10, 15, 20...",
    pattern: "Les résultats finissent par 5 ou 0",
    multiplications: [
      { operation: "5 × 1", result: 5, visual: "🖐️", explanation: "1 main = 5" },
      { operation: "5 × 2", result: 10, visual: "🖐️🖐️", explanation: "2 mains = 10" },
      { operation: "5 × 3", result: 15, visual: "🖐️🖐️🖐️", explanation: "3 mains = 15" },
      { operation: "5 × 4", result: 20, visual: "20", explanation: "Tu vois ? +5 à chaque fois !" },
      { operation: "5 × 5", result: 25, visual: "25", explanation: "Toujours 5 ou 0 à la fin !" },
      { operation: "5 × 6", result: 30, visual: "30", explanation: "Facile !" },
      { operation: "5 × 7", result: 35, visual: "35", explanation: "Tu maîtrises !" },
      { operation: "5 × 8", result: 40, visual: "40", explanation: "Parfait !" },
      { operation: "5 × 9", result: 45, visual: "45", explanation: "Génial !" },
      { operation: "5 × 10", result: 50, visual: "50", explanation: "Bravo !" }
    ]
  },
  table10: {
    name: "Table de 10",
    icon: "🔟",
    color: "indigo",
    trick: "Super facile ! On ajoute juste un 0 à la fin du nombre !",
    pattern: "Tous les résultats finissent par 0",
    multiplications: [
      { operation: "10 × 1", result: 10, visual: "1 → 10", explanation: "1 avec un 0 = 10" },
      { operation: "10 × 2", result: 20, visual: "2 → 20", explanation: "2 avec un 0 = 20" },
      { operation: "10 × 3", result: 30, visual: "3 → 30", explanation: "Tu vois le pattern !" },
      { operation: "10 × 4", result: 40, visual: "4 → 40", explanation: "Facile !" },
      { operation: "10 × 5", result: 50, visual: "5 → 50", explanation: "Bravo !" },
      { operation: "10 × 6", result: 60, visual: "6 → 60", explanation: "Parfait !" },
      { operation: "10 × 7", result: 70, visual: "7 → 70", explanation: "Génial !" },
      { operation: "10 × 8", result: 80, visual: "8 → 80", explanation: "Super !" },
      { operation: "10 × 9", result: 90, visual: "9 → 90", explanation: "Excellent !" },
      { operation: "10 × 10", result: 100, visual: "10 → 100", explanation: "Champion !" }
    ]
  }
};

// Exercices pour chaque table (15 questions randomisées)
const exercisesData = {
  table2: [
    { question: "2 × 7", answer: 14 },
    { question: "2 × 3", answer: 6 },
    { question: "2 × 9", answer: 18 },
    { question: "2 × 5", answer: 10 },
    { question: "2 × 1", answer: 2 },
    { question: "2 × 8", answer: 16 },
    { question: "2 × 4", answer: 8 },
    { question: "2 × 10", answer: 20 },
    { question: "2 × 2", answer: 4 },
    { question: "2 × 6", answer: 12 },
    { question: "2 × 3", answer: 6 },
    { question: "2 × 9", answer: 18 },
    { question: "2 × 7", answer: 14 },
    { question: "2 × 5", answer: 10 },
    { question: "2 × 8", answer: 16 }
  ],
  table5: [
    { question: "5 × 4", answer: 20 },
    { question: "5 × 7", answer: 35 },
    { question: "5 × 2", answer: 10 },
    { question: "5 × 9", answer: 45 },
    { question: "5 × 6", answer: 30 },
    { question: "5 × 1", answer: 5 },
    { question: "5 × 8", answer: 40 },
    { question: "5 × 3", answer: 15 },
    { question: "5 × 10", answer: 50 },
    { question: "5 × 5", answer: 25 },
    { question: "5 × 2", answer: 10 },
    { question: "5 × 8", answer: 40 },
    { question: "5 × 6", answer: 30 },
    { question: "5 × 4", answer: 20 },
    { question: "5 × 9", answer: 45 }
  ],
  table10: [
    { question: "10 × 6", answer: 60 },
    { question: "10 × 3", answer: 30 },
    { question: "10 × 9", answer: 90 },
    { question: "10 × 1", answer: 10 },
    { question: "10 × 7", answer: 70 },
    { question: "10 × 4", answer: 40 },
    { question: "10 × 8", answer: 80 },
    { question: "10 × 2", answer: 20 },
    { question: "10 × 10", answer: 100 },
    { question: "10 × 5", answer: 50 },
    { question: "10 × 3", answer: 30 },
    { question: "10 × 8", answer: 80 },
    { question: "10 × 6", answer: 60 },
    { question: "10 × 9", answer: 90 },
    { question: "10 × 7", answer: 70 }
  ]
};

// Fonction pour jouer l'audio
const playAudio = (text: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    if ('speechSynthesis' in window) {
      // Annuler toute synthèse en cours
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'fr-FR';
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      
      utterance.onend = () => resolve();
      utterance.onerror = (event) => reject(event.error);
      
      window.speechSynthesis.speak(utterance);
    } else {
      resolve();
    }
  });
};

// Fonction d'attente
const wait = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// Fonction pour scroller vers un élément
const scrollToElement = (elementId: string) => {
  const element = document.getElementById(elementId);
  if (element) {
    element.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'center',
      inline: 'nearest'
    });
  }
};

// Composant pour l'animation d'une table
function TableAnimation({ 
  tableKey, 
  highlightedElement, 
  audioRef, 
  updateAudioState 
}: { 
  tableKey: keyof typeof tablesData;
  highlightedElement: string | null;
  audioRef: React.MutableRefObject<boolean>;
  updateAudioState: (isPlaying: boolean) => void;
}) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const table = tablesData[tableKey];

  const explainTable = async () => {
    if (isPlaying) return;
    
    setIsPlaying(true);
    updateAudioState(true);
    audioRef.current = true;
    
    try {
      // Explication de l'astuce
      await playAudio(table.trick);
      await wait(1000);
      
      // Parcourir chaque multiplication
      for (let i = 0; i < table.multiplications.length; i++) {
        if (!audioRef.current) break;
        
        setCurrentStep(i);
        const mult = table.multiplications[i];
        
        await playAudio(mult.operation);
        await wait(500);
        await playAudio(`égale ${mult.result}`);
        await wait(500);
        await playAudio(mult.explanation);
        await wait(800);
      }
      
      // Pattern final
      if (audioRef.current) {
        await playAudio(table.pattern);
      }
      
    } catch (error) {
      console.error('Erreur audio:', error);
    } finally {
      setIsPlaying(false);
      updateAudioState(false);
      audioRef.current = false;
      setCurrentStep(0);
    }
  };

  const stopExplanation = () => {
    audioRef.current = false;
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    updateAudioState(false);
    setCurrentStep(0);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="text-center mb-6">
        <div className="text-6xl mb-4">{table.icon}</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">{table.name}</h2>
        
        {/* Astuce pédagogique */}
        <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 mb-4 rounded">
          <div className="flex items-center mb-2">
            <Lightbulb className="w-5 h-5 text-yellow-600 mr-2" />
            <span className="font-bold text-yellow-800">Astuce !</span>
          </div>
          <p className="text-yellow-800 text-sm">{table.trick}</p>
          <p className="text-yellow-700 text-xs mt-2 italic">{table.pattern}</p>
        </div>

        <button
          onClick={isPlaying ? stopExplanation : explainTable}
          className={`px-6 py-3 rounded-lg font-bold text-white transition-all ${
            isPlaying 
              ? 'bg-red-500 hover:bg-red-600' 
              : 'bg-blue-500 hover:bg-blue-600'
          }`}
        >
          {isPlaying ? (
            <>
              <Pause className="inline w-5 h-5 mr-2" />
              Arrêter l'explication
            </>
          ) : (
            <>
              <Play className="inline w-5 h-5 mr-2" />
              Écouter l'explication
            </>
          )}
        </button>
      </div>

      {/* Grille des multiplications */}
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 sm:gap-3">
        {table.multiplications.map((mult, index) => (
          <div
            key={index}
            className={`p-2 sm:p-3 rounded-lg border-2 text-center transition-all ${
              currentStep === index && isPlaying
                ? 'border-blue-500 bg-blue-50 scale-105'
                : 'border-gray-200 bg-gray-50'
            }`}
          >
            <div className="font-bold text-gray-800 text-xs sm:text-sm mb-1">
              {mult.operation}
            </div>
            <div className="text-sm sm:text-base mb-1 text-gray-800 font-medium">{mult.visual}</div>
            <div className="text-base sm:text-lg font-bold text-gray-800">
              = {mult.result}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Composant pour les exercices d'une table
function TableExercises({ 
  tableKey, 
  onComplete,
  highlightedElement 
}: { 
  tableKey: keyof typeof exercisesData;
  onComplete: (score: number) => void;
  highlightedElement?: string | null;
}) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const exercises = exercisesData[tableKey];
  const currentExercise = exercises[currentQuestion];

  const handleSubmitAnswer = () => {
    if (showResult || userAnswer.trim() === '') return;
    
    const numericAnswer = parseInt(userAnswer.trim());
    const correct = numericAnswer === currentExercise.answer;
    
    setIsCorrect(correct);
    setShowResult(true);
    
    if (correct) {
      setScore(score + 1);
    }
    
    setTimeout(() => {
      if (currentQuestion < exercises.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setUserAnswer('');
        setShowResult(false);
        setIsCorrect(false);
      } else {
        setIsComplete(true);
        onComplete(score + (correct ? 1 : 0));
      }
    }, 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmitAnswer();
    }
  };

  const resetExercises = () => {
    setCurrentQuestion(0);
    setUserAnswer('');
    setShowResult(false);
    setScore(0);
    setIsComplete(false);
    setIsCorrect(false);
  };

  if (isComplete) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 text-center">
        <div className="text-6xl mb-4">🎉</div>
        <h3 className="text-2xl font-bold text-gray-800 mb-4">
          Exercices terminés !
        </h3>
        <div className="text-xl mb-6">
          Score : <span className="font-bold text-blue-600">{score}/{exercises.length}</span>
        </div>
        <button
          onClick={resetExercises}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-bold"
        >
          <RotateCcw className="inline w-5 h-5 mr-2" />
          Recommencer
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm text-gray-600">
            Question {currentQuestion + 1} / {exercises.length}
          </span>
          <span className="text-sm text-gray-600">
            Score : {score}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestion + 1) / exercises.length) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="text-center mb-8">
        <h3 className="text-3xl font-bold text-gray-800 mb-4">
          {currentExercise.question} = ?
        </h3>
      </div>

      <div 
        id="exercise-input"
        className={`flex flex-col items-center space-y-4 ${
          highlightedElement === 'exercise-choices' ? 'ring-4 ring-yellow-400 animate-pulse rounded-xl p-4' : ''
        }`}
      >
        {/* Champ de saisie */}
        <div className="flex items-center space-x-4">
          <input
            type="number"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={showResult}
            placeholder="?"
            className={`w-24 h-16 text-3xl font-bold text-center border-2 rounded-lg transition-all ${
              showResult
                ? isCorrect
                  ? 'border-green-500 bg-green-100 text-green-800'
                  : 'border-red-500 bg-red-100 text-red-800'
                : 'border-gray-300 bg-white text-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
            }`}
            autoFocus
          />
          
          <button
            onClick={handleSubmitAnswer}
            disabled={showResult || userAnswer.trim() === ''}
            className={`px-6 py-3 rounded-lg font-bold transition-all ${
              showResult || userAnswer.trim() === ''
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-xl'
            }`}
          >
            Valider
          </button>
        </div>

        {/* Résultat */}
        {showResult && (
          <div className={`flex items-center space-x-2 text-lg font-bold ${
            isCorrect ? 'text-green-600' : 'text-red-600'
          }`}>
            {isCorrect ? (
              <>
                <CheckCircle className="w-6 h-6" />
                <span>Bravo ! C'est correct !</span>
              </>
            ) : (
              <>
                <XCircle className="w-6 h-6" />
                <span>La bonne réponse était {currentExercise.answer}</span>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function TablesMultiplicationCE1() {
  const [showExerciseTab, setShowExerciseTab] = useState(false);
  const [selectedTable, setSelectedTable] = useState<keyof typeof tablesData>('table2');
  const [highlightedElement, setHighlightedElement] = useState<string | null>(null);
  const [completionScores, setCompletionScores] = useState<{[key: string]: number}>({});
  const [isPlayingCourseExplanation, setIsPlayingCourseExplanation] = useState(false);
  const [isPlayingExerciseExplanation, setIsPlayingExerciseExplanation] = useState(false);

  // Refs pour gérer l'audio
  const tableAudioRef = useRef(false);

  const updateChildAudioState = (childId: string, isPlaying: boolean) => {
    console.log(`🔊 Child ${childId} audio state:`, isPlaying);
  };

  const handleExerciseComplete = (score: number) => {
    setCompletionScores({
      ...completionScores,
      [selectedTable]: score
    });
  };

  const explainCourseWithSteve = async () => {
    if (isPlayingCourseExplanation) return;
    
    setIsPlayingCourseExplanation(true);
    
    try {
      await playAudio("Salut ! Je suis Steve et je vais t'expliquer comment utiliser cette page !");
      await wait(1000);
      
      scrollToElement('course-tab');
      setHighlightedElement('course-tab');
      await playAudio("Tu es dans l'onglet Cours ! Ici tu peux apprendre les tables de multiplication !");
      await wait(1500);
      
      scrollToElement('table-selection');
      setHighlightedElement('table-selection');
      await playAudio("D'abord, choisis une table : 2, 5 ou 10 !");
      await wait(1500);
      
      scrollToElement('table-animation');
      setHighlightedElement('table-animation');
      await playAudio("Ensuite, clique sur 'Écouter l'explication' pour apprendre les astuces !");
      await wait(1500);
      
      scrollToElement('exercise-tab');
      setHighlightedElement('exercise-tab');
      await playAudio("Quand tu es prêt, va dans l'onglet Exercices pour t'entraîner !");
      await wait(1000);
      
      setHighlightedElement(null);
      await playAudio("C'est parti ! Amuse-toi bien !");
      
    } catch (error) {
      console.error('Erreur audio:', error);
    } finally {
      setIsPlayingCourseExplanation(false);
      setHighlightedElement(null);
    }
  };

  const explainExercisesWithSteve = async () => {
    if (isPlayingExerciseExplanation) return;
    
    setIsPlayingExerciseExplanation(true);
    
    try {
      await playAudio("Super ! Tu es dans l'onglet Exercices !");
      await wait(1000);
      
      scrollToElement('exercise-table-selection');
      setHighlightedElement('exercise-table-selection');
      await playAudio("Choisis d'abord une table pour t'exercer !");
      await wait(1500);
      
      scrollToElement('exercise-questions');
      setHighlightedElement('exercise-questions');
      await playAudio("Tu auras 15 questions pour chaque table !");
      await wait(1500);
      
      scrollToElement('exercise-input');
      setHighlightedElement('exercise-choices');
      await playAudio("Écris ta réponse dans le champ et appuie sur Entrée ou Valider !");
      await wait(1500);
      
      await playAudio("Si tu as une réponse inexacte, je te donnerai la solution !");
      await wait(1500);
      
      scrollToElement('course-tab');
      setHighlightedElement('course-tab');
      await playAudio("Si tu as besoin d'aide, retourne dans l'onglet Cours !");
      await wait(1000);
      
      setHighlightedElement(null);
      await playAudio("Bonne chance pour tes exercices !");
      
    } catch (error) {
      console.error('Erreur audio:', error);
    } finally {
      setIsPlayingExerciseExplanation(false);
      setHighlightedElement(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <Link href="/chapitre/ce1-quatre-operations/multiplication-ce1" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-4 touch-manipulation">
            <ArrowLeft className="w-4 h-4" />
            <span>Retour au chapitre</span>
          </Link>
          
          <div className="bg-white rounded-xl p-3 sm:p-6 shadow-lg text-center">
            <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-2 sm:mb-4">
              <span className="sm:hidden">🔢 Tables de multiplication</span>
              <span className="hidden sm:inline">🔢 Tables de multiplication CE1</span>
            </h1>
            <p className="text-sm sm:text-lg text-gray-600">
              <span className="sm:hidden">Tables de 2, 5 et 10</span>
              <span className="hidden sm:inline">Apprends les tables de 2, 5 et 10 avec des animations !</span>
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center space-x-4 mb-8">
          <button
            id="course-tab"
            onClick={() => setShowExerciseTab(false)}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              !showExerciseTab
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white text-blue-600 hover:bg-blue-50'
            } ${
              highlightedElement === 'course-tab' ? 'ring-4 ring-yellow-400 animate-pulse' : ''
            }`}
          >
            📚 Cours
          </button>
          <button
            id="exercise-tab"
            onClick={() => setShowExerciseTab(true)}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              showExerciseTab
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white text-blue-600 hover:bg-blue-50'
            } ${
              highlightedElement === 'exercise-tab' ? 'ring-4 ring-yellow-400 animate-pulse' : ''
            }`}
          >
            🎯 Exercices
          </button>
        </div>

        {!showExerciseTab ? (
          /* COURS */
          <div>
            {/* Bouton DÉMARRER pour le cours avec personnage Minecraft */}
            <div className="flex items-center justify-center gap-2 sm:gap-4 p-2 sm:p-4 mb-3 sm:mb-6">
              {/* Image du personnage pour le cours */}
              <div className={`relative transition-all duration-500 border-2 border-blue-300 rounded-full bg-gradient-to-br from-blue-100 to-cyan-100 ${
                isPlayingCourseExplanation
                    ? 'w-14 sm:w-24 h-14 sm:h-24' // When speaking - plus petit sur mobile
                    : 'w-12 sm:w-20 h-12 sm:h-20' // Normal size
              }`}>
                <img 
                  src="/image/Minecraftstyle.png" 
                  alt="Personnage Minecraft" 
                  className="w-full h-full object-cover rounded-full"
                />
                
                {isPlayingCourseExplanation && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-red-500 rounded-full animate-pulse">
                    <svg className="w-full h-full text-white" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C13.1 2 14 2.9 14 4V12C14 13.1 13.1 14 12 14C10.9 14 10 13.1 10 12V4C10 2.9 10.9 2 12 2M19 11C19 15.4 15.4 19 11 19V21H13V23H11V21H9V23H7V21H9V19C4.6 19 1 15.4 1 11H3C3 14.3 5.7 17 9 17V15C7.3 15 6 13.7 6 12V11H4V9H6V8C6 6.3 7.3 5 9 5V7C8.4 7 8 7.4 8 8V12C8 12.6 8.4 13 9 13V11H11V13C11.6 13 12 12.6 12 12V8C12 7.4 11.6 7 11 7V5C12.7 5 14 6.3 14 8V9H16V11H14V12C14 13.7 12.7 15 11 15V17C14.3 17 17 14.3 17 11H19Z"/>
                    </svg>
                  </div>
                )}
              </div>

              {/* Bouton DÉMARRER pour le cours */}
              <button
                onClick={explainCourseWithSteve}
                disabled={isPlayingCourseExplanation}
                className={`px-2 sm:px-4 py-1 sm:py-2 rounded-lg font-bold text-xs sm:text-base shadow-lg transition-all ${
                  isPlayingCourseExplanation
                    ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:shadow-xl hover:scale-105'
                } ${!isPlayingCourseExplanation ? 'animate-pulse' : ''}`}
              >
                <Play className="w-3 h-3 sm:w-5 sm:h-5 inline-block mr-1 sm:mr-2" />
                {isPlayingCourseExplanation ? 'Le personnage explique...' : 'DÉMARRER LE COURS'}
              </button>
            </div>

            {/* Sélection de table */}
            <div 
              id="table-selection"
              className={`bg-white rounded-xl shadow-lg p-6 mb-6 ${
                highlightedElement === 'table-selection' ? 'ring-4 ring-yellow-400 animate-pulse' : ''
              }`}
            >
              <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">
                Choisis une table à apprendre
              </h2>
              
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-3 sm:gap-4">
                {Object.entries(tablesData).map(([key, table]) => (
                  <button
                    key={key}
                    onClick={() => {
                      setSelectedTable(key as keyof typeof tablesData);
                      // Scroll vers l'animation de la table après un petit délai
                      setTimeout(() => {
                        scrollToElement('table-animation');
                      }, 100);
                    }}
                    className={`p-3 sm:p-4 rounded-lg border-2 transition-all ${
                      selectedTable === key
                        ? `border-${table.color}-500 bg-${table.color}-50`
                        : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <div className="text-2xl sm:text-3xl mb-2">{table.icon}</div>
                    <div className="font-bold text-gray-800 text-sm sm:text-base">{table.name}</div>
                    {completionScores[key] && (
                      <div className="text-sm text-green-600 mt-2">
                        ✅ Score : {completionScores[key]} / 15
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Animation de la table */}
            <div 
              id="table-animation"
              className={`space-y-6 ${
                highlightedElement === 'table-animation' ? 'ring-4 ring-yellow-400 animate-pulse rounded-xl' : ''
              }`}
            >
              <TableAnimation
                tableKey={selectedTable}
                highlightedElement={highlightedElement}
                audioRef={tableAudioRef}
                updateAudioState={(isPlaying) => updateChildAudioState('table', isPlaying)}
              />
            </div>
          </div>
        ) : (
          /* EXERCICES */
          <div className="space-y-4 sm:space-y-6">
            {/* Bouton DÉMARRER pour les exercices avec personnage Minecraft */}
            <div className="flex items-center justify-center gap-2 sm:gap-4 p-2 sm:p-4 mb-2 sm:mb-6">
              {/* Image du personnage pour les exercices */}
              <div className={`relative transition-all duration-500 border-2 border-green-300 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 ${
                isPlayingExerciseExplanation
                    ? 'w-14 sm:w-24 h-14 sm:h-24' // When speaking - plus petit sur mobile
                    : 'w-12 sm:w-20 h-12 sm:h-20' // Normal size
              }`}>
                <img 
                  src="/image/Minecraftstyle.png" 
                  alt="Personnage Minecraft" 
                  className="w-full h-full object-cover rounded-full"
                />
                
                {isPlayingExerciseExplanation && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-red-500 rounded-full animate-pulse">
                    <svg className="w-full h-full text-white" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C13.1 2 14 2.9 14 4V12C14 13.1 13.1 14 12 14C10.9 14 10 13.1 10 12V4C10 2.9 10.9 2 12 2M19 11C19 15.4 15.4 19 11 19V21H13V23H11V21H9V23H7V21H9V19C4.6 19 1 15.4 1 11H3C3 14.3 5.7 17 9 17V15C7.3 15 6 13.7 6 12V11H4V9H6V8C6 6.3 7.3 5 9 5V7C8.4 7 8 7.4 8 8V12C8 12.6 8.4 13 9 13V11H11V13C11.6 13 12 12.6 12 12V8C12 7.4 11.6 7 11 7V5C12.7 5 14 6.3 14 8V9H16V11H14V12C14 13.7 12.7 15 11 15V17C14.3 17 17 14.3 17 11H19Z"/>
                    </svg>
                  </div>
                )}
              </div>

              {/* Bouton DÉMARRER pour les exercices */}
              <button
                onClick={explainExercisesWithSteve}
                disabled={isPlayingExerciseExplanation}
                className={`px-2 sm:px-4 py-1 sm:py-2 rounded-lg font-bold text-xs sm:text-base shadow-lg transition-all ${
                  isPlayingExerciseExplanation
                    ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                    : 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:shadow-xl hover:scale-105'
                } ${!isPlayingExerciseExplanation ? 'animate-pulse' : ''}`}
              >
                <Play className="w-3 h-3 sm:w-5 sm:h-5 inline-block mr-1 sm:mr-2" />
                {isPlayingExerciseExplanation ? 'Le personnage explique...' : 'DÉMARRER LES EXERCICES'}
              </button>
            </div>

            {/* Sélection de table pour exercices */}
            <div 
              id="exercise-table-selection"
              className={`bg-white rounded-xl shadow-lg p-6 mb-6 ${
                highlightedElement === 'exercise-table-selection' ? 'ring-4 ring-yellow-400 animate-pulse' : ''
              }`}
            >
              <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">
                Choisis une table pour t'exercer
              </h2>
              
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-3 sm:gap-4">
                {Object.entries(tablesData).map(([key, table]) => (
                  <button
                    key={key}
                    onClick={() => {
                      setSelectedTable(key as keyof typeof tablesData);
                      // Scroll vers les exercices après un petit délai
                      setTimeout(() => {
                        scrollToElement('exercise-questions');
                      }, 100);
                    }}
                    className={`p-3 sm:p-4 rounded-lg border-2 transition-all ${
                      selectedTable === key
                        ? `border-${table.color}-500 bg-${table.color}-50`
                        : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <div className="text-2xl sm:text-3xl mb-2">{table.icon}</div>
                    <div className="font-bold text-gray-800 text-sm sm:text-base">{table.name}</div>
                    {completionScores[key] && (
                      <div className="text-sm text-green-600 mt-2">
                        ✅ Score : {completionScores[key]} / 15
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div 
              id="exercise-questions"
              className={highlightedElement === 'exercise-questions' ? 'ring-4 ring-yellow-400 animate-pulse rounded-xl' : ''}
            >
              <TableExercises
                tableKey={selectedTable}
                onComplete={handleExerciseComplete}
                highlightedElement={highlightedElement}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}