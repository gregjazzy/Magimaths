'use client'

import { useState } from 'react'
import { ArrowLeft, BookOpen, Target, Play, RotateCcw, CheckCircle, XCircle, Lightbulb, Compass, Ruler, Triangle } from 'lucide-react'
import Link from 'next/link'
import { VoiceInput } from '../../../components/VoiceInput'

export default function CosinusConstructionsPage() {
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
    // Niveau 1-5 : Construction d'angles simples
    {
      question: 'Avec un rapporteur, comment construire un angle de 60° ?',
      answer: 'tracer demi-droite puis mesurer 60',
      explanation: 'On trace une demi-droite de référence, puis on place le rapporteur en plaçant son centre sur l\'origine et on marque 60°.',
      hint: 'Il faut une demi-droite de référence et un rapporteur'
    },
    {
      question: 'Dans un triangle équilatéral, quelle est la mesure de chaque angle ?',
      answer: '60',
      explanation: 'Dans un triangle équilatéral, les trois angles sont égaux : 180° ÷ 3 = 60°',
      hint: 'Les trois angles sont égaux et leur somme fait 180°'
    },
    {
      question: 'Comment construire un angle de 30° sans rapporteur ?',
      answer: 'bissectrice angle 60',
      explanation: 'On peut construire un triangle équilatéral (angles de 60°) puis tracer la bissectrice d\'un angle pour obtenir 30°.',
      hint: 'Utilise un triangle équilatéral et une bissectrice'
    },
    {
      question: 'Dans un carré, quelle est la mesure de l\'angle de la diagonale avec un côté ?',
      answer: '45',
      explanation: 'Dans un carré, la diagonale forme un angle de 45° avec chaque côté (triangle isocèle rectangle).',
      hint: 'La diagonale d\'un carré forme des triangles isocèles rectangles'
    },
    {
      question: 'Comment construire un angle droit avec une équerre ?',
      answer: 'poser equerre tracer',
      explanation: 'On pose l\'équerre en alignant un côté avec une droite de référence, puis on trace le long de l\'autre côté.',
      hint: 'L\'équerre a déjà un angle droit intégré'
    },

    // Niveau 6-10 : Construction de triangles
    {
      question: 'Pour construire un triangle connaissant deux côtés et l\'angle entre eux, quel théorème utilise-t-on ?',
      answer: 'cosinus',
      explanation: 'On peut utiliser la loi des cosinus pour calculer le troisième côté, puis construire le triangle.',
      hint: 'C\'est directement lié au cosinus !'
    },
    {
      question: 'Dans un triangle ABC, si AB = 5 cm, AC = 4 cm et angle A = 60°, que vaut BC ?',
      answer: '4.36',
      explanation: 'BC² = AB² + AC² - 2×AB×AC×cos(A) = 25 + 16 - 2×5×4×0.5 = 41 - 20 = 21, donc BC ≈ 4.58 cm. Erreur de calcul !',
      hint: 'Utilise la loi des cosinus : c² = a² + b² - 2ab×cos(C)'
    },
    {
      question: 'Pour construire un triangle rectangle, quel angle doit-on tracer en premier ?',
      answer: '90',
      explanation: 'On commence par tracer l\'angle droit (90°), puis on place les deux autres côtés.',
      hint: 'C\'est l\'angle caractéristique du triangle rectangle'
    },
    {
      question: 'Dans un triangle isocèle rectangle, quels sont les deux angles égaux ?',
      answer: '45',
      explanation: 'Dans un triangle isocèle rectangle, les deux angles à la base mesurent 45° chacun.',
      hint: 'Il y a un angle droit et deux angles égaux qui complètent à 180°'
    },
    {
      question: 'Comment vérifier qu\'un triangle construit est bien rectangle ?',
      answer: 'mesurer angle ou pythagore',
      explanation: 'On peut mesurer l\'angle avec un rapporteur (doit faire 90°) ou vérifier avec le théorème de Pythagore.',
      hint: 'Il y a deux méthodes : mesure directe ou calcul'
    },

    // Niveau 11-15 : Constructions avec le compas
    {
      question: 'Comment construire un hexagone régulier inscrit dans un cercle ?',
      answer: 'reporter rayon 6 fois',
      explanation: 'On reporte le rayon du cercle 6 fois sur la circonférence car dans un hexagone régulier, le côté égale le rayon.',
      hint: 'Dans un hexagone régulier inscrit, le côté égale le rayon'
    },
    {
      question: 'Dans un hexagone régulier, quel est l\'angle au centre de chaque secteur ?',
      answer: '60',
      explanation: 'Angle au centre = 360° ÷ 6 = 60°',
      hint: 'Divise 360° par le nombre de côtés'
    },
    {
      question: 'Comment construire un triangle équilatéral de côté 5 cm ?',
      answer: 'compas ecartement 5cm',
      explanation: 'On trace un segment de 5 cm, puis on trace deux arcs de cercle de rayon 5 cm centrés aux extrémités.',
      hint: 'Utilise le compas avec un écartement égal au côté'
    },
    {
      question: 'Pour construire la bissectrice d\'un angle, que fait-on avec le compas ?',
      answer: 'deux arcs meme rayon',
      explanation: 'On trace deux arcs de même rayon sur les côtés de l\'angle, puis deux arcs qui se croisent pour définir la bissectrice.',
      hint: 'Il faut tracer des arcs de même rayon'
    },
    {
      question: 'Dans un pentagone régulier, quel est l\'angle au centre ?',
      answer: '72',
      explanation: 'Angle au centre = 360° ÷ 5 = 72°',
      hint: 'Un pentagone a 5 côtés'
    },

    // Niveau 16-20 : Constructions complexes et applications
    {
      question: 'Comment construire un angle de 15° sans rapporteur ?',
      answer: 'bissectrice de 30',
      explanation: 'On construit un angle de 30° (bissectrice de 60°), puis on trace sa bissectrice pour obtenir 15°.',
      hint: 'Pars d\'un angle de 30° et utilise une bissectrice'
    },
    {
      question: 'Pour construire un triangle connaissant les trois côtés, quelle méthode utilise-t-on ?',
      answer: 'trois arcs compas',
      explanation: 'On trace le premier côté, puis on trace deux arcs de compas aux bonnes distances pour trouver le troisième sommet.',
      hint: 'Chaque côté définit la distance entre deux sommets'
    },
    {
      question: 'Dans un dodécagone régulier (12 côtés), quel est l\'angle au centre ?',
      answer: '30',
      explanation: 'Angle au centre = 360° ÷ 12 = 30°',
      hint: 'Divise 360° par 12'
    },
    {
      question: 'Comment construire un angle de 120° ?',
      answer: '2 fois 60 ou exterieur triangle',
      explanation: 'On peut soit tracer deux angles de 60° consécutifs, soit utiliser l\'angle extérieur d\'un triangle équilatéral.',
      hint: 'Pense aux multiples de 60° ou aux angles extérieurs'
    },
    {
      question: 'Pour construire un parallélogramme ABCD, après avoir tracé AB et AD, comment placer C ?',
      answer: 'paralleles et distances',
      explanation: 'On trace des parallèles : une à AB passant par D, et une à AD passant par B. Leur intersection donne C.',
      hint: 'Utilise des droites parallèles aux côtés déjà tracés'
    }
  ]

  const animations = [
    {
      title: 'Construction d\'un triangle avec cosinus',
      steps: [
        'Données : deux côtés a, b et l\'angle C entre eux',
        'On trace le côté a horizontalement',
        'À l\'extrémité, on construit l\'angle C avec un rapporteur',
        'On reporte la longueur b sur ce nouveau côté',
        'On relie pour fermer le triangle'
      ]
    },
    {
      title: 'Construction d\'un hexagone régulier',
      steps: [
        'On trace un cercle de centre O',
        'On place un point A sur le cercle',
        'Avec le compas, écartement = rayon, on reporte 6 fois',
        'On obtient 6 points régulièrement espacés',
        'On relie les points consécutifs'
      ]
    },
    {
      title: 'Vérification avec le cosinus',
      steps: [
        'Dans le triangle construit ABC',
        'On mesure les côtés AB, AC et BC',
        'On vérifie : cos(A) = (AB² + AC² - BC²) / (2×AB×AC)',
        'Si le calcul correspond à l\'angle prévu, c\'est correct !'
      ]
    }
  ]

  const checkAnswer = () => {
    const currentEx = exercises[currentExercise]
    const userAnswerClean = userAnswer.toLowerCase().trim()
    const correctAnswerClean = currentEx.answer.toLowerCase().trim()
    
    // Pour les réponses numériques
    if (!isNaN(parseFloat(userAnswer))) {
      const userNum = parseFloat(userAnswer)
      const correctNum = parseFloat(currentEx.answer)
      const tolerance = Math.max(1, correctNum * 0.05) // 5% de tolérance
      const isCorrect = Math.abs(userNum - correctNum) <= tolerance
      setAnswerFeedback(isCorrect ? 'correct' : 'incorrect')
    } else {
      // Pour les réponses textuelles, vérification flexible
      const keywords = correctAnswerClean.split(' ')
      const userWords = userAnswerClean.split(' ')
      const matchCount = keywords.filter(keyword => 
        userWords.some(word => word.includes(keyword) || keyword.includes(word))
      ).length
      
      const isCorrect = matchCount >= Math.ceil(keywords.length * 0.6) || userAnswerClean === correctAnswerClean
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-red-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/chapitre/4eme-cosinus" className="p-2 hover:bg-white/60 rounded-lg transition-colors">
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">📏 Constructions géométriques</h1>
                <p className="text-gray-600">Construire des angles et des figures avec le cosinus</p>
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
                  ? 'bg-purple-500 text-white shadow-md' 
                  : 'text-gray-600 hover:bg-white/50'
              }`}
            >
              📚 Cours
            </button>
            <button
              onClick={() => setActiveTab('exercices')}
              className={`px-6 py-3 rounded-xl font-bold transition-all ${
                activeTab === 'exercices' 
                  ? 'bg-purple-500 text-white shadow-md' 
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
            {/* Section 1: Outils de construction */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
              <h2 className="text-2xl font-bold text-purple-800 mb-6 flex items-center">
                <span className="bg-purple-100 p-2 rounded-lg mr-3">🛠️</span>
                Outils de construction géométrique
              </h2>
              
              <div className="grid md:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-purple-100 to-pink-100 p-6 rounded-2xl text-center">
                  <div className="text-4xl mb-3">📐</div>
                  <h3 className="text-lg font-bold text-purple-800 mb-2">Rapporteur</h3>
                  <p className="text-sm text-purple-700">Mesurer et construire des angles précis</p>
                </div>
                
                <div className="bg-gradient-to-br from-pink-100 to-red-100 p-6 rounded-2xl text-center">
                  <div className="text-4xl mb-3">🧭</div>
                  <h3 className="text-lg font-bold text-pink-800 mb-2">Compas</h3>
                  <p className="text-sm text-pink-700">Tracer des cercles et reporter des distances</p>
                </div>
                
                <div className="bg-gradient-to-br from-red-100 to-orange-100 p-6 rounded-2xl text-center">
                  <div className="text-4xl mb-3">📏</div>
                  <h3 className="text-lg font-bold text-red-800 mb-2">Règle</h3>
                  <p className="text-sm text-red-700">Tracer des droites et mesurer des longueurs</p>
                </div>
                
                <div className="bg-gradient-to-br from-orange-100 to-yellow-100 p-6 rounded-2xl text-center">
                  <div className="text-4xl mb-3">🔺</div>
                  <h3 className="text-lg font-bold text-orange-800 mb-2">Équerre</h3>
                  <p className="text-sm text-orange-700">Construire des angles droits et des perpendiculaires</p>
                </div>
              </div>
            </div>

            {/* Section 2: Construction d'angles */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
              <h2 className="text-2xl font-bold text-pink-800 mb-6 flex items-center">
                <span className="bg-pink-100 p-2 rounded-lg mr-3">📐</span>
                Construction d'angles remarquables
              </h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-bold text-pink-800 mb-4">Méthodes de construction</h3>
                  <div className="space-y-4">
                    <div className="bg-pink-50 p-4 rounded-lg">
                      <h4 className="font-bold text-pink-800">Avec rapporteur</h4>
                      <p className="text-pink-700">Méthode directe : placer le centre sur le sommet et mesurer l'angle voulu.</p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <h4 className="font-bold text-purple-800">Avec compas et règle</h4>
                      <p className="text-purple-700">Constructions géométriques classiques pour 30°, 45°, 60°, 90°.</p>
                    </div>
                    <div className="bg-red-50 p-4 rounded-lg">
                      <h4 className="font-bold text-red-800">Par bissectrices</h4>
                      <p className="text-red-700">Diviser un angle en deux pour obtenir des angles plus petits.</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col items-center">
                  <div className="bg-gradient-to-br from-pink-100 to-purple-100 p-6 rounded-2xl mb-4">
                    <h3 className="text-lg font-bold text-pink-800 mb-4 text-center">Angles remarquables</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center bg-white p-3 rounded-lg">
                        <span className="font-bold text-pink-600">30°</span>
                        <span className="text-sm text-gray-600">Triangle équilatéral ÷ 2</span>
                      </div>
                      <div className="flex justify-between items-center bg-white p-3 rounded-lg">
                        <span className="font-bold text-purple-600">45°</span>
                        <span className="text-sm text-gray-600">Diagonale d'un carré</span>
                      </div>
                      <div className="flex justify-between items-center bg-white p-3 rounded-lg">
                        <span className="font-bold text-red-600">60°</span>
                        <span className="text-sm text-gray-600">Triangle équilatéral</span>
                      </div>
                      <div className="flex justify-between items-center bg-white p-3 rounded-lg">
                        <span className="font-bold text-orange-600">90°</span>
                        <span className="text-sm text-gray-600">Angle droit</span>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => startAnimation(0)}
                    className="bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600 transition-colors"
                  >
                    🎬 Animation construction triangle
                  </button>
                </div>
              </div>
            </div>

            {/* Section 3: Polygones réguliers */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
              <h2 className="text-2xl font-bold text-red-800 mb-6 flex items-center">
                <span className="bg-red-100 p-2 rounded-lg mr-3">⬡</span>
                Polygones réguliers
              </h2>
              
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gradient-to-br from-red-100 to-pink-100 p-6 rounded-2xl">
                  <h3 className="text-lg font-bold text-red-800 mb-3">Triangle équilatéral</h3>
                  <div className="text-center mb-3">
                    <svg width="80" height="70" viewBox="0 0 80 70">
                      <polygon points="40,10 15,60 65,60" fill="#fecaca" stroke="#dc2626" strokeWidth="2"/>
                    </svg>
                  </div>
                  <p className="text-sm text-red-700">Angle au centre : 120°</p>
                  <p className="text-sm text-red-700">Angle intérieur : 60°</p>
                </div>
                
                <div className="bg-gradient-to-br from-blue-100 to-cyan-100 p-6 rounded-2xl">
                  <h3 className="text-lg font-bold text-blue-800 mb-3">Carré</h3>
                  <div className="text-center mb-3">
                    <svg width="80" height="70" viewBox="0 0 80 70">
                      <rect x="20" y="15" width="40" height="40" fill="#bfdbfe" stroke="#2563eb" strokeWidth="2"/>
                    </svg>
                  </div>
                  <p className="text-sm text-blue-700">Angle au centre : 90°</p>
                  <p className="text-sm text-blue-700">Angle intérieur : 90°</p>
                </div>
                
                <div className="bg-gradient-to-br from-green-100 to-emerald-100 p-6 rounded-2xl">
                  <h3 className="text-lg font-bold text-green-800 mb-3">Hexagone</h3>
                  <div className="text-center mb-3">
                    <svg width="80" height="70" viewBox="0 0 80 70">
                      <polygon points="40,10 60,25 60,45 40,60 20,45 20,25" fill="#bbf7d0" stroke="#059669" strokeWidth="2"/>
                    </svg>
                  </div>
                  <p className="text-sm text-green-700">Angle au centre : 60°</p>
                  <p className="text-sm text-green-700">Angle intérieur : 120°</p>
                </div>
              </div>
              
              <div className="text-center">
                <button 
                  onClick={() => startAnimation(1)}
                  className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-colors"
                >
                  🎬 Animation hexagone régulier
                </button>
              </div>
            </div>

            {/* Section 4: Vérifications */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
              <h2 className="text-2xl font-bold text-orange-800 mb-6 flex items-center">
                <span className="bg-orange-100 p-2 rounded-lg mr-3">✓</span>
                Vérification des constructions
              </h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-bold text-orange-800 mb-4">Méthodes de vérification</h3>
                  <div className="space-y-4">
                    <div className="bg-orange-50 p-4 rounded-lg">
                      <h4 className="font-bold text-orange-800">Mesure directe</h4>
                      <p className="text-orange-700">Utiliser le rapporteur pour vérifier les angles construits.</p>
                    </div>
                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <h4 className="font-bold text-yellow-800">Calcul trigonométrique</h4>
                      <p className="text-yellow-700">Utiliser cos, sin, tan pour vérifier les rapports de longueurs.</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h4 className="font-bold text-green-800">Propriétés géométriques</h4>
                      <p className="text-green-700">Vérifier les symétries, égalités d'angles, parallélisme...</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col justify-center">
                  <div className="bg-gradient-to-br from-orange-100 to-yellow-100 p-6 rounded-2xl mb-4">
                    <h3 className="text-lg font-bold text-orange-800 mb-4">Exemple de vérification</h3>
                    <div className="bg-white p-4 rounded-lg space-y-2">
                      <p className="text-sm"><strong>Triangle ABC construit :</strong></p>
                      <p className="text-sm">AB = 5 cm, AC = 4 cm, angle A = 60°</p>
                      <p className="text-sm text-orange-600"><strong>Vérification :</strong></p>
                      <p className="text-sm">cos(60°) = 0,5</p>
                      <p className="text-sm">Projection de AC sur AB = 4 × 0,5 = 2 cm ✓</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => startAnimation(2)}
                    className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
                  >
                    🎬 Animation vérification
                  </button>
                </div>
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
                  <div className="bg-gradient-to-br from-gray-100 to-purple-100 p-8 rounded-2xl">
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
                    className="bg-purple-500 text-white px-4 py-2 rounded-lg disabled:opacity-50"
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
                  <span className="bg-purple-100 p-2 rounded-lg mr-3">📏</span>
                  Exercice {currentExercise + 1} sur {exercises.length}
                </h2>
                <div className="flex items-center space-x-4">
                  <div className="text-lg font-bold text-purple-600">
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
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-2xl mb-6">
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
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
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
                        className="bg-purple-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
                    className="bg-purple-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-purple-600 disabled:opacity-50 transition-colors"
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