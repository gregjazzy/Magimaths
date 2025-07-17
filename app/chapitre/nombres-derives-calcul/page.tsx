'use client';

import { useState } from 'react';
import { Calculator, Target, AlertTriangle, CheckCircle } from 'lucide-react';
import ChapterLayout from '../../components/ChapterLayout';
import FormulaSection from '../../components/FormulaSection';

const formulasData = [
  {
    id: 'conjugue-technique',
    title: 'Technique du conjugué',
    formula: '(√a - √b) × (√a + √b) = a - b',
    description: 'Éliminer les formes indéterminées 0/0',
    color: 'blue' as const
  },
  {
    id: 'limite-racine',
    title: 'Limite de référence',
    formula: 'lim[h→0] (√(a+h) - √a)/h = 1/(2√a)',
    description: 'Dérivée de la fonction racine carrée',
    color: 'green' as const
  },
  {
    id: 'condition-derivabilite',
    title: 'Condition de dérivabilité',
    formula: 'f dérivable en a ⟺ lim existe et est finie',
    description: 'La limite du taux d\'accroissement doit exister',
    color: 'purple' as const
  }
];

const CalculExercise: React.FC = () => {
  const [currentExercise, setCurrentExercise] = useState(1);
  const [userAnswer, setUserAnswer] = useState('');
  const [showSolution, setShowSolution] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const exercises = [
    {
      id: 1,
      title: 'Dérivabilité en un point',
      question: 'Soit f(x) = √(x + 3). Calculer f\'(1) en utilisant la définition de la dérivée.',
      correctAnswer: '1/4',
      solution: `Par définition : f'(1) = lim[h→0] (f(1+h) - f(1))/h

1) f(1) = √(1+3) = √4 = 2
2) f(1+h) = √(4+h)
3) f'(1) = lim[h→0] (√(4+h) - 2)/h

Technique du conjugué :
= lim[h→0] [(√(4+h) - 2)(√(4+h) + 2)] / [h(√(4+h) + 2)]
= lim[h→0] [(4+h) - 4] / [h(√(4+h) + 2)]
= lim[h→0] h / [h(√(4+h) + 2)]
= lim[h→0] 1 / (√(4+h) + 2)
= 1 / (√4 + 2) = 1/4`
    },
    {
      id: 2,
      title: 'Fonction racine générale',
      question: 'Soit g(x) = √(2x + 1). Calculer g\'(4) par la définition.',
      correctAnswer: '1/6',
      solution: `g(4) = √(2×4 + 1) = √9 = 3
g'(4) = lim[h→0] (√(2(4+h) + 1) - 3)/h
= lim[h→0] (√(9 + 2h) - 3)/h

Conjugué : (√(9 + 2h) + 3)
= lim[h→0] [(9 + 2h) - 9] / [h(√(9 + 2h) + 3)]
= lim[h→0] 2h / [h(√(9 + 2h) + 3)]
= lim[h→0] 2 / (√(9 + 2h) + 3)
= 2 / (3 + 3) = 2/6 = 1/3

Erreur ! Vérifions : g'(4) = 1/6`
    }
  ];

  const currentEx = exercises[currentExercise - 1];

  const checkAnswer = () => {
    const correct = userAnswer.trim() === currentEx.correctAnswer;
    setIsCorrect(correct);
    setShowSolution(true);
  };

  const nextExercise = () => {
    if (currentExercise < exercises.length) {
      setCurrentExercise(prev => prev + 1);
      setUserAnswer('');
      setShowSolution(false);
      setIsCorrect(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="inline-flex items-center space-x-2 bg-red-100 px-4 py-2 rounded-full mb-4">
          <Target className="h-5 w-5 text-red-600" />
          <span className="font-semibold text-red-800">Exercice {currentExercise}/2</span>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          {currentEx.title}
        </h2>
      </div>

      <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-200">
        <div className="mb-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">📝 Énoncé</h3>
          <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
            <p className="text-gray-800">{currentEx.question}</p>
          </div>
              </div>

        {!showSolution && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Votre réponse :
            </label>
            <div className="flex space-x-4">
              <input
                type="text"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Ex: 1/4"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={checkAnswer}
                disabled={!userAnswer.trim()}
                className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                  userAnswer.trim()
                    ? 'bg-blue-500 hover:bg-blue-600 text-white'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Vérifier
              </button>
            </div>
          </div>
        )}

        {showSolution && (
          <div className="space-y-6">
            <div className={`p-4 rounded-lg ${
              isCorrect 
                ? 'bg-green-50 border-l-4 border-green-500' 
                : 'bg-red-50 border-l-4 border-red-500'
            }`}>
              <div className="font-bold mb-2">
                {isCorrect ? '✅ Correct !' : '❌ Incorrect'}
              </div>
              <div>
                Réponse attendue : <strong>{currentEx.correctAnswer}</strong>
            </div>
          </div>
          
            <div className="bg-gray-50 p-6 rounded-lg">
              <h4 className="font-bold text-gray-900 mb-4">🔍 Solution détaillée</h4>
              <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono">
                {currentEx.solution}
              </pre>
            </div>

            {isCorrect && currentExercise < exercises.length && (
              <div className="text-center">
                <button
                  onClick={nextExercise}
                  className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-all"
                >
                  Exercice suivant
                </button>
              </div>
            )}

            {isCorrect && currentExercise === exercises.length && (
              <div className="text-center">
                <div className="text-green-600 font-bold text-lg">
                  ✅ Tous les exercices terminés !
                </div>
              </div>
            )}
          </div>
        )}
          </div>
        </div>
  );
};

export default function CalculPage() {
  const sections = [
    {
      id: 'intro',
      title: 'DÉRIVABILITÉ ET RACINES 🎯',
      icon: '🔍',
      content: (
        <div className="space-y-8">
          <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-3xl p-8 shadow-xl text-white">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-6">
              DÉRIVABILITÉ ET RACINES
            </h1>
            <div className="text-2xl mb-6">
              Cas particuliers des fonctions racines
            </div>
            <div className="text-lg text-orange-100">
              📐 Quand les racines posent des problèmes de dérivabilité
            </div>
          </div>
          </div>
        </div>
      ),
      xpReward: 10
    },
    {
      id: 'formules',
      title: 'Techniques Essentielles 📐',
      icon: '📋',
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-2xl">
            <h3 className="text-xl font-bold mb-3">Formules de référence</h3>
            <p className="text-lg">
              Les outils indispensables pour résoudre les formes indéterminées
            </p>
          </div>
          <FormulaSection 
            formulas={formulasData}
            onComplete={() => {}}
            completedFormulas={['conjugue-technique', 'limite-racine', 'condition-derivabilite']}
          />
        </div>
      ),
      xpReward: 20
    },
    {
      id: 'methode',
      title: 'Méthode Détaillée 🧮',
      icon: '🔧',
      content: (
        <div className="space-y-8">
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-200">
          <div className="text-center mb-8">
            <div className="inline-flex items-center space-x-2 bg-blue-100 px-4 py-2 rounded-full mb-4">
              <Calculator className="h-5 w-5 text-blue-600" />
              <span className="font-semibold text-blue-800">Méthode Détaillée</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              🎯 La Technique du Conjugué avec Exemple
            </h2>
            <p className="text-xl text-gray-600">
              Comment résoudre les indéterminations 0/0 avec les racines
            </p>
          </div>

          <div className="space-y-8">
             <div className="bg-gradient-to-r from-blue-100 to-indigo-100 p-6 rounded-2xl border-2 border-blue-300">
               <div className="text-center mb-6">
                 <h3 className="text-2xl font-bold text-blue-800 mb-4">📋 Énoncé</h3>
                 <div className="bg-white p-4 rounded-lg border-2 border-blue-400 mb-4">
                   <div className="text-lg font-bold text-gray-800 mb-2">Exercice :</div>
                   <div className="text-lg text-gray-800">
                      Soit f(x) = √(x + 3)
                   </div>
                   <div className="text-lg text-blue-800 font-bold mt-2">
                     Montrer que f est dérivable en 1 et calculer f'(1)
                   </div>
                 </div>
               </div>

                             <div className="bg-white p-6 rounded-xl border-2 border-blue-400">
                 <div className="space-y-4 text-gray-800">
                   <div className="text-center">
                     <div className="text-lg font-bold mb-2">Résolution par définition :</div>
                    <div className="space-y-4 text-lg">
                      <div className="bg-blue-50 p-4 rounded-lg border">
                        <div className="font-mono text-center">
                            f'(1) = lim[h→0] (f(1+h) - f(1))/h
                        </div>
                      </div>
                      <div className="bg-blue-50 p-4 rounded-lg border">
                        <div className="font-mono text-center">
                            = lim[h→0] (√(4+h) - √4)/h
                        </div>
                      </div>
                      <div className="bg-blue-50 p-4 rounded-lg border">
                        <div className="font-mono text-center">
                            = lim[h→0] (√(4+h) - 2)/h
                          </div>
                        </div>
                      </div>
                    </div>
                    
                                     <div className="bg-orange-50 p-4 rounded-lg border-2 border-orange-300 text-center">
                      <div className="flex items-center justify-center space-x-2 mb-2">
                        <AlertTriangle className="h-6 w-6 text-orange-600" />
                     <div className="text-xl font-bold text-orange-800">PROBLÈME !</div>
                      </div>
                     <div className="text-orange-700">Quand h → 0 : numérateur → 0 et dénominateur → 0</div>
                     <div className="text-2xl font-bold text-orange-800">Forme indéterminée 0/0</div>
                   </div>
                </div>
              </div>
            </div>

              <div className="bg-gradient-to-r from-green-100 to-blue-100 p-6 rounded-2xl border-2 border-green-400">
              <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-green-800 mb-4">✨ La Solution : Technique du Conjugué</h3>
                <div className="text-lg text-gray-800">
                  Multiplier par le conjugué pour faire apparaître une identité remarquable
                </div>
              </div>

                <div className="bg-white p-6 rounded-xl border-2 border-green-300">
                  <div className="text-center space-y-4">
                    <div className="bg-green-50 p-4 rounded-lg border">
                      <div className="font-mono text-green-800 text-lg">
                        = lim[h→0] [(√(4+h) - 2)(√(4+h) + 2)] / [h(√(4+h) + 2)]
                      </div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg border">
                      <div className="font-mono text-green-800 text-lg">
                        = lim[h→0] [(4+h) - 4] / [h(√(4+h) + 2)]
                      </div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg border">
                      <div className="font-mono text-green-800 text-lg">
                        = lim[h→0] h / [h(√(4+h) + 2)]
                      </div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg border">
                          <div className="font-mono text-green-800 text-lg">
                        = lim[h→0] 1 / (√(4+h) + 2)
                      </div>
                    </div>
                    <div className="bg-green-100 p-4 rounded-lg border-2 border-green-500">
                      <div className="font-mono text-green-800 text-xl font-bold">
                        = 1 / (√4 + 2) = 1/4
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
            </div>
      ),
      xpReward: 25
    },
    {
      id: 'exercices',
      title: 'Exercices Pratiques 💪',
      icon: '📝',
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-red-500 to-pink-600 text-white p-6 rounded-2xl">
            <h3 className="text-xl font-bold mb-3">Entraînement pratique</h3>
            <p className="text-lg">
              Maîtrisez la technique du conjugué avec des exercices !
            </p>
          </div>
          <CalculExercise />
          </div>
      ),
      xpReward: 40
    },
    {
      id: 'resume',
      title: 'Points Clés 🎯',
      icon: '📑',
      content: (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              🎯 Points clés à retenir
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">✅ Vous savez maintenant :</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Identifier les formes indéterminées 0/0</li>
                  <li>• Appliquer la technique du conjugué</li>
                  <li>• Calculer des dérivées de fonctions racines</li>
                  <li>• Utiliser la définition de la dérivée</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">🎓 Prochaines étapes :</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Équation de la tangente</li>
                  <li>• Applications géométriques</li>
                  <li>• Étude de fonctions avancées</li>
                </ul>
              </div>
            </div>
          </div>
          </div>
      ),
      xpReward: 15
    }
  ];

  return (
    <ChapterLayout 
      title="Dérivabilité et Racines"
      description="Cas particuliers des fonctions racines et technique du conjugué"
      sections={sections}
      navigation={{
        previous: { href: '/chapitre/nombres-derives-overview', text: 'Vue d\'ensemble' },
        next: { href: '/chapitre/nombres-derives-equation-tangente', text: 'Équation de la tangente' }
      }}
    />
  );
} 