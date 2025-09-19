'use client';

import { useState } from 'react';
import { Trophy, Target, BookOpen } from 'lucide-react';
import ChapterLayout from '../../components/ChapterLayout';

export default function EquationsCubePage() {
  const [testValues, setTestValues] = useState([0, 1, -1, 2, -2, 3]);
  const [currentTestIndex, setCurrentTestIndex] = useState(0);

  const sections = [
    {
      id: 'intro',
      title: 'Équations du 3ème Degré par Racine Évidente 🧮',
      icon: '📚',
      content: (
        <div className="space-y-8">
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-6 rounded-2xl border-2 border-purple-300">
            <h3 className="text-2xl font-bold text-center text-gray-800 mb-6">
              🎯 Principe de la méthode
            </h3>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl border-l-4 border-purple-400">
                <h4 className="font-bold text-purple-800 mb-3 text-lg">1. Racine évidente</h4>
                <p className="text-gray-700 mb-3">Tester des valeurs simples pour trouver une racine :</p>
                <div className="bg-purple-100 p-3 rounded-lg">
                  <div className="text-purple-700 font-mono text-sm space-y-1">
                    <div>• x = 0</div>
                    <div>• x = ±1</div>
                    <div>• x = ±2</div>
                    <div>• x = ±3...</div>
                  </div>
                </div>
                <div className="mt-3 text-sm text-gray-600">
                  On substitue ces valeurs dans l'équation jusqu'à trouver P(α) = 0
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-xl border-l-4 border-indigo-400">
                <h4 className="font-bold text-indigo-800 mb-3 text-lg">2. Factorisation</h4>
                <p className="text-gray-700 mb-3">Si α est racine, alors :</p>
                <div className="bg-indigo-100 p-3 rounded-lg">
                  <div className="text-indigo-700 font-mono font-bold text-center">
                    P(x) = (x - α) × Q(x)
                  </div>
                </div>
                <div className="mt-3 text-sm text-gray-600">
                  Où Q(x) est un polynôme du 2nd degré qu'on trouve par division euclidienne
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-xl border-l-4 border-blue-400">
                <h4 className="font-bold text-blue-800 mb-3 text-lg">3. Résolution</h4>
                <p className="text-gray-700 mb-3">Q(x) est du 2nd degré :</p>
                <div className="bg-blue-100 p-3 rounded-lg">
                  <div className="text-blue-700 font-mono text-sm text-center">
                    Q(x) = ax² + bx + c = 0
                  </div>
                </div>
                <div className="mt-3 text-sm text-gray-600">
                  On applique toutes les techniques du second degré (discriminant, etc.)
                </div>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 p-6 rounded-2xl border-2 border-yellow-300">
            <h3 className="text-xl font-bold text-yellow-800 mb-4 text-center">
              💡 Pourquoi cette méthode fonctionne ?
            </h3>
            <div className="space-y-4 text-gray-700">
              <div className="flex items-start space-x-3">
                <div className="bg-yellow-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">1</div>
                <div>
                  <div className="font-bold">Théorème fondamental :</div>
                  <div className="text-sm">Si α est racine de P(x), alors (x - α) divise P(x)</div>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="bg-yellow-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">2</div>
                <div>
                  <div className="font-bold">Degré du quotient :</div>
                  <div className="text-sm">Polynôme de degré 3 ÷ Polynôme de degré 1 = Polynôme de degré 2</div>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="bg-yellow-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">3</div>
                <div>
                  <div className="font-bold">Retour aux techniques connues :</div>
                  <div className="text-sm">On résout une équation du 2nd degré avec discriminant, forme canonique, etc.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
      xpReward: 25
    },
    {
      id: 'example',
      title: 'Résolution Pas à Pas 📝',
      icon: '🎯',
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-2xl border-2 border-blue-300">
            <h3 className="text-2xl font-bold text-center text-gray-800 mb-6">
              Exemple : x³ - 6x² + 11x - 6 = 0
            </h3>
            
            <div className="space-y-6">
              <div className="bg-blue-50 p-6 rounded-2xl border-2 border-blue-300">
                <h3 className="text-xl font-bold text-blue-800 mb-4">
                  🔍 Étape 1 : Chercher une racine évidente
                </h3>
                
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-xl border border-blue-200">
                    <div className="text-gray-800 mb-3">
                      <strong>Équation :</strong> <span className="font-mono text-lg">P(x) = x³ - 6x² + 11x - 6</span>
                    </div>
                    <div className="text-sm text-gray-600 mb-3">Testons quelques valeurs simples :</div>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <span className="font-mono">P(0) = 0 - 0 + 0 - 6</span>
                          <span className="text-red-600 font-bold">= -6 ≠ 0</span>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-green-100 rounded border border-green-300">
                          <span className="font-mono">P(1) = 1 - 6 + 11 - 6</span>
                          <span className="text-green-600 font-bold">= 0 ✓</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <span className="font-mono">P(-1) = -1 - 6 - 11 - 6</span>
                          <span className="text-red-600 font-bold">= -24 ≠ 0</span>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-green-100 rounded border border-green-300">
                          <span className="font-mono">P(2) = 8 - 24 + 22 - 6</span>
                          <span className="text-green-600 font-bold">= 0 ✓</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 p-3 bg-green-100 rounded-lg border border-green-300">
                      <div className="font-bold text-green-800">✓ Racines évidentes trouvées : x = 1 et x = 2</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-400">
                <h5 className="font-bold text-green-800 mb-2">Étape 2 : Factorisation</h5>
                <div className="space-y-2">
                  <div>Puisque x = 1 et x = 2 sont racines, on peut factoriser :</div>
                  <div className="font-mono bg-green-100 p-2 rounded">P(x) = (x - 1)(x - 2)(x - α)</div>
                  <div>En développant et comparant : α = 3</div>
                  <div className="font-bold text-green-600">P(x) = (x - 1)(x - 2)(x - 3)</div>
                </div>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-400">
                <h5 className="font-bold text-purple-800 mb-2">Étape 3 : Solutions finales</h5>
                <div className="space-y-2">
                  <div>Les solutions sont les valeurs qui annulent chaque facteur :</div>
                  <div>• x - 1 = 0 → x = 1</div>
                  <div>• x - 2 = 0 → x = 2</div>
                  <div>• x - 3 = 0 → x = 3</div>
                  <div className="font-bold text-purple-600">Solutions : x ∈ {'{1, 2, 3}'}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border-2 border-gray-300">
            <h4 className="font-bold text-gray-800 mb-4">🎮 Testeur interactif de racines</h4>
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-center mb-3">
                  <div className="font-mono text-lg font-bold text-blue-600">
                    P(x) = x³ - 6x² + 11x - 6
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {testValues.map((value, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentTestIndex(index)}
                      className={`p-2 rounded font-mono text-sm border-2 transition-colors ${
                        currentTestIndex === index
                          ? 'bg-blue-500 text-white border-blue-500'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-blue-300'
                      }`}
                    >
                      x = {value}
                    </button>
                  ))}
                </div>

                <div className="bg-white p-3 rounded border">
                  {(() => {
                    const x = testValues[currentTestIndex];
                    const result = x**3 - 6*x**2 + 11*x - 6;
                    const isRoot = Math.abs(result) < 0.001;
                    
                    return (
                      <div className={`text-center ${isRoot ? 'text-green-600' : 'text-gray-700'}`}>
                        <div className="font-mono">
                          P({x}) = ({x})³ - 6({x})² + 11({x}) - 6 = {result}
                        </div>
                        <div className={`font-bold mt-1 ${isRoot ? 'text-green-600' : 'text-red-600'}`}>
                          {isRoot ? '✓ C\'est une racine !' : '✗ Ce n\'est pas une racine'}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
      xpReward: 30
    },
    {
      id: 'method',
      title: 'Méthode Générale 🔧',
      icon: '⚙️',
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-green-500 to-blue-600 text-white p-6 rounded-2xl">
            <h3 className="text-xl font-bold mb-3">Méthode générale de résolution</h3>
            <p className="text-lg">
              Algorithme complet pour résoudre toute équation du 3ème degré
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                step: 1,
                title: "Chercher une racine évidente",
                description: "Tester x = 0, ±1, ±2, ±3... jusqu'à trouver P(α) = 0",
                color: "blue"
              },
              {
                step: 2,
                title: "Effectuer la division euclidienne",
                description: "P(x) = (x - α) × Q(x) où Q(x) est du 2nd degré",
                color: "green"
              },
              {
                step: 3,
                title: "Résoudre Q(x) = 0",
                description: "Utiliser le discriminant pour trouver les autres racines",
                color: "purple"
              },
              {
                step: 4,
                title: "Rassembler toutes les solutions",
                description: "Liste complète des racines de l'équation initiale",
                color: "orange"
              }
            ].map((item, index) => (
              <div key={index} className={`bg-${item.color}-50 p-4 rounded-lg border-l-4 border-${item.color}-400`}>
                <div className={`font-bold text-${item.color}-800 mb-2`}>
                  Étape {item.step} : {item.title}
                </div>
                <div className={`text-${item.color}-700 text-sm`}>
                  {item.description}
                </div>
              </div>
            ))}
          </div>

          <div className="bg-yellow-50 p-6 rounded-2xl border-2 border-yellow-300">
            <h4 className="font-bold text-yellow-800 mb-3">⚠️ Points importants</h4>
            <div className="space-y-2 text-sm text-yellow-700">
              <div>• Toutes les équations du 3ème degré n'ont pas de racine évidente</div>
              <div>• Cette méthode ne fonctionne que si on trouve facilement une racine</div>
              <div>• En général, on teste d'abord les petits entiers : 0, ±1, ±2, ±3</div>
              <div>• Une fois une racine trouvée, le reste se résout comme au 2nd degré</div>
            </div>
          </div>
        </div>
      ),
      xpReward: 25
    }
  ];

  return (
    <ChapterLayout
      title="Équations du 3ème Degré"
      description="Résolution par recherche de racine évidente et factorisation"
      sections={sections}
      navigation={{
        previous: { href: '/chapitre/equations-second-degre-overview', text: 'Vue d\'ensemble' },
        next: { href: '/chapitre/equations-second-degre-overview', text: 'Retour au menu' },
        backToTop: { href: '/chapitre/equations-second-degre-overview', text: 'Retour au sommaire' }
      }}
    />
  );
} 