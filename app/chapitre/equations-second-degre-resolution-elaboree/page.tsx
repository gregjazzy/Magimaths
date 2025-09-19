'use client';

import { useState } from 'react';
import { Circle, CheckCircle, XCircle, Target } from 'lucide-react';
import ChapterLayout from '../../components/ChapterLayout';

export default function ResolutionElaboreePage() {
  const [showSolutions, setShowSolutions] = useState<{[key: string]: boolean}>({});

  const sections = [
    {
      id: 'intro-methode',
      title: 'Résolution d\'Équations Élaborées 🎯',
      icon: '🔍',
      content: (
        <div className="space-y-4 sm:space-y-7">
          <div className="grid md:grid-cols-2 gap-4 sm:gap-7">
            <div className="h-full flex flex-col">
                <div className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white p-4 sm:p-8 rounded-xl sm:rounded-2xl flex-grow">
                <h3 className="text-lg sm:text-2xl font-bold mb-3 sm:mb-6">Méthode de résolution</h3>
                <p className="text-sm sm:text-lg mb-4 sm:mb-8">
                  Pour résoudre des équations plus complexes, suivez ces étapes essentielles :
                </p>
                <div className="bg-gradient-to-br from-white/25 to-white/10 backdrop-blur-sm p-3 sm:p-6 rounded-lg shadow-inner">
                  <div className="text-sm sm:text-lg space-y-3 sm:space-y-5">
                    <div className="flex items-center gap-2 sm:gap-4">
                      <div className="bg-white/30 shadow-lg rounded-full w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center text-white font-bold text-sm sm:text-lg flex-shrink-0">1</div>
                      <div className="flex-grow">Mettre tous les termes du même côté de l'égalité (= 0)</div>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-4">
                      <div className="bg-white/30 shadow-lg rounded-full w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center text-white font-bold text-sm sm:text-lg flex-shrink-0">2</div>
                      <div className="flex-grow">Mettre au même dénominateur si nécessaire</div>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-4">
                      <div className="bg-white/30 shadow-lg rounded-full w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center text-white font-bold text-sm sm:text-lg flex-shrink-0">3</div>
                      <div className="flex-grow">Enlever les dénominateurs</div>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-4">
                      <div className="bg-white/30 shadow-lg rounded-full w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center text-white font-bold text-sm sm:text-lg flex-shrink-0">4</div>
                      <div className="flex-grow">Résoudre l'équation du second degré obtenue</div>
                    </div>
                    <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-white/30">
                      <div className="flex items-center gap-2 sm:gap-4 bg-red-500/20 p-3 sm:p-4 rounded-lg shadow-inner">
                        <div className="text-white font-bold text-xl sm:text-2xl">⚠️</div>
                        <div className="text-white text-sm sm:text-lg leading-snug">
                          Attention aux valeurs interdites ! Les solutions ne sont pas dans les valeurs interdites.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="h-full flex flex-col">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">Exemple détaillé :</h3>
              <div className="bg-white p-3 sm:p-4 rounded-xl border-2 border-gray-300 space-y-2 sm:space-y-3">
                <div className="text-center mb-2 sm:mb-3">
                  <div className="font-mono text-base sm:text-lg font-bold text-blue-600">
                    <div className="inline-block align-middle mx-1">
                      <div className="border-b-2 border-gray-800 text-center px-2">x² - 1</div>
                      <div className="text-center px-2">x + 2</div>
                    </div> = <div className="inline-block align-middle mx-1">
                      <div className="border-b-2 border-gray-800 text-center px-2">2x + 3</div>
                      <div className="text-center px-2">x + 2</div>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="bg-yellow-50 p-3 rounded">
                    <div className="font-bold text-yellow-800 mb-2">⚠️ Étape 1 : Déterminer les valeurs interdites</div>
                    <div className="text-yellow-700 text-sm sm:text-base">
                      • Dénominateur : x + 2 = 0 donc x ≠ -2<br />
                      <div className="mt-2 text-sm">Cette vérification est indispensable avant toute résolution.</div>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded">
                    <div className="font-bold text-gray-700 mb-2">Étape 2 : Mettre tout du même côté</div>
                    <div className="text-gray-600 text-sm sm:text-base">
                      <div className="inline-block align-middle mx-1">
                        <div className="border-b-2 border-gray-800 text-center px-2">x² - 1</div>
                        <div className="text-center px-2">x + 2</div>
                      </div> - <div className="inline-block align-middle mx-1">
                        <div className="border-b-2 border-gray-800 text-center px-2">2x + 3</div>
                        <div className="text-center px-2">x + 2</div>
                      </div> = 0
                    </div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded">
                      <div className="font-bold text-gray-700 mb-2">Étape 3 : Même dénominateur</div>
                    <div className="text-gray-600 text-sm sm:text-base">
                      Déjà fait : dénominateur commun (x + 2)
                    </div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded">
                      <div className="font-bold text-gray-700 mb-2">Étape 4 : Enlever le dénominateur</div>
                    <div className="text-gray-600 text-sm sm:text-base">
                      x² - 1 - (2x + 3) = 0<br />
                      x² - 2x - 4 = 0
                    </div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded">
                      <div className="font-bold text-gray-700 mb-2">Étape 5 : Résoudre</div>
                    <div className="text-gray-600 text-sm sm:text-base">
                      a = 1, b = -2, c = -4<br />
                      Δ = (-2)² - 4(1)(-4) = 4 - (-16) = 20<br />
                      x₁ = <div className="inline-block align-middle mx-1">
                        <div className="border-b-2 border-gray-800 text-center px-2">2 + √20</div>
                        <div className="text-center px-2">2</div>
                      </div><br />
                      x₂ = <div className="inline-block align-middle mx-1">
                        <div className="border-b-2 border-gray-800 text-center px-2">2 - √20</div>
                        <div className="text-center px-2">2</div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-green-100 p-3 rounded">
                    <div className="font-bold text-green-800">Conclusion :</div>
                    <div className="text-green-700">
                      Solutions : x = (2 + √20)/2 et x = (2 - √20)/2<br />
                      Les solutions ne sont pas dans les valeurs interdites, elles sont donc acceptées
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
      xpReward: 30
    },
    {
      id: 'exercises',
      title: 'Exercices Pratiques 💪',
      icon: '📝',
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white p-4 sm:p-6 rounded-xl sm:rounded-2xl">
            <h3 className="text-lg sm:text-xl font-bold">Résoudre</h3>
          </div>

          <div className="grid gap-6">
              <div className="bg-white p-4 sm:p-6 rounded-xl border-2 border-gray-200">
                <div className="flex justify-between items-center mb-3 sm:mb-4">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-800">Exercice 1</h3>
                <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-bold">+25 XP</div>
              </div>
                <div className="font-mono text-base sm:text-lg text-blue-600 mb-4 sm:mb-6 text-center">
                <div className="inline-block align-middle mx-1">
                  <div className="border-b-2 border-gray-800 text-center px-2">x - 3</div>
                  <div className="text-center px-2">x - 1</div>
                </div> = <div className="inline-block align-middle mx-1">
                  <div className="border-b-2 border-gray-800 text-center px-2">4</div>
                  <div className="text-center px-2">x² - 1</div>
                </div>
              </div>
              <div className="space-y-4">
                {!showSolutions['ex1'] ? (
                  <button
                    onClick={() => setShowSolutions(prev => ({ ...prev, ex1: true }))}
                    className="w-full py-2 sm:py-3 px-3 sm:px-4 bg-blue-100 hover:bg-blue-200 text-blue-800 text-sm sm:text-base rounded-lg flex items-center justify-center gap-2 transition-colors"
                  >
                    <span>Voir la solution</span>
                  </button>
                ) : (
                  <>
                    <div className="bg-yellow-50 p-2 sm:p-3 rounded">
                      <div className="font-bold text-yellow-800 mb-1 sm:mb-2 text-sm sm:text-base">⚠️ Étape 1 : Déterminer les valeurs interdites</div>
                      <div className="text-yellow-700 text-sm sm:text-base">
                        • Premier dénominateur : x - 1 = 0 donc x ≠ 1<br />
                        • Second dénominateur : x² - 1 = (x - 1)(x + 1) = 0 donc x ≠ 1 et x ≠ -1<br />
                        <div className="mt-2 text-sm">Il est crucial de repérer ces valeurs interdites dès le début pour ne pas les inclure dans les solutions finales.</div>
                      </div>
                    </div>
                    <div className="bg-gray-50 p-2 sm:p-3 rounded">
                      <div className="font-bold text-gray-700 mb-1 sm:mb-2 text-sm sm:text-base">Étape 2 : Mettre tout du même côté</div>
                      <div className="text-gray-600 text-sm sm:text-base">
                        <div className="inline-block align-middle mx-1">
                          <div className="border-b-2 border-gray-800 text-center px-2">x - 3</div>
                          <div className="text-center px-2">x - 1</div>
                        </div> - <div className="inline-block align-middle mx-1">
                          <div className="border-b-2 border-gray-800 text-center px-2">4</div>
                          <div className="text-center px-2">x² - 1</div>
                        </div> = 0
                      </div>
                    </div>
                    <div className="bg-gray-50 p-2 sm:p-3 rounded">
                      <div className="font-bold text-gray-700 mb-1 sm:mb-2 text-sm sm:text-base">Étape 3 : Factoriser le dénominateur x² - 1</div>
                      <div className="text-gray-600 text-sm sm:text-base">
                        <div className="inline-block align-middle mx-1">
                          <div className="border-b-2 border-gray-800 text-center px-2">x - 3</div>
                          <div className="text-center px-2">x - 1</div>
                        </div> - <div className="inline-block align-middle mx-1">
                          <div className="border-b-2 border-gray-800 text-center px-2">4</div>
                          <div className="text-center px-2">(x - 1)(x + 1)</div>
                        </div> = 0
                      </div>
                    </div>
                    <div className="bg-gray-50 p-2 sm:p-3 rounded">
                      <div className="font-bold text-gray-700 mb-1 sm:mb-2 text-sm sm:text-base">Étape 4 : Mettre au même dénominateur</div>
                      <div className="text-gray-600 text-sm sm:text-base">
                        <div className="inline-block align-middle mx-1">
                          <div className="border-b-2 border-gray-800 text-center px-2">(x - 3)(x + 1)</div>
                          <div className="text-center px-2">(x - 1)(x + 1)</div>
                        </div> - <div className="inline-block align-middle mx-1">
                          <div className="border-b-2 border-gray-800 text-center px-2">4</div>
                          <div className="text-center px-2">(x - 1)(x + 1)</div>
                        </div> = 0
                      </div>
                    </div>
                    <div className="bg-gray-50 p-2 sm:p-3 rounded">
                      <div className="font-bold text-gray-700 mb-1 sm:mb-2 text-sm sm:text-base">Étape 5 : Réunir sous une seule fraction</div>
                      <div className="text-gray-600 text-sm sm:text-base">
                        <div className="inline-block align-middle mx-1">
                          <div className="border-b-2 border-gray-800 text-center px-2">(x - 3)(x + 1) - 4</div>
                          <div className="text-center px-2">(x - 1)(x + 1)</div>
                        </div> = 0
                      </div>
                    </div>
                    <div className="bg-gray-50 p-2 sm:p-3 rounded">
                      <div className="font-bold text-gray-700 mb-1 sm:mb-2 text-sm sm:text-base">Étape 6 : Enlever le dénominateur</div>
                      <div className="text-gray-600 text-sm sm:text-base">
                        (x - 3)(x + 1) - 4 = 0<br />
                        x² + x - 3x - 3 - 4 = 0<br />
                        x² - 2x - 7 = 0
                      </div>
                    </div>
                    <div className="bg-gray-50 p-2 sm:p-3 rounded">
                      <div className="font-bold text-gray-700 mb-1 sm:mb-2 text-sm sm:text-base">Étape 7 : Résoudre l'équation du second degré</div>
                      <div className="text-gray-600 text-sm sm:text-base">
                        a = 1, b = -2, c = -7<br />
                        Δ = (-2)² - 4(1)(-7) = 4 + 28 = 32<br />
                        x₁ = <div className="inline-block align-middle mx-1">
                          <div className="border-b-2 border-gray-800 text-center px-2">2 + √32</div>
                          <div className="text-center px-2">2</div>
                        </div> = 1 + √8<br />
                        x₂ = <div className="inline-block align-middle mx-1">
                          <div className="border-b-2 border-gray-800 text-center px-2">2 - √32</div>
                          <div className="text-center px-2">2</div>
                        </div> = 1 - √8
                      </div>
                    </div>
                    <div className="bg-green-100 p-2 sm:p-3 rounded">
                      <div className="font-bold text-green-800 text-sm sm:text-base">Conclusion :</div>
                      <div className="text-green-700 text-sm sm:text-base">
                        Solutions : x = 1 - √8 et x = 1 + √8<br />
                        Les solutions ne sont pas dans les valeurs interdites, elles sont donc acceptées
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

              <div className="bg-white p-4 sm:p-6 rounded-xl border-2 border-gray-200">
                <div className="flex justify-between items-center mb-3 sm:mb-4">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-800">Exercice 2</h3>
                <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-bold">+25 XP</div>
              </div>
                <div className="font-mono text-base sm:text-lg text-blue-600 mb-4 sm:mb-6 text-center">
                <div className="inline-block align-middle mx-1">
                  <div className="border-b-2 border-gray-800 text-center px-2">x²</div>
                  <div className="text-center px-2">3</div>
                </div> + <div className="inline-block align-middle mx-1">
                  <div className="border-b-2 border-gray-800 text-center px-2">x</div>
                  <div className="text-center px-2">2</div>
                </div> = 1
              </div>
              <div className="space-y-4">
                {!showSolutions['ex2'] ? (
                  <button
                    onClick={() => setShowSolutions(prev => ({ ...prev, ex2: true }))}
                    className="w-full py-2 sm:py-3 px-3 sm:px-4 bg-blue-100 hover:bg-blue-200 text-blue-800 text-sm sm:text-base rounded-lg flex items-center justify-center gap-2 transition-colors"
                  >
                    <span>Voir la solution</span>
                  </button>
                ) : (
                  <>
                    <div className="bg-yellow-50 p-2 sm:p-3 rounded">
                      <div className="font-bold text-yellow-800 mb-1 sm:mb-2 text-sm sm:text-base">⚠️ Étape 1 : Déterminer les valeurs interdites</div>
                      <div className="text-yellow-700 text-sm sm:text-base">
                        • Premier dénominateur : 3 ≠ 0 donc pas de valeur interdite<br />
                        • Second dénominateur : 2 ≠ 0 donc pas de valeur interdite<br />
                        <div className="mt-2 text-sm">Cette vérification est toujours nécessaire, même quand il n'y a pas de valeur interdite.</div>
                      </div>
                    </div>
                    <div className="bg-gray-50 p-2 sm:p-3 rounded">
                      <div className="font-bold text-gray-700 mb-1 sm:mb-2 text-sm sm:text-base">Étape 2 : Mettre tout du même côté</div>
                      <div className="text-gray-600 text-sm sm:text-base">
                        x²/3 + x/2 - 1 = 0
                      </div>
                    </div>
                    <div className="bg-gray-50 p-2 sm:p-3 rounded">
                      <div className="font-bold text-gray-700 mb-1 sm:mb-2 text-sm sm:text-base">Étape 3 : Même dénominateur</div>
                      <div className="text-gray-600 text-sm sm:text-base">
                        (2x² + 3x - 6)/6 = 0
                      </div>
                    </div>
                    <div className="bg-gray-50 p-2 sm:p-3 rounded">
                      <div className="font-bold text-gray-700 mb-1 sm:mb-2 text-sm sm:text-base">Étape 4 : Enlever le dénominateur</div>
                      <div className="text-gray-600 text-sm sm:text-base">
                        2x² + 3x - 6 = 0
                      </div>
                    </div>
                    <div className="bg-gray-50 p-2 sm:p-3 rounded">
                      <div className="font-bold text-gray-700 mb-1 sm:mb-2 text-sm sm:text-base">Étape 5 : Résoudre</div>
                      <div className="text-gray-600 text-sm sm:text-base">
                        a = 2, b = 3, c = -6<br />
                        Δ = 3² - 4(2)(-6) = 9 + 48 = 57<br />
                        x₁ = <div className="inline-block align-middle mx-1">
                          <div className="border-b-2 border-gray-800 text-center px-2">-3 + √57</div>
                          <div className="text-center px-2">4</div>
                        </div><br />
                        x₂ = <div className="inline-block align-middle mx-1">
                          <div className="border-b-2 border-gray-800 text-center px-2">-3 - √57</div>
                          <div className="text-center px-2">4</div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-green-100 p-2 sm:p-3 rounded">
                      <div className="font-bold text-green-800 text-sm sm:text-base">Conclusion :</div>
                      <div className="text-green-700 text-sm sm:text-base">
                        Solutions : x = (-3 + √57)/4 et x = (-3 - √57)/4<br />
                        Les solutions ne sont pas dans les valeurs interdites, elles sont donc acceptées
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

              <div className="bg-white p-4 sm:p-6 rounded-xl border-2 border-gray-200">
                <div className="flex justify-between items-center mb-3 sm:mb-4">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-800">Exercice 3</h3>
                <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-bold">+25 XP</div>
              </div>
                <div className="font-mono text-base sm:text-lg text-blue-600 mb-4 sm:mb-6 text-center">
                <div className="inline-block align-middle mx-1">
                  <div className="border-b-2 border-gray-800 text-center px-2">x²</div>
                  <div className="text-center px-2">x + 1</div>
                </div> = 2x - 3
              </div>
              <div className="space-y-4">
                {!showSolutions['ex3'] ? (
                  <button
                    onClick={() => setShowSolutions(prev => ({ ...prev, ex3: true }))}
                    className="w-full py-2 sm:py-3 px-3 sm:px-4 bg-blue-100 hover:bg-blue-200 text-blue-800 text-sm sm:text-base rounded-lg flex items-center justify-center gap-2 transition-colors"
                  >
                    <span>Voir la solution</span>
                  </button>
                ) : (
                  <>
                    <div className="bg-yellow-50 p-2 sm:p-3 rounded">
                      <div className="font-bold text-yellow-800 mb-1 sm:mb-2 text-sm sm:text-base">⚠️ Étape 1 : Déterminer les valeurs interdites</div>
                      <div className="text-yellow-700 text-sm sm:text-base">
                        • Dénominateur : x + 1 = 0 donc x ≠ -1<br />
                        <div className="mt-2 text-sm">Cette vérification est indispensable avant toute résolution.</div>
                      </div>
                    </div>
                    <div className="bg-gray-50 p-2 sm:p-3 rounded">
                      <div className="font-bold text-gray-700 mb-1 sm:mb-2 text-sm sm:text-base">Étape 2 : Mettre tout du même côté</div>
                      <div className="text-gray-600 text-sm sm:text-base">
                        <div className="inline-block align-middle mx-1">
                          <div className="border-b-2 border-gray-800 text-center px-2">x²</div>
                          <div className="text-center px-2">x + 1</div>
                        </div> - (2x - 3) = 0
                      </div>
                    </div>
                    <div className="bg-gray-50 p-2 sm:p-3 rounded">
                      <div className="font-bold text-gray-700 mb-1 sm:mb-2 text-sm sm:text-base">Étape 3 : Même dénominateur</div>
                      <div className="text-gray-600 text-sm sm:text-base">
                        <div className="inline-block align-middle mx-1">
                          <div className="border-b-2 border-gray-800 text-center px-2">x² - (2x - 3)(x + 1)</div>
                          <div className="text-center px-2">x + 1</div>
                        </div> = 0
                      </div>
                    </div>
                    <div className="bg-gray-50 p-2 sm:p-3 rounded">
                      <div className="font-bold text-gray-700 mb-1 sm:mb-2 text-sm sm:text-base">Étape 4 : Développer et simplifier</div>
                      <div className="text-gray-600 text-sm sm:text-base">
                        <div className="inline-block align-middle mx-1">
                          <div className="border-b-2 border-gray-800 text-center px-2">x² - (2x² + 2x - 3x - 3)</div>
                          <div className="text-center px-2">x + 1</div>
                        </div> = 0<br />
                        <div className="inline-block align-middle mx-1">
                          <div className="border-b-2 border-gray-800 text-center px-2">x² - 2x² + x + 3</div>
                          <div className="text-center px-2">x + 1</div>
                        </div> = 0<br />
                        <div className="inline-block align-middle mx-1">
                          <div className="border-b-2 border-gray-800 text-center px-2">-x² + x + 3</div>
                          <div className="text-center px-2">x + 1</div>
                        </div> = 0
                      </div>
                    </div>
                    <div className="bg-gray-50 p-2 sm:p-3 rounded">
                      <div className="font-bold text-gray-700 mb-1 sm:mb-2 text-sm sm:text-base">Étape 5 : Résoudre le numérateur</div>
                      <div className="text-gray-600 text-sm sm:text-base">
                        -x² + x + 3 = 0<br />
                        a = -1, b = 1, c = 3<br />
                        Δ = 1² - 4(-1)(3) = 1 + 12 = 13<br />
                        x₁ = <div className="inline-block align-middle mx-1">
                          <div className="border-b-2 border-gray-800 text-center px-2">-1 + √13</div>
                          <div className="text-center px-2">-2</div>
                        </div><br />
                        x₂ = <div className="inline-block align-middle mx-1">
                          <div className="border-b-2 border-gray-800 text-center px-2">-1 - √13</div>
                          <div className="text-center px-2">-2</div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-green-100 p-2 sm:p-3 rounded">
                      <div className="font-bold text-green-800 text-sm sm:text-base">Conclusion :</div>
                      <div className="text-green-700 text-sm sm:text-base">
                        Solutions : x = (-1 + √13)/(-2) et x = (-1 - √13)/(-2)<br />
                        Les solutions ne sont pas dans les valeurs interdites, elles sont donc acceptées
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      ),
      xpReward: 75
    }
  ];

  return (
    <ChapterLayout
      title="Résolution d'Équations Élaborées"
      description="Maîtriser la résolution d'équations complexes du second degré"
      sections={sections}
      navigation={{
        previous: { href: '/chapitre/equations-second-degre-overview', text: 'Vue d\'ensemble' },
        next: { href: '/chapitre/equations-second-degre-tableaux-signes', text: 'Tableaux de signes' },
        backToTop: { href: '/chapitre/equations-second-degre-overview', text: 'Retour au sommaire' }
      }}
    />
  );
}
