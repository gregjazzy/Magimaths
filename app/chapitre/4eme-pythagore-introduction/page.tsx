'use client'

import { useState } from 'react'
import { ArrowLeft, BookOpen, Target, Play, RotateCcw, CheckCircle, XCircle, Lightbulb, Eye } from 'lucide-react'
import Link from 'next/link'
import { VoiceInput } from '../../../components/VoiceInput'

export default function PythagoreIntroductionPage() {
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
      question: 'Dans un triangle rectangle, comment s\'appelle le côté le plus long ?',
      answer: 'hypoténuse',
      explanation: 'L\'hypoténuse est toujours le côté opposé à l\'angle droit, c\'est le plus long côté du triangle rectangle.',
      hint: 'C\'est le côté opposé à l\'angle droit'
    },
    {
      question: 'Le théorème de Pythagore ne s\'applique qu\'aux triangles de quel type ?',
      answer: 'rectangles',
      explanation: 'Le théorème de Pythagore ne s\'applique qu\'aux triangles rectangles (qui ont un angle de 90°).',
      hint: 'Il faut un angle de 90° dans le triangle'
    },
    {
      question: 'Dans un triangle ABC rectangle en C, quels sont les côtés de l\'angle droit ?',
      answer: 'AC et BC',
      explanation: 'Si le triangle est rectangle en C, alors l\'angle droit est au sommet C, et les côtés AC et BC forment cet angle droit.',
      hint: 'Ce sont les côtés qui partent du sommet où est l\'angle droit'
    },
    {
      question: 'Si un triangle ABC est rectangle en B, quel est le nom de l\'hypoténuse ?',
      answer: 'AC',
      explanation: 'L\'hypoténuse est le côté opposé à l\'angle droit. Si l\'angle droit est en B, l\'hypoténuse est AC.',
      hint: 'L\'hypoténuse est le côté qui ne touche pas le sommet de l\'angle droit'
    },
    {
      question: 'Dans la formule de Pythagore a² + b² = c², que représente c ?',
      answer: 'hypoténuse',
      explanation: 'Dans la formule a² + b² = c², c représente toujours l\'hypoténuse (le côté le plus long).',
      hint: 'C\'est le côté le plus long du triangle rectangle'
    },

    // Niveau 6-10 : Découverte de la formule
    {
      question: 'Complète la formule de Pythagore : Dans un triangle rectangle, ... = ...',
      answer: 'hypoténuse² = côté1² + côté2²',
      explanation: 'La formule de Pythagore : le carré de l\'hypoténuse est égal à la somme des carrés des deux autres côtés.',
      hint: 'Il s\'agit des carrés des longueurs des côtés'
    },
    {
      question: 'Dans un triangle rectangle de côtés 3, 4 et 5, quel côté est l\'hypoténuse ?',
      answer: '5',
      explanation: 'L\'hypoténuse est le côté le plus long. Ici c\'est 5. On peut vérifier : 3² + 4² = 9 + 16 = 25 = 5².',
      hint: 'L\'hypoténuse est toujours le côté le plus long'
    },
    {
      question: 'Si les côtés de l\'angle droit mesurent 3 et 4, que vaut le carré de l\'hypoténuse ?',
      answer: '25',
      explanation: 'D\'après Pythagore : hypoténuse² = 3² + 4² = 9 + 16 = 25',
      hint: 'Utilise la formule de Pythagore'
    },
    {
      question: 'Dans un triangle rectangle, si deux côtés mesurent 5 et 12, et que l\'hypoténuse mesure 13, vérifie avec Pythagore.',
      answer: '5² + 12² = 13²',
      explanation: 'Vérification : 5² + 12² = 25 + 144 = 169 = 13². Le théorème de Pythagore est bien vérifié.',
      hint: 'Calcule les carrés et vérifie l\'égalité'
    },
    {
      question: 'Que vaut 6² + 8² ?',
      answer: '100',
      explanation: '6² + 8² = 36 + 64 = 100. Donc dans un triangle rectangle de côtés 6 et 8, l\'hypoténuse mesure √100 = 10.',
      hint: 'Calcule 6 × 6 + 8 × 8'
    },

    // Niveau 11-15 : Applications simples
    {
      question: 'Dans un triangle rectangle, si l\'hypoténuse mesure 5 et un côté mesure 3, que vaut l\'autre côté ?',
      answer: '4',
      explanation: 'D\'après Pythagore : 3² + b² = 5², donc 9 + b² = 25, donc b² = 16, donc b = 4.',
      hint: 'Utilise a² + b² = c² avec c = 5 et a = 3'
    },
    {
      question: 'Vrai ou faux : Dans tout triangle, le carré du côté le plus long égale la somme des carrés des deux autres côtés.',
      answer: 'faux',
      explanation: 'Faux ! Cette propriété n\'est vraie que pour les triangles rectangles, pas pour tous les triangles.',
      hint: 'Le théorème de Pythagore ne marche que pour les triangles rectangles'
    },
    {
      question: 'Dans un carré de côté 1, que vaut la longueur de la diagonale ?',
      answer: '√2',
      explanation: 'La diagonale d\'un carré divise le carré en deux triangles rectangles. D\'après Pythagore : d² = 1² + 1² = 2, donc d = √2.',
      hint: 'La diagonale forme un triangle rectangle avec deux côtés du carré'
    },
    {
      question: 'Le triangle de côtés 3, 4, 5 est-il rectangle ?',
      answer: 'oui',
      explanation: 'Oui ! Car 3² + 4² = 9 + 16 = 25 = 5². Le théorème de Pythagore est vérifié, donc le triangle est rectangle.',
      hint: 'Vérifie si a² + b² = c² avec les trois côtés'
    },
    {
      question: 'Dans un triangle rectangle isocèle de côtés égaux a, que vaut l\'hypoténuse ?',
      answer: 'a√2',
      explanation: 'Dans un triangle rectangle isocèle : h² = a² + a² = 2a², donc h = a√2.',
      hint: 'Les deux côtés de l\'angle droit sont égaux'
    },

    // Niveau 16-20 : Histoire et culture mathématique
    {
      question: 'Le théorème de Pythagore était-il connu avant Pythagore ?',
      answer: 'oui',
      explanation: 'Oui ! Les Babyloniens et les Égyptiens connaissaient cette propriété bien avant Pythagore, mais Pythagore a donné la première démonstration rigoureuse.',
      hint: 'Les anciens peuples utilisaient déjà cette propriété'
    },
    {
      question: 'Les anciens Égyptiens utilisaient une corde à 12 nœuds pour faire quoi ?',
      answer: 'angle droit',
      explanation: 'Ils faisaient un triangle de côtés 3-4-5 avec la corde pour construire des angles droits parfaits pour leurs monuments.',
      hint: 'Ils utilisaient le triangle 3-4-5'
    },
    {
      question: 'Combien existe-t-il de démonstrations différentes du théorème de Pythagore ?',
      answer: 'plus de 300',
      explanation: 'Il existe plus de 300 démonstrations différentes du théorème de Pythagore ! C\'est un record en mathématiques.',
      hint: 'C\'est un très grand nombre, plus de 200...'
    },
    {
      question: 'Comment appelle-t-on un triplet de nombres entiers qui vérifient le théorème de Pythagore ?',
      answer: 'triplet pythagoricien',
      explanation: 'Un triplet pythagoricien est un ensemble de trois nombres entiers (a,b,c) tels que a² + b² = c². Exemple : (3,4,5).',
      hint: 'Ça porte le nom de Pythagore'
    },
    {
      question: 'Quel est le plus petit triplet pythagoricien ?',
      answer: '3-4-5',
      explanation: 'Le plus petit triplet pythagoricien est (3,4,5) car 3² + 4² = 9 + 16 = 25 = 5².',
      hint: 'Ce sont trois petits nombres entiers consécutifs ou presque'
    },

    // Niveau 16-20 : Introduction à la contraposée
    {
      question: 'Si dans un triangle, a² + b² ≠ c², que peut-on conclure ?',
      answer: 'pas rectangle',
      explanation: 'Par la contraposée du théorème de Pythagore : si a² + b² ≠ c², alors le triangle n\'est pas rectangle.',
      hint: 'C\'est la contraposée du théorème de Pythagore'
    },
    {
      question: 'Un triangle de côtés 2, 3 et 4 est-il rectangle ? Justifie avec la contraposée.',
      answer: 'non',
      explanation: '2² + 3² = 4 + 9 = 13 ≠ 16 = 4². Par la contraposée, le triangle n\'est pas rectangle.',
      hint: 'Vérifie si a² + b² = c² avec le plus grand côté'
    },
    {
      question: 'Qu\'est-ce que la contraposée d\'une implication logique ?',
      answer: 'négation de la conclusion implique négation de l\'hypothèse',
      explanation: 'Si A ⟹ B, alors la contraposée est : non B ⟹ non A. Les deux sont logiquement équivalentes.',
      hint: 'On inverse et on nie les deux parties de l\'implication'
    },
    {
      question: 'Triangle de côtés 1, 2 et 3. Utilise la contraposée pour conclure.',
      answer: 'impossible',
      explanation: '1² + 2² = 5 ≠ 9 = 3². Par la contraposée, pas rectangle. De plus, 1 + 2 = 3, donc le triangle n\'existe même pas !',
      hint: 'Vérifie aussi l\'inégalité triangulaire'
    },
    {
      question: 'Pour quoi la contraposée est-elle utile en géométrie ?',
      answer: 'prouver qu\'un triangle n\'est pas rectangle',
      explanation: 'La contraposée permet de prouver facilement qu\'un triangle N\'EST PAS rectangle sans chercher l\'angle droit.',
      hint: 'C\'est plus facile que de mesurer les angles'
    }
  ]

  const animations = [
    {
      title: 'Découverte visuelle du théorème',
      steps: [
        'Voici un triangle rectangle avec des carrés sur chaque côté',
        'Le carré sur l\'hypoténuse a pour aire c²',
        'Les carrés sur les côtés de l\'angle droit ont pour aires a² et b²',
        'Par découpage et assemblage, on montre que c² = a² + b²'
      ]
    },
    {
      title: 'Le triangle 3-4-5',
      steps: [
        'Construisons un triangle de côtés 3, 4 et 5',
        'Vérifions : 3² = 9, 4² = 16, 5² = 25',
        'Calculons : 9 + 16 = 25',
        'Donc 3² + 4² = 5² : le théorème est vérifié !'
      ]
    },
    {
      title: 'Applications historiques',
      steps: [
        'Les anciens Égyptiens utilisaient une corde à 12 nœuds',
        'Ils faisaient un triangle de côtés 3-4-5 avec la corde',
        'Cela leur donnait un angle droit parfait',
        'Ils pouvaient ainsi construire des monuments aux angles droits précis'
      ]
    }
  ]

  const checkAnswer = () => {
    const currentEx = exercises[currentExercise]
    const userAnswerClean = userAnswer.toLowerCase().trim()
    const correctAnswerClean = currentEx.answer.toLowerCase().trim()
    
    // Gestion des réponses flexibles
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/chapitre/4eme-theoreme-pythagore" className="p-2 hover:bg-white/60 rounded-lg transition-colors">
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">🔺 Introduction et découverte</h1>
                <p className="text-gray-600">Découvrir le théorème de Pythagore</p>
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
            {/* Section 1: Qu'est-ce que le théorème de Pythagore ? */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
              <h2 className="text-2xl font-bold text-blue-800 mb-6 flex items-center">
                <span className="bg-blue-100 p-2 rounded-lg mr-3">🔺</span>
                Qu'est-ce que le théorème de Pythagore ?
              </h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-bold text-blue-800 mb-4">Énoncé du théorème</h3>
                  <div className="bg-gradient-to-r from-blue-100 to-indigo-100 p-6 rounded-2xl mb-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600 mb-4">
                        Dans un triangle rectangle
                      </div>
                      <div className="text-3xl font-bold text-indigo-600 mb-2">
                        a² + b² = c²
                      </div>
                      <div className="text-sm text-gray-600">
                        où c est l'hypoténuse et a, b les côtés de l'angle droit
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-bold text-blue-800">En mots</h4>
                      <p className="text-blue-700">Le carré de l'hypoténuse égale la somme des carrés des deux autres côtés.</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col items-center">
                  <div className="bg-gradient-to-br from-blue-100 to-indigo-100 p-6 rounded-2xl mb-4">
                    <svg width="200" height="160" viewBox="0 0 200 160">
                      {/* Triangle rectangle */}
                      <polygon points="40,120 120,120 120,60" fill="#dbeafe" stroke="#3b82f6" strokeWidth="3"/>
                      
                      {/* Carrés sur les côtés */}
                      <rect x="40" y="120" width="80" height="20" fill="#bfdbfe" stroke="#1d4ed8" strokeWidth="2" opacity="0.7"/>
                      <rect x="120" y="60" width="20" height="60" fill="#bfdbfe" stroke="#1d4ed8" strokeWidth="2" opacity="0.7"/>
                      <polygon points="40,120 40,40 120,60 120,120" fill="#93c5fd" stroke="#1e40af" strokeWidth="2" opacity="0.7"/>
                      
                      {/* Labels */}
                      <text x="35" y="135" className="text-sm font-bold fill-blue-600">A</text>
                      <text x="125" y="135" className="text-sm font-bold fill-blue-600">B</text>
                      <text x="125" y="55" className="text-sm font-bold fill-blue-600">C</text>
                      
                      <text x="75" y="135" className="text-xs fill-blue-800">a</text>
                      <text x="135" y="95" className="text-xs fill-blue-800">b</text>
                      <text x="70" y="85" className="text-xs fill-indigo-800 font-bold">c</text>
                      
                      {/* Angle droit */}
                      <rect x="110" y="110" width="10" height="10" fill="none" stroke="#3b82f6" strokeWidth="2"/>
                    </svg>
                  </div>
                  <button 
                    onClick={() => startAnimation(0)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    🎬 Animation découverte visuelle
                  </button>
                </div>
              </div>
            </div>

            {/* Section 2: L'exemple historique 3-4-5 */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
              <h2 className="text-2xl font-bold text-indigo-800 mb-6 flex items-center">
                <span className="bg-indigo-100 p-2 rounded-lg mr-3">📏</span>
                L'exemple historique : le triangle 3-4-5
              </h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <div className="bg-gradient-to-r from-indigo-100 to-purple-100 p-6 rounded-2xl mb-6">
                    <h3 className="text-xl font-bold text-indigo-800 mb-3">Vérification</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center bg-white p-3 rounded-lg">
                        <span className="text-lg">3² =</span>
                        <span className="text-lg font-bold text-indigo-600">9</span>
                      </div>
                      <div className="flex justify-between items-center bg-white p-3 rounded-lg">
                        <span className="text-lg">4² =</span>
                        <span className="text-lg font-bold text-indigo-600">16</span>
                      </div>
                      <div className="flex justify-between items-center bg-white p-3 rounded-lg">
                        <span className="text-lg">5² =</span>
                        <span className="text-lg font-bold text-indigo-600">25</span>
                      </div>
                      <div className="border-t-2 border-indigo-300 pt-3">
                        <div className="flex justify-between items-center bg-indigo-50 p-3 rounded-lg">
                          <span className="text-lg font-bold">9 + 16 =</span>
                          <span className="text-xl font-bold text-indigo-800">25 ✓</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col items-center">
                  <div className="bg-gradient-to-br from-indigo-100 to-purple-100 p-6 rounded-2xl mb-4">
                    <svg width="200" height="150" viewBox="0 0 200 150">
                      {/* Triangle 3-4-5 */}
                      <polygon points="50,120 110,120 110,72" fill="#e0e7ff" stroke="#6366f1" strokeWidth="3"/>
                      
                      {/* Mesures */}
                      <text x="75" y="135" className="text-sm font-bold fill-indigo-600">3</text>
                      <text x="120" y="100" className="text-sm font-bold fill-indigo-600">4</text>
                      <text x="70" y="90" className="text-sm font-bold fill-purple-600">5</text>
                      
                      {/* Points */}
                      <circle cx="50" cy="120" r="3" fill="#6366f1"/>
                      <circle cx="110" cy="120" r="3" fill="#6366f1"/>
                      <circle cx="110" cy="72" r="3" fill="#6366f1"/>
                      
                      {/* Angle droit */}
                      <rect x="100" y="110" width="10" height="10" fill="none" stroke="#6366f1" strokeWidth="2"/>
                    </svg>
                  </div>
                  <button 
                    onClick={() => startAnimation(1)}
                    className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition-colors"
                  >
                    🎬 Animation triangle 3-4-5
                  </button>
                </div>
              </div>
            </div>

            {/* Section 3: Histoire et contexte */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
              <h2 className="text-2xl font-bold text-purple-800 mb-6 flex items-center">
                <span className="bg-purple-100 p-2 rounded-lg mr-3">📜</span>
                Histoire et contexte
              </h2>
              
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gradient-to-br from-purple-100 to-pink-100 p-6 rounded-2xl">
                  <h3 className="text-lg font-bold text-purple-800 mb-3">Babyloniens</h3>
                  <p className="text-sm text-purple-700 mb-3">Connaissaient déjà cette propriété il y a 4000 ans !</p>
                  <div className="text-xs text-purple-600">Utilisaient les triplets pythagoriciens</div>
                </div>
                
                <div className="bg-gradient-to-br from-pink-100 to-red-100 p-6 rounded-2xl">
                  <h3 className="text-lg font-bold text-pink-800 mb-3">Égyptiens</h3>
                  <p className="text-sm text-pink-700 mb-3">Utilisaient la "corde à 12 nœuds" pour construire des angles droits</p>
                  <div className="text-xs text-pink-600">Triangle 3-4-5 pour les pyramides</div>
                </div>
                
                <div className="bg-gradient-to-br from-red-100 to-orange-100 p-6 rounded-2xl">
                  <h3 className="text-lg font-bold text-red-800 mb-3">Pythagore</h3>
                  <p className="text-sm text-red-700 mb-3">A donné la première démonstration rigoureuse (VIe siècle av. J.-C.)</p>
                  <div className="text-xs text-red-600">Plus de 300 démonstrations existent !</div>
                </div>
              </div>
              
              <div className="text-center">
                <button 
                  onClick={() => startAnimation(2)}
                  className="bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600 transition-colors"
                >
                  🎬 Animation applications historiques
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
                  <span className="bg-blue-100 p-2 rounded-lg mr-3">✏️</span>
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
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl mb-6">
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