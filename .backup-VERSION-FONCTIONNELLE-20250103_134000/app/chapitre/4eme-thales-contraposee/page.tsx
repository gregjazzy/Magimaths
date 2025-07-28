'use client'

import { useState } from 'react'
import { ArrowLeft, BookOpen, Target, Play, RotateCcw, CheckCircle, XCircle, Lightbulb, AlertTriangle } from 'lucide-react'
import Link from 'next/link'
import { VoiceInput } from '../../../components/VoiceInput'

export default function ThalesContraposePage() {
  const [activeTab, setActiveTab] = useState<'cours' | 'exercices'>('cours')
  const [currentExercise, setCurrentExercise] = useState(0)
  const [userAnswer, setUserAnswer] = useState('')
  const [showAnswer, setShowAnswer] = useState(false)
  const [score, setScore] = useState(0)
  const [answerFeedback, setAnswerFeedback] = useState<'correct' | 'incorrect' | null>(null)

  const exercises = [
    // Niveau 1-5 : Compréhension de la contraposée
    {
      question: 'Si AM/AB ≠ AN/AC, que peut-on dire des droites (MN) et (BC) ?',
      answer: 'non parallèles',
      explanation: 'Par la contraposée de Thalès, si les rapports sont différents, alors les droites ne sont pas parallèles.',
      hint: 'Rapports différents ⟹ pas de parallélisme'
    },
    {
      question: 'Triangle ABC : AM = 3, AB = 8, AN = 4, AC = 9. Les droites (MN) et (BC) sont-elles parallèles ?',
      answer: 'non',
      explanation: 'AM/AB = 3/8 = 0,375 et AN/AC = 4/9 ≈ 0,444. Rapports différents donc pas parallèles.',
      hint: 'Compare 3/8 et 4/9'
    },
    {
      question: 'Que dit la contraposée du théorème de Thalès ?',
      answer: 'rapports différents implique pas parallèle',
      explanation: 'Si AM/AB ≠ AN/AC, alors (MN) n\'est pas parallèle à (BC).',
      hint: 'C\'est l\'inverse logique de la réciproque'
    },
    {
      question: 'Triangle DEF : DG = 2, DF = 6, DH = 4, DE = 10. (GH) ∥ (EF) ?',
      answer: 'non',
      explanation: 'DG/DF = 2/6 = 1/3 et DH/DE = 4/10 = 2/5. Comme 1/3 ≠ 2/5, pas de parallélisme.',
      hint: 'Calcule et compare les rapports'
    },
    {
      question: 'Si deux droites ne sont PAS parallèles, les rapports de Thalès sont-ils égaux ?',
      answer: 'non',
      explanation: 'Si les droites ne sont pas parallèles, alors les rapports AM/AB et AN/AC sont différents.',
      hint: 'Pas de parallélisme ⟹ rapports différents'
    },

    // Niveau 6-10 : Applications de la contraposée
    {
      question: 'Triangle PQR : PM = 4, PQ = 10, PN = 5, PR = 11. Conclusion ?',
      answer: 'pas parallèles',
      explanation: 'PM/PQ = 4/10 = 2/5 = 0,4 et PN/PR = 5/11 ≈ 0,45. Rapports différents donc (MN) ∦ (QR).',
      hint: 'Compare 4/10 et 5/11'
    },
    {
      question: 'Si AM/AB = 0,3 et AN/AC = 3/10, y a-t-il parallélisme ?',
      answer: 'oui',
      explanation: '0,3 = 3/10, donc les rapports sont égaux. Il y a parallélisme.',
      hint: 'Convertis 0,3 en fraction'
    },
    {
      question: 'Triangle ABC : AM = 6, MB = 9, AN = 8, NC = 10. (MN) ∥ (BC) ?',
      answer: 'non',
      explanation: 'AB = 15, AC = 18. AM/AB = 6/15 = 2/5, AN/AC = 8/18 = 4/9. Comme 2/5 ≠ 4/9, pas parallèles.',
      hint: 'Calcule d\'abord AB et AC'
    },
    {
      question: 'Comment prouver que deux droites ne sont PAS parallèles avec Thalès ?',
      answer: 'montrer rapports différents',
      explanation: 'Il suffit de montrer que AM/AB ≠ AN/AC pour prouver que (MN) ∦ (BC).',
      hint: 'Utilise la contraposée'
    },
    {
      question: 'Triangle XYZ : XA = 7, XY = 20, XB = 10, XZ = 25. Les droites (AB) et (YZ) ?',
      answer: 'non parallèles',
      explanation: 'XA/XY = 7/20 = 0,35 et XB/XZ = 10/25 = 0,4. Rapports différents donc pas parallèles.',
      hint: 'Compare 7/20 et 10/25'
    },

    // Niveau 11-15 : Cas subtils et raisonnement logique
    {
      question: 'Triangle ABC : AM:MB = 3:5, AN:NC = 2:4. Parallélisme ?',
      answer: 'non',
      explanation: 'AM/AB = 3/8, AN/AC = 2/6 = 1/3. Comme 3/8 ≠ 1/3, pas de parallélisme.',
      hint: 'Convertis les rapports en fractions de AB et AC'
    },
    {
      question: 'Si on mesure AM = 4,5 cm, AB = 12 cm, AN = 3,8 cm, AC = 10 cm, conclusion ?',
      answer: 'pas parallèles',
      explanation: 'AM/AB = 4,5/12 = 0,375 et AN/AC = 3,8/10 = 0,38. Rapports très proches mais différents.',
      hint: 'Calcule avec précision les deux rapports'
    },
    {
      question: 'Triangle DEF : DG/DF = 5/13 et DH/DE = 6/15. Y a-t-il parallélisme ?',
      answer: 'non',
      explanation: '5/13 ≈ 0,385 et 6/15 = 2/5 = 0,4. Les rapports sont différents donc pas de parallélisme.',
      hint: 'Simplifie 6/15 puis compare'
    },
    {
      question: 'Dans quels cas la contraposée de Thalès est-elle utile ?',
      answer: 'prouver absence parallélisme',
      explanation: 'La contraposée sert à démontrer qu\'il n\'y a PAS de parallélisme en montrant que les rapports diffèrent.',
      hint: 'Pour prouver une négation'
    },
    {
      question: 'Triangle ABC avec erreur de mesure ±1mm. AM = 50±1mm, AB = 120±1mm, AN = 42±1mm, AC = 100±1mm. Peut-on conclure ?',
      answer: 'incertain',
      explanation: 'AM/AB entre 49/121 et 51/119, AN/AC entre 41/101 et 43/99. Les intervalles se chevauchent, impossible de conclure.',
      hint: 'Tiens compte des incertitudes de mesure'
    }
  ]

  const checkAnswer = () => {
    const currentEx = exercises[currentExercise]
    const userAnswerClean = userAnswer.toLowerCase().trim()
    const correctAnswerClean = currentEx.answer.toLowerCase().trim()
    
    const isCorrect = userAnswerClean === correctAnswerClean || 
                     userAnswerClean.includes(correctAnswerClean) ||
                     correctAnswerClean.includes(userAnswerClean) ||
                     (userAnswerClean.includes('non') && correctAnswerClean.includes('non')) ||
                     (userAnswerClean.includes('pas') && correctAnswerClean.includes('pas')) ||
                     (userAnswerClean.includes('oui') && correctAnswerClean === 'oui')
    
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
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/chapitre/4eme-theoreme-thales" className="p-2 hover:bg-white/60 rounded-lg transition-colors">
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">❌ Contraposée et non-parallélisme</h1>
                <p className="text-gray-600">Prouver qu'il n'y a pas de parallélisme</p>
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
            {/* Section 1: Qu'est-ce que la contraposée ? */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
              <h2 className="text-2xl font-bold text-red-800 mb-6 flex items-center">
                <span className="bg-red-100 p-2 rounded-lg mr-3">❌</span>
                La contraposée du théorème de Thalès
              </h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-bold text-red-800 mb-4">Logique des implications</h3>
                  <div className="space-y-4">
                    <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
                      <h4 className="font-bold text-green-800 mb-2">Théorème direct</h4>
                      <p className="text-green-700">
                        Si (MN) ∥ (BC) → alors AM/AB = AN/AC
                      </p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                      <h4 className="font-bold text-blue-800 mb-2">Réciproque</h4>
                      <p className="text-blue-700">
                        Si AM/AB = AN/AC → alors (MN) ∥ (BC)
                      </p>
                    </div>
                    <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-500">
                      <h4 className="font-bold text-red-800 mb-2">Contraposée</h4>
                      <p className="text-red-700">
                        Si AM/AB ≠ AN/AC → alors (MN) ∦ (BC)
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col justify-center">
                  <div className="bg-gradient-to-br from-red-100 to-orange-100 p-6 rounded-2xl">
                    <h3 className="text-lg font-bold text-red-800 mb-4 text-center">Énoncé de la contraposée</h3>
                    <div className="bg-white/80 p-4 rounded-lg">
                      <div className="text-center space-y-3">
                        <div className="text-sm text-gray-600">Dans un triangle ABC,</div>
                        <div className="text-sm text-gray-600">si M ∈ [AB] et N ∈ [AC], et si</div>
                        <div className="text-xl font-bold text-red-600">AM/AB ≠ AN/AC</div>
                        <div className="text-sm text-gray-600">alors</div>
                        <div className="text-lg font-bold text-orange-600">(MN) ∦ (BC)</div>
                        <div className="text-xs text-gray-500">(∦ signifie "non parallèle")</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Pourquoi la contraposée ? */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
              <h2 className="text-2xl font-bold text-orange-800 mb-6 flex items-center">
                <span className="bg-orange-100 p-2 rounded-lg mr-3">🤔</span>
                Pourquoi utiliser la contraposée ?
              </h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-bold text-orange-800 mb-4">Utilité de la contraposée</h3>
                  <div className="space-y-4">
                    <div className="bg-orange-50 p-4 rounded-lg">
                      <h4 className="font-bold text-orange-800 mb-2">🎯 Prouver une négation</h4>
                      <p className="text-orange-700 text-sm">
                        Il est parfois plus facile de prouver que quelque chose N'EST PAS vrai que de prouver qu'elle est vraie.
                      </p>
                    </div>
                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <h4 className="font-bold text-yellow-800 mb-2">🔍 Détecter les erreurs</h4>
                      <p className="text-yellow-700 text-sm">
                        Permet de vérifier qu'une construction géométrique n'est pas correcte.
                      </p>
                    </div>
                    <div className="bg-red-50 p-4 rounded-lg">
                      <h4 className="font-bold text-red-800 mb-2">⚠️ Éviter les conclusions hâtives</h4>
                      <p className="text-red-700 text-sm">
                        Empêche de conclure au parallélisme quand les conditions ne sont pas remplies.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col justify-center">
                  <div className="bg-gradient-to-br from-orange-100 to-yellow-100 p-6 rounded-2xl">
                    <h3 className="text-lg font-bold text-orange-800 mb-4 text-center">Exemple pratique</h3>
                    <div className="space-y-3">
                      <div className="bg-white p-3 rounded-lg">
                        <span className="text-sm text-gray-600">Données :</span>
                        <span className="ml-2">AM = 5, AB = 12, AN = 7, AC = 15</span>
                      </div>
                      <div className="bg-white p-3 rounded-lg">
                        <span className="text-sm text-gray-600">Calculs :</span>
                        <span className="ml-2">AM/AB = 5/12 ≈ 0,417</span>
                      </div>
                      <div className="bg-white p-3 rounded-lg">
                        <span className="text-sm text-gray-600">Calculs :</span>
                        <span className="ml-2">AN/AC = 7/15 ≈ 0,467</span>
                      </div>
                      <div className="bg-white p-3 rounded-lg">
                        <span className="text-sm text-gray-600">Constat :</span>
                        <span className="ml-2">5/12 ≠ 7/15</span>
                      </div>
                      <div className="bg-orange-50 p-3 rounded-lg">
                        <span className="text-sm text-gray-600">Conclusion :</span>
                        <span className="font-bold text-orange-600 ml-2">(MN) ∦ (BC)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3: Comment appliquer la contraposée */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
              <h2 className="text-2xl font-bold text-yellow-800 mb-6 flex items-center">
                <span className="bg-yellow-100 p-2 rounded-lg mr-3">🛠️</span>
                Comment appliquer la contraposée
              </h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-bold text-yellow-800 mb-4">Méthode étape par étape</h3>
                  <div className="space-y-4">
                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <div className="flex items-center mb-2">
                        <span className="bg-yellow-200 text-yellow-800 text-sm font-bold rounded-full w-6 h-6 flex items-center justify-center mr-3">1</span>
                        <h4 className="font-bold text-yellow-800">Calculer les rapports</h4>
                      </div>
                      <p className="text-yellow-700 ml-9">Trouver AM/AB et AN/AC avec précision</p>
                    </div>
                    <div className="bg-orange-50 p-4 rounded-lg">
                      <div className="flex items-center mb-2">
                        <span className="bg-orange-200 text-orange-800 text-sm font-bold rounded-full w-6 h-6 flex items-center justify-center mr-3">2</span>
                        <h4 className="font-bold text-orange-800">Comparer rigoureusement</h4>
                      </div>
                      <p className="text-orange-700 ml-9">Vérifier si les rapports sont exactement égaux</p>
                    </div>
                    <div className="bg-red-50 p-4 rounded-lg">
                      <div className="flex items-center mb-2">
                        <span className="bg-red-200 text-red-800 text-sm font-bold rounded-full w-6 h-6 flex items-center justify-center mr-3">3</span>
                        <h4 className="font-bold text-red-800">Conclure si différents</h4>
                      </div>
                      <p className="text-red-700 ml-9">Si AM/AB ≠ AN/AC, alors pas de parallélisme</p>
                    </div>
                    <div className="bg-pink-50 p-4 rounded-lg">
                      <div className="flex items-center mb-2">
                        <span className="bg-pink-200 text-pink-800 text-sm font-bold rounded-full w-6 h-6 flex items-center justify-center mr-3">4</span>
                        <h4 className="font-bold text-pink-800">Vérifier la logique</h4>
                      </div>
                      <p className="text-pink-700 ml-9">S'assurer que la conclusion est cohérente</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col justify-center">
                  <div className="bg-gradient-to-br from-yellow-100 to-red-100 p-6 rounded-2xl">
                    <h3 className="text-lg font-bold text-yellow-800 mb-4 text-center">Précision des calculs</h3>
                    <div className="space-y-3">
                      <div className="bg-white p-3 rounded-lg">
                        <div className="font-bold text-yellow-700">⚠️ Attention aux arrondis</div>
                        <div className="text-sm text-yellow-600">0,333... ≠ 0,334</div>
                      </div>
                      <div className="bg-white p-3 rounded-lg">
                        <div className="font-bold text-orange-700">🔢 Préférer les fractions</div>
                        <div className="text-sm text-orange-600">1/3 vs 2/6 plus facile à comparer</div>
                      </div>
                      <div className="bg-white p-3 rounded-lg">
                        <div className="font-bold text-red-700">📏 Tenir compte des mesures</div>
                        <div className="text-sm text-red-600">Incertitudes de mesure possibles</div>
                      </div>
                      <div className="bg-white p-3 rounded-lg">
                        <div className="font-bold text-pink-700">✓ Vérifier plusieurs fois</div>
                        <div className="text-sm text-pink-600">Recalculer pour éviter les erreurs</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 4: Applications et exemples */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
              <h2 className="text-2xl font-bold text-pink-800 mb-6 flex items-center">
                <span className="bg-pink-100 p-2 rounded-lg mr-3">📋</span>
                Applications et exemples concrets
              </h2>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-pink-100 to-red-100 p-6 rounded-2xl">
                  <h3 className="text-lg font-bold text-pink-800 mb-3">🏗️ Contrôle qualité</h3>
                  <div className="space-y-2 text-sm">
                    <div className="bg-white p-3 rounded-lg">
                      <div className="font-bold text-pink-700">Usage :</div>
                      <div>Vérifier que des éléments de construction ne sont PAS parallèles</div>
                    </div>
                    <div className="bg-pink-50 p-3 rounded-lg">
                      <div className="font-bold text-pink-700">Exemple :</div>
                      <div>Poutres qui doivent être convergentes</div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-red-100 to-orange-100 p-6 rounded-2xl">
                  <h3 className="text-lg font-bold text-red-800 mb-3">📐 Détection d'erreurs</h3>
                  <div className="space-y-2 text-sm">
                    <div className="bg-white p-3 rounded-lg">
                      <div className="font-bold text-red-700">Usage :</div>
                      <div>Identifier les erreurs de construction ou de dessin</div>
                    </div>
                    <div className="bg-red-50 p-3 rounded-lg">
                      <div className="font-bold text-red-700">Exemple :</div>
                      <div>Lignes censées être parallèles mais qui ne le sont pas</div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-orange-100 to-yellow-100 p-6 rounded-2xl">
                  <h3 className="text-lg font-bold text-orange-800 mb-3">🎯 Validation de mesures</h3>
                  <div className="space-y-2 text-sm">
                    <div className="bg-white p-3 rounded-lg">
                      <div className="font-bold text-orange-700">Usage :</div>
                      <div>Confirmer qu'une configuration n'est pas celle de Thalès</div>
                    </div>
                    <div className="bg-orange-50 p-3 rounded-lg">
                      <div className="font-bold text-orange-700">Exemple :</div>
                      <div>Vérification de plans d'architecte</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 5: Erreurs communes */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
              <h2 className="text-2xl font-bold text-red-600 mb-6 flex items-center">
                <span className="bg-red-100 p-2 rounded-lg mr-3">⚠️</span>
                Erreurs communes à éviter
              </h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-bold text-red-600 mb-4">❌ Erreurs de raisonnement</h3>
                  <div className="space-y-3">
                    <div className="bg-red-50 p-3 rounded-lg border-l-4 border-red-400">
                      <div className="font-bold text-red-700">Confusion logique</div>
                      <div className="text-sm text-red-600">Confondre contraposée et réciproque</div>
                    </div>
                    <div className="bg-orange-50 p-3 rounded-lg border-l-4 border-orange-400">
                      <div className="font-bold text-orange-700">Imprécision numérique</div>
                      <div className="text-sm text-orange-600">Conclure sur des rapports "presque égaux"</div>
                    </div>
                    <div className="bg-yellow-50 p-3 rounded-lg border-l-4 border-yellow-400">
                      <div className="font-bold text-yellow-700">Oubli de vérification</div>
                      <div className="text-sm text-yellow-600">Ne pas recalculer pour confirmer</div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xl font-bold text-green-600 mb-4">✅ Bonnes pratiques</h3>
                  <div className="space-y-3">
                    <div className="bg-green-50 p-3 rounded-lg border-l-4 border-green-400">
                      <div className="font-bold text-green-700">Calculs précis</div>
                      <div className="text-sm text-green-600">Utiliser des fractions exactes</div>
                    </div>
                    <div className="bg-emerald-50 p-3 rounded-lg border-l-4 border-emerald-400">
                      <div className="font-bold text-emerald-700">Vérification croisée</div>
                      <div className="text-sm text-emerald-600">Recalculer par une autre méthode</div>
                    </div>
                    <div className="bg-teal-50 p-3 rounded-lg border-l-4 border-teal-400">
                      <div className="font-bold text-teal-700">Contexte réaliste</div>
                      <div className="text-sm text-teal-600">Considérer les limites des mesures réelles</div>
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
                  ❌ Exercice {currentExercise + 1} sur {exercises.length}
                </h2>
                <div className="flex items-center space-x-4">
                  <div className="text-lg font-bold text-red-600">
                    Score : {score}/{exercises.length}
                  </div>
                  <button onClick={resetExercises} className="bg-gray-500 text-white px-4 py-2 rounded-lg">
                    <RotateCcw className="inline w-4 h-4 mr-2" />
                    Recommencer
                  </button>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-red-50 to-orange-50 p-6 rounded-2xl mb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  {exercises[currentExercise].question}
                </h3>
                
                <div className="space-y-4">
                  <input
                    type="text"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    placeholder="Votre réponse..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                  />
                  <VoiceInput onTranscript={(transcript) => setUserAnswer(transcript)} />
                  
                  {!showAnswer && (
                    <button
                      onClick={checkAnswer}
                      disabled={!userAnswer.trim()}
                      className="bg-red-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-red-600 disabled:opacity-50"
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
                  className="bg-red-500 text-white px-4 py-2 rounded-lg disabled:opacity-50"
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