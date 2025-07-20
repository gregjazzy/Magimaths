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
            {/* Section 1: Les calculs avec Thalès */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
              <h2 className="text-2xl font-bold text-blue-800 mb-6 flex items-center">
                <span className="bg-blue-100 p-2 rounded-lg mr-3">🧮</span>
                Comment calculer avec Thalès ?
              </h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-bold text-blue-800 mb-4">Les trois égalités</h3>
                  <div className="space-y-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-bold text-blue-800 mb-2">Formule de base</h4>
                      <div className="text-center text-lg font-bold text-blue-600">
                        AM/AB = AN/AC = MN/BC
                      </div>
                    </div>
                    <div className="bg-cyan-50 p-4 rounded-lg">
                      <h4 className="font-bold text-cyan-800 mb-2">Ce qu'on peut calculer</h4>
                      <ul className="text-cyan-700 space-y-1">
                        <li>• Une longueur manquante</li>
                        <li>• Un rapport de proportionnalité</li>
                        <li>• Vérifier une configuration</li>
                      </ul>
                    </div>
                    <div className="bg-teal-50 p-4 rounded-lg">
                      <h4 className="font-bold text-teal-800 mb-2">Méthode générale</h4>
                      <ol className="text-teal-700 space-y-1">
                        <li>1. Identifier la configuration</li>
                        <li>2. Écrire l'égalité utile</li>
                        <li>3. Remplacer les valeurs</li>
                        <li>4. Résoudre l'équation</li>
                      </ol>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col justify-center">
                  <div className="bg-gradient-to-br from-blue-100 to-cyan-100 p-6 rounded-2xl">
                    <h3 className="text-lg font-bold text-blue-800 mb-4 text-center">Exemple concret</h3>
                    <div className="space-y-3">
                      <div className="bg-white p-3 rounded-lg">
                        <span className="text-sm text-gray-600">Données :</span>
                        <span className="ml-2">AM = 6, AB = 9, AN = 8</span>
                      </div>
                      <div className="bg-white p-3 rounded-lg">
                        <span className="text-sm text-gray-600">Cherché :</span>
                        <span className="ml-2">AC = ?</span>
                      </div>
                      <div className="bg-white p-3 rounded-lg">
                        <span className="text-sm text-gray-600">Égalité :</span>
                        <span className="ml-2">AM/AB = AN/AC</span>
                      </div>
                      <div className="bg-white p-3 rounded-lg">
                        <span className="text-sm text-gray-600">Calcul :</span>
                        <span className="ml-2">6/9 = 8/AC</span>
                      </div>
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <span className="text-sm text-gray-600">Résultat :</span>
                        <span className="font-bold text-blue-600 ml-2">AC = 12</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Types de calculs */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
              <h2 className="text-2xl font-bold text-cyan-800 mb-6 flex items-center">
                <span className="bg-cyan-100 p-2 rounded-lg mr-3">📐</span>
                Types de calculs possibles
              </h2>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-blue-100 to-cyan-100 p-6 rounded-2xl">
                  <h3 className="text-lg font-bold text-blue-800 mb-3">Type 1 : Longueur sur un côté</h3>
                  <div className="space-y-2 text-sm">
                    <div className="bg-white p-3 rounded-lg">
                      <div className="font-bold text-blue-700">Connu :</div>
                      <div>AM, AB, AN</div>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <div className="font-bold text-blue-700">Cherché :</div>
                      <div>AC</div>
                    </div>
                    <div className="bg-cyan-50 p-3 rounded-lg">
                      <div className="font-bold text-cyan-700">Formule :</div>
                      <div>AM/AB = AN/AC</div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-cyan-100 to-teal-100 p-6 rounded-2xl">
                  <h3 className="text-lg font-bold text-cyan-800 mb-3">Type 2 : Longueur parallèle</h3>
                  <div className="space-y-2 text-sm">
                    <div className="bg-white p-3 rounded-lg">
                      <div className="font-bold text-cyan-700">Connu :</div>
                      <div>AM, AB, BC</div>
                    </div>
                    <div className="bg-cyan-50 p-3 rounded-lg">
                      <div className="font-bold text-cyan-700">Cherché :</div>
                      <div>MN</div>
                    </div>
                    <div className="bg-teal-50 p-3 rounded-lg">
                      <div className="font-bold text-teal-700">Formule :</div>
                      <div>AM/AB = MN/BC</div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-teal-100 to-green-100 p-6 rounded-2xl">
                  <h3 className="text-lg font-bold text-teal-800 mb-3">Type 3 : Rapport vérifié</h3>
                  <div className="space-y-2 text-sm">
                    <div className="bg-white p-3 rounded-lg">
                      <div className="font-bold text-teal-700">Connu :</div>
                      <div>Toutes les longueurs</div>
                    </div>
                    <div className="bg-teal-50 p-3 rounded-lg">
                      <div className="font-bold text-teal-700">Cherché :</div>
                      <div>Vérification</div>
                    </div>
                    <div className="bg-green-50 p-3 rounded-lg">
                      <div className="font-bold text-green-700">Test :</div>
                      <div>AM/AB = AN/AC ?</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3: Méthode pas à pas */}
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

            {/* Section 4: Conseils et astuces */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
              <h2 className="text-2xl font-bold text-green-800 mb-6 flex items-center">
                <span className="bg-green-100 p-2 rounded-lg mr-3">💡</span>
                Conseils et astuces
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-bold text-green-800 mb-2">✅ Bonnes pratiques</h4>
                    <ul className="text-green-700 space-y-1 text-sm">
                      <li>• Toujours vérifier la configuration parallèle</li>
                      <li>• Faire un schéma avec les points nommés</li>
                      <li>• Calculer AB = AM + MB si nécessaire</li>
                      <li>• Vérifier le résultat par un autre rapport</li>
                    </ul>
                  </div>
                  
                  <div className="bg-amber-50 p-4 rounded-lg">
                    <h4 className="font-bold text-amber-800 mb-2">⚠️ Pièges à éviter</h4>
                    <ul className="text-amber-700 space-y-1 text-sm">
                      <li>• Confondre AM et MB</li>
                      <li>• Oublier de vérifier le parallélisme</li>
                      <li>• Inverser les rapports</li>
                      <li>• Ne pas simplifier les fractions</li>
                    </ul>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-green-100 to-emerald-100 p-6 rounded-2xl">
                  <h3 className="text-lg font-bold text-green-800 mb-4">Raccourcis utiles</h3>
                  <div className="space-y-3">
                    <div className="bg-white p-3 rounded-lg">
                      <div className="font-bold text-green-700">Rapport 1/2 :</div>
                      <div className="text-sm text-green-600">M est le milieu de [AB]</div>
                    </div>
                    <div className="bg-white p-3 rounded-lg">
                      <div className="font-bold text-green-700">Rapport 1/3 :</div>
                      <div className="text-sm text-green-600">M est au tiers de [AB]</div>
                    </div>
                    <div className="bg-white p-3 rounded-lg">
                      <div className="font-bold text-green-700">Rapport 2/3 :</div>
                      <div className="text-sm text-green-600">M est aux 2/3 de [AB]</div>
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