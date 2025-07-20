'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, Clock, Trophy, Play, CheckCircle, XCircle, RotateCcw, Calculator, Lightbulb } from 'lucide-react'
import Link from 'next/link'
import 'katex/dist/katex.min.css'
import { InlineMath, BlockMath } from 'react-katex'

export default function TheoremeThalePage() {
  const [activeSection, setActiveSection] = useState(0)
  const [showAnimation, setShowAnimation] = useState(false)
  const [currentExercise, setCurrentExercise] = useState(0)
  const [answers, setAnswers] = useState<{[key: number]: string}>({})
  const [showResults, setShowResults] = useState<{[key: number]: boolean}>({})
  const [triangleAnimation, setTriangleAnimation] = useState(0)

  // Animation du triangle pour Thalès
  useEffect(() => {
    const interval = setInterval(() => {
      setTriangleAnimation(prev => (prev + 1) % 4)
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  const exercises = [
    {
      id: 1,
      question: "Dans un triangle ABC, on a une droite parallèle à BC qui coupe AB en M et AC en N. Si AM = 4 cm, MB = 2 cm et AN = 6 cm, quelle est la longueur NC ?",
      options: ["2 cm", "3 cm", "4 cm", "5 cm"],
      correct: 1,
      explanation: "D'après Thalès : AM/AB = AN/AC, donc 4/6 = 6/(6+NC). En résolvant : NC = 3 cm",
      calculation: "\\frac{AM}{AB} = \\frac{AN}{AC} \\Rightarrow \\frac{4}{6} = \\frac{6}{6+NC} \\Rightarrow NC = 3\\text{ cm}"
    },
    {
      id: 2,
      question: "Deux droites sont-elles parallèles si dans une configuration de Thalès on a : AB = 8, AM = 6, AC = 12, AN = 9 ?",
      options: ["Oui", "Non", "Impossible à déterminer", "Il manque des données"],
      correct: 0,
      explanation: "AM/AB = 6/8 = 3/4 et AN/AC = 9/12 = 3/4. Les rapports sont égaux donc les droites sont parallèles.",
      calculation: "\\frac{AM}{AB} = \\frac{6}{8} = \\frac{3}{4} \\text{ et } \\frac{AN}{AC} = \\frac{9}{12} = \\frac{3}{4}"
    },
    {
      id: 3,
      question: "Dans un triangle, MN est parallèle à BC. Si AM = 5 cm, AB = 15 cm et AC = 18 cm, quelle est la longueur AN ?",
      options: ["5 cm", "6 cm", "8 cm", "10 cm"],
      correct: 1,
      explanation: "D'après Thalès : AM/AB = AN/AC, donc 5/15 = AN/18. En résolvant : AN = 6 cm",
      calculation: "\\frac{AM}{AB} = \\frac{AN}{AC} \\Rightarrow \\frac{5}{15} = \\frac{AN}{18} \\Rightarrow AN = 6\\text{ cm}"
    }
  ]

  const handleAnswer = (exerciseId: number, answerIndex: number) => {
    setAnswers({...answers, [exerciseId]: answerIndex.toString()})
  }

  const checkAnswer = (exerciseId: number) => {
    setShowResults({...showResults, [exerciseId]: true})
  }

  const resetExercise = (exerciseId: number) => {
    const newAnswers = {...answers}
    const newResults = {...showResults}
    delete newAnswers[exerciseId]
    delete newResults[exerciseId]
    setAnswers(newAnswers)
    setShowResults(newResults)
  }

  const sections = [
    {
      id: 'introduction',
      title: 'Introduction au théorème de Thalès',
      icon: '📐',
      content: (
        <div className="space-y-6">
          <div className="bg-blue-50 rounded-3xl p-8 border border-blue-200">
            <h3 className="text-2xl font-bold text-blue-900 mb-4 flex items-center">
              <span className="text-3xl mr-3">🏛️</span>
              Un peu d'histoire
            </h3>
            <p className="text-lg text-blue-800 leading-relaxed">
              Thalès de Milet (vers 625-547 av. J.-C.) était un philosophe et mathématicien grec. 
              Il aurait mesuré la hauteur de la pyramide de Khéops en utilisant les ombres et la proportionnalité !
            </p>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="text-3xl mr-3">🔍</span>
              Qu'est-ce que le théorème de Thalès ?
            </h3>
            
            <div className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-2xl p-6 mb-6">
              <h4 className="text-xl font-bold text-purple-900 mb-3">Énoncé du théorème</h4>
              <p className="text-lg text-purple-800">
                Si dans un triangle, une droite est parallèle à un côté, 
                alors elle divise les deux autres côtés proportionnellement.
              </p>
            </div>

            {/* Animation géométrique */}
            <div className="relative h-80 bg-gray-50 rounded-2xl flex items-center justify-center overflow-hidden">
              <div className="relative">
                {/* Triangle principal ABC */}
                <svg width="300" height="250" viewBox="0 0 300 250">
                  {/* Triangle ABC */}
                  <polygon 
                    points="150,30 50,200 250,200" 
                    fill="rgba(59, 130, 246, 0.1)" 
                    stroke="#3b82f6" 
                    strokeWidth="3"
                    className="transition-all duration-1000"
                  />
                  
                  {/* Droite parallèle MN */}
                  <line 
                    x1={90 + triangleAnimation * 10} 
                    y1={130 + triangleAnimation * 15} 
                    x2={210 - triangleAnimation * 10} 
                    y2={130 + triangleAnimation * 15} 
                    stroke="#ef4444" 
                    strokeWidth="3"
                    className="transition-all duration-1000"
                  />
                  
                  {/* Points */}
                  <circle cx="150" cy="30" r="4" fill="#3b82f6" />
                  <circle cx="50" cy="200" r="4" fill="#3b82f6" />
                  <circle cx="250" cy="200" r="4" fill="#3b82f6" />
                  <circle cx={90 + triangleAnimation * 10} cy={130 + triangleAnimation * 15} r="4" fill="#ef4444" />
                  <circle cx={210 - triangleAnimation * 10} cy={130 + triangleAnimation * 15} r="4" fill="#ef4444" />
                  
                  {/* Labels */}
                  <text x="150" y="20" textAnchor="middle" className="fill-blue-600 font-bold">A</text>
                  <text x="40" y="215" textAnchor="middle" className="fill-blue-600 font-bold">B</text>
                  <text x="260" y="215" textAnchor="middle" className="fill-blue-600 font-bold">C</text>
                  <text x={80 + triangleAnimation * 10} y={125 + triangleAnimation * 15} textAnchor="middle" className="fill-red-600 font-bold">M</text>
                  <text x={220 - triangleAnimation * 10} y={125 + triangleAnimation * 15} textAnchor="middle" className="fill-red-600 font-bold">N</text>
                </svg>
                
                <div className="absolute bottom-4 left-4 text-sm text-gray-600 bg-white/80 backdrop-blur-sm rounded-lg p-2">
                  Animation : MN // BC
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'formule',
      title: 'La formule de Thalès',
      icon: '📏',
      content: (
        <div className="space-y-6">
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="text-3xl mr-3">⚖️</span>
              L'égalité fondamentale
            </h3>
            
            <div className="bg-gradient-to-br from-green-100 to-teal-100 rounded-2xl p-8 mb-6">
              <h4 className="text-xl font-bold text-green-900 mb-4">Si MN // BC, alors :</h4>
              <div className="text-center">
                <BlockMath math="\frac{AM}{AB} = \frac{AN}{AC} = \frac{MN}{BC}" />
              </div>
              <p className="text-green-800 mt-4 text-center font-semibold">
                Les rapports de longueurs sont égaux !
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-blue-50 rounded-2xl p-6">
                <h4 className="text-lg font-bold text-blue-900 mb-3">💡 À retenir</h4>
                <ul className="space-y-2 text-blue-800">
                  <li>• AM et AB sont sur la même droite</li>
                  <li>• AN et AC sont sur la même droite</li>
                  <li>• MN est parallèle à BC</li>
                  <li>• Les trois rapports sont égaux</li>
                </ul>
              </div>
              
              <div className="bg-orange-50 rounded-2xl p-6">
                <h4 className="text-lg font-bold text-orange-900 mb-3">⚠️ Attention</h4>
                <ul className="space-y-2 text-orange-800">
                  <li>• Bien identifier les segments parallèles</li>
                  <li>• Respecter l'ordre des lettres</li>
                  <li>• Vérifier les unités</li>
                  <li>• Ne pas confondre avec Pythagore !</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-3xl p-8 shadow-xl border border-purple-200">
            <h3 className="text-2xl font-bold text-purple-900 mb-6 flex items-center">
              <span className="text-3xl mr-3">🎯</span>
              Exemple guidé
            </h3>
            
            <div className="bg-white rounded-2xl p-6 mb-4">
              <h4 className="text-lg font-bold mb-4">📋 Énoncé</h4>
              <p className="text-gray-700 mb-4">
                Dans le triangle ABC, la droite (MN) est parallèle au côté [BC].
                On donne : AM = 3 cm, MB = 2 cm, AN = 4,5 cm.
                Calculer AC.
              </p>
              
              <div className="bg-gray-50 rounded-xl p-4 mb-4">
                <h5 className="font-bold text-green-700 mb-2">🔍 Solution</h5>
                <div className="space-y-2">
                  <p><strong>1)</strong> On identifie : MN // BC</p>
                  <p><strong>2)</strong> D'après Thalès : <InlineMath math="\frac{AM}{AB} = \frac{AN}{AC}" /></p>
                  <p><strong>3)</strong> AB = AM + MB = 3 + 2 = 5 cm</p>
                  <p><strong>4)</strong> <InlineMath math="\frac{3}{5} = \frac{4,5}{AC}" /></p>
                  <p><strong>5)</strong> AC = <InlineMath math="\frac{4,5 \times 5}{3} = 7,5" /> cm</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'reciproque',
      title: 'Réciproque de Thalès',
      icon: '🔄',
      content: (
        <div className="space-y-6">
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="text-3xl mr-3">🔍</span>
              La réciproque : prouver le parallélisme
            </h3>
            
            <div className="bg-gradient-to-br from-red-100 to-pink-100 rounded-2xl p-8 mb-6">
              <h4 className="text-xl font-bold text-red-900 mb-4">Énoncé de la réciproque</h4>
              <p className="text-red-800 text-lg mb-4">
                Si dans un triangle ABC, on a des points M sur [AB] et N sur [AC] tels que :
              </p>
              <div className="text-center mb-4">
                <BlockMath math="\frac{AM}{AB} = \frac{AN}{AC}" />
              </div>
              <p className="text-red-800 text-lg font-semibold text-center">
                Alors les droites (MN) et (BC) sont parallèles.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-yellow-50 rounded-2xl p-6">
                <h4 className="text-lg font-bold text-yellow-900 mb-3">🎯 Utilité</h4>
                <p className="text-yellow-800">
                  La réciproque permet de <strong>démontrer</strong> qu'une droite 
                  est parallèle à un côté d'un triangle en calculant des rapports.
                </p>
              </div>
              
              <div className="bg-green-50 rounded-2xl p-6">
                <h4 className="text-lg font-bold text-green-900 mb-3">✅ Méthode</h4>
                <ol className="space-y-1 text-green-800">
                  <li>1. Calculer AM/AB</li>
                  <li>2. Calculer AN/AC</li>
                  <li>3. Comparer les rapports</li>
                  <li>4. Conclure</li>
                </ol>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-100 to-cyan-100 rounded-3xl p-8 shadow-xl border border-blue-200">
            <h3 className="text-2xl font-bold text-blue-900 mb-6 flex items-center">
              <span className="text-3xl mr-3">📝</span>
              Exemple d'application
            </h3>
            
            <div className="bg-white rounded-2xl p-6">
              <h4 className="text-lg font-bold mb-4">📋 Situation</h4>
              <p className="text-gray-700 mb-4">
                Dans le triangle ABC, M ∈ [AB] et N ∈ [AC].
                AM = 6 cm, AB = 9 cm, AN = 8 cm, AC = 12 cm.
                Les droites (MN) et (BC) sont-elles parallèles ?
              </p>
              
              <div className="bg-gray-50 rounded-xl p-4">
                <h5 className="font-bold text-blue-700 mb-2">🔍 Démonstration</h5>
                <div className="space-y-2">
                  <p><strong>1)</strong> Calculons <InlineMath math="\frac{AM}{AB} = \frac{6}{9} = \frac{2}{3}" /></p>
                  <p><strong>2)</strong> Calculons <InlineMath math="\frac{AN}{AC} = \frac{8}{12} = \frac{2}{3}" /></p>
                  <p><strong>3)</strong> On constate que <InlineMath math="\frac{AM}{AB} = \frac{AN}{AC}" /></p>
                  <p><strong>4)</strong> D'après la réciproque de Thalès, (MN) // (BC)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'exercices',
      title: 'Exercices interactifs',
      icon: '🎮',
      content: (
        <div className="space-y-6">
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="text-3xl mr-3">🎯</span>
              Testez vos connaissances !
            </h3>
            
            <div className="space-y-8">
              {exercises.map((exercise, index) => (
                <div key={exercise.id} className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-200">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-bold text-indigo-900">
                      Exercice {exercise.id}
                    </h4>
                    <div className="flex gap-2">
                      <button
                        onClick={() => checkAnswer(exercise.id)}
                        disabled={!answers[exercise.id]}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <CheckCircle className="w-4 h-4 inline mr-1" />
                        Vérifier
                      </button>
                      <button
                        onClick={() => resetExercise(exercise.id)}
                        className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                      >
                        <RotateCcw className="w-4 h-4 inline mr-1" />
                        Reset
                      </button>
                    </div>
                  </div>
                  
                  <p className="text-gray-700 mb-4 text-lg leading-relaxed">
                    {exercise.question}
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                    {exercise.options.map((option, optionIndex) => (
                      <button
                        key={optionIndex}
                        onClick={() => handleAnswer(exercise.id, optionIndex)}
                        className={`p-3 rounded-lg border-2 transition-all text-left ${
                          answers[exercise.id] === optionIndex.toString()
                            ? 'border-indigo-500 bg-indigo-50 text-indigo-900'
                            : 'border-gray-200 hover:border-indigo-300 hover:bg-indigo-25'
                        }`}
                      >
                        <span className="font-semibold mr-2">{String.fromCharCode(65 + optionIndex)})</span>
                        {option}
                      </button>
                    ))}
                  </div>
                  
                  {showResults[exercise.id] && (
                    <div className={`rounded-xl p-4 border-2 ${
                      parseInt(answers[exercise.id]) === exercise.correct
                        ? 'border-green-200 bg-green-50'
                        : 'border-red-200 bg-red-50'
                    }`}>
                      <div className="flex items-center mb-2">
                        {parseInt(answers[exercise.id]) === exercise.correct ? (
                          <>
                            <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                            <span className="font-bold text-green-800">Correct !</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-5 h-5 text-red-600 mr-2" />
                            <span className="font-bold text-red-800">Incorrect</span>
                          </>
                        )}
                      </div>
                      <p className="text-gray-700 mb-3">{exercise.explanation}</p>
                      <div className="bg-white/70 rounded-lg p-3">
                        <h5 className="font-semibold mb-2 flex items-center">
                          <Calculator className="w-4 h-4 mr-1" />
                          Calcul détaillé :
                        </h5>
                        <div className="text-center">
                          <BlockMath math={exercise.calculation} />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Particules de fond */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-blue-300/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-48 h-48 bg-purple-300/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-20 left-20 w-56 h-56 bg-pink-300/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '4s'}}></div>
      </div>

      {/* Header */}
      <div className="relative z-10 bg-white/80 backdrop-blur-sm shadow-sm border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <Link href="/4eme" className="p-2 hover:bg-white/60 rounded-lg transition-colors">
                <ChevronLeft className="w-6 h-6 text-gray-600" />
              </Link>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                  ⫽
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Théorème de Thalès</h1>
                  <p className="text-gray-600 mt-1">Proportionnalité dans les triangles - 4ème</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-green-600">
                <Trophy className="w-5 h-5 mr-1" />
                <span className="font-semibold">150 XP</span>
              </div>
              <div className="flex items-center text-blue-600">
                <Clock className="w-5 h-5 mr-1" />
                <span>75 min</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex space-x-1 bg-white/50 p-1 rounded-xl border border-white/20 backdrop-blur-sm">
            {sections.map((section, index) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(index)}
                className={`flex-1 flex items-center justify-center px-4 py-3 rounded-lg transition-all ${
                  activeSection === index
                    ? 'bg-white shadow-lg text-blue-600 border border-blue-200'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-white/50'
                }`}
              >
                <span className="text-xl mr-2">{section.icon}</span>
                <span className="font-medium hidden sm:inline">{section.title}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {sections[activeSection].content}
        </div>
      </div>

      {/* Footer de progression */}
      <div className="relative z-10 mt-12">
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/20 max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                ✓
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Chapitre complété !</h3>
                <p className="text-gray-600">Vous maîtrisez maintenant le théorème de Thalès</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-600">+150 XP</div>
              <div className="text-sm text-gray-600">Bien joué !</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 