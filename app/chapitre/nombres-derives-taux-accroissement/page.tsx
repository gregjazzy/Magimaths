'use client';

import { useState } from 'react';
import { Calculator, Target, CheckCircle, BookOpen } from 'lucide-react';
import ChapterLayout from '../../components/ChapterLayout';

const DerivabilityExercise: React.FC = () => {
  const [currentExercise, setCurrentExercise] = useState(1);
  const [showCorrection, setShowCorrection] = useState(false);

  const exercises = [
    {
      id: 1,
      function: "f(x) = 2x + 5",
      point: "a = 2",
      title: "Fonction affine",
      steps: {
        fa: "f(2) = 2(2) + 5 = 9",
        fah: "f(2+h) = 2(2+h) + 5 = 9 + 2h",
        diff: "f(2+h) - f(2) = 2h",
        division: "2h / h = 2",
        limit: "lim(h→0) 2 = 2",
        result: "f'(2) = 2"
      }
    },
    {
      id: 2,
      function: "f(x) = x² + 4x",
      point: "a = 1",
      title: "Fonction polynôme",
      steps: {
        fa: "f(1) = 1² + 4(1) = 5",
        fah: "f(1+h) = (1+h)² + 4(1+h) = 5 + 6h + h²",
        diff: "f(1+h) - f(1) = 6h + h²",
        division: "(6h + h²) / h = 6 + h",
        limit: "lim(h→0) (6 + h) = 6",
        result: "f'(1) = 6"
      }
    },
    {
      id: 3,
      function: "f(x) = -x² + 3x + 1",
      point: "a = 2",
      title: "Fonction polynôme avec coefficient négatif",
      steps: {
        fa: "f(2) = -(2)² + 3(2) + 1 = 3",
        fah: "f(2+h) = -(2+h)² + 3(2+h) + 1 = 3 - h - h²",
        diff: "f(2+h) - f(2) = -h - h²",
        division: "(-h - h²) / h = -1 - h",
        limit: "lim(h→0) (-1 - h) = -1",
        result: "f'(2) = -1"
      }
    },
    {
      id: 4,
      function: "f(x) = 2x² - 5x + 3",
      point: "a = 0",
      title: "Fonction polynôme au point 0",
      steps: {
        fa: "f(0) = 2(0)² - 5(0) + 3 = 3",
        fah: "f(0+h) = f(h) = 2h² - 5h + 3",
        diff: "f(h) - f(0) = 2h² - 5h",
        division: "(2h² - 5h) / h = 2h - 5",
        limit: "lim(h→0) (2h - 5) = -5",
        result: "f'(0) = -5"
      }
    }
  ];

  const currentEx = exercises[currentExercise - 1];

  const handleNext = () => {
    if (currentExercise < 4) {
      setCurrentExercise(prev => prev + 1);
      setShowCorrection(false);
    }
  };

  const handlePrev = () => {
    if (currentExercise > 1) {
      setCurrentExercise(prev => prev - 1);
      setShowCorrection(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-200">
      <div className="text-center mb-8">
        <div className="inline-flex items-center space-x-2 bg-green-100 px-4 py-2 rounded-full mb-4">
          <Calculator className="h-5 w-5 text-green-600" />
          <span className="font-semibold text-green-800">Exercice {currentExercise}/4</span>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          {currentEx.title}
        </h2>
        <p className="text-xl text-gray-600">
          Calculer la dérivée de <strong>{currentEx.function}</strong> au point <strong>{currentEx.point}</strong>
        </p>
      </div>

      {/* Rappel théorique */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl border-2 border-blue-300 mb-8">
        <h3 className="text-xl font-bold text-blue-800 mb-4">
          📋 Rappel : Condition de dérivabilité
        </h3>
        
        <div className="bg-white p-6 rounded-xl border-2 border-blue-200">
          <div className="text-center">
            <div className="text-lg font-bold text-gray-800 mb-3">
              Une fonction f est dérivable en a si cette limite existe :
            </div>
            <div className="bg-blue-100 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-800 flex items-center justify-center">
                <span>f'(a) = </span>
                <div className="flex flex-col items-center mx-2">
                  <span className="text-xl">lim</span>
                  <span className="text-sm border-t border-blue-600 pt-1">h→0</span>
                </div>
                <div className="mx-4">
                  <div className="border-b-2 border-blue-500 pb-1">f(a + h) - f(a)</div>
                  <div className="text-xl mt-2 text-center">h</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Étapes de résolution */}
      <div className="space-y-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          📐 Étapes de résolution pour {currentEx.function}
        </h3>
        
        <div className="grid gap-4">
          {/* Étape 1 */}
          <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-blue-500">
            <div className="font-bold text-blue-700 mb-2">Étape 1 : Calculer f(a)</div>
            <div className="font-mono text-lg">{currentEx.steps.fa}</div>
          </div>
          
          {/* Étape 2 */}
          <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-green-500">
            <div className="font-bold text-green-700 mb-2">Étape 2 : Calculer f(a+h)</div>
            <div className="font-mono text-lg">{currentEx.steps.fah}</div>
          </div>
          
          {/* Étape 3 */}
          <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-purple-500">
            <div className="font-bold text-purple-700 mb-2">Étape 3 : Calculer f(a+h) - f(a)</div>
            <div className="font-mono text-lg">{currentEx.steps.diff}</div>
          </div>
          
          {/* Étape 4 */}
          <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-orange-500">
            <div className="font-bold text-orange-700 mb-2">Étape 4 : Diviser par h</div>
            <div className="font-mono text-lg">{currentEx.steps.division}</div>
          </div>
          
          {/* Étape 5 */}
          <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-red-500">
            <div className="font-bold text-red-700 mb-2">Étape 5 : Calculer la limite</div>
            <div className="font-mono text-lg">{currentEx.steps.limit}</div>
          </div>
          
          {/* Résultat */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-4 rounded-lg text-white">
            <div className="font-bold text-white mb-2">✅ Résultat final</div>
            <div className="font-mono text-xl font-bold">{currentEx.steps.result}</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center mt-8">
        <button
          onClick={handlePrev}
          disabled={currentExercise === 1}
          className={`px-6 py-3 rounded-lg font-semibold transition-all ${
            currentExercise === 1
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
        >
          ← Précédent
        </button>
        
        <div className="flex space-x-2">
          {exercises.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full ${
                index + 1 === currentExercise ? 'bg-green-500' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
        
        {currentExercise < 4 ? (
          <button
            onClick={handleNext}
            className="px-6 py-3 rounded-lg font-semibold bg-blue-500 hover:bg-blue-600 text-white transition-all"
          >
            Suivant →
          </button>
        ) : (
          <button
            className="px-6 py-3 rounded-lg font-semibold bg-green-500 hover:bg-green-600 text-white transition-all"
          >
            Terminé !
          </button>
        )}
      </div>
    </div>
  );
};

export default function DerivabilitePage() {
  const sections = [
    {
      id: 'intro',
      title: 'DÉRIVABILITÉ EN UN POINT 🎯',
      icon: '📐',
      content: (
        <div className="space-y-8">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-8 shadow-xl text-white">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-6">
                DÉRIVABILITÉ EN UN POINT
              </h1>
              <div className="text-2xl mb-6">
                Comprendre et calculer la dérivabilité avec des exemples pratiques
              </div>
              <div className="text-lg text-indigo-100">
                📏 Utiliser la définition pour calculer des dérivées
              </div>
            </div>
          </div>
        </div>
      ),
      xpReward: 10
    },
    {
      id: 'exemple',
      title: 'Exemple Détaillé 📝',
      icon: '🔍',
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-blue-500 to-green-600 text-white p-6 rounded-2xl">
            <h3 className="text-xl font-bold mb-3">Exemple pas à pas</h3>
            <p className="text-lg">
              Calcul détaillé de la dérivée d'une fonction au point donné
            </p>
          </div>
          
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-200">
            <div className="text-center mb-8">
              <div className="inline-flex items-center space-x-2 bg-blue-100 px-4 py-2 rounded-full mb-4">
                <Target className="h-5 w-5 text-blue-600" />
                <span className="font-semibold text-blue-800">Exemple Type</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                📝 Calcul de la dérivée de f(x) = x² + 3x au point a = 2
              </h2>
            </div>

            <div className="space-y-6">
              {/* Rappel formule */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-2xl border-2 border-blue-300">
                <h3 className="text-xl font-bold text-blue-800 mb-4">
                  📋 Formule de la dérivée
                </h3>
                <div className="bg-white p-6 rounded-xl border-2 border-blue-200">
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-800 mb-3">
                      f'(a) = lim(h→0) [f(a + h) - f(a)] / h
                    </div>
                  </div>
                </div>
              </div>

              {/* Étapes détaillées */}
              <div className="grid gap-4">
                <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-blue-500">
                  <div className="font-bold text-blue-700 mb-2">Étape 1 : Calculer f(2)</div>
                  <div className="font-mono text-lg">f(2) = 2² + 3(2) = 4 + 6 = 10</div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-green-500">
                  <div className="font-bold text-green-700 mb-2">Étape 2 : Calculer f(2+h)</div>
                  <div className="font-mono text-lg">f(2+h) = (2+h)² + 3(2+h) = 4 + 4h + h² + 6 + 3h = 10 + 7h + h²</div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-purple-500">
                  <div className="font-bold text-purple-700 mb-2">Étape 3 : Calculer f(2+h) - f(2)</div>
                  <div className="font-mono text-lg">f(2+h) - f(2) = (10 + 7h + h²) - 10 = 7h + h²</div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-orange-500">
                  <div className="font-bold text-orange-700 mb-2">Étape 4 : Diviser par h</div>
                  <div className="font-mono text-lg">[f(2+h) - f(2)] / h = (7h + h²) / h = 7 + h</div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-red-500">
                  <div className="font-bold text-red-700 mb-2">Étape 5 : Calculer la limite</div>
                  <div className="font-mono text-lg">lim(h→0) (7 + h) = 7</div>
                </div>
                
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-4 rounded-lg text-white">
                  <div className="font-bold text-white mb-2">✅ Résultat final</div>
                  <div className="font-mono text-xl font-bold">f'(2) = 7</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
      xpReward: 15
    },
    {
      id: 'exercices',
      title: 'Exercices Pratiques 💪',
      icon: '📋',
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-green-500 to-blue-600 text-white p-6 rounded-2xl">
            <h3 className="text-xl font-bold mb-3">Entraînement</h3>
            <p className="text-lg">
              Maîtrisez le calcul de la dérivée en un point !
            </p>
          </div>
          <DerivabilityExercise />
        </div>
      ),
      xpReward: 30
    }
  ];

  return (
    <ChapterLayout 
      title="Dérivabilité en un Point"
      description="Comprendre et calculer la dérivabilité avec des exemples pratiques"
      sections={sections}
      navigation={{
        previous: { href: '/chapitre/nombres-derives-definition', text: 'Définition de la dérivée' },
        next: { href: '/chapitre/nombres-derives-overview', text: 'Vue d\'ensemble' }
      }}
    />
  );
} 