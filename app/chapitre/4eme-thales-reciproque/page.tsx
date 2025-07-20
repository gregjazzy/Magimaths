'use client'

import { useState } from 'react'
import { ArrowLeft, BookOpen, Target, Play, RotateCcw, CheckCircle, XCircle, Lightbulb } from 'lucide-react'
import Link from 'next/link'
import { VoiceInput } from '../../../components/VoiceInput'

export default function ThalesReciproquePage() {
  const [activeTab, setActiveTab] = useState<'cours' | 'exercices'>('cours')
  const [currentExercise, setCurrentExercise] = useState(0)
  const [userAnswer, setUserAnswer] = useState('')
  const [showAnswer, setShowAnswer] = useState(false)
  const [score, setScore] = useState(0)
  const [answerFeedback, setAnswerFeedback] = useState<'correct' | 'incorrect' | null>(null)

  const exercises = [
    // Niveau 1-5 : Reconnaissance de la réciproque
    {
      question: 'Dans un triangle ABC, si AM/AB = AN/AC, que peut-on dire des droites (MN) et (BC) ?',
      answer: 'parallèles',
      explanation: 'Par la réciproque de Thalès, si AM/AB = AN/AC, alors (MN) ∥ (BC).',
      hint: 'C\'est la réciproque du théorème de Thalès'
    },
    {
      question: 'Triangle ABC : AM = 4, AB = 6, AN = 6, AC = 9. Les droites (MN) et (BC) sont-elles parallèles ?',
      answer: 'oui',
      explanation: 'AM/AB = 4/6 = 2/3 et AN/AC = 6/9 = 2/3. Comme les rapports sont égaux, (MN) ∥ (BC).',
      hint: 'Compare les rapports AM/AB et AN/AC'
    },
    {
      question: 'Si AM/AB = 3/5 et AN/AC = 3/5, que dit la réciproque de Thalès ?',
      answer: '(MN) parallèle à (BC)',
      explanation: 'Les rapports étant égaux, la réciproque de Thalès nous dit que (MN) ∥ (BC).',
      hint: 'Égalité des rapports ⟹ parallélisme'
    },
    {
      question: 'Triangle DEF : DG = 2, DF = 8, DH = 3, DE = 12. (GH) est-elle parallèle à (EF) ?',
      answer: 'oui',
      explanation: 'DG/DF = 2/8 = 1/4 et DH/DE = 3/12 = 1/4. Rapports égaux donc (GH) ∥ (EF).',
      hint: 'Calcule et compare DG/DF et DH/DE'
    },
    {
      question: 'Pour utiliser la réciproque de Thalès, de combien de rapports égaux avons-nous besoin ?',
      answer: 'deux',
      explanation: 'Il suffit de deux rapports égaux (par exemple AM/AB = AN/AC) pour conclure au parallélisme.',
      hint: 'Pas besoin des trois rapports, deux suffisent'
    },

    // Niveau 6-10 : Applications avec calculs
    {
      question: 'Triangle PQR : PM = 5, MQ = 10, PN = 6, NR = 12. (MN) ∥ (QR) ?',
      answer: 'oui',
      explanation: 'PQ = PM + MQ = 15, PR = PN + NR = 18. PM/PQ = 5/15 = 1/3, PN/PR = 6/18 = 1/3. Donc (MN) ∥ (QR).',
      hint: 'Calcule d\'abord PQ et PR'
    },
    {
      question: 'Triangle ABC : AM = 3, AB = 12, AN = 2, AC = 8. Parallélisme vérifié ?',
      answer: 'oui',
      explanation: 'AM/AB = 3/12 = 1/4 et AN/AC = 2/8 = 1/4. Rapports égaux donc (MN) ∥ (BC).',
      hint: 'Compare 3/12 et 2/8'
    },
    {
      question: 'Si AM/AB = 0,4 et AN/AC = 2/5, (MN) ∥ (BC) ?',
      answer: 'oui',
      explanation: '0,4 = 4/10 = 2/5. Donc AM/AB = AN/AC, par la réciproque (MN) ∥ (BC).',
      hint: 'Convertis 0,4 en fraction'
    },
    {
      question: 'Triangle XYZ : XA = 7, AY = 14, XB = 6, BZ = 12. Les droites (AB) et (YZ) ?',
      answer: 'parallèles',
      explanation: 'XY = 21, XZ = 18. XA/XY = 7/21 = 1/3, XB/XZ = 6/18 = 1/3. Donc (AB) ∥ (YZ).',
      hint: 'Calcule d\'abord XY et XZ'
    },
    {
      question: 'Dans un triangle, si un segment joint les milieux de deux côtés, que dit Thalès ?',
      answer: 'il est parallèle au troisième côté',
      explanation: 'Si M et N sont les milieux, alors AM/AB = AN/AC = 1/2, donc (MN) ∥ (BC) par la réciproque.',
      hint: 'Milieux ⟹ rapports = 1/2'
    },

    // Niveau 11-15 : Cas plus complexes
    {
      question: 'Triangle ABC : AM:MB = 2:3, AN:NC = 4:6. (MN) ∥ (BC) ?',
      answer: 'oui',
      explanation: 'AM/AB = 2/5, AN/AC = 4/10 = 2/5. Rapports égaux donc parallélisme.',
      hint: 'Convertis les rapports en fractions de AB et AC'
    },
    {
      question: 'Si dans un triangle les rapports valent AM/AB = 3/7 et AN/AC = 6/14, conclusion ?',
      answer: 'parallèles',
      explanation: '6/14 = 3/7, donc AM/AB = AN/AC. Par la réciproque, (MN) ∥ (BC).',
      hint: 'Simplifie 6/14'
    },
    {
      question: 'Triangle DEF : DG/DF = 0,6 et DH/DE = 3/5. (GH) ∥ (EF) ?',
      answer: 'oui',
      explanation: '0,6 = 6/10 = 3/5. Donc DG/DF = DH/DE, par la réciproque (GH) ∥ (EF).',
      hint: 'Convertis 0,6 en fraction'
    },
    {
      question: 'Triangle ABC : AM = 4, MB = 8, AN = 5, NC = 10. Vérification ?',
      answer: 'parallèles',
      explanation: 'AB = 12, AC = 15. AM/AB = 4/12 = 1/3, AN/AC = 5/15 = 1/3. Donc (MN) ∥ (BC).',
      hint: 'Calcule AB = AM + MB et AC = AN + NC'
    },
    {
      question: 'Dans quelle condition la réciproque de Thalès ne s\'applique-t-elle PAS ?',
      answer: 'rapports différents',
      explanation: 'Si AM/AB ≠ AN/AC, alors la réciproque ne permet pas de conclure au parallélisme.',
      hint: 'Il faut l\'égalité des rapports'
    }
  ]

  const checkAnswer = () => {
    const currentEx = exercises[currentExercise]
    const userAnswerClean = userAnswer.toLowerCase().trim()
    const correctAnswerClean = currentEx.answer.toLowerCase().trim()
    
    const isCorrect = userAnswerClean === correctAnswerClean || 
                     userAnswerClean.includes(correctAnswerClean) ||
                     correctAnswerClean.includes(userAnswerClean) ||
                     (userAnswerClean.includes('oui') && correctAnswerClean === 'oui') ||
                     (userAnswerClean.includes('non') && correctAnswerClean === 'non') ||
                     (userAnswerClean.includes('parallèle') && correctAnswerClean.includes('parallèle'))
    
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-red-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/chapitre/4eme-theoreme-thales" className="p-2 hover:bg-white/60 rounded-lg transition-colors">
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">🔄 Réciproque du théorème</h1>
                <p className="text-gray-600">Démontrer le parallélisme grâce aux rapports</p>
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
            {/* Section 1: Qu'est-ce que la réciproque ? */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
              <h2 className="text-2xl font-bold text-purple-800 mb-6 flex items-center">
                <span className="bg-purple-100 p-2 rounded-lg mr-3">🔄</span>
                La réciproque du théorème de Thalès
              </h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-bold text-purple-800 mb-4">Principe de la réciproque</h3>
                  <div className="space-y-4">
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <h4 className="font-bold text-purple-800 mb-2">Théorème direct</h4>
                      <p className="text-purple-700">
                        Si (MN) ∥ (BC) → alors AM/AB = AN/AC
                      </p>
                    </div>
                    <div className="bg-pink-50 p-4 rounded-lg">
                      <h4 className="font-bold text-pink-800 mb-2">Réciproque</h4>
                      <p className="text-pink-700">
                        Si AM/AB = AN/AC → alors (MN) ∥ (BC)
                      </p>
                    </div>
                    <div className="bg-red-50 p-4 rounded-lg">
                      <h4 className="font-bold text-red-800 mb-2">Usage</h4>
                      <p className="text-red-700">
                        La réciproque sert à <strong>démontrer</strong> qu'il y a parallélisme
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col justify-center">
                  <div className="bg-gradient-to-br from-purple-100 to-pink-100 p-6 rounded-2xl">
                    <h3 className="text-lg font-bold text-purple-800 mb-4 text-center">Énoncé de la réciproque</h3>
                    <div className="bg-white/80 p-4 rounded-lg">
                      <div className="text-center space-y-3">
                        <div className="text-sm text-gray-600">Dans un triangle ABC,</div>
                        <div className="text-sm text-gray-600">si M ∈ [AB] et N ∈ [AC], et si</div>
                        <div className="text-xl font-bold text-purple-600">AM/AB = AN/AC</div>
                        <div className="text-sm text-gray-600">alors</div>
                        <div className="text-lg font-bold text-pink-600">(MN) ∥ (BC)</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Comment l'utiliser */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
              <h2 className="text-2xl font-bold text-pink-800 mb-6 flex items-center">
                <span className="bg-pink-100 p-2 rounded-lg mr-3">🎯</span>
                Comment utiliser la réciproque
              </h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-bold text-pink-800 mb-4">Méthode step-by-step</h3>
                  <div className="space-y-4">
                    <div className="bg-pink-50 p-4 rounded-lg">
                      <div className="flex items-center mb-2">
                        <span className="bg-pink-200 text-pink-800 text-sm font-bold rounded-full w-6 h-6 flex items-center justify-center mr-3">1</span>
                        <h4 className="font-bold text-pink-800">Identifier les points</h4>
                      </div>
                      <p className="text-pink-700 ml-9">Repérer M sur [AB] et N sur [AC]</p>
                    </div>
                    <div className="bg-red-50 p-4 rounded-lg">
                      <div className="flex items-center mb-2">
                        <span className="bg-red-200 text-red-800 text-sm font-bold rounded-full w-6 h-6 flex items-center justify-center mr-3">2</span>
                        <h4 className="font-bold text-red-800">Calculer les rapports</h4>
                      </div>
                      <p className="text-red-700 ml-9">Trouver AM/AB et AN/AC</p>
                    </div>
                    <div className="bg-orange-50 p-4 rounded-lg">
                      <div className="flex items-center mb-2">
                        <span className="bg-orange-200 text-orange-800 text-sm font-bold rounded-full w-6 h-6 flex items-center justify-center mr-3">3</span>
                        <h4 className="font-bold text-orange-800">Comparer</h4>
                      </div>
                      <p className="text-orange-700 ml-9">Vérifier si les rapports sont égaux</p>
                    </div>
                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <div className="flex items-center mb-2">
                        <span className="bg-yellow-200 text-yellow-800 text-sm font-bold rounded-full w-6 h-6 flex items-center justify-center mr-3">4</span>
                        <h4 className="font-bold text-yellow-800">Conclure</h4>
                      </div>
                      <p className="text-yellow-700 ml-9">Si égaux → parallélisme, sinon → pas parallèles</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col justify-center">
                  <div className="bg-gradient-to-br from-pink-100 to-red-100 p-6 rounded-2xl">
                    <h3 className="text-lg font-bold text-pink-800 mb-4 text-center">Exemple pratique</h3>
                    <div className="space-y-3">
                      <div className="bg-white p-3 rounded-lg">
                        <span className="text-sm text-gray-600">Triangle :</span>
                        <span className="ml-2">ABC avec M ∈ [AB], N ∈ [AC]</span>
                      </div>
                      <div className="bg-white p-3 rounded-lg">
                        <span className="text-sm text-gray-600">Données :</span>
                        <span className="ml-2">AM = 6, AB = 10, AN = 9, AC = 15</span>
                      </div>
                      <div className="bg-white p-3 rounded-lg">
                        <span className="text-sm text-gray-600">Calculs :</span>
                        <span className="ml-2">AM/AB = 6/10 = 3/5</span>
                      </div>
                      <div className="bg-white p-3 rounded-lg">
                        <span className="text-sm text-gray-600">Calculs :</span>
                        <span className="ml-2">AN/AC = 9/15 = 3/5</span>
                      </div>
                      <div className="bg-pink-50 p-3 rounded-lg">
                        <span className="text-sm text-gray-600">Conclusion :</span>
                        <span className="font-bold text-pink-600 ml-2">(MN) ∥ (BC)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3: Cas particuliers */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
              <h2 className="text-2xl font-bold text-red-800 mb-6 flex items-center">
                <span className="bg-red-100 p-2 rounded-lg mr-3">⭐</span>
                Cas particuliers importants
              </h2>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-red-100 to-pink-100 p-6 rounded-2xl">
                  <h3 className="text-lg font-bold text-red-800 mb-3">Droite des milieux</h3>
                  <div className="space-y-2 text-sm">
                    <div className="bg-white p-3 rounded-lg">
                      <div className="font-bold text-red-700">Si :</div>
                      <div>M milieu de [AB]</div>
                      <div>N milieu de [AC]</div>
                    </div>
                    <div className="bg-red-50 p-3 rounded-lg">
                      <div className="font-bold text-red-700">Alors :</div>
                      <div>AM/AB = AN/AC = 1/2</div>
                    </div>
                    <div className="bg-pink-50 p-3 rounded-lg">
                      <div className="font-bold text-pink-700">Donc :</div>
                      <div>(MN) ∥ (BC) et MN = BC/2</div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-orange-100 to-red-100 p-6 rounded-2xl">
                  <h3 className="text-lg font-bold text-orange-800 mb-3">Rapport 1/3</h3>
                  <div className="space-y-2 text-sm">
                    <div className="bg-white p-3 rounded-lg">
                      <div className="font-bold text-orange-700">Si :</div>
                      <div>AM/AB = AN/AC = 1/3</div>
                    </div>
                    <div className="bg-orange-50 p-3 rounded-lg">
                      <div className="font-bold text-orange-700">Alors :</div>
                      <div>(MN) ∥ (BC)</div>
                    </div>
                    <div className="bg-red-50 p-3 rounded-lg">
                      <div className="font-bold text-red-700">Et :</div>
                      <div>MN = BC/3</div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-yellow-100 to-orange-100 p-6 rounded-2xl">
                  <h3 className="text-lg font-bold text-yellow-800 mb-3">Rapport quelconque</h3>
                  <div className="space-y-2 text-sm">
                    <div className="bg-white p-3 rounded-lg">
                      <div className="font-bold text-yellow-700">Si :</div>
                      <div>AM/AB = AN/AC = k</div>
                    </div>
                    <div className="bg-yellow-50 p-3 rounded-lg">
                      <div className="font-bold text-yellow-700">Alors :</div>
                      <div>(MN) ∥ (BC)</div>
                    </div>
                    <div className="bg-orange-50 p-3 rounded-lg">
                      <div className="font-bold text-orange-700">Et :</div>
                      <div>MN = k × BC</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 4: Applications et utilité */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
              <h2 className="text-2xl font-bold text-orange-800 mb-6 flex items-center">
                <span className="bg-orange-100 p-2 rounded-lg mr-3">🔧</span>
                Applications de la réciproque
              </h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-bold text-orange-800 mb-4">Utilisations pratiques</h3>
                  <div className="space-y-4">
                    <div className="bg-orange-50 p-4 rounded-lg">
                      <h4 className="font-bold text-orange-800 mb-2">🏗️ En construction</h4>
                      <p className="text-orange-700 text-sm">
                        Vérifier que des poutres sont parallèles en mesurant les rapports de distances.
                      </p>
                    </div>
                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <h4 className="font-bold text-yellow-800 mb-2">📐 En géométrie</h4>
                      <p className="text-yellow-700 text-sm">
                        Démontrer le parallélisme sans instrument de mesure d'angles.
                      </p>
                    </div>
                    <div className="bg-red-50 p-4 rounded-lg">
                      <h4 className="font-bold text-red-800 mb-2">🎨 En dessin technique</h4>
                      <p className="text-red-700 text-sm">
                        Tracer des parallèles avec précision en calculant les proportions.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col justify-center">
                  <div className="bg-gradient-to-br from-orange-100 to-yellow-100 p-6 rounded-2xl">
                    <h3 className="text-lg font-bold text-orange-800 mb-4 text-center">Avantages de la réciproque</h3>
                    <div className="space-y-3">
                      <div className="bg-white p-3 rounded-lg flex items-center">
                        <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                        <span className="text-gray-700">Pas besoin de mesurer d'angles</span>
                      </div>
                      <div className="bg-white p-3 rounded-lg flex items-center">
                        <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                        <span className="text-gray-700">Calculs simples avec des longueurs</span>
                      </div>
                      <div className="bg-white p-3 rounded-lg flex items-center">
                        <div className="w-3 h-3 bg-purple-500 rounded-full mr-3"></div>
                        <span className="text-gray-700">Méthode rapide et fiable</span>
                      </div>
                      <div className="bg-white p-3 rounded-lg flex items-center">
                        <div className="w-3 h-3 bg-orange-500 rounded-full mr-3"></div>
                        <span className="text-gray-700">Applicable dans tous les triangles</span>
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
                  🔄 Exercice {currentExercise + 1} sur {exercises.length}
                </h2>
                <div className="flex items-center space-x-4">
                  <div className="text-lg font-bold text-purple-600">
                    Score : {score}/{exercises.length}
                  </div>
                  <button onClick={resetExercises} className="bg-gray-500 text-white px-4 py-2 rounded-lg">
                    <RotateCcw className="inline w-4 h-4 mr-2" />
                    Recommencer
                  </button>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-2xl mb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  {exercises[currentExercise].question}
                </h3>
                
                <div className="space-y-4">
                  <input
                    type="text"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    placeholder="Votre réponse..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                  <VoiceInput onTranscript={(transcript) => setUserAnswer(transcript)} />
                  
                  {!showAnswer && (
                    <button
                      onClick={checkAnswer}
                      disabled={!userAnswer.trim()}
                      className="bg-purple-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-purple-600 disabled:opacity-50"
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
                  className="bg-purple-500 text-white px-4 py-2 rounded-lg disabled:opacity-50"
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