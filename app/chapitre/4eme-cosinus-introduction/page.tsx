'use client'

import { useState } from 'react'
import { ArrowLeft, BookOpen, Target, Play, RotateCcw, CheckCircle, XCircle, Lightbulb, Eye } from 'lucide-react'
import Link from 'next/link'
import { VoiceInput } from '../../../components/VoiceInput'

export default function CosinusIntroductionPage() {
  const [activeTab, setActiveTab] = useState<'cours' | 'exercices'>('cours')
  const [currentExercise, setCurrentExercise] = useState(0)
  const [userAnswer, setUserAnswer] = useState('')
  const [showAnswer, setShowAnswer] = useState(false)
  const [score, setScore] = useState(0)
  const [correctAnswers, setCorrectAnswers] = useState(0)
  const [answerFeedback, setAnswerFeedback] = useState<'correct' | 'incorrect' | null>(null)
  
  // États pour les animations
  const [currentAnimation, setCurrentAnimation] = useState(0)
  const [animationStep, setAnimationStep] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  const exercises = [
    // Niveau 1-5 : Reconnaissance triangle rectangle et vocabulaire
    {
      question: 'Dans un triangle rectangle, quel est le nom du côté le plus long ?',
      answer: 'hypoténuse',
      explanation: 'L\'hypoténuse est toujours le côté opposé à l\'angle droit, c\'est le plus long côté.',
      hint: 'C\'est le côté opposé à l\'angle droit'
    },
    {
      question: 'Dans un triangle ABC rectangle en C, quel est le nom de l\'hypoténuse ?',
      answer: 'AB',
      explanation: 'L\'hypoténuse est le côté opposé à l\'angle droit. Ici l\'angle droit est en C, donc l\'hypoténuse est AB.',
      hint: 'L\'hypoténuse est opposée à l\'angle droit'
    },
    {
      question: 'Dans un triangle rectangle, combien y a-t-il d\'angles aigus ?',
      answer: '2',
      explanation: 'Un triangle rectangle a un angle droit (90°) et deux angles aigus qui sont complémentaires.',
      hint: 'Un triangle a 3 angles, dont 1 angle droit...'
    },
    {
      question: 'Si dans un triangle ABC, l\'angle en B mesure 90°, quel côté est l\'hypoténuse ?',
      answer: 'AC',
      explanation: 'L\'hypoténuse est toujours opposée à l\'angle droit. L\'angle droit est en B, donc l\'hypoténuse est AC.',
      hint: 'Regarde quel côté ne touche pas le sommet B'
    },
    {
      question: 'Dans un triangle rectangle, que vaut la somme des deux angles aigus ?',
      answer: '90',
      explanation: 'La somme des angles d\'un triangle est 180°. Avec un angle droit (90°), les deux autres font 180° - 90° = 90°.',
      hint: 'La somme des angles d\'un triangle est 180°'
    },

    // Niveau 6-10 : Introduction au cosinus
    {
      question: 'Le cosinus d\'un angle aigu est le rapport entre quel côté et l\'hypoténuse ?',
      answer: 'côté adjacent',
      explanation: 'cos(angle) = côté adjacent à l\'angle / hypoténuse',
      hint: 'C\'est le côté qui touche l\'angle (mais pas l\'hypoténuse)'
    },
    {
      question: 'Dans un triangle rectangle, que vaut cos(90°) ?',
      answer: '0',
      explanation: 'cos(90°) = 0. Le côté adjacent à un angle de 90° a une longueur nulle.',
      hint: 'Un angle de 90° n\'a pas de côté adjacent dans un triangle rectangle'
    },
    {
      question: 'Que vaut cos(0°) ?',
      answer: '1',
      explanation: 'cos(0°) = 1. Quand l\'angle tend vers 0°, le côté adjacent se confond avec l\'hypoténuse.',
      hint: 'Imagine un angle très petit, presque nul'
    },
    {
      question: 'Le cosinus d\'un angle aigu est toujours compris entre quelles valeurs ?',
      answer: '0 et 1',
      explanation: 'Dans un triangle rectangle, le côté adjacent est toujours plus petit que l\'hypoténuse, donc 0 < cos(angle aigu) < 1.',
      hint: 'Compare les longueurs du côté adjacent et de l\'hypoténuse'
    },
    {
      question: 'Dans un triangle ABC rectangle en C, que vaut cos(A) ?',
      answer: 'AC/AB',
      explanation: 'cos(A) = côté adjacent à A / hypoténuse = AC / AB',
      hint: 'Identifie le côté adjacent à l\'angle A et l\'hypoténuse'
    },

    // Niveau 11-15 : Calculs avec cosinus
    {
      question: 'Dans un triangle rectangle, si cos(α) = 0,6 et l\'hypoténuse mesure 10 cm, quelle est la longueur du côté adjacent ?',
      answer: '6',
      explanation: 'cos(α) = adjacent/hypoténuse, donc adjacent = cos(α) × hypoténuse = 0,6 × 10 = 6 cm',
      hint: 'Utilise la formule : adjacent = cos(α) × hypoténuse'
    },
    {
      question: 'Si dans un triangle rectangle le côté adjacent à un angle mesure 8 cm et l\'hypoténuse 10 cm, que vaut le cosinus de cet angle ?',
      answer: '0.8',
      explanation: 'cos(angle) = adjacent/hypoténuse = 8/10 = 0,8',
      hint: 'cos(angle) = côté adjacent / hypoténuse'
    },
    {
      question: 'Que vaut cos(60°) ? (valeur exacte)',
      answer: '0.5',
      explanation: 'cos(60°) = 1/2 = 0,5. C\'est une valeur remarquable à retenir.',
      hint: 'C\'est une valeur remarquable, la moitié de quelque chose...'
    },
    {
      question: 'Dans un triangle rectangle, si un angle mesure 30° et l\'hypoténuse 12 cm, quelle est la longueur du côté adjacent à cet angle ?',
      answer: '10.4',
      explanation: 'cos(30°) = √3/2 ≈ 0,866. Adjacent = cos(30°) × 12 ≈ 0,866 × 12 ≈ 10,4 cm',
      hint: 'Utilise cos(30°) ≈ 0,866'
    },
    {
      question: 'Si cos(α) = 0,75, quelle est la mesure approximative de l\'angle α ?',
      answer: '41',
      explanation: 'Si cos(α) = 0,75, alors α ≈ 41°. On utilise la fonction arccos.',
      hint: 'Utilise la calculatrice avec la fonction cos⁻¹ ou arccos'
    },

    // Niveau 16-20 : Applications et problèmes
    {
      question: 'Une échelle de 5 m est posée contre un mur. Elle fait un angle de 60° avec le sol. À quelle distance du mur se trouve le pied de l\'échelle ?',
      answer: '2.5',
      explanation: 'Distance = longueur × cos(60°) = 5 × 0,5 = 2,5 m',
      hint: 'La distance cherchée est le côté adjacent à l\'angle de 60°'
    },
    {
      question: 'Un toit a une pente de 30°. Si la largeur horizontale de la maison est 8 m, quelle est la longueur du versant du toit ?',
      answer: '9.2',
      explanation: 'Longueur du versant = largeur / cos(30°) = 8 / (√3/2) = 8 / 0,866 ≈ 9,2 m',
      hint: 'La largeur est le côté adjacent à l\'angle de 30°'
    },
    {
      question: 'Dans un triangle ABC rectangle en C, si AB = 13 cm et AC = 5 cm, que vaut cos(A) ?',
      answer: '5/13',
      explanation: 'cos(A) = côté adjacent / hypoténuse = AC / AB = 5/13',
      hint: 'Identifie quel côté est adjacent à l\'angle A'
    },
    {
      question: 'Un avion décolle avec un angle de 15° par rapport à l\'horizontale. Après avoir parcouru 2000 m, quelle est sa distance horizontale par rapport au point de départ ?',
      answer: '1932',
      explanation: 'Distance horizontale = 2000 × cos(15°) ≈ 2000 × 0,966 ≈ 1932 m',
      hint: 'La distance horizontale correspond au côté adjacent à l\'angle de 15°'
    },
    {
      question: 'Dans un triangle isocèle rectangle, que vaut le cosinus de chaque angle aigu ?',
      answer: '√2/2',
      explanation: 'Dans un triangle isocèle rectangle, les angles aigus mesurent 45°. cos(45°) = √2/2 ≈ 0,707',
      hint: 'Les angles aigus d\'un triangle isocèle rectangle mesurent 45°'
    }
  ]

  const animations = [
    {
      title: 'Découverte du triangle rectangle',
      steps: [
        'Voici un triangle quelconque ABC',
        'Ajoutons un angle droit en C',
        'Le côté AB devient l\'hypoténuse',
        'AC et BC sont les côtés de l\'angle droit'
      ]
    },
    {
      title: 'Définition du cosinus',
      steps: [
        'Prenons l\'angle A dans le triangle rectangle',
        'Le côté AC est adjacent à l\'angle A',
        'Le côté BC est opposé à l\'angle A',
        'cos(A) = côté adjacent / hypoténuse = AC / AB'
      ]
    },
    {
      title: 'Valeurs remarquables',
      steps: [
        'Dans un triangle rectangle particulier...',
        'Si l\'angle mesure 60°, cos(60°) = 1/2',
        'Si l\'angle mesure 45°, cos(45°) = √2/2',
        'Si l\'angle mesure 30°, cos(30°) = √3/2'
      ]
    }
  ]

  const checkAnswer = () => {
    const currentEx = exercises[currentExercise]
    const userAnswerClean = userAnswer.toLowerCase().trim()
    const correctAnswerClean = currentEx.answer.toLowerCase().trim()
    
    const isCorrect = userAnswerClean === correctAnswerClean
    setAnswerFeedback(isCorrect ? 'correct' : 'incorrect')
    setShowAnswer(true)
    
    if (isCorrect && correctAnswers <= currentExercise) {
      setCorrectAnswers(correctAnswers + 1)
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
    setCorrectAnswers(0)
    setAnswerFeedback(null)
  }

  const startAnimation = (animIndex: number) => {
    setCurrentAnimation(animIndex)
    setAnimationStep(0)
    setIsAnimating(true)
  }

  const nextAnimationStep = () => {
    if (animationStep < animations[currentAnimation].steps.length - 1) {
      setAnimationStep(animationStep + 1)
    }
  }

  const prevAnimationStep = () => {
    if (animationStep > 0) {
      setAnimationStep(animationStep - 1)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-pink-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/chapitre/4eme-cosinus" className="p-2 hover:bg-white/60 rounded-lg transition-colors">
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">📐 Introduction au cosinus</h1>
                <p className="text-gray-600">Découvrir le cosinus dans le triangle rectangle</p>
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
                  ? 'bg-red-500 text-white shadow-md' 
                  : 'text-gray-600 hover:bg-white/50'
              }`}
            >
              📚 Cours
            </button>
            <button
              onClick={() => setActiveTab('exercices')}
              className={`px-6 py-3 rounded-xl font-bold transition-all ${
                activeTab === 'exercices' 
                  ? 'bg-red-500 text-white shadow-md' 
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
            {/* Section 1: Triangle rectangle */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
              <h2 className="text-2xl font-bold text-red-800 mb-6 flex items-center">
                <span className="bg-red-100 p-2 rounded-lg mr-3">📐</span>
                Le triangle rectangle
              </h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Rappels importants</h3>
                  <div className="space-y-4">
                    <div className="bg-red-50 p-4 rounded-lg">
                      <h4 className="font-bold text-red-800">Définition</h4>
                      <p className="text-red-700">Un triangle rectangle est un triangle qui possède un angle droit (90°).</p>
                    </div>
                    <div className="bg-orange-50 p-4 rounded-lg">
                      <h4 className="font-bold text-orange-800">Hypoténuse</h4>
                      <p className="text-orange-700">L'hypoténuse est le côté opposé à l'angle droit. C'est le côté le plus long.</p>
                    </div>
                    <div className="bg-pink-50 p-4 rounded-lg">
                      <h4 className="font-bold text-pink-800">Côtés de l'angle droit</h4>
                      <p className="text-pink-700">Les deux autres côtés forment l'angle droit et sont perpendiculaires.</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col items-center">
                  <div className="bg-gradient-to-br from-red-100 to-orange-100 p-6 rounded-2xl mb-4">
                    <svg width="200" height="150" viewBox="0 0 200 150">
                      <polygon points="20,120 120,120 120,40" fill="#fef2f2" stroke="#dc2626" strokeWidth="3"/>
                      <text x="15" y="135" className="text-sm font-bold fill-red-600">A</text>
                      <text x="125" y="135" className="text-sm font-bold fill-red-600">B</text>
                      <text x="125" y="35" className="text-sm font-bold fill-red-600">C</text>
                      <text x="65" y="135" className="text-xs fill-gray-600">côté adjacent</text>
                      <text x="130" y="85" className="text-xs fill-gray-600">côté opposé</text>
                      <text x="60" y="75" className="text-xs fill-red-600 font-bold">hypoténuse</text>
                      <rect x="110" y="110" width="10" height="10" fill="none" stroke="#dc2626" strokeWidth="2"/>
                    </svg>
                  </div>
                  <button 
                    onClick={() => startAnimation(0)}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                  >
                    🎬 Animation triangle rectangle
                  </button>
                </div>
              </div>
            </div>

            {/* Section 2: Définition du cosinus */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
              <h2 className="text-2xl font-bold text-orange-800 mb-6 flex items-center">
                <span className="bg-orange-100 p-2 rounded-lg mr-3">🧮</span>
                Définition du cosinus
              </h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <div className="bg-gradient-to-r from-orange-100 to-red-100 p-6 rounded-2xl mb-6">
                    <h3 className="text-xl font-bold text-orange-800 mb-3">Formule du cosinus</h3>
                    <div className="text-center bg-white p-4 rounded-lg shadow-inner">
                      <div className="text-2xl font-bold text-orange-600 mb-2">
                        cos(angle) = <span className="text-red-600">côté adjacent</span> / <span className="text-blue-600">hypoténuse</span>
                      </div>
                      <p className="text-sm text-gray-600">Dans un triangle rectangle</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-orange-50 p-4 rounded-lg">
                      <h4 className="font-bold text-orange-800">Côté adjacent</h4>
                      <p className="text-orange-700">C'est le côté de l'angle droit qui touche l'angle considéré (sans être l'hypoténuse).</p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-bold text-blue-800">Important</h4>
                      <p className="text-blue-700">Le cosinus d'un angle aigu est toujours compris entre 0 et 1.</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col items-center">
                  <div className="bg-gradient-to-br from-orange-100 to-yellow-100 p-6 rounded-2xl mb-4">
                    <svg width="220" height="160" viewBox="0 0 220 160">
                      <polygon points="30,130 140,130 140,50" fill="#fff7ed" stroke="#ea580c" strokeWidth="3"/>
                      <path d="M 30,130 A 20,20 0 0,0 45,120" fill="none" stroke="#dc2626" strokeWidth="2"/>
                      <text x="25" y="145" className="text-sm font-bold fill-orange-600">A</text>
                      <text x="145" y="145" className="text-sm font-bold fill-orange-600">B</text>
                      <text x="145" y="45" className="text-sm font-bold fill-orange-600">C</text>
                      <text x="80" y="145" className="text-xs fill-red-600 font-bold">adjacent</text>
                      <text x="150" y="95" className="text-xs fill-green-600">opposé</text>
                      <text x="75" y="85" className="text-xs fill-blue-600 font-bold">hypoténuse</text>
                      <text x="35" y="125" className="text-xs fill-red-600 font-bold">α</text>
                      <rect x="130" y="120" width="10" height="10" fill="none" stroke="#ea580c" strokeWidth="2"/>
                    </svg>
                  </div>
                  <button 
                    onClick={() => startAnimation(1)}
                    className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
                  >
                    🎬 Animation définition cosinus
                  </button>
                </div>
              </div>
            </div>

            {/* Section 3: Valeurs remarquables */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
              <h2 className="text-2xl font-bold text-pink-800 mb-6 flex items-center">
                <span className="bg-pink-100 p-2 rounded-lg mr-3">⭐</span>
                Valeurs remarquables à retenir
              </h2>
              
              <div className="grid md:grid-cols-3 gap-6 mb-6">
                <div className="bg-gradient-to-br from-pink-100 to-red-100 p-6 rounded-2xl text-center">
                  <div className="text-3xl font-bold text-pink-600 mb-2">30°</div>
                  <div className="text-xl text-pink-800">cos(30°) = √3/2</div>
                  <div className="text-sm text-pink-600 mt-2">≈ 0,866</div>
                </div>
                <div className="bg-gradient-to-br from-orange-100 to-yellow-100 p-6 rounded-2xl text-center">
                  <div className="text-3xl font-bold text-orange-600 mb-2">45°</div>
                  <div className="text-xl text-orange-800">cos(45°) = √2/2</div>
                  <div className="text-sm text-orange-600 mt-2">≈ 0,707</div>
                </div>
                <div className="bg-gradient-to-br from-red-100 to-pink-100 p-6 rounded-2xl text-center">
                  <div className="text-3xl font-bold text-red-600 mb-2">60°</div>
                  <div className="text-xl text-red-800">cos(60°) = 1/2</div>
                  <div className="text-sm text-red-600 mt-2">= 0,5</div>
                </div>
              </div>
              
              <div className="text-center">
                <button 
                  onClick={() => startAnimation(2)}
                  className="bg-pink-500 text-white px-6 py-3 rounded-lg hover:bg-pink-600 transition-colors"
                >
                  🎬 Animation valeurs remarquables
                </button>
              </div>
            </div>

            {/* Animation viewer */}
            {isAnimating && (
              <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-gray-800">{animations[currentAnimation].title}</h3>
                  <button 
                    onClick={() => setIsAnimating(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>
                
                <div className="text-center mb-6">
                  <div className="bg-gradient-to-br from-gray-100 to-blue-100 p-8 rounded-2xl">
                    <p className="text-lg text-gray-800 mb-4">
                      {animations[currentAnimation].steps[animationStep]}
                    </p>
                    <div className="text-sm text-gray-600">
                      Étape {animationStep + 1} sur {animations[currentAnimation].steps.length}
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-center space-x-4">
                  <button 
                    onClick={prevAnimationStep}
                    disabled={animationStep === 0}
                    className="bg-gray-500 text-white px-4 py-2 rounded-lg disabled:opacity-50"
                  >
                    ← Précédent
                  </button>
                  <button 
                    onClick={nextAnimationStep}
                    disabled={animationStep === animations[currentAnimation].steps.length - 1}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg disabled:opacity-50"
                  >
                    Suivant →
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* EXERCICES */
          <div className="space-y-8">
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                  <span className="bg-red-100 p-2 rounded-lg mr-3">✏️</span>
                  Exercice {currentExercise + 1} sur {exercises.length}
                </h2>
                <div className="flex items-center space-x-4">
                  <div className="text-lg font-bold text-red-600">
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
                <div className="bg-gradient-to-r from-red-50 to-orange-50 p-6 rounded-2xl mb-6">
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
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
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
                        className="bg-red-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
                    className="bg-red-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-red-600 disabled:opacity-50 transition-colors"
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