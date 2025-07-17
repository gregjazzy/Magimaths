'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Play, Target, Eye } from 'lucide-react';

interface Exercise {
  id: number;
  question: string;
  answer: string;
  unit: string;
  explanation: string;
  difficulty: 'facile' | 'moyen' | 'difficile';
  type: 'longueur' | 'masse' | 'contenance' | 'temps';
  choices: string[];
}

export default function EstimationsPage() {
  const [activeTab, setActiveTab] = useState<'methode' | 'exercices'>('methode');
  const [currentExercise, setCurrentExercise] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [exerciseType, setExerciseType] = useState<'tous' | 'longueur' | 'masse' | 'contenance' | 'temps'>('tous');
  const [animationStep, setAnimationStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const exercises: Exercise[] = [
    // Estimations de longueur (10 questions)
    { id: 1, question: "Quelle est la longueur d'un terrain de football ?", answer: "100", unit: "m", explanation: "Un terrain de football mesure environ 100 mètres de long", difficulty: 'facile', type: 'longueur', choices: ["50", "100", "200", "500"] },
    { id: 2, question: "Quelle est la hauteur d'un immeuble de 3 étages ?", answer: "10", unit: "m", explanation: "Un immeuble de 3 étages mesure environ 10 mètres", difficulty: 'facile', type: 'longueur', choices: ["5", "10", "20", "50"] },
    { id: 3, question: "Quelle est la largeur d'une rue ?", answer: "8", unit: "m", explanation: "Une rue mesure environ 8 mètres de large", difficulty: 'moyen', type: 'longueur', choices: ["3", "8", "15", "25"] },
    { id: 4, question: "Quelle est la longueur d'un autobus ?", answer: "12", unit: "m", explanation: "Un autobus mesure environ 12 mètres de long", difficulty: 'moyen', type: 'longueur', choices: ["6", "12", "25", "40"] },
    { id: 5, question: "Quelle est la hauteur de la Tour Eiffel ?", answer: "324", unit: "m", explanation: "La Tour Eiffel mesure 324 mètres", difficulty: 'difficile', type: 'longueur', choices: ["150", "324", "500", "800"] },
    { id: 6, question: "Quelle est la largeur d'une porte ?", answer: "80", unit: "cm", explanation: "Une porte mesure environ 80 centimètres de large", difficulty: 'facile', type: 'longueur', choices: ["40", "80", "120", "200"] },
    { id: 7, question: "Quelle est la longueur d'un crayon ?", answer: "18", unit: "cm", explanation: "Un crayon mesure environ 18 centimètres", difficulty: 'facile', type: 'longueur', choices: ["10", "18", "25", "35"] },
    { id: 8, question: "Quelle est la hauteur d'une table ?", answer: "75", unit: "cm", explanation: "Une table mesure environ 75 centimètres de haut", difficulty: 'moyen', type: 'longueur', choices: ["50", "75", "100", "150"] },
    { id: 9, question: "Quelle est la longueur d'un vélo ?", answer: "180", unit: "cm", explanation: "Un vélo mesure environ 180 centimètres de long", difficulty: 'moyen', type: 'longueur', choices: ["120", "180", "250", "350"] },
    { id: 10, question: "Quelle est la distance entre Paris et Marseille ?", answer: "800", unit: "km", explanation: "La distance entre Paris et Marseille est d'environ 800 kilomètres", difficulty: 'difficile', type: 'longueur', choices: ["400", "800", "1200", "2000"] },
    
    // Estimations de masse (10 questions)
    { id: 11, question: "Quelle est la masse d'un éléphant ?", answer: "5", unit: "t", explanation: "Un éléphant pèse environ 5 tonnes", difficulty: 'facile', type: 'masse', choices: ["1", "5", "10", "20"] },
    { id: 12, question: "Quelle est la masse d'un sac de farine ?", answer: "1", unit: "kg", explanation: "Un sac de farine pèse environ 1 kilogramme", difficulty: 'facile', type: 'masse', choices: ["0,5", "1", "2", "5"] },
    { id: 13, question: "Quelle est la masse d'un cheval ?", answer: "500", unit: "kg", explanation: "Un cheval pèse environ 500 kilogrammes", difficulty: 'moyen', type: 'masse', choices: ["100", "500", "1000", "2000"] },
    { id: 14, question: "Quelle est la masse d'une balle de tennis ?", answer: "60", unit: "g", explanation: "Une balle de tennis pèse environ 60 grammes", difficulty: 'moyen', type: 'masse', choices: ["20", "60", "150", "300"] },
    { id: 15, question: "Quelle est la masse d'un camion chargé ?", answer: "20", unit: "t", explanation: "Un camion chargé pèse environ 20 tonnes", difficulty: 'difficile', type: 'masse', choices: ["5", "20", "50", "100"] },
    { id: 16, question: "Quelle est la masse d'une pomme ?", answer: "150", unit: "g", explanation: "Une pomme pèse environ 150 grammes", difficulty: 'facile', type: 'masse', choices: ["50", "150", "300", "500"] },
    { id: 17, question: "Quelle est la masse d'un chat ?", answer: "4", unit: "kg", explanation: "Un chat pèse environ 4 kilogrammes", difficulty: 'facile', type: 'masse', choices: ["1", "4", "8", "15"] },
    { id: 18, question: "Quelle est la masse d'un dictionnaire ?", answer: "800", unit: "g", explanation: "Un dictionnaire pèse environ 800 grammes", difficulty: 'moyen', type: 'masse', choices: ["200", "800", "1500", "3000"] },
    { id: 19, question: "Quelle est la masse d'une voiture ?", answer: "1,2", unit: "t", explanation: "Une voiture pèse environ 1,2 tonne", difficulty: 'moyen', type: 'masse', choices: ["0,5", "1,2", "3", "8"] },
    { id: 20, question: "Quelle est la masse d'un grain de riz ?", answer: "25", unit: "mg", explanation: "Un grain de riz pèse environ 25 milligrammes", difficulty: 'difficile', type: 'masse', choices: ["5", "25", "100", "500"] },
    
    // Estimations de contenance (10 questions)
    { id: 21, question: "Quelle est la contenance d'une baignoire ?", answer: "200", unit: "L", explanation: "Une baignoire contient environ 200 litres", difficulty: 'facile', type: 'contenance', choices: ["50", "200", "500", "1000"] },
    { id: 22, question: "Quelle est la contenance d'un arrosoir ?", answer: "10", unit: "L", explanation: "Un arrosoir contient environ 10 litres", difficulty: 'facile', type: 'contenance', choices: ["2", "10", "25", "50"] },
    { id: 23, question: "Quelle est la contenance d'une piscine ?", answer: "50", unit: "hL", explanation: "Une piscine contient environ 50 hectolitres", difficulty: 'moyen', type: 'contenance', choices: ["10", "50", "100", "500"] },
    { id: 24, question: "Quelle est la contenance d'un réservoir de voiture ?", answer: "50", unit: "L", explanation: "Un réservoir de voiture contient environ 50 litres", difficulty: 'moyen', type: 'contenance', choices: ["20", "50", "100", "200"] },
    { id: 25, question: "Quelle est la contenance d'une citerne ?", answer: "1000", unit: "L", explanation: "Une citerne contient environ 1000 litres", difficulty: 'difficile', type: 'contenance', choices: ["100", "1000", "5000", "10000"] },
    { id: 26, question: "Quelle est la contenance d'un verre ?", answer: "25", unit: "cL", explanation: "Un verre contient environ 25 centilitres", difficulty: 'facile', type: 'contenance', choices: ["10", "25", "50", "100"] },
    { id: 27, question: "Quelle est la contenance d'une bouteille d'eau ?", answer: "1,5", unit: "L", explanation: "Une bouteille d'eau contient environ 1,5 litre", difficulty: 'facile', type: 'contenance', choices: ["0,5", "1,5", "3", "5"] },
    { id: 28, question: "Quelle est la contenance d'une casserole ?", answer: "3", unit: "L", explanation: "Une casserole contient environ 3 litres", difficulty: 'moyen', type: 'contenance', choices: ["1", "3", "8", "15"] },
    { id: 29, question: "Quelle est la contenance d'un seau ?", answer: "12", unit: "L", explanation: "Un seau contient environ 12 litres", difficulty: 'moyen', type: 'contenance', choices: ["5", "12", "25", "50"] },
    { id: 30, question: "Quelle est la contenance d'une cuillère à café ?", answer: "5", unit: "mL", explanation: "Une cuillère à café contient environ 5 millilitres", difficulty: 'difficile', type: 'contenance', choices: ["1", "5", "15", "50"] },
    
    // Estimations de temps (10 questions)
    { id: 31, question: "Quel est le temps pour faire ses lacets ?", answer: "30", unit: "s", explanation: "Faire ses lacets prend environ 30 secondes", difficulty: 'facile', type: 'temps', choices: ["10", "30", "60", "120"] },
    { id: 32, question: "Quel est le temps pour prendre une douche ?", answer: "10", unit: "min", explanation: "Prendre une douche prend environ 10 minutes", difficulty: 'facile', type: 'temps', choices: ["5", "10", "20", "30"] },
    { id: 33, question: "Quel est le temps pour cuisiner un repas ?", answer: "45", unit: "min", explanation: "Cuisiner un repas prend environ 45 minutes", difficulty: 'moyen', type: 'temps', choices: ["15", "45", "90", "180"] },
    { id: 34, question: "Quel est le temps pour aller de Paris à Lyon en train ?", answer: "2", unit: "h", explanation: "Le trajet Paris-Lyon en train prend environ 2 heures", difficulty: 'moyen', type: 'temps', choices: ["1", "2", "4", "6"] },
    { id: 35, question: "Quel est le temps pour faire ses devoirs ?", answer: "1", unit: "h", explanation: "Faire ses devoirs prend environ 1 heure", difficulty: 'difficile', type: 'temps', choices: ["0,5", "1", "2", "3"] },
    { id: 36, question: "Quel est le temps pour se brosser les dents ?", answer: "3", unit: "min", explanation: "Se brosser les dents prend environ 3 minutes", difficulty: 'facile', type: 'temps', choices: ["1", "3", "8", "15"] },
    { id: 37, question: "Quel est le temps pour manger un repas ?", answer: "30", unit: "min", explanation: "Manger un repas prend environ 30 minutes", difficulty: 'facile', type: 'temps', choices: ["10", "30", "60", "120"] },
    { id: 38, question: "Quel est le temps pour regarder un film ?", answer: "2", unit: "h", explanation: "Regarder un film prend environ 2 heures", difficulty: 'moyen', type: 'temps', choices: ["1", "2", "3", "5"] },
    { id: 39, question: "Quel est le temps pour traverser la France en voiture ?", answer: "8", unit: "h", explanation: "Traverser la France en voiture prend environ 8 heures", difficulty: 'moyen', type: 'temps', choices: ["4", "8", "15", "24"] },
    { id: 40, question: "Quel est le temps pour faire pousser une plante ?", answer: "2", unit: "mois", explanation: "Faire pousser une plante prend environ 2 mois", difficulty: 'difficile', type: 'temps', choices: ["2 semaines", "2", "6", "2 ans"] }
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
    
    if (answer === currentEx.answer) {
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
        if (prev >= 5) {
          clearInterval(interval);
          setIsAnimating(false);
          return 0;
        }
        return prev + 1;
      });
    }, 1000);
  };

  const isAnswerCorrect = () => {
    return selectedAnswer === currentEx.answer;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <Link href="/chapitre/cm1-grandeurs-mesures" className="flex items-center gap-2 text-pink-600 hover:text-pink-800 transition-colors">
              <ArrowLeft size={20} />
              <span>Retour au chapitre</span>
            </Link>
          </div>
          
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-pink-100">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
                🎯
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Estimations</h1>
                <p className="text-gray-600 text-lg">
                  Estimer des grandeurs et vérifier la cohérence
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
                ? 'bg-pink-500 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            📚 Méthode
          </button>
          <button
            onClick={() => setActiveTab('exercices')}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              activeTab === 'exercices'
                ? 'bg-pink-500 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            🏃 Exercices (40)
          </button>
        </div>

        {/* Méthode Tab */}
        {activeTab === 'methode' && (
          <div className="space-y-8">
            {/* Méthode d'estimation */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">📏 Méthode d'estimation</h2>
              
              <div className="space-y-6">
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h3 className="text-lg font-bold text-blue-800 mb-3">🎯 Pourquoi estimer ?</h3>
                  <ul className="text-blue-700 space-y-2">
                    <li>• Vérifier la cohérence d'un résultat</li>
                    <li>• Développer son sens des grandeurs</li>
                    <li>• Résoudre des problèmes concrets</li>
                    <li>• Contrôler des calculs</li>
                  </ul>
                </div>

                <div className="bg-green-50 p-6 rounded-lg">
                  <h3 className="text-lg font-bold text-green-800 mb-3">🧠 Stratégies d'estimation</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-green-700 mb-2">Longueurs</h4>
                      <ul className="text-green-600 text-sm space-y-1">
                        <li>• Utiliser son corps (empan, pas, taille)</li>
                        <li>• Comparer à des objets connus</li>
                        <li>• Décomposer en parties plus petites</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-green-700 mb-2">Masses</h4>
                      <ul className="text-green-600 text-sm space-y-1">
                        <li>• Comparer à des objets familiers</li>
                        <li>• Utiliser des références (livre = 500g)</li>
                        <li>• Penser aux emballages courants</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-green-700 mb-2">Contenances</h4>
                      <ul className="text-green-600 text-sm space-y-1">
                        <li>• Visualiser des récipients connus</li>
                        <li>• Comparer à une bouteille d'eau</li>
                        <li>• Utiliser des multiples simples</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-green-700 mb-2">Temps</h4>
                      <ul className="text-green-600 text-sm space-y-1">
                        <li>• Comparer à des activités connues</li>
                        <li>• Utiliser des références temporelles</li>
                        <li>• Décomposer en étapes</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-orange-50 p-6 rounded-lg">
                  <h3 className="text-lg font-bold text-orange-800 mb-3">💡 Ordres de grandeur utiles</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-orange-700 mb-2">Longueurs</h4>
                      <ul className="text-orange-600 text-sm space-y-1">
                        <li>• Hauteur d'une personne : 1,70 m</li>
                        <li>• Largeur d'une main : 10 cm</li>
                        <li>• Longueur d'un pas : 70 cm</li>
                        <li>• Hauteur d'un étage : 3 m</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-orange-700 mb-2">Masses</h4>
                      <ul className="text-orange-600 text-sm space-y-1">
                        <li>• Livre : 500 g</li>
                        <li>• Bouteille d'eau : 1,5 kg</li>
                        <li>• Personne adulte : 70 kg</li>
                        <li>• Voiture : 1,5 t</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Exercices Tab */}
        {activeTab === 'exercices' && (
          <div className="space-y-8">
            {/* Filtres */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">🎯 Filtrer les exercices</h2>
              <div className="flex flex-wrap gap-2">
                {[
                  { key: 'tous', label: 'Tous' },
                  { key: 'longueur', label: 'Longueurs' },
                  { key: 'masse', label: 'Masses' },
                  { key: 'contenance', label: 'Contenances' },
                  { key: 'temps', label: 'Temps' }
                ].map((type) => (
                  <button
                    key={type.key}
                    onClick={() => setExerciseType(type.key as any)}
                    className={`px-4 py-2 rounded-lg transition-all ${
                      exerciseType === type.key
                        ? 'bg-pink-500 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
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
                  <div className="text-2xl font-bold text-pink-600">{score}</div>
                  <div className="text-sm text-gray-500">points</div>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg mb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-6">{currentEx.question}</h3>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {currentEx.choices.map((choice, index) => (
                    <button
                      key={index}
                      onClick={() => handleAnswer(choice)}
                      disabled={showAnswer}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        showAnswer && choice === currentEx.answer
                          ? 'bg-green-100 border-green-500 text-green-800'
                          : showAnswer && choice === selectedAnswer && choice !== currentEx.answer
                          ? 'bg-red-100 border-red-500 text-red-800'
                          : showAnswer
                          ? 'bg-gray-100 border-gray-300 text-gray-500'
                          : 'bg-white border-gray-300 text-gray-800 hover:border-pink-500 hover:bg-pink-50 hover:text-pink-800'
                      }`}
                    >
                      <span className="text-lg font-semibold">{choice} {currentEx.unit}</span>
                    </button>
                  ))}
                </div>

                <div className="mb-4 text-sm text-gray-600">
                  💡 <strong>Astuce :</strong> Réfléchis aux objets de référence que tu connais !
                </div>
              </div>

              {showAnswer && (
                <div className={`p-4 rounded-lg mb-6 ${
                  isAnswerCorrect()
                    ? 'bg-green-100 border border-green-200'
                    : 'bg-red-100 border border-red-200'
                }`}>
                  <p className="font-bold mb-2 text-gray-800">
                    {isAnswerCorrect()
                      ? '✅ Bonne réponse !'
                      : '❌ Mauvaise réponse'}
                  </p>
                  <p className="text-sm text-gray-800">
                    <strong>Bonne réponse :</strong> {currentEx.answer} {currentEx.unit}
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
                  className="bg-pink-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-pink-600 transition-all"
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