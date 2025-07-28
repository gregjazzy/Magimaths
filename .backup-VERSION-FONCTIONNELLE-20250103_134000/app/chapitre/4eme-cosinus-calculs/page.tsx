'use client'

import { useState } from 'react'
import { ArrowLeft, BookOpen, Target, Play, RotateCcw, CheckCircle, XCircle, Lightbulb, Calculator } from 'lucide-react'
import Link from 'next/link'
import { VoiceInput } from '../../../components/VoiceInput'

export default function CosinusCalculsPage() {
  const [activeTab, setActiveTab] = useState<'cours' | 'exercices'>('cours')
  const [currentExercise, setCurrentExercise] = useState(0)
  const [userAnswer, setUserAnswer] = useState('')
  const [showAnswer, setShowAnswer] = useState(false)
  const [score, setScore] = useState(0)
  const [answerFeedback, setAnswerFeedback] = useState<'correct' | 'incorrect' | null>(null)
  
  // États pour les animations
  const [currentAnimation, setCurrentAnimation] = useState(0)
  const [animationStep, setAnimationStep] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  const exercises = [
    // Niveau 1-5 : Valeurs remarquables simples
    {
      question: 'Que vaut cos(60°) ?',
      answer: '0.5',
      explanation: 'cos(60°) = 1/2 = 0,5. C\'est une valeur remarquable importante à retenir.',
      hint: 'C\'est égal à 1/2'
    },
    {
      question: 'Que vaut cos(45°) ? (arrondi à 3 décimales)',
      answer: '0.707',
      explanation: 'cos(45°) = √2/2 ≈ 0,707',
      hint: 'C\'est √2/2'
    },
    {
      question: 'Que vaut cos(30°) ? (arrondi à 3 décimales)',
      answer: '0.866',
      explanation: 'cos(30°) = √3/2 ≈ 0,866',
      hint: 'C\'est √3/2'
    },
    {
      question: 'Que vaut cos(0°) ?',
      answer: '1',
      explanation: 'cos(0°) = 1. Quand l\'angle est nul, le côté adjacent coïncide avec l\'hypoténuse.',
      hint: 'L\'angle est nul, que devient le triangle ?'
    },
    {
      question: 'Que vaut cos(90°) ?',
      answer: '0',
      explanation: 'cos(90°) = 0. Dans un triangle rectangle, il n\'y a pas de côté adjacent à l\'angle droit.',
      hint: 'Il n\'y a pas de côté adjacent à un angle droit'
    },

    // Niveau 6-10 : Calculs avec la calculatrice
    {
      question: 'Avec une calculatrice, que vaut cos(25°) ? (arrondi à 3 décimales)',
      answer: '0.906',
      explanation: 'cos(25°) ≈ 0,906',
      hint: 'Utilise ta calculatrice en mode degrés'
    },
    {
      question: 'Si cos(α) = 0,8, quelle est la valeur approximative de α ? (au degré près)',
      answer: '37',
      explanation: 'Si cos(α) = 0,8, alors α ≈ 37°. On utilise la fonction arccos.',
      hint: 'Utilise la fonction cos⁻¹ ou arccos sur ta calculatrice'
    },
    {
      question: 'Dans un triangle rectangle, si l\'hypoténuse mesure 12 cm et cos(α) = 0,75, quelle est la longueur du côté adjacent ?',
      answer: '9',
      explanation: 'Côté adjacent = cos(α) × hypoténuse = 0,75 × 12 = 9 cm',
      hint: 'Utilise la formule : adjacent = cos(α) × hypoténuse'
    },
    {
      question: 'Si le côté adjacent mesure 6 cm et l\'hypoténuse 8 cm, que vaut cos(α) ?',
      answer: '0.75',
      explanation: 'cos(α) = adjacent / hypoténuse = 6 / 8 = 0,75',
      hint: 'cos(α) = côté adjacent / hypoténuse'
    },
    {
      question: 'Que vaut cos(70°) ? (arrondi à 3 décimales)',
      answer: '0.342',
      explanation: 'cos(70°) ≈ 0,342',
      hint: 'Utilise ta calculatrice'
    },

    // Niveau 11-15 : Calculs dans triangles particuliers
    {
      question: 'Dans un triangle isocèle rectangle, que vaut le cosinus d\'un angle aigu ?',
      answer: '0.707',
      explanation: 'Dans un triangle isocèle rectangle, les angles aigus mesurent 45°. cos(45°) = √2/2 ≈ 0,707',
      hint: 'Les angles aigus d\'un triangle isocèle rectangle mesurent 45°'
    },
    {
      question: 'Dans un triangle équilatéral divisé par une hauteur, que vaut le cosinus de l\'angle à la base ?',
      answer: '0.5',
      explanation: 'Dans un triangle équilatéral, les angles mesurent 60°. cos(60°) = 1/2 = 0,5',
      hint: 'Les angles d\'un triangle équilatéral mesurent 60°'
    },
    {
      question: 'Si cos(α) = √3/2, quelle est la mesure de l\'angle α ?',
      answer: '30',
      explanation: 'cos(30°) = √3/2, donc α = 30°',
      hint: 'C\'est une valeur remarquable'
    },
    {
      question: 'Dans un triangle rectangle, si un angle mesure 35°, que vaut le cosinus de l\'autre angle aigu ?',
      answer: '0.574',
      explanation: 'L\'autre angle mesure 90° - 35° = 55°. cos(55°) ≈ 0,574',
      hint: 'Les deux angles aigus sont complémentaires'
    },
    {
      question: 'Si l\'hypoténuse mesure 20 cm et cos(40°) ≈ 0,766, quelle est la longueur du côté adjacent ?',
      answer: '15.32',
      explanation: 'Côté adjacent = cos(40°) × 20 = 0,766 × 20 = 15,32 cm',
      hint: 'adjacent = cos(angle) × hypoténuse'
    },

    // Niveau 16-20 : Problèmes complexes
    {
      question: 'Dans un triangle ABC rectangle en C, si AB = 15 cm et cos(A) = 0,6, que vaut AC ?',
      answer: '9',
      explanation: 'AC = AB × cos(A) = 15 × 0,6 = 9 cm',
      hint: 'AC est le côté adjacent à l\'angle A'
    },
    {
      question: 'Si cos(β) = 5/13, que vaut cos(90° - β) ?',
      answer: '12/13',
      explanation: 'cos(90° - β) = sin(β). Dans un triangle rectangle, si cos(β) = 5/13, alors sin(β) = 12/13 (théorème de Pythagore).',
      hint: 'cos(90° - β) = sin(β). Utilise le théorème de Pythagore.'
    },
    {
      question: 'Dans un pentagone régulier, que vaut le cosinus de l\'angle au centre ? (arrondi à 3 décimales)',
      answer: '0.309',
      explanation: 'Un pentagone régulier a des angles au centre de 360°/5 = 72°. cos(72°) ≈ 0,309',
      hint: 'L\'angle au centre = 360° / nombre de côtés'
    },
    {
      question: 'Si cos(2α) = 0,28 et α est aigu, que vaut approximativement α ? (au degré près)',
      answer: '31',
      explanation: 'Si cos(2α) = 0,28, alors 2α ≈ 73,7°, donc α ≈ 36,85° ≈ 37°. Attention, l\'énoncé demande cos(2α) !',
      hint: 'Trouve d\'abord 2α, puis divise par 2'
    },
    {
      question: 'Dans un triangle rectangle, si l\'aire est 24 cm² et l\'hypoténuse 10 cm, que vaut cos²(A) + cos²(B) où A et B sont les angles aigus ?',
      answer: '1',
      explanation: 'Dans tout triangle rectangle, cos²(A) + cos²(B) = sin²(A) + cos²(A) = 1 (identité trigonométrique fondamentale).',
      hint: 'C\'est une identité trigonométrique fondamentale'
    }
  ]

  const checkAnswer = () => {
    const currentEx = exercises[currentExercise]
    const userAnswerNum = parseFloat(userAnswer.replace(',', '.'))
    const correctAnswerNum = parseFloat(currentEx.answer)
    
    // Tolérance pour les calculs numériques
    const tolerance = 0.01
    const isCorrect = Math.abs(userAnswerNum - correctAnswerNum) <= tolerance || 
                     userAnswer.toLowerCase().trim() === currentEx.answer.toLowerCase().trim()
    
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

  const resetExercise = () => {
    setCurrentExercise(0)
    setUserAnswer('')
    setShowAnswer(false)
    setScore(0)
    setAnswerFeedback(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-red-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/chapitre/4eme-cosinus" className="p-2 hover:bg-white/60 rounded-lg transition-colors">
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">🧮 Calculs et valeurs remarquables</h1>
                <p className="text-gray-600">Maîtriser les calculs avec le cosinus</p>
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
                  ? 'bg-orange-500 text-white shadow-md' 
                  : 'text-gray-600 hover:bg-white/50'
              }`}
            >
              📚 Cours
            </button>
            <button
              onClick={() => setActiveTab('exercices')}
              className={`px-6 py-3 rounded-xl font-bold transition-all ${
                activeTab === 'exercices' 
                  ? 'bg-orange-500 text-white shadow-md' 
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
            {/* Section 1: Valeurs remarquables */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
              <h2 className="text-2xl font-bold text-orange-800 mb-6 flex items-center">
                <span className="bg-orange-100 p-2 rounded-lg mr-3">⭐</span>
                Valeurs remarquables du cosinus
              </h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-orange-100 to-yellow-100 p-6 rounded-2xl">
                    <h3 className="text-xl font-bold text-orange-800 mb-4">À retenir absolument</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center bg-white p-3 rounded-lg">
                        <span className="font-bold text-2xl text-orange-600">cos(0°)</span>
                        <span className="text-xl text-gray-800">= 1</span>
                      </div>
                      <div className="flex justify-between items-center bg-white p-3 rounded-lg">
                        <span className="font-bold text-2xl text-orange-600">cos(30°)</span>
                        <span className="text-xl text-gray-800">= √3/2 ≈ 0,866</span>
                      </div>
                      <div className="flex justify-between items-center bg-white p-3 rounded-lg">
                        <span className="font-bold text-2xl text-orange-600">cos(45°)</span>
                        <span className="text-xl text-gray-800">= √2/2 ≈ 0,707</span>
                      </div>
                      <div className="flex justify-between items-center bg-white p-3 rounded-lg">
                        <span className="font-bold text-2xl text-orange-600">cos(60°)</span>
                        <span className="text-xl text-gray-800">= 1/2 = 0,5</span>
                      </div>
                      <div className="flex justify-between items-center bg-white p-3 rounded-lg">
                        <span className="font-bold text-2xl text-orange-600">cos(90°)</span>
                        <span className="text-xl text-gray-800">= 0</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col justify-center">
                  <div className="bg-gradient-to-br from-yellow-100 to-orange-100 p-6 rounded-2xl mb-4">
                    <h3 className="text-lg font-bold text-orange-800 mb-4">Astuce mnémotechnique</h3>
                    <div className="text-center">
                      <div className="text-sm text-gray-600 mb-2">Le cosinus décroît de 1 à 0</div>
                      <div className="space-y-2">
                        <div className="bg-white p-2 rounded">cos(0°) = 1 👑</div>
                        <div className="bg-white p-2 rounded">cos(30°) = √3/2 📐</div>
                        <div className="bg-white p-2 rounded">cos(45°) = √2/2 ⚡</div>
                        <div className="bg-white p-2 rounded">cos(60°) = 1/2 🎯</div>
                        <div className="bg-white p-2 rounded">cos(90°) = 0 ⭕</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Utilisation de la calculatrice */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
              <h2 className="text-2xl font-bold text-yellow-800 mb-6 flex items-center">
                <span className="bg-yellow-100 p-2 rounded-lg mr-3">📱</span>
                Calculer avec la calculatrice
              </h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-bold text-yellow-800 mb-4">Mode calculatrice</h3>
                  <div className="space-y-4">
                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <h4 className="font-bold text-yellow-800">1. Mode Degrés</h4>
                      <p className="text-yellow-700">Assure-toi que ta calculatrice est en mode "DEG" (degrés) et non en radians.</p>
                    </div>
                    <div className="bg-orange-50 p-4 rounded-lg">
                      <h4 className="font-bold text-orange-800">2. Calcul direct</h4>
                      <p className="text-orange-700">Pour cos(25°), tape : cos → 25 → =</p>
                    </div>
                    <div className="bg-red-50 p-4 rounded-lg">
                      <h4 className="font-bold text-red-800">3. Calcul inverse</h4>
                      <p className="text-red-700">Pour trouver l'angle : cos⁻¹ → 0,8 → = donne l'angle</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xl font-bold text-yellow-800 mb-4">Exemples pratiques</h3>
                  <div className="bg-gradient-to-br from-yellow-100 to-orange-100 p-6 rounded-2xl">
                    <div className="space-y-3">
                      <div className="bg-white p-3 rounded-lg">
                        <span className="font-bold">cos(37°) ≈ 0,799</span>
                      </div>
                      <div className="bg-white p-3 rounded-lg">
                        <span className="font-bold">cos(53°) ≈ 0,602</span>
                      </div>
                      <div className="bg-white p-3 rounded-lg">
                        <span className="font-bold">Si cos(α) = 0,7 → α ≈ 45,6°</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3: Formules importantes */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
              <h2 className="text-2xl font-bold text-red-800 mb-6 flex items-center">
                <span className="bg-red-100 p-2 rounded-lg mr-3">🔢</span>
                Formules et propriétés
              </h2>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-red-100 to-pink-100 p-6 rounded-2xl">
                  <h3 className="text-lg font-bold text-red-800 mb-3">Formule de base</h3>
                  <div className="text-center bg-white p-4 rounded-lg">
                    <div className="text-xl font-bold text-red-600">
                      cos(α) = <span className="text-blue-600">adjacent</span> / <span className="text-green-600">hypoténuse</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-blue-100 to-cyan-100 p-6 rounded-2xl">
                  <h3 className="text-lg font-bold text-blue-800 mb-3">Calcul du côté</h3>
                  <div className="text-center bg-white p-4 rounded-lg">
                    <div className="text-xl font-bold text-blue-600">
                      adjacent = cos(α) × hypoténuse
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-green-100 to-emerald-100 p-6 rounded-2xl">
                  <h3 className="text-lg font-bold text-green-800 mb-3">Propriété importante</h3>
                  <div className="text-center bg-white p-4 rounded-lg">
                    <div className="text-xl font-bold text-green-600">
                      0 ≤ cos(α) ≤ 1
                    </div>
                    <div className="text-sm text-gray-600 mt-2">pour α aigu</div>
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
                  <span className="bg-orange-100 p-2 rounded-lg mr-3">🧮</span>
                  Exercice {currentExercise + 1} sur {exercises.length}
                </h2>
                <div className="flex items-center space-x-4">
                  <div className="text-lg font-bold text-orange-600">
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
                <div className="bg-gradient-to-r from-orange-50 to-yellow-50 p-6 rounded-2xl mb-6">
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
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
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
                        className="bg-orange-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
                    className="bg-orange-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-orange-600 disabled:opacity-50 transition-colors"
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