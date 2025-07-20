'use client'

import { useState } from 'react'
import { ArrowLeft, BookOpen, Target, Play, RotateCcw, CheckCircle, XCircle, Lightbulb, Calculator } from 'lucide-react'
import Link from 'next/link'
import { VoiceInput } from '../../../components/VoiceInput'

export default function PythagoreCalculsDirectsPage() {
  const [activeTab, setActiveTab] = useState<'cours' | 'exercices'>('cours')
  const [currentExercise, setCurrentExercise] = useState(0)
  const [userAnswer, setUserAnswer] = useState('')
  const [showAnswer, setShowAnswer] = useState(false)
  const [score, setScore] = useState(0)
  const [answerFeedback, setAnswerFeedback] = useState<'correct' | 'incorrect' | null>(null)
  
  const exercises = [
    // Niveau 1-5 : Calculs simples avec nombres entiers
    {
      question: 'Dans un triangle rectangle de côtés 3 et 4, que vaut l\'hypoténuse ?',
      answer: '5',
      explanation: 'h² = 3² + 4² = 9 + 16 = 25, donc h = √25 = 5',
      hint: 'Utilise la formule a² + b² = c²'
    },
    {
      question: 'Si les côtés de l\'angle droit mesurent 5 et 12, que vaut l\'hypoténuse ?',
      answer: '13',
      explanation: 'h² = 5² + 12² = 25 + 144 = 169, donc h = √169 = 13',
      hint: 'C\'est un triplet pythagoricien classique'
    },
    {
      question: 'Dans un triangle rectangle de côtés 8 et 15, que vaut l\'hypoténuse ?',
      answer: '17',
      explanation: 'h² = 8² + 15² = 64 + 225 = 289, donc h = √289 = 17',
      hint: 'Autre triplet pythagoricien connu'
    },
    {
      question: 'Un triangle rectangle a des côtés de 9 et 12. Que vaut l\'hypoténuse ?',
      answer: '15',
      explanation: 'h² = 9² + 12² = 81 + 144 = 225, donc h = √225 = 15',
      hint: 'Multiple du triplet 3-4-5'
    },
    {
      question: 'Si a = 7 et b = 24, que vaut c dans un triangle rectangle ?',
      answer: '25',
      explanation: 'c² = 7² + 24² = 49 + 576 = 625, donc c = √625 = 25',
      hint: 'Calcule les carrés puis la racine'
    },

    // Niveau 6-10 : Calculs avec décimaux simples
    {
      question: 'Dans un triangle rectangle de côtés 1 et 1, que vaut l\'hypoténuse ? (arrondi à 3 décimales)',
      answer: '1.414',
      explanation: 'h² = 1² + 1² = 2, donc h = √2 ≈ 1,414',
      hint: 'C\'est la racine de 2'
    },
    {
      question: 'Si les côtés sont 2 et 3, que vaut l\'hypoténuse ? (arrondi à 2 décimales)',
      answer: '3.61',
      explanation: 'h² = 2² + 3² = 4 + 9 = 13, donc h = √13 ≈ 3,61',
      hint: 'Calcule √13'
    },
    {
      question: 'Triangle rectangle de côtés 1 et 2. Hypoténuse ? (arrondi à 3 décimales)',
      answer: '2.236',
      explanation: 'h² = 1² + 2² = 1 + 4 = 5, donc h = √5 ≈ 2,236',
      hint: 'C\'est √5'
    },
    {
      question: 'Côtés 4 et 5, hypoténuse ? (arrondi à 2 décimales)',
      answer: '6.40',
      explanation: 'h² = 4² + 5² = 16 + 25 = 41, donc h = √41 ≈ 6,40',
      hint: 'Calcule √41'
    },
    {
      question: 'Triangle rectangle : a = 3, b = 5. Que vaut c ? (arrondi à 2 décimales)',
      answer: '5.83',
      explanation: 'c² = 3² + 5² = 9 + 25 = 34, donc c = √34 ≈ 5,83',
      hint: 'Il faut calculer √34'
    },

    // Niveau 11-15 : Applications géométriques
    {
      question: 'Diagonale d\'un carré de côté 6 ? (arrondi à 2 décimales)',
      answer: '8.49',
      explanation: 'Dans un carré, d² = 6² + 6² = 72, donc d = √72 = 6√2 ≈ 8,49',
      hint: 'La diagonale forme un triangle rectangle isocèle'
    },
    {
      question: 'Rectangle de dimensions 5 × 12. Longueur de la diagonale ?',
      answer: '13',
      explanation: 'd² = 5² + 12² = 25 + 144 = 169, donc d = 13',
      hint: 'C\'est un triplet pythagoricien'
    },
    {
      question: 'Carré de côté 8. Que vaut sa diagonale ? (arrondi à 1 décimale)',
      answer: '11.3',
      explanation: 'd² = 8² + 8² = 128, donc d = √128 = 8√2 ≈ 11,3',
      hint: 'Diagonale = côté × √2'
    },
    {
      question: 'Rectangle 9 × 40. Diagonale ?',
      answer: '41',
      explanation: 'd² = 9² + 40² = 81 + 1600 = 1681, donc d = √1681 = 41',
      hint: 'Vérifie si c\'est un triplet pythagoricien'
    },
    {
      question: 'Carré de côté 5. Diagonale ? (forme exacte)',
      answer: '5√2',
      explanation: 'd² = 5² + 5² = 50, donc d = √50 = √(25×2) = 5√2',
      hint: 'Garde la forme avec √2'
    },

    // Niveau 16-20 : Problèmes plus complexes
    {
      question: 'Dans un triangle isocèle rectangle, si l\'hypoténuse mesure 10, que valent les côtés égaux ?',
      answer: '5√2',
      explanation: 'Si les côtés égaux valent a, alors a² + a² = 10², donc 2a² = 100, donc a² = 50, donc a = √50 = 5√2',
      hint: 'Les deux côtés sont égaux dans un triangle isocèle rectangle'
    },
    {
      question: 'Triangle rectangle : hypoténuse = 26, un côté = 10. Autre côté ?',
      answer: '24',
      explanation: 'a² + 10² = 26², donc a² = 676 - 100 = 576, donc a = √576 = 24',
      hint: 'C\'est le calcul inverse du théorème'
    },
    {
      question: 'Cube d\'arête 3. Diagonale de l\'espace ? (arrondi à 2 décimales)',
      answer: '5.20',
      explanation: 'La diagonale de l\'espace = √(3² + 3² + 3²) = √27 = 3√3 ≈ 5,20',
      hint: 'Utilise la formule en 3D : √(a² + b² + c²)'
    },
    {
      question: 'Rectangle de périmètre 14 et de côtés dans le rapport 3:4. Diagonale ?',
      answer: '5',
      explanation: 'Si les côtés sont 3k et 4k, périmètre = 2(3k + 4k) = 14k = 14, donc k = 1. Côtés : 3 et 4. Diagonale = 5.',
      hint: 'Trouve d\'abord les dimensions du rectangle'
    },
    {
      question: 'Triangle rectangle inscrit dans un cercle de rayon 5. Que vaut l\'hypoténuse ?',
      answer: '10',
      explanation: 'Dans un triangle rectangle inscrit dans un cercle, l\'hypoténuse est un diamètre du cercle, donc 2 × 5 = 10.',
      hint: 'L\'hypoténuse est le diamètre du cercle circonscrit'
    }
  ]

  const checkAnswer = () => {
    const currentEx = exercises[currentExercise]
    const userAnswerNum = parseFloat(userAnswer.replace(',', '.').replace('√', 'sqrt'))
    const correctAnswerNum = parseFloat(currentEx.answer.replace('√', 'sqrt'))
    
    // Vérification pour les réponses numériques
    if (!isNaN(userAnswerNum) && !isNaN(correctAnswerNum)) {
      const tolerance = Math.max(0.01, correctAnswerNum * 0.02)
      const isCorrect = Math.abs(userAnswerNum - correctAnswerNum) <= tolerance
      setAnswerFeedback(isCorrect ? 'correct' : 'incorrect')
    } else {
      // Vérification pour les réponses textuelles (comme 5√2)
      const userClean = userAnswer.toLowerCase().trim().replace(/\s/g, '')
      const correctClean = currentEx.answer.toLowerCase().trim().replace(/\s/g, '')
      const isCorrect = userClean === correctClean || userClean.includes(correctClean)
      setAnswerFeedback(isCorrect ? 'correct' : 'incorrect')
    }
    
    setShowAnswer(true)
    
    if (answerFeedback === 'correct') {
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

  const resetExercise = () => {
    setCurrentExercise(0)
    setUserAnswer('')
    setShowAnswer(false)
    setScore(0)
    setAnswerFeedback(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-cyan-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/chapitre/4eme-theoreme-pythagore" className="p-2 hover:bg-white/60 rounded-lg transition-colors">
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">📏 Calculs directs</h1>
                <p className="text-gray-600">Calculer l'hypoténuse d'un triangle rectangle</p>
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
                  ? 'bg-green-500 text-white shadow-md' 
                  : 'text-gray-600 hover:bg-white/50'
              }`}
            >
              📚 Cours
            </button>
            <button
              onClick={() => setActiveTab('exercices')}
              className={`px-6 py-3 rounded-xl font-bold transition-all ${
                activeTab === 'exercices' 
                  ? 'bg-green-500 text-white shadow-md' 
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
            {/* Section 1: Méthode pour calculer l'hypoténuse */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
              <h2 className="text-2xl font-bold text-green-800 mb-6 flex items-center">
                <span className="bg-green-100 p-2 rounded-lg mr-3">📏</span>
                Calculer l'hypoténuse : méthode
              </h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-bold text-green-800 mb-4">Étapes de calcul</h3>
                  <div className="space-y-4">
                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="flex items-center mb-2">
                        <span className="bg-green-200 text-green-800 text-sm font-bold rounded-full w-6 h-6 flex items-center justify-center mr-3">1</span>
                        <h4 className="font-bold text-green-800">Identifier les côtés</h4>
                      </div>
                      <p className="text-green-700 ml-9">Repérer les côtés de l'angle droit (a et b) et l'hypoténuse (c)</p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="flex items-center mb-2">
                        <span className="bg-blue-200 text-blue-800 text-sm font-bold rounded-full w-6 h-6 flex items-center justify-center mr-3">2</span>
                        <h4 className="font-bold text-blue-800">Appliquer la formule</h4>
                      </div>
                      <p className="text-blue-700 ml-9">c² = a² + b²</p>
                    </div>
                    <div className="bg-cyan-50 p-4 rounded-lg">
                      <div className="flex items-center mb-2">
                        <span className="bg-cyan-200 text-cyan-800 text-sm font-bold rounded-full w-6 h-6 flex items-center justify-center mr-3">3</span>
                        <h4 className="font-bold text-cyan-800">Calculer</h4>
                      </div>
                      <p className="text-cyan-700 ml-9">c = √(a² + b²)</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col justify-center">
                  <div className="bg-gradient-to-br from-green-100 to-blue-100 p-6 rounded-2xl">
                    <h3 className="text-lg font-bold text-green-800 mb-4 text-center">Exemple</h3>
                    <div className="space-y-3">
                      <div className="bg-white p-3 rounded-lg">
                        <span className="text-sm text-gray-600">Données :</span>
                        <span className="font-bold ml-2">a = 3, b = 4</span>
                      </div>
                      <div className="bg-white p-3 rounded-lg">
                        <span className="text-sm text-gray-600">Calcul :</span>
                        <span className="font-bold ml-2">c² = 3² + 4² = 9 + 16 = 25</span>
                      </div>
                      <div className="bg-green-50 p-3 rounded-lg">
                        <span className="text-sm text-gray-600">Résultat :</span>
                        <span className="font-bold text-green-600 ml-2">c = √25 = 5</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Cas particuliers */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
              <h2 className="text-2xl font-bold text-blue-800 mb-6 flex items-center">
                <span className="bg-blue-100 p-2 rounded-lg mr-3">🔢</span>
                Cas particuliers importants
              </h2>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-blue-100 to-cyan-100 p-6 rounded-2xl">
                  <h3 className="text-lg font-bold text-blue-800 mb-3">Triangle isocèle rectangle</h3>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600 mb-2">a = b</div>
                    <div className="text-lg text-blue-700">c = a√2</div>
                    <div className="text-sm text-gray-600 mt-2">Les côtés de l'angle droit sont égaux</div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-green-100 to-emerald-100 p-6 rounded-2xl">
                  <h3 className="text-lg font-bold text-green-800 mb-3">Carré</h3>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600 mb-2">côté = a</div>
                    <div className="text-lg text-green-700">diagonale = a√2</div>
                    <div className="text-sm text-gray-600 mt-2">La diagonale d'un carré</div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-purple-100 to-pink-100 p-6 rounded-2xl">
                  <h3 className="text-lg font-bold text-purple-800 mb-3">Triplets pythagoriciens</h3>
                  <div className="text-center space-y-1">
                    <div className="text-sm text-purple-700">(3, 4, 5)</div>
                    <div className="text-sm text-purple-700">(5, 12, 13)</div>
                    <div className="text-sm text-purple-700">(8, 15, 17)</div>
                    <div className="text-xs text-gray-600 mt-2">Triangles à côtés entiers</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3: Utilisation de la calculatrice */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
              <h2 className="text-2xl font-bold text-cyan-800 mb-6 flex items-center">
                <span className="bg-cyan-100 p-2 rounded-lg mr-3">🧮</span>
                Utilisation de la calculatrice
              </h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-bold text-cyan-800 mb-4">Séquence de touches</h3>
                  <div className="space-y-4">
                    <div className="bg-cyan-50 p-4 rounded-lg">
                      <h4 className="font-bold text-cyan-800 mb-2">Pour calculer √(a² + b²)</h4>
                      <div className="font-mono bg-white p-2 rounded text-sm">
                        ( a x² + b x² ) √
                      </div>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-bold text-blue-800 mb-2">Exemple : √(3² + 4²)</h4>
                      <div className="font-mono bg-white p-2 rounded text-sm">
                        ( 3 x² + 4 x² ) √ = 5
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xl font-bold text-cyan-800 mb-4">Conseils pratiques</h3>
                  <div className="space-y-3">
                    <div className="bg-yellow-50 p-3 rounded-lg">
                      <span className="text-yellow-800 font-semibold">💡 Astuce :</span>
                      <span className="text-yellow-700 ml-2">Utilise les parenthèses pour éviter les erreurs</span>
                    </div>
                    <div className="bg-orange-50 p-3 rounded-lg">
                      <span className="text-orange-800 font-semibold">⚠️ Attention :</span>
                      <span className="text-orange-700 ml-2">N'oublie pas de prendre la racine carrée</span>
                    </div>
                    <div className="bg-green-50 p-3 rounded-lg">
                      <span className="text-green-800 font-semibold">✓ Vérification :</span>
                      <span className="text-green-700 ml-2">Le résultat doit être plus grand que chaque côté</span>
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
                <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                  <span className="bg-green-100 p-2 rounded-lg mr-3">📏</span>
                  Exercice {currentExercise + 1} sur {exercises.length}
                </h2>
                <div className="flex items-center space-x-4">
                  <div className="text-lg font-bold text-green-600">
                    Score : {score}/{exercises.length}
                  </div>
                  <button
                    onClick={resetExercise}
                    className="bg-gray-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-gray-600 transition-colors"
                  >
                    <RotateCcw className="inline w-4 h-4 mr-2" />
                    Recommencer
                  </button>
                </div>
              </div>
              
              <div className="mb-8">
                <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-2xl mb-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">
                    {exercises[currentExercise].question}
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="flex flex-col space-y-2">
                      <input
                        type="text"
                        value={userAnswer}
                        onChange={(e) => setUserAnswer(e.target.value)}
                        placeholder="Votre réponse..."
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      />
                      <VoiceInput 
                        onTranscript={(transcript) => setUserAnswer(transcript)}
                        className="w-full"
                      />
                    </div>
                    
                    {!showAnswer && (
                      <button
                        onClick={checkAnswer}
                        disabled={!userAnswer.trim()}
                        className="bg-green-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Vérifier ma réponse
                      </button>
                    )}
                  </div>
                </div>
                
                {showAnswer && (
                  <div className={`p-6 rounded-2xl mb-6 ${answerFeedback === 'correct' ? 'bg-green-50 border-2 border-green-200' : 'bg-red-50 border-2 border-red-200'}`}>
                    <div className="flex items-center mb-4">
                      {answerFeedback === 'correct' ? (
                        <CheckCircle className="w-6 h-6 text-green-600 mr-2" />
                      ) : (
                        <XCircle className="w-6 h-6 text-red-600 mr-2" />
                      )}
                      <span className={`font-bold ${answerFeedback === 'correct' ? 'text-green-800' : 'text-red-800'}`}>
                        {answerFeedback === 'correct' ? 'Correct !' : 'Incorrect'}
                      </span>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <span className="font-semibold text-gray-700">Réponse correcte : </span>
                        <span className="text-blue-600 font-bold">{exercises[currentExercise].answer}</span>
                      </div>
                      <div>
                        <span className="font-semibold text-gray-700">Explication : </span>
                        <span className="text-gray-800">{exercises[currentExercise].explanation}</span>
                      </div>
                    </div>
                  </div>
                )}
                
                {exercises[currentExercise].hint && !showAnswer && (
                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                    <div className="flex items-center">
                      <Lightbulb className="w-5 h-5 text-yellow-600 mr-2" />
                      <span className="font-semibold text-yellow-800">Indice : </span>
                      <span className="text-yellow-700">{exercises[currentExercise].hint}</span>
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
                    className="bg-gray-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-gray-600 disabled:opacity-50 transition-colors"
                  >
                    ← Précédent
                  </button>
                  
                  <button
                    onClick={nextExercise}
                    disabled={currentExercise === exercises.length - 1}
                    className="bg-green-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-green-600 disabled:opacity-50 transition-colors"
                  >
                    Suivant →
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 