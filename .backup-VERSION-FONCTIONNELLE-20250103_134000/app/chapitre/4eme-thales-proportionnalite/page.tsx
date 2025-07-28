'use client'

import { useState } from 'react'
import { ArrowLeft, BookOpen, Target, Play, RotateCcw, CheckCircle, XCircle, Lightbulb, Calculator } from 'lucide-react'
import Link from 'next/link'
import { VoiceInput } from '../../../components/VoiceInput'

export default function ThalesProportionnalitePage() {
  const [activeTab, setActiveTab] = useState<'cours' | 'exercices'>('cours')
  const [currentExercise, setCurrentExercise] = useState(0)
  const [userAnswer, setUserAnswer] = useState('')
  const [showAnswer, setShowAnswer] = useState(false)
  const [score, setScore] = useState(0)
  const [answerFeedback, setAnswerFeedback] = useState<'correct' | 'incorrect' | null>(null)
  
  // États pour l'animation de calcul
  const [calcStep, setCalcStep] = useState(0)
  const [searchingFor, setSearchingFor] = useState<string>('AM')
  const [isCalculating, setIsCalculating] = useState(false)

  // Fonctions pour l'animation de calcul
  const startCalculation = (target: string) => {
    setSearchingFor(target)
    setIsCalculating(true)
    setCalcStep(0)
    
    // Animation en étapes
    setTimeout(() => setCalcStep(1), 500)  // Montrer les 3 égalités
    setTimeout(() => setCalcStep(2), 1500) // Sélectionner les 2 bonnes égalités
    setTimeout(() => setCalcStep(3), 2500) // Montrer le calcul
    setTimeout(() => setCalcStep(4), 3500) // Montrer le résultat
    setTimeout(() => {
      setCalcStep(0)
      setIsCalculating(false)
    }, 5000) // Reset
  }

  const resetCalculation = () => {
    setCalcStep(0)
    setIsCalculating(false)
    setSearchingFor('AM')
  }

  const exercises = [
    // Niveau 1-5 : Calculs simples avec rapports entiers
    {
      question: 'Dans un triangle ABC avec (MN) ∥ (BC), si AM = 3 et AB = 6, que vaut le rapport AM/AB ?',
      answer: '0.5',
      explanation: 'AM/AB = 3/6 = 1/2 = 0,5',
      hint: 'Divise 3 par 6'
    },
    {
      question: 'Si AM/AB = 1/3 et AB = 9, que vaut AM ?',
      answer: '3',
      explanation: 'AM/AB = 1/3, donc AM = AB × 1/3 = 9 × 1/3 = 3',
      hint: 'Multiplie AB par le rapport'
    },
    {
      question: 'Triangle ABC avec (MN) ∥ (BC). Si AM = 4, AB = 8, AN = 5, que vaut AC ?',
      answer: '10',
      explanation: 'AM/AB = AN/AC, donc 4/8 = 5/AC, donc AC = 5 × 8/4 = 10',
      hint: 'Utilise la proportionnalité : AM/AB = AN/AC'
    },
    {
      question: 'Si les rapports de Thalès valent tous 2/3, et BC = 12, que vaut MN ?',
      answer: '8',
      explanation: 'MN/BC = 2/3, donc MN = BC × 2/3 = 12 × 2/3 = 8',
      hint: 'MN = BC × rapport'
    },
    {
      question: 'Dans une configuration de Thalès, si AM = 5 et MB = 5, que vaut AM/AB ?',
      answer: '0.5',
      explanation: 'AB = AM + MB = 5 + 5 = 10, donc AM/AB = 5/10 = 0,5',
      hint: 'AB = AM + MB'
    },

    // Niveau 6-10 : Calculs avec fractions
    {
      question: 'Si AM/AB = 3/7 et AB = 14, que vaut AM ?',
      answer: '6',
      explanation: 'AM = AB × 3/7 = 14 × 3/7 = 6',
      hint: 'Multiplie 14 par 3/7'
    },
    {
      question: 'Triangle avec (MN) ∥ (BC). Si AM = 6, AB = 15, BC = 10, que vaut MN ?',
      answer: '4',
      explanation: 'AM/AB = MN/BC, donc 6/15 = MN/10, donc MN = 10 × 6/15 = 4',
      hint: 'Utilise MN/BC = AM/AB'
    },
    {
      question: 'Si AN/AC = 5/8 et AC = 24, que vaut AN ?',
      answer: '15',
      explanation: 'AN = AC × 5/8 = 24 × 5/8 = 15',
      hint: 'Multiplie 24 par 5/8'
    },
    {
      question: 'Configuration de Thalès : AM = 9, AB = 12, AN = 6. Que vaut AC ?',
      answer: '8',
      explanation: 'AM/AB = AN/AC, donc 9/12 = 6/AC, donc AC = 6 × 12/9 = 8',
      hint: 'Résous l\'équation 9/12 = 6/AC'
    },
    {
      question: 'Si MN/BC = 4/5 et MN = 12, que vaut BC ?',
      answer: '15',
      explanation: 'MN/BC = 4/5, donc 12/BC = 4/5, donc BC = 12 × 5/4 = 15',
      hint: 'Résous l\'équation 12/BC = 4/5'
    },

    // Niveau 11-15 : Calculs avancés et problèmes
    {
      question: 'Triangle ABC : AB = 18, AC = 24, BC = 30. Si AM = 12, que vaut MN (avec (MN) ∥ (BC)) ?',
      answer: '20',
      explanation: 'AM/AB = 12/18 = 2/3, donc MN/BC = 2/3, donc MN = 30 × 2/3 = 20',
      hint: 'Trouve d\'abord le rapport AM/AB'
    },
    {
      question: 'Si AM/MB = 2/3, que vaut AM/AB ?',
      answer: '0.4',
      explanation: 'Si AM/MB = 2/3, alors AM = 2k et MB = 3k, donc AB = 5k et AM/AB = 2k/5k = 2/5 = 0,4',
      hint: 'Pose AM = 2k et MB = 3k'
    },
    {
      question: 'Configuration de Thalès : les rapports valent 0,6. Si BC = 25, que vaut MN ?',
      answer: '15',
      explanation: 'MN/BC = 0,6, donc MN = BC × 0,6 = 25 × 0,6 = 15',
      hint: '0,6 = 6/10 = 3/5'
    },
    {
      question: 'Triangle ABC avec (MN) ∥ (BC). Si AM:MB = 3:2 et BC = 20, que vaut MN ?',
      answer: '12',
      explanation: 'AM:MB = 3:2 signifie AM/AB = 3/5. Donc MN/BC = 3/5, donc MN = 20 × 3/5 = 12',
      hint: 'AM:MB = 3:2 signifie AM/AB = 3/(3+2)'
    },
    {
      question: 'Si AN = 7, NC = 3, et AM/AB = AN/AC, que vaut le rapport AM/AB ?',
      answer: '0.7',
      explanation: 'AC = AN + NC = 7 + 3 = 10, donc AN/AC = 7/10 = 0,7. Par Thalès, AM/AB = 0,7',
      hint: 'Calcule d\'abord AC = AN + NC'
    }
  ]

  const checkAnswer = () => {
    const currentEx = exercises[currentExercise]
    const userAnswerNum = parseFloat(userAnswer.replace(',', '.'))
    const correctAnswerNum = parseFloat(currentEx.answer)
    
    const tolerance = Math.max(0.01, correctAnswerNum * 0.02)
    const isCorrect = Math.abs(userAnswerNum - correctAnswerNum) <= tolerance
    
    setAnswerFeedback(isCorrect ? 'correct' : 'incorrect')
    setShowAnswer(true)
    
    if (isCorrect) {
      setScore(score + 1)
    }
  }

  const nextExercise = () => {
    if (currentExercise < exercises.length - 1) {
      setCurrentExercise(currentExercise + 1)
      setUserAnswer('')
      setShowAnswer(false)
      setAnswerFeedback(null)
    }
  }

  const resetExercises = () => {
    setCurrentExercise(0)
    setUserAnswer('')
    setShowAnswer(false)
    setScore(0)
    setAnswerFeedback(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/chapitre/4eme-theoreme-thales" className="p-2 hover:bg-white/60 rounded-lg transition-colors">
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">📏 Proportionnalité et calculs</h1>
                <p className="text-gray-600">Calculer des longueurs avec le théorème de Thalès</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation par onglets */}
        <div className="flex justify-center mb-8">
          <div className="flex bg-white/70 backdrop-blur-sm rounded-2xl p-1 shadow-lg border border-white/20">
            <button
              onClick={() => setActiveTab('cours')}
              className={`px-6 py-3 rounded-xl font-bold transition-all ${
                activeTab === 'cours' 
                  ? 'bg-blue-500 text-white shadow-md' 
                  : 'text-gray-600 hover:bg-white/50'
              }`}
            >
              📚 Cours
            </button>
            <button
              onClick={() => setActiveTab('exercices')}
              className={`px-6 py-3 rounded-xl font-bold transition-all ${
                activeTab === 'exercices' 
                  ? 'bg-blue-500 text-white shadow-md' 
                  : 'text-gray-600 hover:bg-white/50'
              }`}
            >
              ✏️ Exercices ({score}/{exercises.length})
            </button>
          </div>
        </div>

        {activeTab === 'cours' ? (
          /* COURS */
          <div className="space-y-8">
            {/* Section 1: Comment trouver la longueur manquante dans un exercice */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
              <h2 className="text-2xl font-bold text-teal-800 mb-6 flex items-center">
                <span className="bg-teal-100 p-2 rounded-lg mr-3">🎯</span>
                Comment trouver la longueur manquante dans un exercice
              </h2>

              {/* Étape 1: Choix de la valeur à chercher */}
              <div className="bg-gradient-to-r from-blue-50 to-teal-50 p-6 rounded-2xl mb-6">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-teal-800 mb-4">🎯 Quelle longueur voulez-vous calculer ?</h3>
                  <div className="flex flex-wrap justify-center gap-3">
                    {['AM', 'AB', 'AN', 'AC', 'MN', 'BC'].map((target) => (
                      <button
                        key={target}
                        onClick={() => startCalculation(target)}
                        disabled={isCalculating}
                        className={`px-4 py-2 rounded-lg font-bold transition-all ${
                          searchingFor === target && isCalculating
                            ? 'bg-orange-500 text-white'
                            : 'bg-white text-teal-800 hover:bg-teal-100'
                        } border-2 border-teal-200`}
                      >
                        {target}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Animation des calculs */}
                {isCalculating && (
                  <div className="space-y-6">
                    {/* Étape 1: Les 3 égalités */}
                    <div className={`transition-all duration-500 ${calcStep >= 1 ? 'opacity-100' : 'opacity-30'}`}>
                      <h4 className="text-lg font-bold text-teal-700 mb-4 text-center">
                        📝 Étape 1 : Les 3 égalités de Thalès
                      </h4>
                      <div className="bg-white/80 p-4 rounded-lg">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                          {/* Égalité 1 */}
                          <div className={`p-4 rounded-lg transition-all duration-500 ${
                            calcStep >= 2 && (
                              (searchingFor === 'AM' && ['AB', 'AN', 'AC'].some(x => ['AB', 'AN', 'AC'].includes(x))) ||
                              (searchingFor === 'AB' && ['AM', 'AN', 'AC'].some(x => ['AM', 'AN', 'AC'].includes(x))) ||
                              (['AN', 'AC'].includes(searchingFor))
                            ) ? 'bg-green-100 border-2 border-green-400' : 'bg-gray-100'
                          }`}>
                            <div className="flex flex-col items-center text-lg font-bold text-gray-800">
                              <div className="pb-1 border-b-2 border-gray-800">AM</div>
                              <div className="pt-1">AB</div>
                            </div>
                            <div className="text-2xl font-bold text-gray-800 my-2">=</div>
                            <div className="flex flex-col items-center text-lg font-bold text-gray-800">
                              <div className="pb-1 border-b-2 border-gray-800">AN</div>
                              <div className="pt-1">AC</div>
                            </div>
                          </div>

                          {/* Égalité 2 */}
                          <div className={`p-4 rounded-lg transition-all duration-500 ${
                            calcStep >= 2 && (
                              (searchingFor === 'AM' && ['AB', 'MN', 'BC'].some(x => ['AB', 'MN', 'BC'].includes(x))) ||
                              (searchingFor === 'AB' && ['AM', 'MN', 'BC'].some(x => ['AM', 'MN', 'BC'].includes(x))) ||
                              (['MN', 'BC'].includes(searchingFor))
                            ) ? 'bg-green-100 border-2 border-green-400' : 'bg-gray-100'
                          }`}>
                            <div className="flex flex-col items-center text-lg font-bold text-gray-800">
                              <div className="pb-1 border-b-2 border-gray-800">AM</div>
                              <div className="pt-1">AB</div>
                            </div>
                            <div className="text-2xl font-bold text-gray-800 my-2">=</div>
                            <div className="flex flex-col items-center text-lg font-bold text-gray-800">
                              <div className="pb-1 border-b-2 border-gray-800">MN</div>
                              <div className="pt-1">BC</div>
                            </div>
                          </div>

                          {/* Égalité 3 */}
                          <div className={`p-4 rounded-lg transition-all duration-500 ${
                            calcStep >= 2 && (
                              (['AN', 'AC', 'MN', 'BC'].includes(searchingFor))
                            ) ? 'bg-green-100 border-2 border-green-400' : 'bg-gray-100'
                          }`}>
                            <div className="flex flex-col items-center text-lg font-bold text-gray-800">
                              <div className="pb-1 border-b-2 border-gray-800">AN</div>
                              <div className="pt-1">AC</div>
                            </div>
                            <div className="text-2xl font-bold text-gray-800 my-2">=</div>
                            <div className="flex flex-col items-center text-lg font-bold text-gray-800">
                              <div className="pb-1 border-b-2 border-gray-800">MN</div>
                              <div className="pt-1">BC</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Étape 2: Sélection des bonnes égalités */}
                    {calcStep >= 2 && (
                      <div className="bg-yellow-50 p-6 rounded-lg border-2 border-yellow-300">
                        <h4 className="text-lg font-bold text-yellow-800 mb-4 text-center">
                          ✅ Étape 2 : Je choisis les 2 égalités qui contiennent {searchingFor}
                        </h4>
                        <p className="text-center text-yellow-700">
                          Les égalités surlignées en vert sont celles qui nous servent pour calculer <strong>{searchingFor}</strong>
                        </p>
                      </div>
                    )}

                    {/* Étape 3: Calcul */}
                    {calcStep >= 3 && (
                      <div className="bg-blue-50 p-6 rounded-lg border-2 border-blue-300">
                        <h4 className="text-lg font-bold text-blue-800 mb-4 text-center">
                          🧮 Étape 3 : Je fais le calcul
                        </h4>
                        <div className="text-center">
                          <div className="bg-white p-4 rounded-lg inline-block">
                            <div className="text-lg">
                              {searchingFor === 'AM' && (
                                <div>
                                  <span className="text-orange-600 font-bold">{searchingFor}</span> = AB × AN ÷ AC<br/>
                                  <span className="text-orange-600 font-bold">{searchingFor}</span> = 8 × 6 ÷ 12 = <span className="text-green-600 font-bold">4 cm</span>
                                </div>
                              )}
                              {searchingFor === 'AB' && (
                                <div>
                                  <span className="text-orange-600 font-bold">{searchingFor}</span> = AM × AC ÷ AN<br/>
                                  <span className="text-orange-600 font-bold">{searchingFor}</span> = 4 × 12 ÷ 6 = <span className="text-green-600 font-bold">8 cm</span>
                                </div>
                              )}
                              {searchingFor === 'AN' && (
                                <div>
                                  <span className="text-orange-600 font-bold">{searchingFor}</span> = AM × AC ÷ AB<br/>
                                  <span className="text-orange-600 font-bold">{searchingFor}</span> = 4 × 12 ÷ 8 = <span className="text-green-600 font-bold">6 cm</span>
                                </div>
                              )}
                              {searchingFor === 'AC' && (
                                <div>
                                  <span className="text-orange-600 font-bold">{searchingFor}</span> = AB × AN ÷ AM<br/>
                                  <span className="text-orange-600 font-bold">{searchingFor}</span> = 8 × 6 ÷ 4 = <span className="text-green-600 font-bold">12 cm</span>
                                </div>
                              )}
                              {searchingFor === 'MN' && (
                                <div>
                                  <span className="text-orange-600 font-bold">{searchingFor}</span> = AM × BC ÷ AB<br/>
                                  <span className="text-orange-600 font-bold">{searchingFor}</span> = 4 × 9 ÷ 8 = <span className="text-green-600 font-bold">4,5 cm</span>
                                </div>
                              )}
                              {searchingFor === 'BC' && (
                                <div>
                                  <span className="text-orange-600 font-bold">{searchingFor}</span> = AB × MN ÷ AM<br/>
                                  <span className="text-orange-600 font-bold">{searchingFor}</span> = 8 × 4,5 ÷ 4 = <span className="text-green-600 font-bold">9 cm</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Étape 4: Résultat */}
                    {calcStep >= 4 && (
                      <div className="bg-green-50 p-6 rounded-lg border-2 border-green-400 text-center">
                        <h4 className="text-xl font-bold text-green-800 mb-2">
                          🎉 Résultat final
                        </h4>
                        <div className="text-2xl font-bold text-green-600">
                          {searchingFor} = {
                            searchingFor === 'AM' ? '4 cm' :
                            searchingFor === 'AB' ? '8 cm' :
                            searchingFor === 'AN' ? '6 cm' :
                            searchingFor === 'AC' ? '12 cm' :
                            searchingFor === 'MN' ? '4,5 cm' :
                            '9 cm'
                          }
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Bouton Reset */}
                {!isCalculating && calcStep === 0 && (
                  <div className="text-center">
                    <p className="text-gray-600 italic">👆 Cliquez sur une longueur pour voir comment la calculer</p>
                  </div>
                )}
              </div>

              {/* Règle générale */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-2xl">
                <h3 className="text-xl font-bold text-purple-800 mb-4 text-center">💡 Règle à retenir</h3>
                <div className="bg-white/80 p-4 rounded-lg text-center">
                  <p className="text-purple-700 font-medium">
                    Pour calculer une longueur avec Thalès :<br/>
                    <span className="font-bold">1️⃣</span> Je choisis <strong>2 égalités parmi les 3</strong> qui contiennent ma longueur inconnue<br/>
                    <span className="font-bold">2️⃣</span> Si elle est <strong>en haut</strong> : je multiplie en croix et je divise<br/>
                    <span className="font-bold">3️⃣</span> Si elle est <strong>en bas</strong> : je multiplie en croix et je divise
                  </p>
                </div>
              </div>
            </div>

            {/* Section 2: Méthode pas à pas */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
              <h2 className="text-2xl font-bold text-teal-800 mb-6 flex items-center">
                <span className="bg-teal-100 p-2 rounded-lg mr-3">🎯</span>
                Méthode de résolution étape par étape
              </h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-bold text-teal-800 mb-4">Les étapes à suivre</h3>
                  <div className="space-y-4">
                    <div className="bg-teal-50 p-4 rounded-lg">
                      <div className="flex items-center mb-2">
                        <span className="bg-teal-200 text-teal-800 text-sm font-bold rounded-full w-6 h-6 flex items-center justify-center mr-3">1</span>
                        <h4 className="font-bold text-teal-800">Vérifier la configuration</h4>
                      </div>
                      <p className="text-teal-700 ml-9">S'assurer qu'on a bien (MN) ∥ (BC)</p>
                    </div>
                    <div className="bg-cyan-50 p-4 rounded-lg">
                      <div className="flex items-center mb-2">
                        <span className="bg-cyan-200 text-cyan-800 text-sm font-bold rounded-full w-6 h-6 flex items-center justify-center mr-3">2</span>
                        <h4 className="font-bold text-cyan-800">Identifier les longueurs</h4>
                      </div>
                      <p className="text-cyan-700 ml-9">Lister ce qu'on connaît et ce qu'on cherche</p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="flex items-center mb-2">
                        <span className="bg-blue-200 text-blue-800 text-sm font-bold rounded-full w-6 h-6 flex items-center justify-center mr-3">3</span>
                        <h4 className="font-bold text-blue-800">Choisir l'égalité</h4>
                      </div>
                      <p className="text-blue-700 ml-9">Sélectionner la bonne partie de AM/AB = AN/AC = MN/BC</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="flex items-center mb-2">
                        <span className="bg-green-200 text-green-800 text-sm font-bold rounded-full w-6 h-6 flex items-center justify-center mr-3">4</span>
                        <h4 className="font-bold text-green-800">Résoudre</h4>
                      </div>
                      <p className="text-green-700 ml-9">Remplacer les valeurs et calculer l'inconnue</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col justify-center">
                  <div className="bg-gradient-to-br from-teal-100 to-green-100 p-6 rounded-2xl">
                    <h3 className="text-lg font-bold text-teal-800 mb-4 text-center">Exemple détaillé</h3>
                    <div className="space-y-3">
                      <div className="bg-white p-3 rounded-lg">
                        <span className="text-sm text-gray-600">Configuration :</span>
                        <span className="ml-2">Triangle ABC, (MN) ∥ (BC)</span>
                      </div>
                      <div className="bg-white p-3 rounded-lg">
                        <span className="text-sm text-gray-600">Connu :</span>
                        <span className="ml-2">AM = 4, MB = 2, AN = 6</span>
                      </div>
                      <div className="bg-white p-3 rounded-lg">
                        <span className="text-sm text-gray-600">Déduction :</span>
                        <span className="ml-2">AB = AM + MB = 6</span>
                      </div>
                      <div className="bg-white p-3 rounded-lg">
                        <span className="text-sm text-gray-600">Égalité :</span>
                        <span className="ml-2">AM/AB = AN/AC</span>
                      </div>
                      <div className="bg-white p-3 rounded-lg">
                        <span className="text-sm text-gray-600">Substitution :</span>
                        <span className="ml-2">4/6 = 6/AC</span>
                      </div>
                      <div className="bg-teal-50 p-3 rounded-lg">
                        <span className="text-sm text-gray-600">Solution :</span>
                        <span className="font-bold text-teal-600 ml-2">AC = 9</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>


          </div>
        ) : (
          /* EXERCICES */
          <div className="space-y-8">
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  📏 Exercice {currentExercise + 1} sur {exercises.length}
                </h2>
                <div className="flex items-center space-x-4">
                  <div className="text-lg font-bold text-blue-600">
                    Score : {score}/{exercises.length}
                  </div>
                  <button onClick={resetExercises} className="bg-gray-500 text-white px-4 py-2 rounded-lg">
                    <RotateCcw className="inline w-4 h-4 mr-2" />
                    Recommencer
                  </button>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-2xl mb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  {exercises[currentExercise].question}
                </h3>
                
                <div className="space-y-4">
                  <input
                    type="text"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    placeholder="Votre réponse (nombre)..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  <VoiceInput onTranscript={(transcript) => setUserAnswer(transcript)} />
                  
                  {!showAnswer && (
                    <button
                      onClick={checkAnswer}
                      disabled={!userAnswer.trim()}
                      className="bg-blue-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-600 disabled:opacity-50"
                    >
                      Vérifier
                    </button>
                  )}
                </div>
              </div>
              
              {showAnswer && (
                <div className={`p-6 rounded-2xl mb-6 ${answerFeedback === 'correct' ? 'bg-green-50 border-2 border-green-200' : 'bg-red-50 border-2 border-red-200'}`}>
                  <div className="flex items-center mb-4">
                    {answerFeedback === 'correct' ? 
                      <CheckCircle className="w-6 h-6 text-green-600 mr-2" /> : 
                      <XCircle className="w-6 h-6 text-red-600 mr-2" />
                    }
                    <span className={`font-bold ${answerFeedback === 'correct' ? 'text-green-800' : 'text-red-800'}`}>
                      {answerFeedback === 'correct' ? 'Correct !' : 'Incorrect'}
                    </span>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <span className="font-semibold text-gray-700">Réponse : </span>
                      <span className="text-blue-600 font-bold">{exercises[currentExercise].answer}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-700">Explication : </span>
                      <span className="text-gray-800">{exercises[currentExercise].explanation}</span>
                    </div>
                    <div className="flex items-center text-amber-600">
                      <Lightbulb className="w-4 h-4 mr-2" />
                      <span className="text-sm">{exercises[currentExercise].hint}</span>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="flex justify-between mt-6">
                <button
                  onClick={() => {
                    if (currentExercise > 0) {
                      setCurrentExercise(currentExercise - 1)
                      setUserAnswer('')
                      setShowAnswer(false)
                      setAnswerFeedback(null)
                    }
                  }}
                  disabled={currentExercise === 0}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg disabled:opacity-50"
                >
                  ← Précédent
                </button>
                
                <button
                  onClick={nextExercise}
                  disabled={currentExercise === exercises.length - 1}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg disabled:opacity-50"
                >
                  Suivant →
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 