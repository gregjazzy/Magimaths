'use client';

import { useState } from 'react';
import { Calculator, BookOpen } from 'lucide-react';
import ChapterLayout from '../../components/ChapterLayout';

export default function ParametresPage() {
  const [mValue, setMValue] = useState(1);

  const calculateDiscriminant = (m: number) => {
    return 4 - 4 * m;
  };

  const sections = [
    {
      id: 'intro',
      title: 'Équations avec Paramètre m 📐',
      icon: '📚',
      content: (
        <div className="space-y-8">
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-6 rounded-2xl border-2 border-purple-300">
            <h3 className="text-2xl font-bold text-center text-gray-800 mb-4">
              🎯 Qu'est-ce qu'une équation avec paramètre ?
            </h3>
            <div className="text-center space-y-4">
              <div className="bg-white p-4 rounded-xl border-2 border-purple-300">
                <div className="text-2xl font-mono font-bold text-purple-600 mb-2">
                  f(x) = ax² + bx + c
                </div>
                <div className="text-lg text-gray-700">
                  où <strong>a</strong>, <strong>b</strong> ou <strong>c</strong> dépendent d'un paramètre <strong className="text-purple-600">m</strong>
                </div>
              </div>
              <div className="text-lg text-gray-700">
                Le <strong>nombre de solutions</strong> et le <strong>signe</strong> de f(x) vont <strong>dépendre de m</strong> !
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-purple-50 p-4 rounded-lg border border-purple-300">
                    <div className="font-bold text-purple-800 mb-2">Exemple 1</div>
                    <div className="font-mono text-purple-600">x² + 2x + m = 0</div>
                    <div className="text-lg text-gray-700 mt-2">c dépend de m</div>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg border border-purple-300">
                    <div className="font-bold text-purple-800 mb-2">Exemple 2</div>
                    <div className="font-mono text-purple-600">mx² + 3x + 1 = 0</div>
                    <div className="text-lg text-gray-700 mt-2">a dépend de m</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-2xl border-2 border-blue-300">
            <h3 className="text-2xl font-bold text-center text-gray-800 mb-6">
              📊 Méthode de résolution
            </h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-bold text-blue-700 text-xl">🔍 Étapes à suivre :</h4>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3 p-3 bg-white rounded-lg border border-blue-200">
                    <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-lg font-bold">1</div>
                    <div>
                      <div className="font-bold text-gray-800">Calculer Δ(m)</div>
                      <div className="text-lg text-gray-600">Δ = b² - 4ac en fonction de m</div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-3 bg-white rounded-lg border border-blue-200">
                    <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-lg font-bold">2</div>
                    <div>
                      <div className="font-bold text-gray-800">Étudier le signe de Δ(m)</div>
                      <div className="text-lg text-gray-600">Résoudre Δ(m) {'>'} 0, Δ(m) = 0, Δ(m) {'<'} 0</div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-3 bg-white rounded-lg border border-blue-200">
                    <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-lg font-bold">3</div>
                    <div>
                      <div className="font-bold text-gray-800">Conclure selon m</div>
                      <div className="text-lg text-gray-600">Nombre de solutions pour chaque intervalle de m</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-bold text-cyan-700 text-xl">⚠️ Cas particuliers :</h4>
                <div className="space-y-3 text-lg">
                  <div className="p-3 bg-orange-50 rounded-lg border-l-4 border-orange-400">
                    <div className="font-bold text-orange-800">Si a dépend de m :</div>
                    <div className="text-orange-700">Vérifier d'abord si a = 0<br/>→ L'équation devient du 1er degré !</div>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg border-l-4 border-green-400">
                    <div className="font-bold text-green-800">Valeurs particulières :</div>
                    <div className="text-green-700">Tester les valeurs de m qui annulent Δ<br/>→ Racine double</div>
                  </div>
                  <div className="p-3 bg-red-50 rounded-lg border-l-4 border-red-400">
                    <div className="font-bold text-red-800">Discussion complète :</div>
                    <div className="text-red-700">Organiser la réponse par intervalles de m<br/>→ Tableau de synthèse</div>
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
      id: 'example',
      title: 'Exemple Détaillé & Calculateur 🧮',
      icon: '🔢',
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-2xl border-2 border-green-300">
            <h3 className="text-2xl font-bold text-center text-gray-800 mb-6">
              Étude de l'équation : x² + 2x + m = 0
            </h3>
            
            <div className="bg-white p-6 rounded-xl border-2 border-gray-300 mb-6">
              <div className="text-center mb-4">
                <div className="font-mono text-xl font-bold text-blue-600">
                  x² + 2x + {mValue} = 0
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Paramètre m = {mValue}
                </label>
                <input
                  type="range"
                  min="-2"
                  max="4"
                  step="0.1"
                  value={mValue}
                  onChange={(e) => setMValue(parseFloat(e.target.value))}
                  className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                {(() => {
                  const delta = calculateDiscriminant(mValue);
                  return (
                    <div className="space-y-2">
                      <div className="text-center font-bold text-gray-800">Analyse</div>
                      <div>Discriminant Δ = 4 - 4m = {delta.toFixed(2)}</div>
                      {delta > 0 && (
                        <div className="text-green-600 font-bold">
                          Δ {'>'} 0 : Deux solutions réelles distinctes
                        </div>
                      )}
                      {delta === 0 && (
                        <div className="text-yellow-600 font-bold">
                          Δ = 0 : Une solution double
                        </div>
                      )}
                      {delta < 0 && (
                        <div className="text-red-600 font-bold">
                          Δ {'<'} 0 : Aucune solution réelle
                        </div>
                      )}
                      {delta >= 0 && (
                        <div>Solutions : x = {((-2 + Math.sqrt(delta)) / 2).toFixed(2)} et x = {((-2 - Math.sqrt(delta)) / 2).toFixed(2)}</div>
                      )}
                    </div>
                  );
                })()}
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-bold text-green-800 text-xl">📊 Résolution complète :</h4>
              
              <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
                <h5 className="font-bold text-blue-800 mb-2">Calcul du discriminant</h5>
                <div className="space-y-1">
                  <div>Δ = b² - 4ac = 2² - 4(1)(m) = 4 - 4m</div>
                </div>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-400">
                <h5 className="font-bold text-yellow-800 mb-2">Étude du signe de Δ</h5>
                <div className="space-y-1">
                  <div>Δ {'>'} 0 ⟺ 4 - 4m {'>'} 0 ⟺ m {'<'} 1</div>
                  <div>Δ = 0 ⟺ 4 - 4m = 0 ⟺ m = 1</div>
                  <div>Δ {'<'} 0 ⟺ 4 - 4m {'<'} 0 ⟺ m {'>'} 1</div>
                </div>
              </div>

              <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-400">
                <h5 className="font-bold text-green-800 mb-2">Conclusion</h5>
                <div className="space-y-1">
                  <div>• Si m {'<'} 1 : deux solutions réelles distinctes</div>
                  <div>• Si m = 1 : une solution double (x = -1)</div>
                  <div>• Si m {'>'} 1 : aucune solution réelle</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
      xpReward: 30
    }
  ];

  return (
    <ChapterLayout
      title="Équations avec Paramètres"
      description="Étudier les équations du second degré dépendant d'un paramètre"
      sections={sections}
      navigation={{
        previous: { href: '/chapitre/equations-second-degre-tableaux-signes', text: 'Tableaux de signes' },
        next: { href: '/chapitre/equations-second-degre-techniques-avancees', text: 'Techniques avancées' }
      }}
    />
  );
} 