'use client'

import { useState } from 'react'
import { ArrowLeft, BookOpen, Target, Play, RotateCcw, CheckCircle, XCircle, Lightbulb, Eye } from 'lucide-react'
import Link from 'next/link'
import { VoiceInput } from '../../../components/VoiceInput'

export default function ThalesIntroductionPage() {
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
    // Niveau 1-5 : Reconnaissance de configuration
    {
      question: 'Dans un triangle ABC, si (MN) est parallèle à (BC), comment s\'appelle cette configuration ?',
      answer: 'configuration de Thalès',
      explanation: 'Une configuration de Thalès se forme quand une droite est parallèle à un côté du triangle.',
      hint: 'C\'est le nom du mathématicien grec'
    },
    {
      question: 'Pour appliquer le théorème de Thalès, de quoi avons-nous besoin dans un triangle ?',
      answer: 'parallélisme',
      explanation: 'Il faut qu\'une droite soit parallèle à un côté du triangle pour former une configuration de Thalès.',
      hint: 'C\'est une propriété des droites'
    },
    {
      question: 'Si dans un triangle ABC, (MN) ∥ (BC), quels triangles sont semblables ?',
      answer: 'AMN et ABC',
      explanation: 'Les triangles AMN et ABC sont semblables car ils ont les mêmes angles.',
      hint: 'Les triangles qui ont les mêmes angles'
    },
    {
      question: 'Dans la configuration de Thalès, que dit le théorème sur les rapports ?',
      answer: 'ils sont égaux',
      explanation: 'Le théorème de Thalès dit que les rapports correspondants sont égaux : AM/AB = AN/AC = MN/BC.',
      hint: 'Les rapports de longueurs correspondantes'
    },
    {
      question: 'Qui était Thalès de Milet ?',
      answer: 'mathématicien grec',
      explanation: 'Thalès de Milet (vers 625-547 av. J.-C.) était un philosophe et mathématicien grec.',
      hint: 'Nationalité et époque antique'
    },

    // Niveau 6-10 : Identification des éléments
    {
      question: 'Dans la formule AM/AB = AN/AC, que représentent A, M et B ?',
      answer: 'points du triangle',
      explanation: 'A est un sommet du triangle, M est sur le côté [AB], et B est l\'autre extrémité de ce côté.',
      hint: 'Ce sont des positions géométriques'
    },
    {
      question: 'Si (MN) ∥ (BC) dans le triangle ABC, M est sur quel côté ?',
      answer: 'AB',
      explanation: 'M est sur le côté [AB] du triangle, et N est sur le côté [AC].',
      hint: 'M est entre A et un autre sommet'
    },
    {
      question: 'Dans la proportion AM/AB = AN/AC, quel point est commun aux deux rapports ?',
      answer: 'A',
      explanation: 'Le point A est le sommet commun, c\'est le point de concours des côtés [AB] et [AC].',
      hint: 'C\'est le sommet du triangle d\'où partent les mesures'
    },
    {
      question: 'Que signifie le symbole ∥ en géométrie ?',
      answer: 'parallèle',
      explanation: 'Le symbole ∥ signifie "parallèle à". Deux droites parallèles ne se coupent jamais.',
      hint: 'Propriété de droites qui ne se rencontrent pas'
    },
    {
      question: 'Dans un triangle ABC avec (MN) ∥ (BC), combien y a-t-il de rapports égaux ?',
      answer: 'trois',
      explanation: 'Il y a trois rapports égaux : AM/AB = AN/AC = MN/BC.',
      hint: 'Compte les égalités dans la formule'
    },

    // Niveau 11-15 : Applications simples
    {
      question: 'Si AM/AB = 1/2, que représente le point M sur le segment [AB] ?',
      answer: 'milieu',
      explanation: 'Si AM/AB = 1/2, alors AM = AB/2, donc M est le milieu du segment [AB].',
      hint: 'M partage [AB] en deux parties égales'
    },
    {
      question: 'Dans une configuration de Thalès, si tous les rapports valent 1/3, où se trouve M sur [AB] ?',
      answer: 'au tiers',
      explanation: 'Si AM/AB = 1/3, alors M se trouve au tiers du segment [AB] à partir de A.',
      hint: 'M divise [AB] en 3 parties égales'
    },
    {
      question: 'Vrai ou faux : Le théorème de Thalès ne marche que dans les triangles rectangles.',
      answer: 'faux',
      explanation: 'Faux ! Le théorème de Thalès marche dans tous les triangles, pas seulement les rectangles.',
      hint: 'Thalès est plus général que Pythagore'
    },
    {
      question: 'Pour mesurer la hauteur d\'un arbre, Thalès utilisait quoi ?',
      answer: 'son ombre',
      explanation: 'Thalès utilisait l\'ombre de l\'arbre et la proportionnalité avec sa propre ombre.',
      hint: 'Il comparait les ombres'
    },
    {
      question: 'Le théorème de Thalès est-il réciproque ?',
      answer: 'oui',
      explanation: 'Oui, le théorème de Thalès a une réciproque : si les rapports sont égaux, alors il y a parallélisme.',
      hint: 'Comme Pythagore, il a une réciproque'
    }
  ]

  const animations = [
    {
      title: 'Configuration de base',
      steps: [
        'Voici un triangle ABC',
        'Plaçons un point M sur le côté [AB]',
        'Plaçons un point N sur le côté [AC]',
        'Traçons la droite (MN)',
        'Si (MN) est parallèle à (BC), nous avons une configuration de Thalès !'
      ]
    },
    {
      title: 'Les rapports de Thalès',
      steps: [
        'Dans cette configuration, mesurons AM et AB',
        'Calculons le rapport AM/AB',
        'Mesurons AN et AC',
        'Calculons le rapport AN/AC',
        'Ces deux rapports sont égaux ! C\'est le théorème de Thalès.'
      ]
    },
    {
      title: 'Application historique',
      steps: [
        'Thalès voulait mesurer la hauteur d\'une pyramide',
        'Il a planté un bâton dans le sable',
        'Il a mesuré l\'ombre du bâton et sa hauteur',
        'Il a mesuré l\'ombre de la pyramide',
        'Par proportionnalité, il a trouvé la hauteur de la pyramide !'
      ]
    }
  ]

  const checkAnswer = () => {
    const currentEx = exercises[currentExercise]
    const userAnswerClean = userAnswer.toLowerCase().trim()
    const correctAnswerClean = currentEx.answer.toLowerCase().trim()
    
    const isCorrect = userAnswerClean === correctAnswerClean || 
                     userAnswerClean.includes(correctAnswerClean) ||
                     correctAnswerClean.includes(userAnswerClean)
    
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

  const resetExercises = () => {
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
    const currentAnim = animations[currentAnimation]
    if (animationStep < currentAnim.steps.length - 1) {
      setAnimationStep(animationStep + 1)
    } else {
      setIsAnimating(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/chapitre/4eme-theoreme-thales" className="p-2 hover:bg-white/60 rounded-lg transition-colors">
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">📐 Introduction au théorème de Thalès</h1>
                <p className="text-gray-600">Découvrir les bases de la proportionnalité</p>
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
            {/* Section 1: Qu'est-ce que le théorème de Thalès ? */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
              <h2 className="text-2xl font-bold text-green-800 mb-6 flex items-center">
                <span className="bg-green-100 p-2 rounded-lg mr-3">📐</span>
                Qu'est-ce que le théorème de Thalès ?
              </h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-bold text-green-800 mb-4">L'idée principale</h3>
                  <div className="space-y-4">
                    <div className="bg-green-50 p-4 rounded-lg">
                      <p className="text-green-800">
                        Le théorème de Thalès établit une relation entre <strong>parallélisme</strong> et <strong>proportionnalité</strong> dans les triangles.
                      </p>
                    </div>
                    <div className="bg-emerald-50 p-4 rounded-lg">
                      <h4 className="font-bold text-emerald-800 mb-2">Configuration de base</h4>
                      <p className="text-emerald-700">
                        Dans un triangle ABC, si une droite (MN) est parallèle au côté (BC), alors les longueurs sont proportionnelles.
                      </p>
                    </div>
                    <div className="bg-teal-50 p-4 rounded-lg">
                      <h4 className="font-bold text-teal-800 mb-2">Formule magique</h4>
                      <div className="text-center text-lg font-bold text-teal-600">
                        AM/AB = AN/AC = MN/BC
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col justify-center">
                  <div className="bg-gradient-to-br from-green-100 to-emerald-100 p-6 rounded-2xl">
                    <h3 className="text-lg font-bold text-green-800 mb-4 text-center">Thalès de Milet</h3>
                    <div className="text-center space-y-3">
                      <div className="w-20 h-20 bg-green-300 rounded-full mx-auto flex items-center justify-center text-2xl">
                        🧙‍♂️
                      </div>
                      <div className="space-y-2">
                        <p className="text-green-700 font-semibold">Mathématicien grec</p>
                        <p className="text-green-600 text-sm">v. 625-547 av. J.-C.</p>
                        <p className="text-green-700 text-sm">
                          Premier à mesurer la hauteur des pyramides grâce aux ombres !
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Configuration géométrique */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
              <h2 className="text-2xl font-bold text-emerald-800 mb-6 flex items-center">
                <span className="bg-emerald-100 p-2 rounded-lg mr-3">⫽</span>
                La configuration de Thalès
              </h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-bold text-emerald-800 mb-4">Éléments nécessaires</h3>
                  <div className="space-y-4">
                    <div className="bg-emerald-50 p-4 rounded-lg">
                      <div className="flex items-center mb-2">
                        <span className="bg-emerald-200 text-emerald-800 text-sm font-bold rounded-full w-6 h-6 flex items-center justify-center mr-3">1</span>
                        <h4 className="font-bold text-emerald-800">Un triangle ABC</h4>
                      </div>
                      <p className="text-emerald-700 ml-9">Triangle quelconque (pas forcément rectangle)</p>
                    </div>
                    <div className="bg-teal-50 p-4 rounded-lg">
                      <div className="flex items-center mb-2">
                        <span className="bg-teal-200 text-teal-800 text-sm font-bold rounded-full w-6 h-6 flex items-center justify-center mr-3">2</span>
                        <h4 className="font-bold text-teal-800">Des points M et N</h4>
                      </div>
                      <p className="text-teal-700 ml-9">M sur [AB] et N sur [AC]</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="flex items-center mb-2">
                        <span className="bg-green-200 text-green-800 text-sm font-bold rounded-full w-6 h-6 flex items-center justify-center mr-3">3</span>
                        <h4 className="font-bold text-green-800">Parallélisme</h4>
                      </div>
                      <p className="text-green-700 ml-9">(MN) ∥ (BC)</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col justify-center">
                  <div className="bg-gradient-to-br from-emerald-100 to-teal-100 p-6 rounded-2xl">
                    <h3 className="text-lg font-bold text-emerald-800 mb-4 text-center">Schéma interactif</h3>
                    <div className="bg-white p-4 rounded-lg">
                      <svg viewBox="0 0 300 200" className="w-full h-40">
                        <polygon points="50,150 250,150 150,50" fill="none" stroke="#059669" strokeWidth="2"/>
                        <line x1="50" y1="150" x2="150" y2="50" stroke="#059669" strokeWidth="1"/>
                        <line x1="150" y1="50" x2="250" y2="150" stroke="#059669" strokeWidth="1"/>
                        <line x1="100" y1="100" x2="200" y2="100" stroke="#dc2626" strokeWidth="2"/>
                        <circle cx="50" cy="150" r="3" fill="#059669"/>
                        <circle cx="150" cy="50" r="3" fill="#059669"/>
                        <circle cx="250" cy="150" r="3" fill="#059669"/>
                        <circle cx="100" cy="100" r="3" fill="#dc2626"/>
                        <circle cx="200" cy="100" r="3" fill="#dc2626"/>
                        <text x="45" y="170" className="text-xs fill-gray-700">A</text>
                        <text x="145" y="40" className="text-xs fill-gray-700">B</text>
                        <text x="255" y="170" className="text-xs fill-gray-700">C</text>
                        <text x="95" y="90" className="text-xs fill-red-600">M</text>
                        <text x="205" y="90" className="text-xs fill-red-600">N</text>
                        <text x="120" y="180" className="text-xs fill-gray-600">(MN) ∥ (BC)</text>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3: Le théorème */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
              <h2 className="text-2xl font-bold text-teal-800 mb-6 flex items-center">
                <span className="bg-teal-100 p-2 rounded-lg mr-3">📏</span>
                Énoncé du théorème
              </h2>
              
              <div className="bg-gradient-to-r from-teal-100 to-cyan-100 p-6 rounded-2xl mb-6">
                <div className="text-center">
                  <div className="text-lg font-bold text-teal-600 mb-4">
                    Théorème de Thalès
                  </div>
                  <div className="bg-white/80 p-4 rounded-lg">
                    <div className="text-teal-800 space-y-2">
                      <div>Soit un triangle ABC et deux points M et N tels que :</div>
                      <div className="font-bold">• M ∈ [AB] et N ∈ [AC]</div>
                      <div className="font-bold">• (MN) ∥ (BC)</div>
                      <div className="text-lg font-bold text-teal-600 mt-4">
                        Alors : AM/AB = AN/AC = MN/BC
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-teal-50 p-4 rounded-lg text-center">
                  <h4 className="font-bold text-teal-800 mb-2">Premier rapport</h4>
                  <div className="text-lg font-bold text-teal-600">AM/AB</div>
                  <p className="text-sm text-teal-700">Position de M sur [AB]</p>
                </div>
                
                <div className="bg-cyan-50 p-4 rounded-lg text-center">
                  <h4 className="font-bold text-cyan-800 mb-2">Deuxième rapport</h4>
                  <div className="text-lg font-bold text-cyan-600">AN/AC</div>
                  <p className="text-sm text-cyan-700">Position de N sur [AC]</p>
                </div>
                
                <div className="bg-emerald-50 p-4 rounded-lg text-center">
                  <h4 className="font-bold text-emerald-800 mb-2">Troisième rapport</h4>
                  <div className="text-lg font-bold text-emerald-600">MN/BC</div>
                  <p className="text-sm text-emerald-700">Rapport des parallèles</p>
                </div>
              </div>
            </div>

            {/* Section 4: Animations interactives */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
              <h2 className="text-2xl font-bold text-purple-800 mb-6 flex items-center">
                <span className="bg-purple-100 p-2 rounded-lg mr-3">🎬</span>
                Animations interactives
              </h2>
              
              <div className="grid md:grid-cols-3 gap-6">
                {animations.map((animation, index) => (
                  <div key={index} className="bg-gradient-to-br from-purple-100 to-pink-100 p-6 rounded-2xl">
                    <h3 className="text-lg font-bold text-purple-800 mb-4">{animation.title}</h3>
                    <button
                      onClick={() => startAnimation(index)}
                      className="w-full bg-purple-500 text-white py-3 px-4 rounded-lg font-bold hover:bg-purple-600 transition-colors flex items-center justify-center"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Lancer l'animation
                    </button>
                  </div>
                ))}
              </div>
              
              {isAnimating && (
                <div className="mt-8 bg-purple-50 p-6 rounded-2xl">
                  <h3 className="text-lg font-bold text-purple-800 mb-4">
                    {animations[currentAnimation].title}
                  </h3>
                  <div className="bg-white p-4 rounded-lg mb-4">
                    <p className="text-purple-700">
                      Étape {animationStep + 1} : {animations[currentAnimation].steps[animationStep]}
                    </p>
                  </div>
                  <button
                    onClick={nextAnimationStep}
                    className="bg-purple-500 text-white py-2 px-4 rounded-lg font-bold hover:bg-purple-600 transition-colors"
                  >
                    {animationStep < animations[currentAnimation].steps.length - 1 ? 'Étape suivante' : 'Terminer'}
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* EXERCICES */
          <div className="space-y-8">
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  📐 Exercice {currentExercise + 1} sur {exercises.length}
                </h2>
                <div className="flex items-center space-x-4">
                  <div className="text-lg font-bold text-green-600">
                    Score : {score}/{exercises.length}
                  </div>
                  <button onClick={resetExercises} className="bg-gray-500 text-white px-4 py-2 rounded-lg">
                    <RotateCcw className="inline w-4 h-4 mr-2" />
                    Recommencer
                  </button>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-2xl mb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  {exercises[currentExercise].question}
                </h3>
                
                <div className="space-y-4">
                  <input
                    type="text"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    placeholder="Votre réponse..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                  <VoiceInput onTranscript={(transcript) => setUserAnswer(transcript)} />
                  
                  {!showAnswer && (
                    <button
                      onClick={checkAnswer}
                      disabled={!userAnswer.trim()}
                      className="bg-green-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-green-600 disabled:opacity-50"
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
                  className="bg-green-500 text-white px-4 py-2 rounded-lg disabled:opacity-50"
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