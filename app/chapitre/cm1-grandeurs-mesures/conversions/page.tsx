'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Play, Target, RefreshCw } from 'lucide-react';

interface Exercise {
  id: number;
  question: string;
  answer: string;
  unit: string;
  explanation: string;
  difficulty: 'facile' | 'moyen' | 'difficile';
  type: 'longueur' | 'masse' | 'contenance';
}

export default function ConversionsPage() {
  const [activeTab, setActiveTab] = useState<'methode' | 'exercices'>('methode');
  const [currentExercise, setCurrentExercise] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [exerciseType, setExerciseType] = useState<'tous' | 'longueur' | 'masse' | 'contenance'>('tous');
  const [animationStep, setAnimationStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [selectedConversion, setSelectedConversion] = useState<'longueur' | 'masse' | 'contenance'>('longueur');

  const exercises: Exercise[] = [
    // Conversions de longueur
    { id: 1, question: "Convertis 5 m en cm", answer: "500", unit: "cm", explanation: "5 m = 5 × 100 = 500 cm", difficulty: 'facile', type: 'longueur' },
    { id: 2, question: "Convertis 3000 mm en m", answer: "3", unit: "m", explanation: "3000 mm = 3000 ÷ 1000 = 3 m", difficulty: 'facile', type: 'longueur' },
    { id: 3, question: "Convertis 2,5 km en m", answer: "2500", unit: "m", explanation: "2,5 km = 2,5 × 1000 = 2500 m", difficulty: 'moyen', type: 'longueur' },
    { id: 4, question: "Convertis 150 cm en dm", answer: "15", unit: "dm", explanation: "150 cm = 150 ÷ 10 = 15 dm", difficulty: 'moyen', type: 'longueur' },
    { id: 5, question: "Convertis 0,8 hm en cm", answer: "8000", unit: "cm", explanation: "0,8 hm = 80 m = 8000 cm", difficulty: 'difficile', type: 'longueur' },
    { id: 6, question: "Convertis 45 dm en mm", answer: "4500", unit: "mm", explanation: "45 dm = 450 cm = 4500 mm", difficulty: 'difficile', type: 'longueur' },
    
    // Conversions de masse
    { id: 7, question: "Convertis 4 kg en g", answer: "4000", unit: "g", explanation: "4 kg = 4 × 1000 = 4000 g", difficulty: 'facile', type: 'masse' },
    { id: 8, question: "Convertis 2500 g en kg", answer: "2,5", unit: "kg", explanation: "2500 g = 2500 ÷ 1000 = 2,5 kg", difficulty: 'facile', type: 'masse' },
    { id: 9, question: "Convertis 1,5 t en kg", answer: "1500", unit: "kg", explanation: "1,5 t = 1,5 × 1000 = 1500 kg", difficulty: 'moyen', type: 'masse' },
    { id: 10, question: "Convertis 350 g en hg", answer: "3,5", unit: "hg", explanation: "350 g = 350 ÷ 100 = 3,5 hg", difficulty: 'moyen', type: 'masse' },
    { id: 11, question: "Convertis 0,6 t en g", answer: "600000", unit: "g", explanation: "0,6 t = 600 kg = 600 000 g", difficulty: 'difficile', type: 'masse' },
    { id: 12, question: "Convertis 250 cg en g", answer: "2,5", unit: "g", explanation: "250 cg = 250 ÷ 100 = 2,5 g", difficulty: 'difficile', type: 'masse' },
    
    // Conversions de contenance
    { id: 13, question: "Convertis 3 L en mL", answer: "3000", unit: "mL", explanation: "3 L = 3 × 1000 = 3000 mL", difficulty: 'facile', type: 'contenance' },
    { id: 14, question: "Convertis 1500 mL en L", answer: "1,5", unit: "L", explanation: "1500 mL = 1500 ÷ 1000 = 1,5 L", difficulty: 'facile', type: 'contenance' },
    { id: 15, question: "Convertis 2,5 hL en L", answer: "250", unit: "L", explanation: "2,5 hL = 2,5 × 100 = 250 L", difficulty: 'moyen', type: 'contenance' },
    { id: 16, question: "Convertis 80 dL en L", answer: "8", unit: "L", explanation: "80 dL = 80 ÷ 10 = 8 L", difficulty: 'moyen', type: 'contenance' },
    { id: 17, question: "Convertis 0,5 hL en mL", answer: "50000", unit: "mL", explanation: "0,5 hL = 50 L = 50 000 mL", difficulty: 'difficile', type: 'contenance' },
    { id: 18, question: "Convertis 45 cL en mL", answer: "450", unit: "mL", explanation: "45 cL = 45 × 10 = 450 mL", difficulty: 'difficile', type: 'contenance' }
  ];

  const filteredExercises = exerciseType === 'tous' 
    ? exercises 
    : exercises.filter(ex => ex.type === exerciseType);

  const currentEx = filteredExercises[currentExercise];

  useEffect(() => {
    if (currentExercise >= filteredExercises.length) {
      setCurrentExercise(0);
    }
  }, [exerciseType, currentExercise, filteredExercises.length]);

  const handleAnswer = (answer: string) => {
    setSelectedAnswer(answer);
    setShowAnswer(true);
    if (answer === currentEx.answer || parseFloat(answer) === parseFloat(currentEx.answer)) {
      setScore(score + 1);
    }
  };

  const nextExercise = () => {
    setCurrentExercise((prev) => (prev + 1) % filteredExercises.length);
    setShowAnswer(false);
    setSelectedAnswer('');
  };

  const prevExercise = () => {
    setCurrentExercise((prev) => (prev - 1 + filteredExercises.length) % filteredExercises.length);
    setShowAnswer(false);
    setSelectedAnswer('');
  };

  const runAnimation = () => {
    setIsAnimating(true);
    setAnimationStep(0);
    
    const interval = setInterval(() => {
      setAnimationStep(prev => {
        if (prev >= 4) {
          clearInterval(interval);
          setIsAnimating(false);
          return 0;
        }
        return prev + 1;
      });
    }, 1000);
  };

  const conversionTables = {
    longueur: {
      title: "Longueurs",
      units: ["km", "hm", "dam", "m", "dm", "cm", "mm"],
      values: ["1", "10", "100", "1000", "10 000", "100 000", "1 000 000"],
      color: "blue"
    },
    masse: {
      title: "Masses",
      units: ["t", "kg", "hg", "g", "cg", "mg"],
      values: ["1", "1000", "10 000", "1 000 000", "100 000 000", "1 000 000 000"],
      color: "green"
    },
    contenance: {
      title: "Contenances",
      units: ["hL", "L", "dL", "cL", "mL"],
      values: ["1", "100", "1000", "10 000", "100 000"],
      color: "purple"
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <Link href="/chapitre/cm1-grandeurs-mesures" className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 transition-colors">
              <ArrowLeft size={20} />
              <span>Retour au chapitre</span>
            </Link>
          </div>
          
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-indigo-100">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
                🔄
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Conversions</h1>
                <p className="text-gray-600 text-lg">
                  Convertir entre unités (×10, ×100, ×1000)
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab('methode')}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              activeTab === 'methode'
                ? 'bg-indigo-500 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            📖 Méthode
          </button>
          <button
            onClick={() => setActiveTab('exercices')}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              activeTab === 'exercices'
                ? 'bg-indigo-500 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            ✏️ Exercices ({filteredExercises.length})
          </button>
        </div>

        {/* Contenu Méthode */}
        {activeTab === 'methode' && (
          <div className="space-y-8">
            {/* Section 1: Tableaux de conversion */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">📊 Tableaux de conversion</h2>
              
              <div className="mb-6">
                <div className="flex gap-2 mb-4">
                  {Object.entries(conversionTables).map(([key, table]) => (
                    <button
                      key={key}
                      onClick={() => setSelectedConversion(key as any)}
                      className={`px-4 py-2 rounded-lg font-medium transition-all ${
                        selectedConversion === key
                          ? `bg-${table.color}-500 text-white shadow-lg`
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {table.title}
                    </button>
                  ))}
                </div>
                
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="font-bold text-gray-800 mb-4">
                    {conversionTables[selectedConversion].title}
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300">
                      <thead>
                        <tr className="bg-gray-200">
                          {conversionTables[selectedConversion].units.map((unit, index) => (
                            <th key={index} className="border border-gray-300 p-2 text-gray-800">
                              {unit}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          {conversionTables[selectedConversion].values.map((value, index) => (
                            <td key={index} className="border border-gray-300 p-2 text-center text-gray-800">
                              {value}
                            </td>
                          ))}
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Animation des conversions */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">🎬 Animation des conversions</h2>
              
              <div className="flex justify-center mb-6">
                <button
                  onClick={runAnimation}
                  disabled={isAnimating}
                  className="bg-indigo-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-600 disabled:opacity-50 transition-all"
                >
                  <Play size={20} className="inline mr-2" />
                  {isAnimating ? 'Animation en cours...' : 'Voir l\'animation'}
                </button>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-bold text-gray-800 mb-4">Exemple: Convertir 3,5 kg en g</h3>
                
                <div className="space-y-4">
                  <div className={`transition-all duration-500 ${animationStep >= 1 ? 'opacity-100' : 'opacity-30'}`}>
                    <div className="bg-blue-100 p-3 rounded border-l-4 border-blue-500">
                      <p className="text-gray-800"><strong>Étape 1:</strong> Je trouve kg et g dans le tableau</p>
                    </div>
                  </div>
                  
                  <div className={`transition-all duration-500 ${animationStep >= 2 ? 'opacity-100' : 'opacity-30'}`}>
                    <div className="bg-green-100 p-3 rounded border-l-4 border-green-500">
                      <p className="text-gray-800"><strong>Étape 2:</strong> De kg à g, je me déplace vers la droite</p>
                    </div>
                  </div>
                  
                  <div className={`transition-all duration-500 ${animationStep >= 3 ? 'opacity-100' : 'opacity-30'}`}>
                    <div className="bg-orange-100 p-3 rounded border-l-4 border-orange-500">
                      <p className="text-gray-800"><strong>Étape 3:</strong> Je compte 3 rangs : kg → hg → g</p>
                    </div>
                  </div>
                  
                  <div className={`transition-all duration-500 ${animationStep >= 4 ? 'opacity-100' : 'opacity-30'}`}>
                    <div className="bg-purple-100 p-3 rounded border-l-4 border-purple-500">
                      <p className="text-gray-800"><strong>Résultat:</strong> 3,5 × 1000 = 3500 g</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3: Règles de conversion */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">📐 Règles de conversion</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h3 className="font-bold text-blue-800 mb-4">➡️ Vers des unités plus petites</h3>
                  <ul className="space-y-2 text-blue-700">
                    <li>• Je me déplace vers la <strong>droite</strong></li>
                    <li>• Je <strong>multiplie</strong> par 10, 100, 1000...</li>
                    <li>• Le nombre devient <strong>plus grand</strong></li>
                    <li>• Exemple : 2 m = 200 cm</li>
                  </ul>
                </div>
                
                <div className="bg-green-50 p-6 rounded-lg">
                  <h3 className="font-bold text-green-800 mb-4">⬅️ Vers des unités plus grandes</h3>
                  <ul className="space-y-2 text-green-700">
                    <li>• Je me déplace vers la <strong>gauche</strong></li>
                    <li>• Je <strong>divise</strong> par 10, 100, 1000...</li>
                    <li>• Le nombre devient <strong>plus petit</strong></li>
                    <li>• Exemple : 3000 g = 3 kg</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Contenu Exercices */}
        {activeTab === 'exercices' && (
          <div className="space-y-8">
            {/* Filtres */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
              <h3 className="font-bold text-gray-800 mb-4">🎯 Filtrer les exercices</h3>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'tous', label: 'Tous', color: 'bg-gray-500' },
                  { id: 'longueur', label: 'Longueurs', color: 'bg-blue-500' },
                  { id: 'masse', label: 'Masses', color: 'bg-green-500' },
                  { id: 'contenance', label: 'Contenances', color: 'bg-purple-500' }
                ].map(type => (
                  <button
                    key={type.id}
                    onClick={() => setExerciseType(type.id as any)}
                    className={`px-4 py-2 rounded-lg text-white font-medium transition-all ${
                      exerciseType === type.id ? type.color : 'bg-gray-300'
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Exercice actuel */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    Exercice {currentExercise + 1} / {filteredExercises.length}
                  </h2>
                  <div className="flex items-center gap-4 mt-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      currentEx.difficulty === 'facile' ? 'bg-green-100 text-green-800' :
                      currentEx.difficulty === 'moyen' ? 'bg-orange-100 text-orange-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {currentEx.difficulty}
                    </span>
                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                      {currentEx.type}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-indigo-600">{score}</div>
                  <div className="text-sm text-gray-500">points</div>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg mb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">{currentEx.question}</h3>
                
                <div className="flex gap-4 mb-4">
                  <input
                    type="text"
                    value={selectedAnswer}
                    onChange={(e) => setSelectedAnswer(e.target.value)}
                    placeholder="Votre réponse"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    disabled={showAnswer}
                  />
                  <span className="px-4 py-2 bg-gray-200 rounded-lg font-medium text-gray-800">
                    {currentEx.unit}
                  </span>
                </div>

                {!showAnswer && (
                  <button
                    onClick={() => handleAnswer(selectedAnswer)}
                    className="bg-indigo-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-600 transition-all"
                  >
                    Vérifier
                  </button>
                )}
              </div>

              {showAnswer && (
                <div className={`p-4 rounded-lg mb-6 ${
                  selectedAnswer === currentEx.answer || parseFloat(selectedAnswer) === parseFloat(currentEx.answer)
                    ? 'bg-green-100 border border-green-200'
                    : 'bg-red-100 border border-red-200'
                }`}>
                  <p className="font-bold mb-2 text-gray-800">
                    {selectedAnswer === currentEx.answer || parseFloat(selectedAnswer) === parseFloat(currentEx.answer)
                      ? '✅ Bonne réponse !'
                      : '❌ Réponse incorrecte'}
                  </p>
                  <p className="text-sm text-gray-800">
                    <strong>Réponse correcte :</strong> {currentEx.answer} {currentEx.unit}
                  </p>
                  <p className="text-sm mt-2 text-gray-800">
                    <strong>Explication :</strong> {currentEx.explanation}
                  </p>
                </div>
              )}

              <div className="flex justify-between">
                <button
                  onClick={prevExercise}
                  className="bg-gray-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-600 transition-all"
                >
                  ← Précédent
                </button>
                <button
                  onClick={nextExercise}
                  className="bg-indigo-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-600 transition-all"
                >
                  Suivant →
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 