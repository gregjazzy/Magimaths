'use client';

import ChapterLayout from '../../components/ChapterLayout';

export default function InequationsComplexesPage() {
  const sections = [
    {
      id: 'intro',
      title: 'Méthode de résolution 📝',
      icon: '📚',
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-700 p-6 rounded-2xl text-white">
            <h3 className="text-lg sm:text-xl font-bold mb-4">
              Méthode de résolution des inéquations complexes
            </h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="bg-white/30 w-8 h-8 rounded-full flex items-center justify-center text-lg">1</div>
                <div>Identifier les valeurs interdites (dénominateurs ≠ 0)</div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="bg-white/30 w-8 h-8 rounded-full flex items-center justify-center text-lg">2</div>
                <div>Mettre tout du même côté</div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="bg-white/30 w-8 h-8 rounded-full flex items-center justify-center text-lg">3</div>
                <div>Mettre au même dénominateur</div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="bg-white/30 w-8 h-8 rounded-full flex items-center justify-center text-lg">4</div>
                <div>Étudier le signe du numérateur</div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="bg-white/30 w-8 h-8 rounded-full flex items-center justify-center text-lg">5</div>
                <div>Étudier le signe du dénominateur</div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="bg-white/30 w-8 h-8 rounded-full flex items-center justify-center text-lg">6</div>
                <div>En déduire le signe du quotient</div>
              </div>
              <div className="mt-6 bg-red-500/20 p-4 rounded-xl">
                <div className="font-bold mb-2">⚠️ Attention aux valeurs interdites !</div>
                <div>Les solutions ne sont pas dans les valeurs interdites.</div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border-2 border-gray-200">
            <div className="text-center mb-4">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Exemple détaillé
              </h3>
            </div>
            <div className="space-y-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-bold text-blue-800 mb-2">Résoudre l'inéquation :</h4>
                <div className="text-blue-700 text-center">
                  <div className="inline-block align-middle mx-1">
                    <div className="border-b-2 border-gray-800 text-center px-2">x - 1</div>
                    <div className="text-center px-2">x + 2</div>
                  </div>
                  {' > '}
                  <div className="inline-block align-middle mx-1">
                    <div className="border-b-2 border-gray-800 text-center px-2">2</div>
                    <div className="text-center px-2">x - 1</div>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg">
                <h4 className="font-bold text-yellow-800 mb-2">⚠️ Étape 1 : Valeurs interdites</h4>
                <div className="text-yellow-700">
                  • Premier dénominateur : x + 2 = 0 donc x ≠ -2<br />
                  • Second dénominateur : x - 1 = 0 donc x ≠ 1
                </div>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-bold text-purple-800 mb-2">Étape 2 : Mettre tout du même côté</h4>
                <div className="text-purple-700">
                  <div className="inline-block align-middle mx-1">
                    <div className="border-b-2 border-gray-800 text-center px-2">x - 1</div>
                    <div className="text-center px-2">x + 2</div>
                  </div>
                  {' - '}
                  <div className="inline-block align-middle mx-1">
                    <div className="border-b-2 border-gray-800 text-center px-2">2</div>
                    <div className="text-center px-2">x - 1</div>
                  </div>
                  {' > 0'}
                </div>
              </div>

              <div className="bg-indigo-50 p-4 rounded-lg">
                <h4 className="font-bold text-indigo-800 mb-2">Étape 3 : Mettre au même dénominateur</h4>
                <div className="text-indigo-700">
                  <div className="inline-block align-middle mx-1">
                    <div className="border-b-2 border-gray-800 text-center px-2">(x - 1)(x - 1) - 2(x + 2)</div>
                    <div className="text-center px-2">(x + 2)(x - 1)</div>
                  </div>
                  {' > 0'}
                </div>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-bold text-green-800 mb-2">Étape 4 : Étudier le signe du numérateur</h4>
                <div className="text-green-700">
                  Numérateur = (x - 1)(x - 1) - 2(x + 2)<br />
                  = x² - 2x + 1 - 2x - 4<br />
                  = x² - 4x - 3
                </div>
              </div>

              <div className="bg-indigo-50 p-4 rounded-lg">
                <h4 className="font-bold text-indigo-800 mb-2">Étape 5 : Tableau de signes</h4>
                <div className="bg-white p-1 sm:p-2 rounded border">
                  <table className="w-full border border-gray-300 text-xs sm:text-sm">
                    <thead>
                      <tr className="bg-gray-200">
                        <th className="border p-1 sm:p-2 text-gray-800">x</th>
                        <th className="border p-1 sm:p-2 text-gray-800 text-left">-∞</th>
                        <th className="border p-1 sm:p-2 text-gray-800">-2</th>
                        <th className="border p-1 sm:p-2 text-gray-800">1</th>
                        <th className="border p-1 sm:p-2 text-gray-800">4</th>
                        <th className="border p-1 sm:p-2 text-gray-800 text-right">+∞</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border p-1 sm:p-2 font-bold text-gray-800">x + 2</td>
                        <td className="border-t border-b p-2 text-right text-red-600 text-lg sm:text-xl font-bold">-</td>
                        <td className="border-t border-b p-2 text-center text-gray-800">Ø</td>
                        <td className="border-t border-b p-2 text-center text-green-600 text-lg sm:text-xl font-bold">+</td>
                        <td className="border-t border-b p-2 text-center text-green-600 text-lg sm:text-xl font-bold">+</td>
                        <td className="border-t border-b p-2 text-left text-green-600 text-lg sm:text-xl font-bold">+</td>
                      </tr>
                      <tr>
                        <td className="border p-1 sm:p-2 font-bold text-gray-800">x - 1</td>
                        <td className="border-t border-b p-2 text-right text-red-600 text-lg sm:text-xl font-bold">-</td>
                        <td className="border-t border-b p-2 text-center text-red-600 text-lg sm:text-xl font-bold">-</td>
                        <td className="border-t border-b p-2 text-center text-gray-800">Ø</td>
                        <td className="border-t border-b p-2 text-center text-green-600 text-lg sm:text-xl font-bold">+</td>
                        <td className="border-t border-b p-2 text-left text-green-600 text-lg sm:text-xl font-bold">+</td>
                      </tr>
                      <tr>
                        <td className="border p-1 sm:p-2 font-bold text-gray-800">x² - 4x - 3</td>
                        <td className="border-t border-b p-2 text-right text-green-600 text-lg sm:text-xl font-bold">+</td>
                        <td className="border-t border-b p-2 text-center text-green-600 text-lg sm:text-xl font-bold">+</td>
                        <td className="border-t border-b p-2 text-center text-red-600 text-lg sm:text-xl font-bold">-</td>
                        <td className="border-t border-b p-2 text-center text-gray-800">Ø</td>
                        <td className="border-t border-b p-2 text-left text-green-600 text-lg sm:text-xl font-bold">+</td>
                      </tr>
                      <tr>
                        <td className="border p-1 sm:p-2 font-bold text-gray-800">Quotient</td>
                        <td className="border-t border-b p-2 text-right text-red-600 text-lg sm:text-xl font-bold">-</td>
                        <td className="border-t border-b p-2 text-center text-gray-800">Ø</td>
                        <td className="border-t border-b p-2 text-center text-gray-800">Ø</td>
                        <td className="border-t border-b p-2 text-center text-gray-800">Ø</td>
                        <td className="border-t border-b p-2 text-left text-green-600 text-lg sm:text-xl font-bold">+</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-bold text-green-800 mb-2">Conclusion :</h4>
                <div className="text-green-700">
                  L'inéquation est vérifiée pour x ∈ ]-∞; -1[ ∪ ]4; +∞[<br />
                  En tenant compte des valeurs interdites (x ≠ -2 et x ≠ 1), les solutions sont :<br />
                  x ∈ ]-∞; -2[ ∪ ]-2; -1[ ∪ ]4; +∞[
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
      xpReward: 25
    },
    {
      id: 'exercises',
      title: 'Résoudre',
      icon: '📝',
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white p-4 sm:p-6 rounded-xl sm:rounded-2xl">
            <h3 className="text-lg sm:text-xl font-bold mb-3">Entraînement sur les inéquations complexes</h3>
            <p className="text-base sm:text-lg">
              Maîtrisez la résolution des inéquations avec quotients et produits !
            </p>
          </div>

          <div className="grid gap-6">
            <div className="space-y-8">
              {/* Exercice 1 */}
              <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-200">
                <div className="text-center mb-4">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Exercice 1
                  </h3>
                </div>
                <div className="text-center text-blue-600 font-mono text-lg mb-6">
                  <div className="inline-block align-middle mx-1">
                    <div className="border-b-2 border-gray-800 text-center px-2">x - 3</div>
                    <div className="text-center px-2">x - 1</div>
                  </div>
                  {' > '}
                  <div className="inline-block align-middle mx-1">
                    <div className="border-b-2 border-gray-800 text-center px-2">4</div>
                    <div className="text-center px-2">x² - 1</div>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h4 className="font-bold text-yellow-800 mb-2">⚠️ Étape 1 : Valeurs interdites</h4>
                    <div className="text-yellow-700">
                      • Premier dénominateur : x - 1 = 0 donc x ≠ 1<br />
                      • Second dénominateur : x² - 1 = (x - 1)(x + 1) = 0 donc x ≠ 1 et x ≠ -1
                    </div>
                  </div>

                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h4 className="font-bold text-purple-800 mb-2">Étape 2 : Mettre tout du même côté</h4>
                    <div className="text-purple-700">
                      <div className="inline-block align-middle mx-1">
                        <div className="border-b-2 border-gray-800 text-center px-2">x - 3</div>
                        <div className="text-center px-2">x - 1</div>
                      </div>
                      {' - '}
                      <div className="inline-block align-middle mx-1">
                        <div className="border-b-2 border-gray-800 text-center px-2">4</div>
                        <div className="text-center px-2">x² - 1</div>
                      </div>
                      {' > 0'}
                    </div>
                  </div>

                  <div className="bg-indigo-50 p-4 rounded-lg">
                    <h4 className="font-bold text-indigo-800 mb-2">Étape 3 : Mettre au même dénominateur</h4>
                    <div className="text-indigo-700">
                      <div className="inline-block align-middle mx-1">
                        <div className="border-b-2 border-gray-800 text-center px-2">(x - 3)(x² - 1) - 4(x - 1)</div>
                        <div className="text-center px-2">(x - 1)(x² - 1)</div>
                      </div>
                      {' > 0'}
                    </div>
                  </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-bold text-green-800 mb-2">Étape 4 : Étudier le signe du numérateur</h4>
                <div className="text-green-700">
                  Numérateur = (x - 3)(x² - 1) - 4(x - 1)<br />
                  = (x - 3)(x + 1)(x - 1) - 4(x - 1)<br />
                  = (x - 1)[(x - 3)(x + 1) - 4]<br />
                  = (x - 1)(x² - 2x - 7)
                </div>
              </div>

              <div className="bg-indigo-50 p-4 rounded-lg">
                <h4 className="font-bold text-indigo-800 mb-2">Étape 5 : Étudier le signe du dénominateur</h4>
                <div className="text-indigo-700">
                  Dénominateur = (x - 1)(x² - 1)<br />
                  = (x - 1)(x + 1)(x - 1)<br />
                  = (x - 1)²(x + 1)
                </div>
                <div className="bg-white p-1 sm:p-2 rounded border mt-4">
                  <table className="w-full border border-gray-300 text-xs sm:text-sm">
                    <thead>
                      <tr className="bg-gray-200">
                        <th className="border p-1 sm:p-2 text-gray-800">x</th>
                        <th className="border p-1 sm:p-2 text-gray-800 text-left">-∞</th>
                        <th className="border p-1 sm:p-2 text-gray-800">-1</th>
                        <th className="border p-1 sm:p-2 text-gray-800">1</th>
                        <th className="border p-1 sm:p-2 text-gray-800 text-right">+∞</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border p-1 sm:p-2 font-bold text-gray-800">x + 1</td>
                        <td className="border-t border-b p-2 text-right text-red-600 text-lg sm:text-xl font-bold">-</td>
                        <td className="border-t border-b p-2 text-center text-gray-800">Ø</td>
                        <td className="border-t border-b p-2 text-center text-green-600 text-lg sm:text-xl font-bold">+</td>
                        <td className="border-t border-b p-2 text-left text-green-600 text-lg sm:text-xl font-bold">+</td>
                      </tr>
                      <tr>
                        <td className="border p-1 sm:p-2 font-bold text-gray-800">(x - 1)²</td>
                        <td className="border-t border-b p-2 text-right text-green-600 text-lg sm:text-xl font-bold">+</td>
                        <td className="border-t border-b p-2 text-center text-green-600 text-lg sm:text-xl font-bold">+</td>
                        <td className="border-t border-b p-2 text-center text-gray-800">Ø</td>
                        <td className="border-t border-b p-2 text-left text-green-600 text-lg sm:text-xl font-bold">+</td>
                      </tr>
                      <tr>
                        <td className="border p-1 sm:p-2 font-bold text-gray-800">Dénominateur</td>
                        <td className="border-t border-b p-2 text-right text-red-600 text-lg sm:text-xl font-bold">-</td>
                        <td className="border-t border-b p-2 text-center text-gray-800">Ø</td>
                        <td className="border-t border-b p-2 text-center text-gray-800">Ø</td>
                        <td className="border-t border-b p-2 text-left text-green-600 text-lg sm:text-xl font-bold">+</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-bold text-purple-800 mb-2">Étape 6 : Tableau de signes du numérateur</h4>
                <div className="bg-white p-1 sm:p-2 rounded border">
                  <table className="w-full border border-gray-300 text-xs sm:text-sm">
                    <thead>
                      <tr className="bg-gray-200">
                        <th className="border p-1 sm:p-2 text-gray-800">x</th>
                        <th className="border p-1 sm:p-2 text-gray-800 text-left">-∞</th>
                        <th className="border p-1 sm:p-2 text-gray-800">1</th>
                        <th className="border p-1 sm:p-2 text-gray-800">1+√8</th>
                        <th className="border p-1 sm:p-2 text-gray-800 text-right">+∞</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border p-1 sm:p-2 font-bold text-gray-800">x - 1</td>
                        <td className="border-t border-b p-2 text-right text-red-600 text-lg sm:text-xl font-bold">-</td>
                        <td className="border-t border-b p-2 text-center text-gray-800">Ø</td>
                        <td className="border-t border-b p-2 text-center text-green-600 text-lg sm:text-xl font-bold">+</td>
                        <td className="border-t border-b p-2 text-left text-green-600 text-lg sm:text-xl font-bold">+</td>
                      </tr>
                      <tr>
                        <td className="border p-1 sm:p-2 font-bold text-gray-800">x² - 2x - 7</td>
                        <td className="border-t border-b p-2 text-right text-red-600 text-lg sm:text-xl font-bold">-</td>
                        <td className="border-t border-b p-2 text-center text-red-600 text-lg sm:text-xl font-bold">-</td>
                        <td className="border-t border-b p-2 text-center text-gray-800">Ø</td>
                        <td className="border-t border-b p-2 text-left text-green-600 text-lg sm:text-xl font-bold">+</td>
                      </tr>
                      <tr>
                        <td className="border p-1 sm:p-2 font-bold text-gray-800">Numérateur</td>
                        <td className="border-t border-b p-2 text-right text-green-600 text-lg sm:text-xl font-bold">+</td>
                        <td className="border-t border-b p-2 text-center text-gray-800">Ø</td>
                        <td className="border-t border-b p-2 text-center text-gray-800">Ø</td>
                        <td className="border-t border-b p-2 text-left text-green-600 text-lg sm:text-xl font-bold">+</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

                  <div className="bg-orange-50 p-4 rounded-lg">
                <h4 className="font-bold text-orange-800 mb-2">Étape 7 : Tableau de signes final</h4>
                <div className="bg-white p-1 sm:p-2 rounded border">
                  <table className="w-full border border-gray-300 text-xs sm:text-sm">
                    <thead>
                      <tr className="bg-gray-200">
                        <th className="border p-1 sm:p-2 text-gray-800">x</th>
                        <th className="border p-1 sm:p-2 text-gray-800 text-left">-∞</th>
                        <th className="border p-1 sm:p-2 text-gray-800">-1</th>
                        <th className="border p-1 sm:p-2 text-gray-800">1</th>
                        <th className="border p-1 sm:p-2 text-gray-800">1+√8</th>
                        <th className="border p-1 sm:p-2 text-gray-800 text-right">+∞</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border p-1 sm:p-2 font-bold text-gray-800">Numérateur</td>
                        <td className="border-t border-b p-2 text-right text-green-600 text-lg sm:text-xl font-bold">+</td>
                        <td className="border-t border-b p-2 text-center text-green-600 text-lg sm:text-xl font-bold">+</td>
                        <td className="border-t border-b p-2 text-center text-gray-800">Ø</td>
                        <td className="border-t border-b p-2 text-center text-gray-800">Ø</td>
                        <td className="border-t border-b p-2 text-left text-green-600 text-lg sm:text-xl font-bold">+</td>
                      </tr>
                      <tr>
                        <td className="border p-1 sm:p-2 font-bold text-gray-800">Dénominateur</td>
                        <td className="border-t border-b p-2 text-right text-red-600 text-lg sm:text-xl font-bold">-</td>
                        <td className="border-t border-b p-2 text-center text-gray-800">Ø</td>
                        <td className="border-t border-b p-2 text-center text-gray-800">Ø</td>
                        <td className="border-t border-b p-2 text-center text-green-600 text-lg sm:text-xl font-bold">+</td>
                        <td className="border-t border-b p-2 text-left text-green-600 text-lg sm:text-xl font-bold">+</td>
                      </tr>
                      <tr>
                        <td className="border p-1 sm:p-2 font-bold text-gray-800">Quotient</td>
                        <td className="border-t border-b p-2 text-right text-red-600 text-lg sm:text-xl font-bold">-</td>
                        <td className="border-t border-b p-2 text-center text-gray-800">Ø</td>
                        <td className="border-t border-b p-2 text-center text-gray-800">Ø</td>
                        <td className="border-t border-b p-2 text-center text-gray-800">Ø</td>
                        <td className="border-t border-b p-2 text-left text-green-600 text-lg sm:text-xl font-bold">+</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-bold text-green-800 mb-2">Conclusion :</h4>
                <div className="text-green-700">
                  Le quotient est positif pour x ∈ ]1+√8; +∞[<br />
                  En tenant compte des valeurs interdites (x ≠ -1 et x ≠ 1), la solution est :<br />
                  x ∈ ]1+√8; +∞[
                </div>
              </div>
                </div>
              </div>

              {/* Exercice 2 */}
              <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-200">
                <div className="text-center mb-4">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Exercice 2
                  </h3>
                </div>
                <div className="text-center text-blue-600 font-mono text-lg mb-6">
                  <div className="inline-block align-middle mx-1">
                    <div className="border-b-2 border-gray-800 text-center px-2">2x + 1</div>
                    <div className="text-center px-2">x² - 4</div>
                  </div>
                  {' ≤ '}
                  <div className="inline-block align-middle mx-1">
                    <div className="border-b-2 border-gray-800 text-center px-2">x - 2</div>
                    <div className="text-center px-2">x + 2</div>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h4 className="font-bold text-yellow-800 mb-2">⚠️ Étape 1 : Valeurs interdites</h4>
                    <div className="text-yellow-700">
                      • Premier dénominateur : x² - 4 = (x - 2)(x + 2) = 0 donc x ≠ 2 et x ≠ -2<br />
                      • Second dénominateur : x + 2 = 0 donc x ≠ -2
                    </div>
                  </div>

                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h4 className="font-bold text-purple-800 mb-2">Étape 2 : Mettre tout du même côté</h4>
                    <div className="text-purple-700">
                      <div className="inline-block align-middle mx-1">
                        <div className="border-b-2 border-gray-800 text-center px-2">2x + 1</div>
                        <div className="text-center px-2">x² - 4</div>
                      </div>
                      {' - '}
                      <div className="inline-block align-middle mx-1">
                        <div className="border-b-2 border-gray-800 text-center px-2">x - 2</div>
                        <div className="text-center px-2">x + 2</div>
                      </div>
                      {' ≤ 0'}
                    </div>
                  </div>

                  <div className="bg-indigo-50 p-4 rounded-lg">
                    <h4 className="font-bold text-indigo-800 mb-2">Étape 3 : Mettre au même dénominateur</h4>
                    <div className="text-indigo-700">
                      <div className="inline-block align-middle mx-1">
                        <div className="border-b-2 border-gray-800 text-center px-2">(2x + 1)(x + 2) - (x - 2)(x² - 4)</div>
                        <div className="text-center px-2">(x² - 4)(x + 2)</div>
                      </div>
                      {' ≤ 0'}
                    </div>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-bold text-green-800 mb-2">Étape 4 : Étudier le signe du numérateur</h4>
                    <div className="text-green-700">
                      Numérateur = (2x + 1)(x + 2) - (x - 2)(x² - 4)<br />
                      = 2x² + 5x + 2 - (x³ - 4x - 2x² + 8)<br />
                      = -x³ + 4x² + 9x - 6
                    </div>
                  </div>

                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h4 className="font-bold text-purple-800 mb-2">Étape 5 : Étudier le signe du dénominateur</h4>
                    <div className="text-purple-700">
                      Dénominateur = (x² - 4)(x + 2)<br />
                      = (x - 2)(x + 2)(x + 2)<br />
                      Le coefficient de x² est positif, donc la parabole sourit.<br />
                      Les racines sont x = -2 (double) et x = 2
                    </div>
                  </div>

                  <div className="bg-indigo-50 p-4 rounded-lg">
                    <h4 className="font-bold text-indigo-800 mb-2">Étape 6 : Tableau de signes</h4>
                    <div className="bg-white p-1 sm:p-2 rounded border">
                      <table className="w-full border border-gray-300 text-xs sm:text-sm">
                        <thead>
                          <tr className="bg-gray-200">
                            <th className="border p-1 sm:p-2 text-gray-800">x</th>
                            <th className="border p-1 sm:p-2 text-gray-800 text-left">-∞</th>
                            <th className="border p-1 sm:p-2 text-gray-800">-2</th>
                            <th className="border p-1 sm:p-2 text-gray-800">2</th>
                            <th className="border p-1 sm:p-2 text-gray-800 text-right">+∞</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="border p-1 sm:p-2 font-bold text-gray-800">x² - 4</td>
                            <td className="border-t border-b p-2 text-right text-green-600 text-lg sm:text-xl font-bold">+</td>
                            <td className="border-t border-b p-2 text-center text-red-600 text-lg sm:text-xl font-bold">-</td>
                            <td className="border-t border-b p-2 text-center text-gray-800">Ø</td>
                            <td className="border-t border-b p-2 text-left text-green-600 text-lg sm:text-xl font-bold">+</td>
                          </tr>
                          <tr>
                            <td className="border p-1 sm:p-2 font-bold text-gray-800">x + 2</td>
                            <td className="border-t border-b p-2 text-right text-red-600 text-lg sm:text-xl font-bold">-</td>
                            <td className="border-t border-b p-2 text-center text-gray-800">Ø</td>
                            <td className="border-t border-b p-2 text-center text-green-600 text-lg sm:text-xl font-bold">+</td>
                            <td className="border-t border-b p-2 text-left text-green-600 text-lg sm:text-xl font-bold">+</td>
                          </tr>
                          <tr>
                            <td className="border p-1 sm:p-2 font-bold text-gray-800">Dénominateur</td>
                            <td className="border-t border-b p-2 text-right text-red-600 text-lg sm:text-xl font-bold">-</td>
                            <td className="border-t border-b p-2 text-center text-gray-800">Ø</td>
                            <td className="border-t border-b p-2 text-center text-gray-800">Ø</td>
                            <td className="border-t border-b p-2 text-left text-green-600 text-lg sm:text-xl font-bold">+</td>
                          </tr>
                          <tr>
                            <td className="border p-1 sm:p-2 font-bold text-gray-800">-x³ + 4x² + 9x - 6</td>
                            <td className="border-t border-b p-2 text-right text-green-600 text-lg sm:text-xl font-bold">+</td>
                            <td className="border-t border-b p-2 text-center text-green-600 text-lg sm:text-xl font-bold">+</td>
                            <td className="border-t border-b p-2 text-center text-gray-800">Ø</td>
                            <td className="border-t border-b p-2 text-left text-red-600 text-lg sm:text-xl font-bold">-</td>
                          </tr>
                          <tr>
                            <td className="border p-1 sm:p-2 font-bold text-gray-800">Quotient</td>
                            <td className="border-t border-b p-2 text-right text-red-600 text-lg sm:text-xl font-bold">-</td>
                            <td className="border-t border-b p-2 text-center text-gray-800">Ø</td>
                            <td className="border-t border-b p-2 text-center text-gray-800">Ø</td>
                            <td className="border-t border-b p-2 text-left text-red-600 text-lg sm:text-xl font-bold">-</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-bold text-green-800 mb-2">Conclusion :</h4>
                    <div className="text-green-700">
                      L'inéquation est vérifiée pour x ∈ [2; +∞[<br />
                      Les solutions ne sont pas dans les valeurs interdites, elles sont donc acceptées.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
      xpReward: 35
    }
  ];

  return (
    <ChapterLayout
      title="Inéquations plus compliquées"
      description="Résoudre des inéquations complexes avec quotients et produits"
      sections={sections}
      navigation={{
        previous: { href: '/chapitre/equations-second-degre-overview', text: 'Vue d\'ensemble' },
        next: { href: '/chapitre/equations-second-degre-parametres', text: 'Paramètres' },
        backToTop: { href: '/chapitre/equations-second-degre-overview', text: 'Retour au sommaire' }
      }}
    />
  );
}
