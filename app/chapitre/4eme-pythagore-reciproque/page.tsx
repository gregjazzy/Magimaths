'use client'

import { useState } from 'react'
import { ArrowLeft, RotateCcw, CheckCircle, XCircle } from 'lucide-react'
import Link from 'next/link'
import { VoiceInput } from '../../../components/VoiceInput'

export default function PythagoreReciproquePage() {
  const [activeTab, setActiveTab] = useState<'cours' | 'exercices'>('cours')
  const [currentExercise, setCurrentExercise] = useState(0)
  const [userAnswer, setUserAnswer] = useState('')
  const [showAnswer, setShowAnswer] = useState(false)
  const [score, setScore] = useState(0)
  const [answerFeedback, setAnswerFeedback] = useState<'correct' | 'incorrect' | null>(null)
  
  const exercises = [
    {
      question: 'Un triangle a des côtés de 3, 4 et 5. Est-il rectangle ?',
      answer: 'oui',
      explanation: '3² + 4² = 9 + 16 = 25 = 5². Le théorème de Pythagore est vérifié, donc le triangle est rectangle.',
      hint: 'Vérifie si a² + b² = c² avec le plus grand côté comme c'
    },
    {
      question: 'Triangle de côtés 5, 12 et 13. Rectangle ou non ?',
      answer: 'oui',
      explanation: '5² + 12² = 25 + 144 = 169 = 13². C\'est rectangle.',
      hint: 'Calcule les carrés des côtés'
    },
    {
      question: 'Triangle ABC : AB = 7, AC = 5, BC = 9. Est-il rectangle ?',
      answer: 'non',
      explanation: '5² + 7² = 25 + 49 = 74 ≠ 81 = 9². Par la contraposée, le triangle n\'est pas rectangle.',
      hint: 'Teste avec le plus grand côté comme hypoténuse'
    },
    {
      question: 'Triangle de côtés 2, 3 et 4. Rectangle ou non ?',
      answer: 'non',
      explanation: '2² + 3² = 4 + 9 = 13 ≠ 16 = 4². Par la contraposée, ce n\'est pas rectangle.',
      hint: 'Utilise la contraposée : si a² + b² ≠ c², alors pas rectangle'
    },
    {
      question: 'Triangle de côtés 8, 15 et 17. Est-il rectangle ?',
      answer: 'oui',
      explanation: '8² + 15² = 64 + 225 = 289 = 17². C\'est un triplet pythagoricien.',
      hint: 'C\'est un triplet pythagoricien classique'
    },
    {
      question: 'Triangle de côtés 1, 1 et 1,5. Rectangle ou non ?',
      answer: 'non',
      explanation: '1² + 1² = 2 ≠ 2,25 = 1,5². Par la contraposée, pas rectangle.',
      hint: 'Compare 1² + 1² avec 1,5²'
    },
    {
      question: 'Triangle de côtés 6, 8 et 10. Est-il rectangle ?',
      answer: 'oui',
      explanation: '6² + 8² = 36 + 64 = 100 = 10². C\'est le multiple de (3,4,5).',
      hint: 'C\'est un multiple du triplet 3-4-5'
    },
    {
      question: 'Triangle de côtés 4, 5 et 6. Rectangle ou non ?',
      answer: 'non',
      explanation: '4² + 5² = 16 + 25 = 41 ≠ 36 = 6². Par la contraposée, pas rectangle.',
      hint: 'Compare 4² + 5² avec 6²'
    },
    {
      question: 'Triangle de côtés 7, 24 et 25. Est-il rectangle ?',
      answer: 'oui',
      explanation: '7² + 24² = 49 + 576 = 625 = 25². C\'est rectangle.',
      hint: 'Autre triplet pythagoricien à connaître'
    },
    {
      question: 'Triangle de côtés 3, 5 et 7. Rectangle ou non ?',
      answer: 'non',
      explanation: '3² + 5² = 9 + 25 = 34 ≠ 49 = 7². Par la contraposée, pas rectangle.',
      hint: 'La contraposée permet de conclure rapidement'
    },
    {
      question: 'Triangle de côtés 9, 12 et 15. Est-il rectangle ?',
      answer: 'oui',
      explanation: '9² + 12² = 81 + 144 = 225 = 15². C\'est 3×(3,4,5).',
      hint: 'Pense aux multiples de triplets connus'
    },
    {
      question: 'Triangle de côtés 2, 4 et 5. Rectangle ou non ?',
      answer: 'non',
      explanation: '2² + 4² = 4 + 16 = 20 ≠ 25 = 5². Pas rectangle.',
      hint: 'Vérifie l\'égalité de Pythagore'
    },
    {
      question: 'Triangle de côtés 10, 24 et 26. Est-il rectangle ?',
      answer: 'oui',
      explanation: '10² + 24² = 100 + 576 = 676 = 26². C\'est 2×(5,12,13).',
      hint: 'Multiple d\'un triplet pythagoricien'
    },
    {
      question: 'Triangle de côtés 1, 2 et 3. Rectangle ou non ?',
      answer: 'non',
      explanation: '1² + 2² = 1 + 4 = 5 ≠ 9 = 3². Ce triangle n\'existe même pas ! (inégalité triangulaire)',
      hint: 'Attention : vérifie d\'abord si le triangle peut exister'
    },
    {
      question: 'Triangle de côtés 11, 60 et 61. Est-il rectangle ?',
      answer: 'oui',
      explanation: '11² + 60² = 121 + 3600 = 3721 = 61². C\'est rectangle.',
      hint: 'Calcule soigneusement les carrés'
    },
    {
      question: 'Triangle de côtés 4, 6 et 8. Rectangle ou non ?',
      answer: 'non',
      explanation: '4² + 6² = 16 + 36 = 52 ≠ 64 = 8². Pas rectangle.',
      hint: 'La contraposée donne la réponse directement'
    },
    {
      question: 'Triangle de côtés 20, 21 et 29. Est-il rectangle ?',
      answer: 'oui',
      explanation: '20² + 21² = 400 + 441 = 841 = 29². C\'est rectangle.',
      hint: 'Teste même si ce ne sont pas des triplets connus'
    },
    {
      question: 'Triangle de côtés 3, 6 et 8. Rectangle ou non ?',
      answer: 'non',
      explanation: '3² + 6² = 9 + 36 = 45 ≠ 64 = 8². Pas rectangle.',
      hint: 'Compare 3² + 6² avec 8²'
    },
    {
      question: 'Triangle isocèle de côtés 5, 5 et 5√2. Est-il rectangle ?',
      answer: 'oui',
      explanation: '5² + 5² = 25 + 25 = 50 = (5√2)². C\'est un triangle isocèle rectangle.',
      hint: 'Triangle isocèle rectangle classique'
    },
    {
      question: 'Triangle de côtés 1, 3 et 4. Rectangle ou non ?',
      answer: 'non',
      explanation: '1² + 3² = 1 + 9 = 10 ≠ 16 = 4². Pas rectangle. De plus, 1 + 3 = 4, donc ce triangle est dégénéré.',
      hint: 'Vérifie aussi l\'inégalité triangulaire !'
    },

    // Exercices spécifiques contraposée
    {
      question: 'CONTRAPOSÉE : Triangle de côtés 4, 6 et 9. Conclusion ?',
      answer: 'non',
      explanation: '4² + 6² = 16 + 36 = 52 ≠ 81 = 9². Par la CONTRAPOSÉE du théorème de Pythagore, ce triangle n\'est PAS rectangle.',
      hint: 'Utilise spécifiquement la contraposée'
    },
    {
      question: 'CONTRAPOSÉE : Si 7² + 11² ≠ 15², que conclut-on ?',
      answer: 'non',
      explanation: '7² + 11² = 49 + 121 = 170 ≠ 225 = 15². La contraposée nous dit : triangle pas rectangle.',
      hint: 'Contraposée : si a² + b² ≠ c² alors pas rectangle'
    },
    {
      question: 'CONTRAPOSÉE : Triangle équilatéral de côté 5. Rectangle ?',
      answer: 'non',
      explanation: 'Dans un triangle équilatéral : 5² + 5² = 50 ≠ 25 = 5². Par contraposée : pas rectangle (logique !)',
      hint: 'Un triangle équilatéral ne peut pas être rectangle'
    },
    {
      question: 'CONTRAPOSÉE : Côtés 1, 1 et 2. Que dit la contraposée ?',
      answer: 'impossible',
      explanation: '1² + 1² = 2 ≠ 4 = 2². Contraposée : pas rectangle. De plus, 1 + 1 = 2, triangle dégénéré !',
      hint: 'Double vérification : contraposée ET inégalité triangulaire'
    },
    {
      question: 'CONTRAPOSÉE : Quand l\'utilise-t-on plutôt que la réciproque ?',
      answer: 'pour prouver qu\'un triangle n\'est pas rectangle',
      explanation: 'Réciproque : prouver QU\'un triangle EST rectangle. Contraposée : prouver qu\'un triangle N\'EST PAS rectangle.',
      hint: 'Contraposée = négation du résultat'
    }
  ]

  const checkAnswer = () => {
    const currentEx = exercises[currentExercise]
    const userAnswerClean = userAnswer.toLowerCase().trim()
    const correctAnswerClean = currentEx.answer.toLowerCase().trim()
    
    const isCorrect = userAnswerClean === correctAnswerClean || 
                     (userAnswerClean.includes('oui') && correctAnswerClean === 'oui') ||
                     (userAnswerClean.includes('non') && correctAnswerClean === 'non') ||
                     (userAnswerClean.includes('rectangle') && correctAnswerClean === 'oui')
    
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/chapitre/4eme-theoreme-pythagore" className="p-2 hover:bg-white/60 rounded-lg transition-colors">
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">✅ Réciproque du théorème</h1>
                <p className="text-gray-600">Démontrer qu'un triangle est rectangle</p>
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
            {/* Section 1: Énoncé de la réciproque */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
              <h2 className="text-2xl font-bold text-green-800 mb-6 flex items-center">
                <span className="bg-green-100 p-2 rounded-lg mr-3">✅</span>
                Énoncé de la réciproque
              </h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-bold text-green-800 mb-4">La réciproque dit :</h3>
                  <div className="bg-gradient-to-r from-green-100 to-emerald-100 p-6 rounded-2xl mb-6">
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-600 mb-4">
                        Si dans un triangle
                      </div>
                      <div className="text-2xl font-bold text-emerald-600 mb-2">
                        a² + b² = c²
                      </div>
                      <div className="text-lg font-bold text-green-600">
                        alors le triangle est rectangle
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h4 className="font-bold text-green-800">Important</h4>
                      <p className="text-green-700">c doit être le côté le plus long (la future hypoténuse)</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col justify-center">
                  <div className="bg-gradient-to-br from-green-100 to-teal-100 p-6 rounded-2xl">
                    <h3 className="text-lg font-bold text-green-800 mb-4 text-center">Différence importante</h3>
                    <div className="space-y-3">
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <span className="text-sm text-blue-600 font-semibold">Théorème direct :</span>
                        <p className="text-blue-700">Triangle rectangle → a² + b² = c²</p>
                      </div>
                      <div className="bg-green-50 p-3 rounded-lg">
                        <span className="text-sm text-green-600 font-semibold">Réciproque :</span>
                        <p className="text-green-700">a² + b² = c² → Triangle rectangle</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Méthode d'application */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
              <h2 className="text-2xl font-bold text-emerald-800 mb-6 flex items-center">
                <span className="bg-emerald-100 p-2 rounded-lg mr-3">🔍</span>
                Comment l'appliquer ?
              </h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-bold text-emerald-800 mb-4">Étapes</h3>
                  <div className="space-y-4">
                    <div className="bg-emerald-50 p-4 rounded-lg">
                      <div className="flex items-center mb-2">
                        <span className="bg-emerald-200 text-emerald-800 text-sm font-bold rounded-full w-6 h-6 flex items-center justify-center mr-3">1</span>
                        <h4 className="font-bold text-emerald-800">Identifier le plus grand côté</h4>
                      </div>
                      <p className="text-emerald-700 ml-9">Ce sera c dans la formule</p>
                    </div>
                    <div className="bg-teal-50 p-4 rounded-lg">
                      <div className="flex items-center mb-2">
                        <span className="bg-teal-200 text-teal-800 text-sm font-bold rounded-full w-6 h-6 flex items-center justify-center mr-3">2</span>
                        <h4 className="font-bold text-teal-800">Calculer a² + b²</h4>
                      </div>
                      <p className="text-teal-700 ml-9">Avec les deux autres côtés</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="flex items-center mb-2">
                        <span className="bg-green-200 text-green-800 text-sm font-bold rounded-full w-6 h-6 flex items-center justify-center mr-3">3</span>
                        <h4 className="font-bold text-green-800">Calculer c²</h4>
                      </div>
                      <p className="text-green-700 ml-9">Le carré du plus grand côté</p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="flex items-center mb-2">
                        <span className="bg-blue-200 text-blue-800 text-sm font-bold rounded-full w-6 h-6 flex items-center justify-center mr-3">4</span>
                        <h4 className="font-bold text-blue-800">Comparer</h4>
                      </div>
                      <p className="text-blue-700 ml-9">Si a² + b² = c², alors rectangle !</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col justify-center">
                  <div className="bg-gradient-to-br from-emerald-100 to-green-100 p-6 rounded-2xl">
                    <h3 className="text-lg font-bold text-emerald-800 mb-4 text-center">Exemple</h3>
                    <div className="space-y-3">
                      <div className="bg-white p-3 rounded-lg">
                        <span className="text-sm text-gray-600">Triangle :</span>
                        <span className="ml-2">côtés 3, 4, 5</span>
                      </div>
                      <div className="bg-white p-3 rounded-lg">
                        <span className="text-sm text-gray-600">Plus grand :</span>
                        <span className="ml-2">c = 5</span>
                      </div>
                      <div className="bg-white p-3 rounded-lg">
                        <span className="text-sm text-gray-600">Calcul :</span>
                        <span className="ml-2">3² + 4² = 9 + 16 = 25</span>
                      </div>
                      <div className="bg-white p-3 rounded-lg">
                        <span className="text-sm text-gray-600">c² :</span>
                        <span className="ml-2">5² = 25</span>
                      </div>
                      <div className="bg-green-50 p-3 rounded-lg">
                        <span className="text-sm text-gray-600">Conclusion :</span>
                        <span className="font-bold text-green-600 ml-2">25 = 25 → Rectangle !</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3: La contraposée */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
              <h2 className="text-2xl font-bold text-purple-800 mb-6 flex items-center">
                <span className="bg-purple-100 p-2 rounded-lg mr-3">🚫</span>
                La contraposée : démontrer qu'un triangle N'est PAS rectangle
              </h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-bold text-purple-800 mb-4">Énoncé de la contraposée</h3>
                  <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-6 rounded-2xl mb-6">
                    <div className="text-center">
                      <div className="text-lg font-bold text-purple-600 mb-4">
                        Si dans un triangle
                      </div>
                      <div className="text-2xl font-bold text-pink-600 mb-2">
                        a² + b² ≠ c²
                      </div>
                      <div className="text-lg font-bold text-purple-600">
                        alors le triangle N'est PAS rectangle
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <h4 className="font-bold text-purple-800">Utilité</h4>
                      <p className="text-purple-700">Très pratique pour éliminer des triangles qui ne sont pas rectangles</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col justify-center">
                  <div className="bg-gradient-to-br from-purple-100 to-pink-100 p-6 rounded-2xl">
                    <h3 className="text-lg font-bold text-purple-800 mb-4 text-center">Exemple</h3>
                    <div className="space-y-3">
                      <div className="bg-white p-3 rounded-lg">
                        <span className="text-sm text-gray-600">Triangle :</span>
                        <span className="ml-2">côtés 2, 3, 4</span>
                      </div>
                      <div className="bg-white p-3 rounded-lg">
                        <span className="text-sm text-gray-600">Plus grand :</span>
                        <span className="ml-2">c = 4</span>
                      </div>
                      <div className="bg-white p-3 rounded-lg">
                        <span className="text-sm text-gray-600">Calcul :</span>
                        <span className="ml-2">2² + 3² = 4 + 9 = 13</span>
                      </div>
                      <div className="bg-white p-3 rounded-lg">
                        <span className="text-sm text-gray-600">c² :</span>
                        <span className="ml-2">4² = 16</span>
                      </div>
                      <div className="bg-red-50 p-3 rounded-lg">
                        <span className="text-sm text-gray-600">Conclusion :</span>
                        <span className="font-bold text-red-600 ml-2">13 ≠ 16 → PAS rectangle !</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 4: Les trois cas possibles */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
              <h2 className="text-2xl font-bold text-indigo-800 mb-6 flex items-center">
                <span className="bg-indigo-100 p-2 rounded-lg mr-3">⚖️</span>
                Les trois cas possibles
              </h2>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-green-100 to-emerald-100 p-6 rounded-2xl text-center">
                  <h3 className="text-lg font-bold text-green-800 mb-3">Triangle rectangle</h3>
                  <div className="text-3xl font-bold text-green-600 mb-2">a² + b² = c²</div>
                  <p className="text-sm text-green-700">L'égalité est vérifiée</p>
                  <p className="text-xs text-green-600 mt-2">Exemple : 3² + 4² = 5²</p>
                </div>
                
                <div className="bg-gradient-to-br from-orange-100 to-yellow-100 p-6 rounded-2xl text-center">
                  <h3 className="text-lg font-bold text-orange-800 mb-3">Triangle obtus</h3>
                  <div className="text-3xl font-bold text-orange-600 mb-2">a² + b² &lt; c²</div>
                  <p className="text-sm text-orange-700">Le carré du plus grand côté est plus grand</p>
                  <p className="text-xs text-orange-600 mt-2">Exemple : 2² + 3² &lt; 4²</p>
                </div>
                
                <div className="bg-gradient-to-br from-blue-100 to-cyan-100 p-6 rounded-2xl text-center">
                  <h3 className="text-lg font-bold text-blue-800 mb-3">Triangle aigu</h3>
                  <div className="text-3xl font-bold text-blue-600 mb-2">a² + b² &gt; c²</div>
                  <p className="text-sm text-blue-700">Le carré du plus grand côté est plus petit</p>
                  <p className="text-xs text-blue-600 mt-2">Exemple : 2² + 3² &gt; 3,5²</p>
                </div>
              </div>
            </div>

            {/* Section 5: Triplets pythagoriciens */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
              <h2 className="text-2xl font-bold text-teal-800 mb-6 flex items-center">
                <span className="bg-teal-100 p-2 rounded-lg mr-3">🎯</span>
                Triplets pythagoriciens utiles
              </h2>
              
              <div className="grid md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-teal-100 to-cyan-100 p-4 rounded-2xl text-center">
                  <h3 className="text-lg font-bold text-teal-800 mb-2">(3, 4, 5)</h3>
                  <p className="text-sm text-teal-700">Le plus simple</p>
                </div>
                
                <div className="bg-gradient-to-br from-cyan-100 to-blue-100 p-4 rounded-2xl text-center">
                  <h3 className="text-lg font-bold text-cyan-800 mb-2">(5, 12, 13)</h3>
                  <p className="text-sm text-cyan-700">Classique</p>
                </div>
                
                <div className="bg-gradient-to-br from-blue-100 to-indigo-100 p-4 rounded-2xl text-center">
                  <h3 className="text-lg font-bold text-blue-800 mb-2">(8, 15, 17)</h3>
                  <p className="text-sm text-blue-700">Plus grand</p>
                </div>
                
                <div className="bg-gradient-to-br from-indigo-100 to-purple-100 p-4 rounded-2xl text-center">
                  <h3 className="text-lg font-bold text-indigo-800 mb-2">(7, 24, 25)</h3>
                  <p className="text-sm text-indigo-700">Avancé</p>
                </div>
              </div>
              
              <div className="mt-6 bg-yellow-50 p-4 rounded-lg">
                <p className="text-yellow-800">
                  <span className="font-bold">💡 Astuce :</span> 
                  Tous les multiples de ces triplets donnent aussi des triangles rectangles !
                  <br />Par exemple : (6, 8, 10), (9, 12, 15), (10, 24, 26)...
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* EXERCICES */
          <div className="space-y-8">
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  ✅ Exercice {currentExercise + 1} sur {exercises.length}
                </h2>
                <div className="flex items-center space-x-4">
                  <div className="text-lg font-bold text-green-600">
                    Score : {score}/{exercises.length}
                  </div>
                  <button onClick={resetExercise} className="bg-gray-500 text-white px-4 py-2 rounded-lg">
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
                    placeholder="Répondez par 'oui' ou 'non'..."
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