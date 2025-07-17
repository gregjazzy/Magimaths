'use client';

import { useState } from 'react';
import { Target } from 'lucide-react';
import ChapterLayout from '../../components/ChapterLayout';

const TableExercise: React.FC = () => {
  const [showGraph2, setShowGraph2] = useState(false);
  const [tableValues, setTableValues] = useState<{[key: string]: string}>({
    'f(-6)': '',
    'f(-3)': '',
    'f(-1)': '',
    'f(3)': '',
    'f(6)': '',
    "f'(-6)": '',
    "f'(-3)": '',
    "f'(-1)": '',
    "f'(3)": '',
    "f'(6)": ''
  });

  const handleTableChange = (key: string, value: string) => {
    setTableValues(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const checkAnswers = () => {
    const correctAnswers = {
      'f(-6)': '-3',
      'f(-3)': '-2',
      'f(-1)': '-1',
      'f(3)': '3',
      'f(6)': '0',
      "f'(-6)": '-1',
      "f'(-3)": '0',
      "f'(-1)": '2',
      "f'(3)": '0',
      "f'(6)": '-2'
    };

    const allCorrect = Object.entries(correctAnswers).every(
      ([key, correct]) => tableValues[key] === correct
    );
    
    setShowGraph2(true);
  };

  return (
    <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-200">
      <div className="text-center mb-8">
        <div className="inline-flex items-center space-x-2 bg-green-100 px-4 py-2 rounded-full mb-4">
          <Target className="h-5 w-5 text-green-600" />
          <span className="font-semibold text-green-800">Exercice</span>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          📊 Lecture Graphique - Tableau à Compléter
        </h2>
        <p className="text-xl text-gray-600">
          À l'aide de la représentation graphique, recopiez et complétez le tableau
        </p>
      </div>

      <div className="space-y-6">
        {/* Énoncé de l'exercice */}
        <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-500">
          <div className="font-bold text-blue-800 mb-4">📋 Énoncé</div>
          <div className="text-gray-800">
            <p className="mb-4">À l'aide de la représentation graphique ci-dessous d'une fonction f, recopiez et complétez le tableau ci-contre :</p>
            
            {/* Graphique dans l'énoncé */}
            <div className="bg-white p-8 rounded-lg border mb-6">
              <div className="text-center text-gray-800 mb-4 font-semibold">📈 Représentation graphique de la fonction f</div>
              
              {/* Image du graphique */}
              <div className="flex justify-center">
                <div className="border border-gray-300 rounded-lg shadow-lg p-8 bg-white">
                  <img 
                    src="/images/graphique-derivees.png" 
                    alt="Graphique de la fonction f avec tangentes aux points demandés"
                    className="max-w-full h-auto rounded"
                    style={{maxHeight: '700px', minHeight: '400px', width: '100%'}}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        parent.innerHTML = `
                          <div class="text-center p-8 bg-gray-50 rounded border-2 border-dashed border-gray-300">
                            <p class="text-gray-600 mb-4">📊 Graphique de la fonction f</p>
                            <p class="text-sm text-gray-500">Courbe rouge avec tangentes bleues aux points :</p>
                            <p class="text-sm text-gray-500">x = -6, -3, -1, 3, 6</p>
                            <p class="text-xs text-gray-400 mt-4">Image à ajouter : /public/images/graphique-derivees.png</p>
                          </div>
                        `;
                      }
                    }}
                  />
                </div>
              </div>
              
              <div className="mt-6 text-center">
                <p className="text-gray-700 mb-4">
                  <span className="inline-block w-4 h-4 bg-red-600 mr-2"></span>Courbe de la fonction f
                  <span className="inline-block w-4 h-4 bg-blue-600 ml-6 mr-2" style={{borderTop: '2px dashed #2563eb'}}></span>Tangentes aux points demandés
                </p>
              </div>
            </div>

            {/* Tableau interactif à compléter */}
            <div className="bg-white p-4 rounded-lg border-2 border-gray-300 inline-block">
              <table className="border-collapse">
                <thead>
                  <tr>
                    <th className="border border-gray-400 px-3 py-2 bg-gray-200 font-bold text-gray-800">x</th>
                    <th className="border border-gray-400 px-3 py-2 bg-gray-200 font-bold text-gray-800">-6</th>
                    <th className="border border-gray-400 px-3 py-2 bg-gray-200 font-bold text-gray-800">-3</th>
                    <th className="border border-gray-400 px-3 py-2 bg-gray-200 font-bold text-gray-800">-1</th>
                    <th className="border border-gray-400 px-3 py-2 bg-gray-200 font-bold text-gray-800">3</th>
                    <th className="border border-gray-400 px-3 py-2 bg-gray-200 font-bold text-gray-800">6</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-400 px-3 py-2 bg-gray-200 font-bold text-gray-800">f(x)</td>
                    {['-6', '-3', '-1', '3', '6'].map(x => (
                      <td key={`f(${x})`} className="border border-gray-400 px-1 py-1 bg-white">
                        <input 
                          type="text" 
                          value={tableValues[`f(${x})`]} 
                          onChange={(e) => handleTableChange(`f(${x})`, e.target.value)}
                          className="w-12 h-8 text-center border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded bg-white text-gray-800"
                          placeholder="?"
                        />
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="border border-gray-400 px-3 py-2 bg-gray-200 font-bold text-gray-800">f'(x)</td>
                    {['-6', '-3', '-1', '3', '6'].map(x => (
                      <td key={`f'(${x})`} className="border border-gray-400 px-1 py-1 bg-white">
                        <input 
                          type="text" 
                          value={tableValues[`f'(${x})`]} 
                          onChange={(e) => handleTableChange(`f'(${x})`, e.target.value)}
                          className="w-12 h-8 text-center border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded bg-white text-gray-800"
                          placeholder="?"
                        />
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
            
            {/* Bouton pour vérifier */}
            <div className="text-center mt-6">
              <button
                onClick={checkAnswers}
                className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-bold transition-all transform hover:scale-105"
              >
                {showGraph2 ? '🔍 Masquer la correction' : '✅ Vérifier mes réponses'}
              </button>
            </div>
          </div>
        </div>

        {/* Correction */}
        {showGraph2 && (
          <div className="mt-6">
            <div className="bg-yellow-50 p-6 rounded-lg border-l-4 border-yellow-500">
              <div className="font-bold text-yellow-800 mb-4">✅ Solution - Lecture graphique</div>
              
              {/* Méthode */}
              <div className="bg-white p-4 rounded-lg border mb-4">
                <div className="text-gray-800 space-y-3">
                  <div className="font-semibold">Méthode de résolution :</div>
                  <div>1. <strong>Pour f(x)</strong> : On lit sur l'axe des ordonnées la valeur correspondant au point de la courbe</div>
                  <div>2. <strong>Pour f'(x)</strong> : On lit le coefficient directeur de la tangente (pente)</div>
                  <div>3. <strong>Tangente horizontale</strong> ⟹ f'(x) = 0</div>
                  <div>4. <strong>Tangente montante</strong> ⟹ f'(x) {'>'} 0</div>
                  <div>5. <strong>Tangente descendante</strong> ⟹ f'(x) {'<'} 0</div>
                </div>
              </div>
              
              {/* Tableau corrigé */}
              <div className="bg-white p-4 rounded-lg border">
                <div className="text-center mb-4 font-semibold text-gray-800">Tableau complété :</div>
                <div className="bg-white p-4 rounded-lg border-2 border-green-300 inline-block">
                  <table className="border-collapse">
                    <thead>
                      <tr>
                        <th className="border border-gray-400 px-3 py-2 bg-gray-200 font-bold text-gray-800">x</th>
                        <th className="border border-gray-400 px-3 py-2 bg-gray-200 font-bold text-gray-800">-6</th>
                        <th className="border border-gray-400 px-3 py-2 bg-gray-200 font-bold text-gray-800">-3</th>
                        <th className="border border-gray-400 px-3 py-2 bg-gray-200 font-bold text-gray-800">-1</th>
                        <th className="border border-gray-400 px-3 py-2 bg-gray-200 font-bold text-gray-800">3</th>
                        <th className="border border-gray-400 px-3 py-2 bg-gray-200 font-bold text-gray-800">6</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-gray-400 px-3 py-2 bg-gray-200 font-bold text-gray-800">f(x)</td>
                        <td className="border border-gray-400 px-3 py-2 bg-green-100 text-center font-bold text-green-800">-3</td>
                        <td className="border border-gray-400 px-3 py-2 bg-green-100 text-center font-bold text-green-800">-2</td>
                        <td className="border border-gray-400 px-3 py-2 bg-green-100 text-center font-bold text-green-800">-1</td>
                        <td className="border border-gray-400 px-3 py-2 bg-green-100 text-center font-bold text-green-800">3</td>
                        <td className="border border-gray-400 px-3 py-2 bg-green-100 text-center font-bold text-green-800">0</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-400 px-3 py-2 bg-gray-200 font-bold text-gray-800">f'(x)</td>
                        <td className="border border-gray-400 px-3 py-2 bg-blue-100 text-center font-bold text-blue-800">-1</td>
                        <td className="border border-gray-400 px-3 py-2 bg-blue-100 text-center font-bold text-blue-800">0</td>
                        <td className="border border-gray-400 px-3 py-2 bg-blue-100 text-center font-bold text-blue-800">2</td>
                        <td className="border border-gray-400 px-3 py-2 bg-blue-100 text-center font-bold text-blue-800">0</td>
                        <td className="border border-gray-400 px-3 py-2 bg-blue-100 text-center font-bold text-blue-800">-2</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              
              {/* Explication détaillée */}
              <div className="bg-white p-4 rounded-lg border mt-4">
                <div className="text-gray-800 space-y-2">
                  <div className="font-semibold mb-3">Explication détaillée :</div>
                  <div>• <strong>f(-6) = -3</strong> : Le point de la courbe d'abscisse -6 a pour ordonnée -3</div>
                  <div>• <strong>f'(-6) = -1</strong> : La tangente en x = -6 a une pente négative (descend)</div>
                  <div>• <strong>f'(-3) = 0</strong> : La tangente en x = -3 est horizontale (minimum local)</div>
                  <div>• <strong>f'(-1) = 2</strong> : La tangente en x = -1 a une pente positive forte</div>
                  <div>• <strong>f'(3) = 0</strong> : La tangente en x = 3 est horizontale (maximum local)</div>
                  <div>• <strong>f'(6) = -2</strong> : La tangente en x = 6 a une pente négative forte</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default function GraphiquePage() {
  const sections = [
    {
      id: 'intro',
      title: 'REPRÉSENTATION GRAPHIQUE 📊',
      icon: '📈',
      content: (
        <div className="space-y-8">
          <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-3xl p-8 shadow-xl text-white">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-6">
                REPRÉSENTATION GRAPHIQUE
              </h1>
              <div className="text-2xl mb-6">
                Visualisation des dérivées et des tangentes
              </div>
              <div className="text-lg text-green-100">
                📊 Lire graphiquement la valeur d'une dérivée
              </div>
            </div>
          </div>
        </div>
      ),
      xpReward: 10
    },
    {
      id: 'exercice',
      title: 'Exercice de Lecture Graphique 📋',
      icon: '📝',
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-2xl">
            <h3 className="text-xl font-bold mb-3">Exercice pratique</h3>
            <p className="text-lg">
              Complétez le tableau en lisant les valeurs sur le graphique
            </p>
          </div>
          <TableExercise />
        </div>
      ),
      xpReward: 25
    }
  ];

  return (
    <ChapterLayout 
      title="Représentation Graphique"
      description="Visualisation des dérivées et des tangentes"
      sections={sections}
      navigation={{
        previous: { href: '/chapitre/nombres-derives-equation-tangente', text: 'Équation de la tangente' },
        next: { href: '/chapitre/nombres-derives-taux-accroissement', text: 'Taux d\'accroissement' }
      }}
    />
  );
}