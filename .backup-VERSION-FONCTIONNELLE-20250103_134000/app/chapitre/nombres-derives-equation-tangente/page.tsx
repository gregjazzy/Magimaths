'use client';

import { useState } from 'react';
import { Calculator, Target, BookOpen } from 'lucide-react';
import ChapterLayout from '../../components/ChapterLayout';
import FormulaSection from '../../components/FormulaSection';

const formulasData = [
  {
    id: 'tangent-formula',
    title: 'Équation de la Tangente',
    formula: 'y = f\'(a)(x - a) + f(a)',
    description: 'L\'équation de la tangente à la courbe de f au point d\'abscisse a',
    examples: [
      'f\'(a) = coefficient directeur de la tangente',
      'f(a) = ordonnée du point de tangence',
      'Point de tangence : (a, f(a))'
    ],
    color: 'blue' as const
  }
];

const TangentExercise: React.FC = () => {
  const [showExample, setShowExample] = useState(false);
  const [currentExercise, setCurrentExercise] = useState(1);

  const exercises = [
    {
      id: 1,
      function: 'f(x) = x² + 2x',
      point: 'a = 1',
      title: 'Fonction polynôme',
      solution: {
        fa: 'f(1) = 1² + 2(1) = 3',
        derivee: 'f\'(1) = 4 (par définition)',
        equation: 'y = 4(x - 1) + 3 = 4x - 1'
      }
    },
    {
      id: 2,
      function: 'f(x) = 2x² - 3x + 1',
      point: 'a = 2',
      title: 'Fonction polynôme complexe',
      solution: {
        fa: 'f(2) = 2(4) - 3(2) + 1 = 3',
        derivee: 'f\'(2) = 5 (par définition)',
        equation: 'y = 5(x - 2) + 3 = 5x - 7'
      }
    },
    {
      id: 3,
      function: 'f(x) = √(x + 1)',
      point: 'a = 3',
      title: 'Fonction racine',
      solution: {
        fa: 'f(3) = √(3 + 1) = 2',
        derivee: 'f\'(3) = 1/4 (par définition)',
        equation: 'y = (1/4)(x - 3) + 2 = (1/4)x + 5/4'
      }
    }
  ];

  const currentEx = exercises[currentExercise - 1];

  return (
    <div className="space-y-8">
      {/* Exemple détaillé */}
      <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-200">
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-2 bg-green-100 px-4 py-2 rounded-full mb-4">
            <Target className="h-5 w-5 text-green-600" />
            <span className="font-semibold text-green-800">Exemple Type</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            📝 Exemple Détaillé
          </h2>
          <p className="text-xl text-gray-600">
            Calcul complet avec la définition de la dérivée
          </p>
        </div>

        <div className="bg-green-50 p-6 rounded-xl border-2 border-green-300 mb-6">
          <div className="text-center">
            <div className="text-lg font-bold text-gray-800 mb-4">📋 Énoncé</div>
            <div className="bg-white p-4 rounded-lg border-2 border-green-400">
              <div className="text-lg text-gray-800 mb-2">
                Soit f(x) = x² + 2x
              </div>
              <div className="text-lg text-green-800 font-bold">
                Déterminer l'équation de la tangente à la courbe de f au point d'abscisse a = 1
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mb-6">
          <button
            onClick={() => setShowExample(!showExample)}
            className={`px-8 py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-105 ${
              showExample
                ? 'bg-gray-500 hover:bg-gray-600 text-white'
                : 'bg-green-500 hover:bg-green-600 text-white'
            }`}
          >
            {showExample ? '🔍 Masquer la résolution' : '🔍 Voir la résolution complète'}
          </button>
        </div>

        {showExample && (
          <div className="space-y-6">
            {/* Étape 1 */}
            <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-500">
              <div className="font-bold text-blue-800 mb-4">Étape 1 : Calculer f(1)</div>
              <div className="bg-white p-4 rounded-lg border">
                <div className="text-gray-800 space-y-2">
                  <div>f(1) = 1² + 2(1) = 1 + 2 = 3</div>
                  <div className="text-green-700 font-bold">Le point de tangence est (1, 3)</div>
                </div>
              </div>
            </div>

            {/* Étape 2 */}
            <div className="bg-purple-50 p-6 rounded-lg border-l-4 border-purple-500">
              <div className="font-bold text-purple-800 mb-4">Étape 2 : Calculer f'(1) par la définition</div>
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg border">
                  <div className="text-gray-800 space-y-2">
                    <div>f(1+h) = (1+h)² + 2(1+h) = 1 + 2h + h² + 2 + 2h = 3 + 4h + h²</div>
                    <div>f(1+h) - f(1) = (3 + 4h + h²) - 3 = 4h + h²</div>
                    <div>[f(1+h) - f(1)] / h = (4h + h²) / h = 4 + h</div>
                    <div className="text-purple-700 font-bold">f'(1) = lim(h→0) (4 + h) = 4</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Étape 3 */}
            <div className="bg-orange-50 p-6 rounded-lg border-l-4 border-orange-500">
              <div className="font-bold text-orange-800 mb-4">Étape 3 : Écrire l'équation de la tangente</div>
              <div className="bg-white p-4 rounded-lg border">
                <div className="text-gray-800 space-y-2">
                  <div>Formule : y = f'(a)(x - a) + f(a)</div>
                  <div>y = 4(x - 1) + 3</div>
                  <div className="text-orange-700 font-bold">y = 4x - 1</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Exercices pratiques */}
      <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-200">
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-2 bg-purple-100 px-4 py-2 rounded-full mb-4">
            <Calculator className="h-5 w-5 text-purple-600" />
            <span className="font-semibold text-purple-800">Exercice {currentExercise}/3</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            🎯 Exercices d'Entraînement
          </h2>
          <p className="text-xl text-gray-600">
            À ton tour de calculer l'équation de la tangente !
          </p>
        </div>

        {/* Exercice actuel */}
        <div className="bg-purple-50 p-6 rounded-xl border-2 border-purple-300 mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-800 mb-4">
              📝 {currentEx.title}
            </div>
            <div className="bg-white p-4 rounded-lg border-2 border-purple-400">
              <div className="text-lg text-gray-800 mb-2">
                Fonction : <strong>{currentEx.function}</strong>
              </div>
              <div className="text-lg text-purple-800 font-bold">
                Calculer l'équation de la tangente au point {currentEx.point}
              </div>
            </div>
          </div>
        </div>

        {/* Solution */}
        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
            <div className="font-bold text-blue-700 mb-2">Étape 1 : Point de tangence</div>
            <div className="font-mono">{currentEx.solution.fa}</div>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
            <div className="font-bold text-green-700 mb-2">Étape 2 : Dérivée</div>
            <div className="font-mono">{currentEx.solution.derivee}</div>
          </div>
          
          <div className="bg-orange-50 p-4 rounded-lg border-l-4 border-orange-500">
            <div className="font-bold text-orange-700 mb-2">Étape 3 : Équation finale</div>
            <div className="font-mono text-lg font-bold">{currentEx.solution.equation}</div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-8">
          <button
            onClick={() => setCurrentExercise(Math.max(1, currentExercise - 1))}
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
                  index + 1 === currentExercise ? 'bg-purple-500' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
          
          {currentExercise < 3 ? (
            <button
              onClick={() => setCurrentExercise(Math.min(3, currentExercise + 1))}
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
    </div>
  );
};

export default function EquationTangentePage() {
  const sections = [
    {
      id: 'intro',
      title: 'ÉQUATION DE LA TANGENTE 📐',
      icon: '📏',
      content: (
        <div className="space-y-8">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-8 shadow-xl text-white">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-6">
                ÉQUATION DE LA TANGENTE
              </h1>
              <div className="text-2xl mb-6">
                Calcul de l'équation de la droite tangente
              </div>
              <div className="text-lg text-blue-100">
                📐 Utilisation de la définition de la dérivée
              </div>
            </div>
          </div>
        </div>
      ),
      xpReward: 10
    },
    {
      id: 'formule',
      title: 'Formule de la Tangente 📋',
      icon: '📐',
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-2xl">
            <h3 className="text-xl font-bold mb-3">Formule de référence</h3>
            <p className="text-lg">
              L'équation de la tangente à la courbe de f au point d'abscisse a
            </p>
          </div>
          <FormulaSection 
            formulas={formulasData}
            onComplete={() => {}}
            completedFormulas={['tangent-formula']}
          />
        </div>
      ),
      xpReward: 15
    },
    {
      id: 'exercices',
      title: 'Exemples et Exercices 🎯',
      icon: '📝',
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-green-500 to-blue-600 text-white p-6 rounded-2xl">
            <h3 className="text-xl font-bold mb-3">Entraînement pratique</h3>
            <p className="text-lg">
              Maîtrisez le calcul de l'équation de la tangente !
            </p>
          </div>
          <TangentExercise />
        </div>
      ),
      xpReward: 30
    }
  ];

  return (
    <ChapterLayout 
      title="Équation de la Tangente"
      description="Calcul de l'équation de la droite tangente avec la définition de la dérivée"
      sections={sections}
      navigation={{
        previous: { href: '/chapitre/nombres-derives-calcul', text: 'Dérivabilité et racines' },
        next: { href: '/chapitre/nombres-derives-graphique', text: 'Interprétation graphique' }
      }}
    />
  );
} 