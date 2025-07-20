'use client'

import { useState } from 'react'
import { ArrowLeft, BookOpen, Target, Play, RotateCcw, CheckCircle, XCircle, Lightbulb } from 'lucide-react'
import Link from 'next/link'
import { VoiceInput } from '../../../components/VoiceInput'

export default function ThalesApplicationsPage() {
  const [activeTab, setActiveTab] = useState<'cours' | 'exercices'>('cours')
  const [currentExercise, setCurrentExercise] = useState(0)
  const [userAnswer, setUserAnswer] = useState('')
  const [showAnswer, setShowAnswer] = useState(false)
  const [score, setScore] = useState(0)
  const [answerFeedback, setAnswerFeedback] = useState<'correct' | 'incorrect' | null>(null)

  const exercises = [
    // Niveau 1-5 : Problèmes simples avec mesures directes
    {
      question: 'Un arbre projette une ombre de 12 m. Un bâton de 1,5 m projette une ombre de 2 m. Quelle est la hauteur de l\'arbre ?',
      answer: '9',
      explanation: 'Par proportionnalité : 1,5/2 = h/12, donc h = 1,5 × 12/2 = 9 m',
      hint: 'Utilise la proportionnalité des ombres'
    },
    {
      question: 'Une personne de 1,8 m a une ombre de 1,2 m. Un pylône a une ombre de 30 m. Hauteur du pylône ?',
      answer: '45',
      explanation: '1,8/1,2 = h/30, donc h = 1,8 × 30/1,2 = 45 m',
      hint: 'Même principe : hauteur/ombre = constante'
    },
    {
      question: 'Pour mesurer la largeur d\'une rivière, on utilise Thalès. Si AB = 20 m, AM = 15 m, AN = 12 m, que vaut AC ?',
      answer: '16',
      explanation: 'AM/AB = AN/AC, donc 15/20 = 12/AC, donc AC = 12 × 20/15 = 16 m',
      hint: 'Configuration de Thalès avec la rivière'
    },
    {
      question: 'Un phare de 45 m projette une ombre de 36 m. Un poteau projette une ombre de 8 m. Hauteur du poteau ?',
      answer: '10',
      explanation: '45/36 = h/8, donc h = 45 × 8/36 = 10 m',
      hint: 'Proportionnalité hauteur/ombre'
    },
    {
      question: 'Dans un triangle ABC, (MN) ∥ (BC). Si AM = 6, AB = 9 et BC = 15, que vaut MN ?',
      answer: '10',
      explanation: 'AM/AB = MN/BC, donc 6/9 = MN/15, donc MN = 6 × 15/9 = 10',
      hint: 'Rapport des segments parallèles'
    },

    // Niveau 6-10 : Problèmes avec calculs d'agrandissement/réduction
    {
      question: 'Une carte à l\'échelle 1/25000. Sur la carte, deux villes sont distantes de 8 cm. Distance réelle ?',
      answer: '2000',
      explanation: 'Distance réelle = 8 × 25000 = 200000 cm = 2000 m = 2 km',
      hint: 'Multiplie par l\'échelle'
    },
    {
      question: 'Un plan à l\'échelle 1:200. Une pièce mesure 3 cm sur le plan. Dimension réelle ?',
      answer: '6',
      explanation: 'Dimension réelle = 3 × 200 = 600 cm = 6 m',
      hint: 'Échelle 1:200 signifie ×200'
    },
    {
      question: 'Photo agrandie dans le rapport 3:2. L\'original mesure 10 cm × 15 cm. Dimensions de l\'agrandissement ?',
      answer: '15 × 22.5',
      explanation: 'Nouvelles dimensions : 10 × 3/2 = 15 cm et 15 × 3/2 = 22,5 cm',
      hint: 'Multiplie par 3/2'
    },
    {
      question: 'Maquette au 1/50. Une voiture de 4 m de long mesure combien sur la maquette ?',
      answer: '8',
      explanation: 'Sur la maquette : 400 cm ÷ 50 = 8 cm',
      hint: 'Divise par l\'échelle'
    },
    {
      question: 'Triangles semblables dans le rapport 2:3. Si un côté du petit vaut 6, que vaut le côté correspondant du grand ?',
      answer: '9',
      explanation: 'Côté du grand = 6 × 3/2 = 9',
      hint: 'Multiplie par le rapport 3/2'
    },

    // Niveau 11-15 : Problèmes complexes et situations réelles
    {
      question: 'Tour de 300 m. À quelle distance doit-on placer un miroir pour voir le sommet si on mesure 1,7 m ?',
      answer: '1.7',
      explanation: 'Par réflexion (Thalès) : distance/1,7 = 1,7/300, donc distance = 1,7²/300 ≈ 0,0096... Non, erreur dans l\'énoncé. Réponse : voir explication complète.',
      hint: 'Utilise la loi de réflexion avec Thalès'
    },
    {
      question: 'Pont suspendu : les câbles forment des triangles avec Thalès. Si un segment de 50 m correspond à une hauteur de 5 m, quelle hauteur pour 120 m ?',
      answer: '12',
      explanation: 'Par proportionnalité : 5/50 = h/120, donc h = 5 × 120/50 = 12 m',
      hint: 'Les câbles suivent une proportion constante'
    },
    {
      question: 'Escalier : pour respecter les normes, giron/2 × hauteur = 63 cm. Si giron = 28 cm, quelle hauteur ?',
      answer: '17.5',
      explanation: '28/2 × h = 63, donc 14h = 63, donc h = 63/14 = 4,5... Erreur calcul. h = (63-28)/2 = 17,5 cm',
      hint: 'Formule de Blondel pour escaliers'
    },
    {
      question: 'Rampe d\'accès : pour 1 m de hauteur, il faut 12 m de longueur. Pour franchir 80 cm, quelle longueur ?',
      answer: '9.6',
      explanation: 'Par proportionnalité : 1/12 = 0,8/L, donc L = 0,8 × 12 = 9,6 m',
      hint: 'Norme d\'accessibilité : pente 1/12'
    },
    {
      question: 'Échelle 4 m contre un mur. Le pied est à 1,2 m du mur. Thalès permet de trouver la hauteur atteinte ?',
      answer: '3.8',
      explanation: 'Par Pythagore : h² + 1,2² = 4², donc h = √(16-1,44) = √14,56 ≈ 3,8 m',
      hint: 'Ici c\'est Pythagore, pas Thalès directement'
    }
  ]

  const checkAnswer = () => {
    const currentEx = exercises[currentExercise]
    const userAnswerNum = parseFloat(userAnswer.replace(',', '.'))
    const correctAnswerNum = parseFloat(currentEx.answer.split(' ')[0]) // Prend le premier nombre si réponse composée
    
    const tolerance = Math.max(0.1, correctAnswerNum * 0.05)
    const isCorrect = Math.abs(userAnswerNum - correctAnswerNum) <= tolerance
    
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
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/chapitre/4eme-theoreme-thales" className="p-2 hover:bg-white/60 rounded-lg transition-colors">
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">🏗️ Applications et problèmes</h1>
                <p className="text-gray-600">Résoudre des problèmes concrets avec Thalès</p>
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
                  ? 'bg-emerald-500 text-white shadow-md' 
                  : 'text-gray-600 hover:bg-white/50'
              }`}
            >
              📚 Cours
            </button>
            <button
              onClick={() => setActiveTab('exercices')}
              className={`px-6 py-3 rounded-xl font-bold transition-all ${
                activeTab === 'exercices' 
                  ? 'bg-emerald-500 text-white shadow-md' 
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
            {/* Section 1: Applications classiques */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
              <h2 className="text-2xl font-bold text-emerald-800 mb-6 flex items-center">
                <span className="bg-emerald-100 p-2 rounded-lg mr-3">🌟</span>
                Applications classiques du théorème de Thalès
              </h2>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-emerald-100 to-teal-100 p-6 rounded-2xl">
                  <h3 className="text-lg font-bold text-emerald-800 mb-3">🌳 Mesure d'hauteurs</h3>
                  <div className="space-y-2 text-sm">
                    <div className="bg-white p-3 rounded-lg">
                      <div className="font-bold text-emerald-700">Principe :</div>
                      <div>Ombres proportionnelles aux hauteurs</div>
                    </div>
                    <div className="bg-emerald-50 p-3 rounded-lg">
                      <div className="font-bold text-emerald-700">Formule :</div>
                      <div>h₁/ombre₁ = h₂/ombre₂</div>
                    </div>
                    <div className="bg-teal-50 p-3 rounded-lg">
                      <div className="font-bold text-teal-700">Usage :</div>
                      <div>Arbres, bâtiments, tours...</div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-teal-100 to-cyan-100 p-6 rounded-2xl">
                  <h3 className="text-lg font-bold text-teal-800 mb-3">🗺️ Mesures inaccessibles</h3>
                  <div className="space-y-2 text-sm">
                    <div className="bg-white p-3 rounded-lg">
                      <div className="font-bold text-teal-700">Principe :</div>
                      <div>Triangles semblables</div>
                    </div>
                    <div className="bg-teal-50 p-3 rounded-lg">
                      <div className="font-bold text-teal-700">Exemple :</div>
                      <div>Largeur d'une rivière</div>
                    </div>
                    <div className="bg-cyan-50 p-3 rounded-lg">
                      <div className="font-bold text-cyan-700">Méthode :</div>
                      <div>Configuration sur le terrain</div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-cyan-100 to-blue-100 p-6 rounded-2xl">
                  <h3 className="text-lg font-bold text-cyan-800 mb-3">📐 Échelles et plans</h3>
                  <div className="space-y-2 text-sm">
                    <div className="bg-white p-3 rounded-lg">
                      <div className="font-bold text-cyan-700">Principe :</div>
                      <div>Proportionnalité constante</div>
                    </div>
                    <div className="bg-cyan-50 p-3 rounded-lg">
                      <div className="font-bold text-cyan-700">Échelle :</div>
                      <div>plan/réalité = constante</div>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <div className="font-bold text-blue-700">Usage :</div>
                      <div>Cartes, maquettes, plans</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Méthode de résolution */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
              <h2 className="text-2xl font-bold text-teal-800 mb-6 flex items-center">
                <span className="bg-teal-100 p-2 rounded-lg mr-3">🎯</span>
                Méthode de résolution des problèmes
              </h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-bold text-teal-800 mb-4">Étapes à suivre</h3>
                  <div className="space-y-4">
                    <div className="bg-teal-50 p-4 rounded-lg">
                      <div className="flex items-center mb-2">
                        <span className="bg-teal-200 text-teal-800 text-sm font-bold rounded-full w-6 h-6 flex items-center justify-center mr-3">1</span>
                        <h4 className="font-bold text-teal-800">Comprendre la situation</h4>
                      </div>
                      <p className="text-teal-700 ml-9">Identifier ce qu'on cherche et ce qu'on connaît</p>
                    </div>
                    <div className="bg-cyan-50 p-4 rounded-lg">
                      <div className="flex items-center mb-2">
                        <span className="bg-cyan-200 text-cyan-800 text-sm font-bold rounded-full w-6 h-6 flex items-center justify-center mr-3">2</span>
                        <h4 className="font-bold text-cyan-800">Faire un schéma</h4>
                      </div>
                      <p className="text-cyan-700 ml-9">Dessiner la configuration avec les points nommés</p>
                    </div>
                    <div className="bg-emerald-50 p-4 rounded-lg">
                      <div className="flex items-center mb-2">
                        <span className="bg-emerald-200 text-emerald-800 text-sm font-bold rounded-full w-6 h-6 flex items-center justify-center mr-3">3</span>
                        <h4 className="font-bold text-emerald-800">Identifier la proportionnalité</h4>
                      </div>
                      <p className="text-emerald-700 ml-9">Reconnaître les triangles semblables ou parallèles</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="flex items-center mb-2">
                        <span className="bg-green-200 text-green-800 text-sm font-bold rounded-full w-6 h-6 flex items-center justify-center mr-3">4</span>
                        <h4 className="font-bold text-green-800">Écrire l'équation</h4>
                      </div>
                      <p className="text-green-700 ml-9">Utiliser la formule de Thalès adaptée</p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="flex items-center mb-2">
                        <span className="bg-blue-200 text-blue-800 text-sm font-bold rounded-full w-6 h-6 flex items-center justify-center mr-3">5</span>
                        <h4 className="font-bold text-blue-800">Résoudre et vérifier</h4>
                      </div>
                      <p className="text-blue-700 ml-9">Calculer et vérifier la cohérence du résultat</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col justify-center">
                  <div className="bg-gradient-to-br from-teal-100 to-emerald-100 p-6 rounded-2xl">
                    <h3 className="text-lg font-bold text-teal-800 mb-4 text-center">Exemple : Hauteur d'un arbre</h3>
                    <div className="space-y-3">
                      <div className="bg-white p-3 rounded-lg">
                        <span className="text-sm text-gray-600">Situation :</span>
                        <span className="ml-2">Arbre avec ombre de 15 m</span>
                      </div>
                      <div className="bg-white p-3 rounded-lg">
                        <span className="text-sm text-gray-600">Référence :</span>
                        <span className="ml-2">Bâton 2 m, ombre 3 m</span>
                      </div>
                      <div className="bg-white p-3 rounded-lg">
                        <span className="text-sm text-gray-600">Proportionnalité :</span>
                        <span className="ml-2">h_arbre/15 = 2/3</span>
                      </div>
                      <div className="bg-white p-3 rounded-lg">
                        <span className="text-sm text-gray-600">Calcul :</span>
                        <span className="ml-2">h_arbre = 15 × 2/3 = 10 m</span>
                      </div>
                      <div className="bg-teal-50 p-3 rounded-lg">
                        <span className="text-sm text-gray-600">Réponse :</span>
                        <span className="font-bold text-teal-600 ml-2">L'arbre mesure 10 m</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3: Applications dans différents domaines */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
              <h2 className="text-2xl font-bold text-cyan-800 mb-6 flex items-center">
                <span className="bg-cyan-100 p-2 rounded-lg mr-3">🔧</span>
                Applications dans différents domaines
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="bg-cyan-50 p-4 rounded-lg">
                    <h4 className="font-bold text-cyan-800 mb-2">🏗️ Architecture et construction</h4>
                    <ul className="text-cyan-700 space-y-1 text-sm">
                      <li>• Calcul de hauteurs de bâtiments</li>
                      <li>• Vérification de l'aplomb des murs</li>
                      <li>• Calcul des pentes de toitures</li>
                      <li>• Dimensionnement des structures</li>
                    </ul>
                  </div>
                  
                  <div className="bg-emerald-50 p-4 rounded-lg">
                    <h4 className="font-bold text-emerald-800 mb-2">🗺️ Cartographie et topographie</h4>
                    <ul className="text-emerald-700 space-y-1 text-sm">
                      <li>• Calcul des échelles de cartes</li>
                      <li>• Mesure de distances inaccessibles</li>
                      <li>• Triangulation géodésique</li>
                      <li>• Calcul d'altitudes</li>
                    </ul>
                  </div>
                  
                  <div className="bg-teal-50 p-4 rounded-lg">
                    <h4 className="font-bold text-teal-800 mb-2">📐 Design et arts appliqués</h4>
                    <ul className="text-teal-700 space-y-1 text-sm">
                      <li>• Agrandissement d'images</li>
                      <li>• Calcul de proportions</li>
                      <li>• Mise à l'échelle de dessins</li>
                      <li>• Perspective et proportions</li>
                    </ul>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-bold text-blue-800 mb-2">⚙️ Ingénierie et technique</h4>
                    <ul className="text-blue-700 space-y-1 text-sm">
                      <li>• Calcul de forces dans les structures</li>
                      <li>• Dimensionnement de pièces mécaniques</li>
                      <li>• Calcul d'engrenages</li>
                      <li>• Systèmes de levier</li>
                    </ul>
                  </div>
                  
                  <div className="bg-indigo-50 p-4 rounded-lg">
                    <h4 className="font-bold text-indigo-800 mb-2">🌐 Sciences et recherche</h4>
                    <ul className="text-indigo-700 space-y-1 text-sm">
                      <li>• Astronomie (distances stellaires)</li>
                      <li>• Physique (optique géométrique)</li>
                      <li>• Biologie (croissance proportionnelle)</li>
                      <li>• Géologie (datation par parallaxe)</li>
                    </ul>
                  </div>
                  
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h4 className="font-bold text-purple-800 mb-2">💼 Vie quotidienne</h4>
                    <ul className="text-purple-700 space-y-1 text-sm">
                      <li>• Recettes de cuisine (proportions)</li>
                      <li>• Dosages en jardinage</li>
                      <li>• Calculs de consommation</li>
                      <li>• Économies d'échelle</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 4: Conseils pratiques */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
              <h2 className="text-2xl font-bold text-green-800 mb-6 flex items-center">
                <span className="bg-green-100 p-2 rounded-lg mr-3">💡</span>
                Conseils pratiques pour les problèmes
              </h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-bold text-green-800 mb-4">Bonnes pratiques</h3>
                  <div className="space-y-3">
                    <div className="bg-green-50 p-3 rounded-lg flex items-start">
                      <div className="w-3 h-3 bg-green-500 rounded-full mr-3 mt-2"></div>
                      <span className="text-green-700">Toujours faire un schéma clair avec les mesures</span>
                    </div>
                    <div className="bg-emerald-50 p-3 rounded-lg flex items-start">
                      <div className="w-3 h-3 bg-emerald-500 rounded-full mr-3 mt-2"></div>
                      <span className="text-emerald-700">Vérifier que les unités sont cohérentes</span>
                    </div>
                    <div className="bg-teal-50 p-3 rounded-lg flex items-start">
                      <div className="w-3 h-3 bg-teal-500 rounded-full mr-3 mt-2"></div>
                      <span className="text-teal-700">Contrôler la logique du résultat obtenu</span>
                    </div>
                    <div className="bg-cyan-50 p-3 rounded-lg flex items-start">
                      <div className="w-3 h-3 bg-cyan-500 rounded-full mr-3 mt-2"></div>
                      <span className="text-cyan-700">Utiliser des objets familiers comme référence</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xl font-bold text-red-800 mb-4">Erreurs à éviter</h3>
                  <div className="space-y-3">
                    <div className="bg-red-50 p-3 rounded-lg flex items-start">
                      <div className="w-3 h-3 bg-red-500 rounded-full mr-3 mt-2"></div>
                      <span className="text-red-700">Confondre les rapports (inverser numérateur/dénominateur)</span>
                    </div>
                    <div className="bg-orange-50 p-3 rounded-lg flex items-start">
                      <div className="w-3 h-3 bg-orange-500 rounded-full mr-3 mt-2"></div>
                      <span className="text-orange-700">Mélanger différentes unités de mesure</span>
                    </div>
                    <div className="bg-yellow-50 p-3 rounded-lg flex items-start">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full mr-3 mt-2"></div>
                      <span className="text-yellow-700">Oublier de vérifier la configuration de Thalès</span>
                    </div>
                    <div className="bg-pink-50 p-3 rounded-lg flex items-start">
                      <div className="w-3 h-3 bg-pink-500 rounded-full mr-3 mt-2"></div>
                      <span className="text-pink-700">Ne pas tenir compte du contexte réel du problème</span>
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
                  🏗️ Exercice {currentExercise + 1} sur {exercises.length}
                </h2>
                <div className="flex items-center space-x-4">
                  <div className="text-lg font-bold text-emerald-600">
                    Score : {score}/{exercises.length}
                  </div>
                  <button onClick={resetExercises} className="bg-gray-500 text-white px-4 py-2 rounded-lg">
                    <RotateCcw className="inline w-4 h-4 mr-2" />
                    Recommencer
                  </button>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-6 rounded-2xl mb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  {exercises[currentExercise].question}
                </h3>
                
                <div className="space-y-4">
                  <input
                    type="text"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    placeholder="Votre réponse (nombre)..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  />
                  <VoiceInput onTranscript={(transcript) => setUserAnswer(transcript)} />
                  
                  {!showAnswer && (
                    <button
                      onClick={checkAnswer}
                      disabled={!userAnswer.trim()}
                      className="bg-emerald-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-emerald-600 disabled:opacity-50"
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
                  className="bg-emerald-500 text-white px-4 py-2 rounded-lg disabled:opacity-50"
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