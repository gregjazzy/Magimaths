'use client';

import { useState } from 'react';
import ChapterLayout from '../../components/ChapterLayout';

export default function TableauxSignesPage() {

  const sections = [
    {
      id: 'intro',
      title: 'Tableaux de Signe & Inéquations 📊',
      icon: '📈',
      content: (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 sm:p-6 rounded-xl sm:rounded-2xl border-2 border-blue-300">
              <h3 className="text-base sm:text-lg font-bold text-center text-gray-800 mb-4 sm:mb-6">
                📏 Règles du signe selon Δ puis a
              </h3>
              
              <div className="space-y-6">
                <div className="bg-white p-5 rounded-xl border-2 border-green-300">
                  <h4 className="text-base sm:text-lg font-bold text-center text-gray-800 mb-4 sm:mb-6">
                  📊 Cas 1 : Δ {'>'} 0 (Deux racines distinctes)
                  </h4>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-3 bg-green-50 rounded-lg border-l-4 border-green-400">
                    <div className="font-bold text-green-800 mb-2">Si a {'>'} 0 :</div>
                      <div className="bg-white p-1 sm:p-2 rounded border">
                      <table className="w-full border border-gray-300 text-xs sm:text-sm">
                          <thead>
                            <tr className="bg-gray-200">
                            <th className="border p-1 sm:p-2 text-gray-800">x</th>
                            <th className="border p-1 sm:p-2 text-gray-800 text-left">-∞</th>
                            <th className="border p-1 sm:p-2 text-gray-800">x₁</th>
                            <th className="border p-1 sm:p-2 text-gray-800"></th>
                            <th className="border p-1 sm:p-2 text-gray-800">x₂</th>
                            <th className="border p-1 sm:p-2 text-gray-800 text-right">+∞</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                            <td className="border p-1 sm:p-2 font-bold text-gray-800">f(x)</td>
                            <td className="border-t border-b p-2 text-right text-green-600 text-lg sm:text-xl font-bold">+</td>
                            <td className="border-t border-b p-2 text-center text-gray-800">Ø</td>
                            <td className="border-t border-b p-2 text-center text-red-600 text-lg sm:text-xl font-bold">-</td>
                            <td className="border-t border-b p-2 text-center text-gray-800">Ø</td>
                            <td className="border-t border-b p-2 text-left text-green-600 text-lg sm:text-xl font-bold">+</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  
                    <div className="p-3 bg-red-50 rounded-lg border-l-4 border-red-400">
                    <div className="font-bold text-red-800 mb-2">Si a {'<'} 0 :</div>
                      <div className="bg-white p-1 sm:p-2 rounded border">
                      <table className="w-full border border-gray-300 text-xs sm:text-sm">
                          <thead>
                            <tr className="bg-gray-200">
                            <th className="border p-1 sm:p-2 text-gray-800">x</th>
                            <th className="border p-1 sm:p-2 text-gray-800 text-left">-∞</th>
                            <th className="border p-1 sm:p-2 text-gray-800">x₁</th>
                            <th className="border p-1 sm:p-2 text-gray-800"></th>
                            <th className="border p-1 sm:p-2 text-gray-800">x₂</th>
                            <th className="border p-1 sm:p-2 text-gray-800 text-right">+∞</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                            <td className="border p-1 sm:p-2 font-bold text-gray-800">f(x)</td>
                            <td className="border-t border-b p-2 text-right text-red-600 text-lg sm:text-xl font-bold">-</td>
                            <td className="border-t border-b p-2 text-center text-gray-800">Ø</td>
                            <td className="border-t border-b p-2 text-center text-green-600 text-lg sm:text-xl font-bold">+</td>
                            <td className="border-t border-b p-2 text-center text-gray-800">Ø</td>
                            <td className="border-t border-b p-2 text-left text-red-600 text-lg sm:text-xl font-bold">-</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-xl border-2 border-yellow-300">
                <h4 className="text-base sm:text-lg font-bold text-center text-gray-800 mb-4">
                    📊 Cas 2 : Δ = 0 (Racine double)
                  </h4>
                <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-3 bg-green-50 rounded-lg border-l-4 border-green-400">
                      <div className="font-bold text-green-800 mb-2">Si a {'>'} 0 :</div>
                      <div className="bg-white p-1 sm:p-2 rounded border">
                        <table className="w-full border border-gray-300 text-xs sm:text-sm">
                          <thead>
                            <tr className="bg-gray-200">
                              <th className="border p-1 sm:p-2 text-gray-800">x</th>
                              <th className="border p-1 sm:p-2 text-gray-800 text-left">-∞</th>
                              <th className="border p-1 sm:p-2 text-gray-800">α</th>
                              <th className="border p-1 sm:p-2 text-gray-800 text-right">+∞</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="border p-1 sm:p-2 font-bold text-gray-800">f(x)</td>
                              <td className="border-t border-b p-2 text-right text-green-600 text-lg sm:text-xl font-bold">+</td>
                              <td className="border-t border-b p-2 text-center text-gray-800">Ø</td>
                              <td className="border-t border-b p-2 text-left text-green-600 text-lg sm:text-xl font-bold">+</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div className="p-3 bg-red-50 rounded-lg border-l-4 border-red-400">
                      <div className="font-bold text-red-800 mb-2">Si a {'<'} 0 :</div>
                      <div className="bg-white p-1 sm:p-2 rounded border">
                        <table className="w-full border border-gray-300 text-xs sm:text-sm">
                          <thead>
                            <tr className="bg-gray-200">
                              <th className="border p-1 sm:p-2 text-gray-800">x</th>
                              <th className="border p-1 sm:p-2 text-gray-800 text-left">-∞</th>
                              <th className="border p-1 sm:p-2 text-gray-800">α</th>
                              <th className="border p-1 sm:p-2 text-gray-800 text-right">+∞</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="border p-1 sm:p-2 font-bold text-gray-800">f(x)</td>
                              <td className="border-t border-b p-2 text-right text-red-600 text-lg sm:text-xl font-bold">-</td>
                              <td className="border-t border-b p-2 text-center text-gray-800">Ø</td>
                              <td className="border-t border-b p-2 text-left text-red-600 text-lg sm:text-xl font-bold">-</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                                </div>
                  </div>
                </div>

              <div className="bg-white p-5 rounded-xl border-2 border-purple-300">
                <h4 className="text-base sm:text-lg font-bold text-center text-gray-800 mb-4">
                  📊 Cas 3 : Δ {'<'} 0 (Pas de racines réelles)
                  </h4>
                <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-3 bg-green-50 rounded-lg border-l-4 border-green-400">
                      <div className="font-bold text-green-800 mb-2">Si a {'>'} 0 :</div>
                      <div className="bg-white p-1 sm:p-2 rounded border">
                        <table className="w-full border border-gray-300 text-xs sm:text-sm">
                          <thead>
                            <tr className="bg-gray-200">
                              <th className="border p-1 sm:p-2 text-gray-800">x</th>
                              <th className="border p-1 sm:p-2 text-gray-800 text-left">-∞</th>
                              <th className="border p-1 sm:p-2 text-gray-800 text-right">+∞</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="border p-1 sm:p-2 font-bold text-gray-800">f(x)</td>
                              <td className="border-t border-b p-2 text-right text-green-600 text-lg sm:text-xl font-bold">+</td>
                              <td className="border-t border-b p-2 text-left text-green-600 text-lg sm:text-xl font-bold">+</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div className="p-3 bg-red-50 rounded-lg border-l-4 border-red-400">
                      <div className="font-bold text-red-800 mb-2">Si a {'<'} 0 :</div>
                      <div className="bg-white p-1 sm:p-2 rounded border">
                        <table className="w-full border border-gray-300 text-xs sm:text-sm">
                          <thead>
                            <tr className="bg-gray-200">
                              <th className="border p-1 sm:p-2 text-gray-800">x</th>
                              <th className="border p-1 sm:p-2 text-gray-800 text-left">-∞</th>
                              <th className="border p-1 sm:p-2 text-gray-800 text-right">+∞</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="border p-1 sm:p-2 font-bold text-gray-800">f(x)</td>
                              <td className="border-t border-b p-2 text-right text-red-600 text-lg sm:text-xl font-bold">-</td>
                              <td className="border-t border-b p-2 text-left text-red-600 text-lg sm:text-xl font-bold">-</td>
                            </tr>
                          </tbody>
                        </table>
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
      id: 'exercises',
      title: 'Exercices Pratiques 💪',
      icon: '📝',
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white p-4 sm:p-6 rounded-xl sm:rounded-2xl">
            <h3 className="text-lg sm:text-xl font-bold mb-3">Entraînement sur les tableaux de signes</h3>
            <p className="text-lg">
              Maîtrisez la résolution d'inéquations !
            </p>
          </div>

          <div className="grid gap-6">
            <div className="space-y-8">
              {/* Exercice 1 */}
              <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-200">
                <div className="text-center mb-4">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                    Exercice 1 : x² - 5x + 6 > 0
                  </h3>
                </div>
                <div className="space-y-6">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-bold text-blue-800 mb-2">Étape 1 : Calcul du discriminant</h4>
                    <div className="text-blue-700 text-xs sm:text-base">
                      a = 1, b = -5, c = 6<br />
                      Δ = b² - 4ac = (-5)² - 4(1)(6)<br />
                      Δ = 25 - 24 = 1
                    </div>
                  </div>

                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h4 className="font-bold text-purple-800 mb-2">Étape 2 : Calcul des racines</h4>
                    <div className="text-purple-700 text-xs sm:text-base">
                      x₁ = <div className="inline-block align-middle mx-0.5 sm:mx-1">
                        <div className="border-b-2 border-gray-800 text-center px-1 sm:px-2">-b - √Δ</div>
                        <div className="text-center px-1 sm:px-2">2a</div>
                      </div> = <div className="inline-block align-middle mx-0.5 sm:mx-1">
                        <div className="border-b-2 border-gray-800 text-center px-1 sm:px-2">5 - √1</div>
                        <div className="text-center px-1 sm:px-2">2</div>
                      </div> = 2<br />
                      x₂ = <div className="inline-block align-middle mx-0.5 sm:mx-1">
                        <div className="border-b-2 border-gray-800 text-center px-1 sm:px-2">-b + √Δ</div>
                        <div className="text-center px-1 sm:px-2">2a</div>
                      </div> = <div className="inline-block align-middle mx-0.5 sm:mx-1">
                        <div className="border-b-2 border-gray-800 text-center px-1 sm:px-2">5 + √1</div>
                        <div className="text-center px-1 sm:px-2">2</div>
                      </div> = 3
                    </div>
                  </div>

                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h4 className="font-bold text-yellow-800 mb-2">Étape 3 : Factorisation</h4>
                    <div className="text-yellow-700 text-xs sm:text-base">
                      x² - 5x + 6 = (x - 2)(x - 3)
                    </div>
                  </div>

                  <div className="bg-indigo-50 p-4 rounded-lg">
                    <h4 className="font-bold text-indigo-800 mb-2">Étape 4 : Tableau de signes</h4>
                    <div className="bg-white p-1 sm:p-2 rounded border">
                      <table className="w-full border border-gray-300 text-xs sm:text-sm">
                        <thead>
                          <tr className="bg-gray-200">
                            <th className="border p-1 sm:p-2 text-gray-800">x</th>
                            <th className="border p-1 sm:p-2 text-gray-800 text-left">-∞</th>
                            <th className="border p-1 sm:p-2 text-gray-800">2</th>
                            <th className="border p-1 sm:p-2 text-gray-800"></th>
                            <th className="border p-1 sm:p-2 text-gray-800">3</th>
                            <th className="border p-1 sm:p-2 text-gray-800 text-right">+∞</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="border p-1 sm:p-2 font-bold text-gray-800">x - 2</td>
                            <td className="border-t border-b p-2 text-right text-red-600 text-lg sm:text-xl font-bold">-</td>
                            <td className="border-t border-b p-2 text-center text-gray-800">Ø</td>
                            <td className="border-t border-b p-2 text-center text-green-600 text-lg sm:text-xl font-bold">+</td>
                            <td className="border-t border-b p-2 text-center"></td>
                            <td className="border-t border-b p-2 text-left text-green-600 text-lg sm:text-xl font-bold">+</td>
                          </tr>
                          <tr>
                            <td className="border p-1 sm:p-2 font-bold text-gray-800">x - 3</td>
                            <td className="border-t border-b p-2 text-right text-red-600 text-lg sm:text-xl font-bold">-</td>
                            <td className="border-t border-b p-2 text-center"></td>
                            <td className="border-t border-b p-2 text-center text-red-600 text-lg sm:text-xl font-bold">-</td>
                            <td className="border-t border-b p-2 text-center text-gray-800">Ø</td>
                            <td className="border-t border-b p-2 text-left text-green-600 text-lg sm:text-xl font-bold">+</td>
                          </tr>
                          <tr>
                            <td className="border p-1 sm:p-2 font-bold text-gray-800">(x - 2)(x - 3)</td>
                            <td className="border-t border-b p-2 text-right text-green-600 text-lg sm:text-xl font-bold">+</td>
                            <td className="border-t border-b p-2 text-center text-gray-800">Ø</td>
                            <td className="border-t border-b p-2 text-center text-red-600 text-lg sm:text-xl font-bold">-</td>
                            <td className="border-t border-b p-2 text-center text-gray-800">Ø</td>
                            <td className="border-t border-b p-2 text-left text-green-600 text-lg sm:text-xl font-bold">+</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-bold text-green-800 mb-2">Solution :</h4>
                    <div className="text-green-700">
                      L'inéquation x² - 5x + 6 > 0 est vérifiée pour x ∈ ]-∞; 2[ ∪ ]3; +∞[
                    </div>
                  </div>
                </div>
              </div>

              {/* Exercice 2 */}
              <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-200">
                <div className="text-center mb-4">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                    Exercice 2 : -2x² + 3x + 2 ≤ 0
                  </h3>
          </div>
                <div className="space-y-6">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-bold text-blue-800 mb-2">Étape 1 : Calcul du discriminant</h4>
                    <div className="text-blue-700 text-xs sm:text-base">
                      Δ = b² - 4ac = 3² - 4(2)(-2) = 9 + 16 = 25
                    </div>
                  </div>

                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h4 className="font-bold text-purple-800 mb-2">Étape 2 : Racines</h4>
                    <div className="text-purple-700 text-xs sm:text-base">
                      x₁ = <div className="inline-block align-middle mx-0.5 sm:mx-1">
                        <div className="border-b-2 border-gray-800 text-center px-1 sm:px-2">-3 - √25</div>
                        <div className="text-center px-1 sm:px-2">4</div>
                      </div> = -2<br />
                      x₂ = <div className="inline-block align-middle mx-0.5 sm:mx-1">
                        <div className="border-b-2 border-gray-800 text-center px-1 sm:px-2">-3 + √25</div>
                        <div className="text-center px-1 sm:px-2">4</div>
                      </div> = <div className="inline-block align-middle mx-0.5 sm:mx-1">
                        <div className="border-b-2 border-gray-800 text-center px-1 sm:px-2">1</div>
                        <div className="text-center px-1 sm:px-2">2</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-indigo-50 p-4 rounded-lg">
                    <h4 className="font-bold text-indigo-800 mb-2">Étape 4 : Tableau de signes</h4>
                    <div className="bg-white p-1 sm:p-2 rounded border">
                      <table className="w-full border border-gray-300 text-xs sm:text-sm">
                        <thead>
                          <tr className="bg-gray-200">
                            <th className="border p-1 sm:p-2 text-gray-800">x</th>
                            <th className="border p-1 sm:p-2 text-gray-800 text-left">-∞</th>
                            <th className="border p-1 sm:p-2 text-gray-800">-2</th>
                            <th className="border p-1 sm:p-2 text-gray-800"></th>
                            <th className="border p-1 sm:p-2 text-gray-800">1/2</th>
                            <th className="border p-1 sm:p-2 text-gray-800 text-right">+∞</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="border p-1 sm:p-2 font-bold text-gray-800">-2x² + 3x + 2</td>
                            <td className="border-t border-b p-2 text-right text-red-600 text-lg sm:text-xl font-bold">-</td>
                            <td className="border-t border-b p-2 text-center text-gray-800">Ø</td>
                            <td className="border-t border-b p-2 text-center text-green-600 text-lg sm:text-xl font-bold">+</td>
                            <td className="border-t border-b p-2 text-center text-gray-800">Ø</td>
                            <td className="border-t border-b p-2 text-left text-red-600 text-lg sm:text-xl font-bold">-</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-bold text-green-800 mb-2">Solution :</h4>
                    <div className="text-green-700">
                      L'inéquation 2x² + 3x - 2 ≤ 0 est vérifiée pour x ∈ [-2; 1/2]
                    </div>
                  </div>
                </div>
              </div>

              {/* Exercice 3 */}
              <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-200">
                <div className="text-center mb-4">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                    Exercice 3 : -x² + 4x - 4 ≥ 0
                  </h3>
                </div>
                <div className="space-y-6">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-bold text-blue-800 mb-2">Étape 1 : Calcul du discriminant</h4>
                    <div className="text-blue-700 text-xs sm:text-base">
                      a = -1, b = 4, c = -4<br />
                      Δ = b² - 4ac = 4² - 4(-1)(-4)<br />
                      Δ = 16 - 16 = 0
                    </div>
                  </div>

                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h4 className="font-bold text-purple-800 mb-2">Étape 2 : Racine double</h4>
                    <div className="text-purple-700 text-xs sm:text-base">
                      x = <div className="inline-block align-middle mx-0.5 sm:mx-1">
                        <div className="border-b-2 border-gray-800 text-center px-1 sm:px-2">-b</div>
                        <div className="text-center px-1 sm:px-2">2a</div>
                      </div> = <div className="inline-block align-middle mx-0.5 sm:mx-1">
                        <div className="border-b-2 border-gray-800 text-center px-1 sm:px-2">-4</div>
                        <div className="text-center px-1 sm:px-2">-2</div>
                      </div> = 2
                    </div>
                  </div>

                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h4 className="font-bold text-yellow-800 mb-2">Étape 3 : Forme canonique</h4>
                    <div className="text-yellow-700 text-xs sm:text-base">
                      -x² + 4x - 4 = -(x² - 4x + 4) = -(x - 2)²
                    </div>
                  </div>

                  <div className="bg-indigo-50 p-4 rounded-lg">
                    <h4 className="font-bold text-indigo-800 mb-2">Étape 4 : Tableau de signes</h4>
                    <div className="bg-white p-1 sm:p-2 rounded border">
                      <table className="w-full border border-gray-300 text-xs sm:text-sm">
                        <thead>
                          <tr className="bg-gray-200">
                            <th className="border p-1 sm:p-2 text-gray-800">x</th>
                            <th className="border p-1 sm:p-2 text-gray-800 text-left">-∞</th>
                            <th className="border p-1 sm:p-2 text-gray-800">2</th>
                            <th className="border p-1 sm:p-2 text-gray-800 text-right">+∞</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="border p-1 sm:p-2 font-bold text-gray-800">-(x - 2)²</td>
                            <td className="border-t border-b p-2 text-right text-red-600 text-lg sm:text-xl font-bold">-</td>
                            <td className="border-t border-b p-2 text-center text-gray-800">Ø</td>
                            <td className="border-t border-b p-2 text-left text-red-600 text-lg sm:text-xl font-bold">-</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-bold text-green-800 mb-2">Solution :</h4>
                    <div className="text-green-700">
                      L'inéquation -x² + 4x - 4 ≥ 0 est vérifiée pour x = 2
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
      title="Tableaux de Signes et Inéquations"
      description="Résoudre des inéquations du second degré avec des tableaux de signes"
      sections={sections}
      navigation={{
        previous: { href: '/chapitre/equations-second-degre-overview', text: 'Vue d\'ensemble' },
        next: { href: '/chapitre/equations-second-degre-parametres', text: 'Paramètres' },
        backToTop: { href: '/chapitre/equations-second-degre-overview', text: 'Retour au sommaire' }
      }}
    />
  );
} 