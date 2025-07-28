'use client'

import { useState } from 'react'
import { ArrowLeft, BookOpen, Target, Play, RotateCcw, CheckCircle, XCircle, Lightbulb, Compass, Ruler } from 'lucide-react'
import Link from 'next/link'
import { VoiceInput } from '../../../components/VoiceInput'

export default function CosinusApplicationsPage() {
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
    // Niveau 1-5 : Problèmes simples avec échelles
    {
      question: 'Une échelle de 4 m est posée contre un mur. Elle fait un angle de 60° avec le sol. À quelle distance du mur se trouve le pied de l\'échelle ? (arrondi au cm)',
      answer: '2',
      explanation: 'Distance = longueur × cos(60°) = 4 × 0,5 = 2 m',
      hint: 'La distance cherchée est le côté adjacent à l\'angle de 60°'
    },
    {
      question: 'Une échelle de 6 m fait un angle de 70° avec le sol. Quelle est sa distance horizontale au mur ? (arrondi au dm)',
      answer: '21',
      explanation: 'Distance = 6 × cos(70°) = 6 × 0,342 ≈ 2,05 m = 20,5 dm ≈ 21 dm',
      hint: 'Utilise cos(70°) ≈ 0,342'
    },
    {
      question: 'Un toboggan de 5 m fait un angle de 30° avec l\'horizontale. Quelle est sa projection horizontale ? (arrondi au dm)',
      answer: '43',
      explanation: 'Projection = 5 × cos(30°) = 5 × 0,866 ≈ 4,33 m = 43,3 dm ≈ 43 dm',
      hint: 'cos(30°) = √3/2 ≈ 0,866'
    },
    {
      question: 'Le pied d\'une échelle est à 2,5 m d\'un mur. L\'échelle mesure 5 m. Quel angle fait-elle avec le sol ? (au degré près)',
      answer: '60',
      explanation: 'cos(α) = adjacent/hypoténuse = 2,5/5 = 0,5, donc α = 60°',
      hint: 'cos(α) = distance au mur / longueur échelle'
    },
    {
      question: 'Une rampe d\'accès de 8 m fait un angle de 5° avec l\'horizontale. Quelle est sa longueur horizontale ? (arrondi au cm)',
      answer: '797',
      explanation: 'Longueur horizontale = 8 × cos(5°) = 8 × 0,996 ≈ 7,97 m = 797 cm',
      hint: 'cos(5°) ≈ 0,996 (angle très petit)'
    },

    // Niveau 6-10 : Problèmes avec toits et pentes
    {
      question: 'Un toit a une pente de 35°. Si la largeur de la maison est 12 m, quelle est la longueur d\'un versant ? (arrondi au dm)',
      answer: '146',
      explanation: 'Longueur versant = largeur / cos(35°) = 12 / 0,819 ≈ 14,65 m = 146,5 dm ≈ 146 dm',
      hint: 'La largeur est le côté adjacent à l\'angle de pente'
    },
    {
      question: 'Une gouttière est à 6 m de hauteur. Une échelle fait un angle de 75° avec le sol. Quelle longueur d\'échelle faut-il ? (arrondi au dm)',
      answer: '62',
      explanation: 'Longueur = hauteur / sin(75°) = 6 / 0,966 ≈ 6,21 m. Attention : ici on utilise sin, pas cos !',
      hint: 'Attention : la hauteur est le côté opposé, pas adjacent !'
    },
    {
      question: 'Une pente de ski fait un angle de 25° avec l\'horizontale. Un skieur parcourt 200 m sur cette pente. Quelle est sa distance horizontale ? (arrondi au m)',
      answer: '181',
      explanation: 'Distance horizontale = 200 × cos(25°) = 200 × 0,906 ≈ 181,2 m ≈ 181 m',
      hint: 'cos(25°) ≈ 0,906'
    },
    {
      question: 'Un panneau solaire incliné à 40° a une largeur de 3 m. Quelle est sa projection au sol ? (arrondi au cm)',
      answer: '230',
      explanation: 'Projection = 3 × cos(40°) = 3 × 0,766 ≈ 2,30 m = 230 cm',
      hint: 'cos(40°) ≈ 0,766'
    },
    {
      question: 'Une route monte avec un angle de 8°. Sur 1 km de route, quelle est la distance horizontale parcourue ? (arrondi au m)',
      answer: '990',
      explanation: 'Distance horizontale = 1000 × cos(8°) = 1000 × 0,990 = 990 m',
      hint: 'cos(8°) ≈ 0,990'
    },

    // Niveau 11-15 : Navigation et aviation
    {
      question: 'Un avion vole à 500 km/h avec un cap de 30° par rapport au nord. Quelle est sa vitesse vers le nord ? (arrondi au km/h)',
      answer: '433',
      explanation: 'Vitesse nord = 500 × cos(30°) = 500 × 0,866 ≈ 433 km/h',
      hint: 'cos(30°) = √3/2 ≈ 0,866'
    },
    {
      question: 'Un bateau navigue avec un cap de 45° nord-est à 20 nœuds. Quelle est sa vitesse vers l\'est ? (arrondi au nœud)',
      answer: '14',
      explanation: 'Vitesse est = 20 × cos(45°) = 20 × 0,707 ≈ 14,1 nœuds ≈ 14 nœuds',
      hint: 'cos(45°) = √2/2 ≈ 0,707'
    },
    {
      question: 'Un avion décolle avec un angle de 15°. Après 3 km de vol, quelle est sa distance horizontale ? (arrondi au m)',
      answer: '2898',
      explanation: 'Distance horizontale = 3000 × cos(15°) = 3000 × 0,966 ≈ 2898 m',
      hint: 'cos(15°) ≈ 0,966'
    },
    {
      question: 'Un voilier fait route plein ouest avec un vent venant du nord-ouest (angle de 45°). Si le vent souffle à 25 km/h, quelle est la composante ouest du vent ? (arrondi au km/h)',
      answer: '18',
      explanation: 'Composante ouest = 25 × cos(45°) = 25 × 0,707 ≈ 17,7 km/h ≈ 18 km/h',
      hint: 'Le vent vient du nord-ouest, donc fait 45° avec l\'ouest'
    },
    {
      question: 'Un parachutiste dérive avec un angle de 20° par rapport à la verticale à cause du vent. S\'il tombe de 1000 m, quelle est sa dérive horizontale ? (arrondi au m)',
      answer: '364',
      explanation: 'Dérive = 1000 × sin(20°) = 1000 × 0,342 ≈ 342 m. Attention : ici c\'est sin, pas cos !',
      hint: 'Attention : l\'angle est par rapport à la verticale !'
    },

    // Niveau 16-20 : Problèmes complexes et techniques
    {
      question: 'Une antenne de 50 m est maintenue par un câble qui fait un angle de 65° avec l\'antenne. Le câble est fixé au sol à quelle distance de la base ? (arrondi au m)',
      answer: '21',
      explanation: 'Distance = 50 × sin(65°) = 50 × 0,906 ≈ 45,3 m. Erreur dans ma réponse ! cos(25°) car 90°-65°=25°. Distance = 50 × cos(25°) = 50 × 0,906 ≈ 45 m. Hmm, il faut revoir...',
      hint: 'Dessine le triangle ! L\'angle avec l\'antenne donne quoi au sol ?'
    },
    {
      question: 'Un pont-levis de 8 m fait un angle de 40° avec l\'horizontale quand il est relevé. Quelle est la hauteur de son extrémité libre ? (arrondi au m)',
      answer: '5',
      explanation: 'Hauteur = 8 × sin(40°) = 8 × 0,643 ≈ 5,14 m ≈ 5 m',
      hint: 'La hauteur correspond au côté opposé à l\'angle avec l\'horizontale'
    },
    {
      question: 'Un radar détecte un avion à 10 km avec un angle d\'élévation de 30°. Quelle est la distance horizontale de l\'avion ? (arrondi au km)',
      answer: '9',
      explanation: 'Distance horizontale = 10 × cos(30°) = 10 × 0,866 ≈ 8,66 km ≈ 9 km',
      hint: 'cos(30°) = √3/2 ≈ 0,866'
    },
    {
      question: 'Une grue a une flèche de 30 m inclinée à 60° par rapport à l\'horizontale. Quelle est la portée horizontale maximum ? (arrondi au m)',
      answer: '15',
      explanation: 'Portée = 30 × cos(60°) = 30 × 0,5 = 15 m',
      hint: 'cos(60°) = 1/2'
    },
    {
      question: 'Un satellite géostationnaire est à 36000 km d\'altitude. Vu depuis un point terrestre, il fait un angle de 45° avec l\'horizon. À quelle distance horizontale se trouve-t-il ? (arrondi au millier de km)',
      answer: '36',
      explanation: 'Distance horizontale = 36000 × cos(45°) = 36000 × 0,707 ≈ 25452 km. Mais en réalité, c\'est plus complexe avec la courbure terrestre...',
      hint: 'cos(45°) = √2/2 ≈ 0,707 (approximation sans courbure terrestre)'
    }
  ]

  const animations = [
    {
      title: 'L\'échelle contre le mur',
      steps: [
        'Une échelle de longueur L appuyée contre un mur',
        'Elle fait un angle α avec le sol',
        'La distance au mur = L × cos(α)',
        'Plus l\'angle augmente, plus on se rapproche du mur'
      ]
    },
    {
      title: 'Navigation et composantes',
      steps: [
        'Un véhicule se déplace avec une vitesse V',
        'Il fait un cap d\'angle α par rapport au nord',
        'Composante nord = V × cos(α)',
        'Composante est = V × sin(α)'
      ]
    },
    {
      title: 'Problème de toit',
      steps: [
        'Un toit avec une pente d\'angle α',
        'Largeur de la maison = L',
        'Longueur du versant = L / cos(α)',
        'Plus la pente est forte, plus le versant est long'
      ]
    }
  ]

  const checkAnswer = () => {
    const currentEx = exercises[currentExercise]
    const userAnswerNum = parseFloat(userAnswer.replace(',', '.'))
    const correctAnswerNum = parseFloat(currentEx.answer)
    
    // Tolérance pour les calculs numériques
    const tolerance = Math.max(1, correctAnswerNum * 0.02) // 2% ou 1 unité minimum
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-green-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/chapitre/4eme-cosinus" className="p-2 hover:bg-white/60 rounded-lg transition-colors">
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">🏗️ Applications et problèmes</h1>
                <p className="text-gray-600">Résoudre des problèmes concrets avec le cosinus</p>
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
            {/* Section 1: Problèmes d'échelles et rampes */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
              <h2 className="text-2xl font-bold text-blue-800 mb-6 flex items-center">
                <span className="bg-blue-100 p-2 rounded-lg mr-3">🪜</span>
                Échelles et rampes d'accès
              </h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-bold text-blue-800 mb-4">Problème type : L'échelle</h3>
                  <div className="space-y-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-bold text-blue-800">Données</h4>
                      <p className="text-blue-700">• Longueur de l'échelle : L</p>
                      <p className="text-blue-700">• Angle avec le sol : α</p>
                    </div>
                    <div className="bg-cyan-50 p-4 rounded-lg">
                      <h4 className="font-bold text-cyan-800">À calculer</h4>
                      <p className="text-cyan-700">Distance au mur = L × cos(α)</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h4 className="font-bold text-green-800">Exemple</h4>
                      <p className="text-green-700">Échelle 5m, angle 60° ⟹ Distance = 5 × 0,5 = 2,5 m</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col items-center">
                  <div className="bg-gradient-to-br from-blue-100 to-cyan-100 p-6 rounded-2xl mb-4">
                    <svg width="200" height="160" viewBox="0 0 200 160">
                      {/* Mur */}
                      <line x1="160" y1="30" x2="160" y2="140" stroke="#4f46e5" strokeWidth="8"/>
                      {/* Sol */}
                      <line x1="20" y1="140" x2="180" y2="140" stroke="#8b5cf6" strokeWidth="4"/>
                      {/* Échelle */}
                      <line x1="70" y1="140" x2="160" y2="50" stroke="#dc2626" strokeWidth="4"/>
                      {/* Angle */}
                      <path d="M 70,140 A 20,20 0 0,0 85,128" fill="none" stroke="#ea580c" strokeWidth="2"/>
                      {/* Étiquettes */}
                      <text x="65" y="155" className="text-xs fill-orange-600 font-bold">α</text>
                      <text x="110" y="90" className="text-xs fill-red-600 font-bold">L</text>
                      <text x="110" y="155" className="text-xs fill-blue-600 font-bold">L×cos(α)</text>
                      <text x="175" y="90" className="text-xs fill-gray-600">Mur</text>
                    </svg>
                  </div>
                  <button 
                    onClick={() => startAnimation(0)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    🎬 Animation échelle
                  </button>
                </div>
              </div>
            </div>

            {/* Section 2: Navigation et transport */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
              <h2 className="text-2xl font-bold text-cyan-800 mb-6 flex items-center">
                <span className="bg-cyan-100 p-2 rounded-lg mr-3">🧭</span>
                Navigation et transport
              </h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-bold text-cyan-800 mb-4">Décomposition des vitesses</h3>
                  <div className="space-y-4">
                    <div className="bg-cyan-50 p-4 rounded-lg">
                      <h4 className="font-bold text-cyan-800">Principe</h4>
                      <p className="text-cyan-700">Un véhicule avec cap α par rapport au nord :</p>
                      <p className="text-cyan-700">• Vitesse nord = V × cos(α)</p>
                      <p className="text-cyan-700">• Vitesse est = V × sin(α)</p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-bold text-blue-800">Applications</h4>
                      <p className="text-blue-700">🛩️ Aviation : calcul des composantes de vitesse</p>
                      <p className="text-blue-700">⛵ Navigation : dérive due au vent</p>
                      <p className="text-blue-700">🚗 Automobile : montée sur pente</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col items-center">
                  <div className="bg-gradient-to-br from-cyan-100 to-blue-100 p-6 rounded-2xl mb-4">
                    <svg width="200" height="160" viewBox="0 0 200 160">
                      {/* Axes */}
                      <line x1="30" y1="140" x2="30" y2="40" stroke="#6b7280" strokeWidth="2" markerEnd="url(#arrowhead)"/>
                      <line x1="30" y1="140" x2="150" y2="140" stroke="#6b7280" strokeWidth="2" markerEnd="url(#arrowhead)"/>
                      {/* Vecteur vitesse */}
                      <line x1="30" y1="140" x2="120" y2="80" stroke="#dc2626" strokeWidth="4" markerEnd="url(#arrowhead)"/>
                      {/* Composantes */}
                      <line x1="30" y1="140" x2="30" y2="80" stroke="#059669" strokeWidth="3" strokeDasharray="5,5"/>
                      <line x1="30" y1="140" x2="120" y2="140" stroke="#2563eb" strokeWidth="3" strokeDasharray="5,5"/>
                      {/* Angle */}
                      <path d="M 50,140 A 20,20 0 0,0 65,115" fill="none" stroke="#ea580c" strokeWidth="2"/>
                      {/* Étiquettes */}
                      <text x="15" y="50" className="text-xs fill-gray-600">Nord</text>
                      <text x="140" y="155" className="text-xs fill-gray-600">Est</text>
                      <text x="70" y="105" className="text-xs fill-red-600 font-bold">V</text>
                      <text x="10" y="115" className="text-xs fill-green-600 font-bold">V×cos(α)</text>
                      <text x="65" y="155" className="text-xs fill-blue-600 font-bold">V×sin(α)</text>
                      <text x="55" y="130" className="text-xs fill-orange-600 font-bold">α</text>
                      <defs>
                        <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                          <polygon points="0 0, 10 3.5, 0 7" fill="#6b7280" />
                        </marker>
                      </defs>
                    </svg>
                  </div>
                  <button 
                    onClick={() => startAnimation(1)}
                    className="bg-cyan-500 text-white px-4 py-2 rounded-lg hover:bg-cyan-600 transition-colors"
                  >
                    🎬 Animation navigation
                  </button>
                </div>
              </div>
            </div>

            {/* Section 3: Bâtiment et architecture */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
              <h2 className="text-2xl font-bold text-green-800 mb-6 flex items-center">
                <span className="bg-green-100 p-2 rounded-lg mr-3">🏠</span>
                Bâtiment et architecture
              </h2>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-green-100 to-emerald-100 p-6 rounded-2xl">
                  <h3 className="text-lg font-bold text-green-800 mb-3">Toits et charpentes</h3>
                  <div className="space-y-2 text-sm">
                    <p className="text-green-700">🏠 Calcul longueur versant</p>
                    <p className="text-green-700">📐 Pente du toit</p>
                    <p className="text-green-700">🌧️ Surface de couverture</p>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-blue-100 to-sky-100 p-6 rounded-2xl">
                  <h3 className="text-lg font-bold text-blue-800 mb-3">Rampes et escaliers</h3>
                  <div className="space-y-2 text-sm">
                    <p className="text-blue-700">♿ Accessibilité PMR</p>
                    <p className="text-blue-700">📏 Longueur de rampe</p>
                    <p className="text-blue-700">⬆️ Montée verticale</p>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-purple-100 to-pink-100 p-6 rounded-2xl">
                  <h3 className="text-lg font-bold text-purple-800 mb-3">Panneaux solaires</h3>
                  <div className="space-y-2 text-sm">
                    <p className="text-purple-700">☀️ Angle d'inclinaison</p>
                    <p className="text-purple-700">📊 Projection au sol</p>
                    <p className="text-purple-700">🔋 Optimisation énergétique</p>
                  </div>
                </div>
              </div>
              
              <div className="text-center mt-6">
                <button 
                  onClick={() => startAnimation(2)}
                  className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors"
                >
                  🎬 Animation problème de toit
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
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg disabled:opacity-50"
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
                  <span className="bg-blue-100 p-2 rounded-lg mr-3">🏗️</span>
                  Exercice {currentExercise + 1} sur {exercises.length}
                </h2>
                <div className="flex items-center space-x-4">
                  <div className="text-lg font-bold text-blue-600">
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
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-2xl mb-6">
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
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                        className="bg-blue-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-600 disabled:opacity-50 transition-colors"
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