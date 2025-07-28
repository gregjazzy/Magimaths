'use client'

import { useState } from 'react'
import { ArrowLeft, BookOpen, Target, Play, Pause, Thermometer, Mountain } from 'lucide-react'
import Link from 'next/link'

export default function NombresRelatifs5emePage() {
  const [activeTab, setActiveTab] = useState<'cours' | 'exercices'>('cours')
  const [currentExercise, setCurrentExercise] = useState(0)
  const [userAnswer, setUserAnswer] = useState('')
  const [showAnswer, setShowAnswer] = useState(false)
  const [score, setScore] = useState(0)
  const [currentStep, setCurrentStep] = useState(0)
  const [animationStep, setAnimationStep] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [exerciseType, setExerciseType] = useState<'numerical' | 'textual' | 'practical'>('numerical')

  const exercises = [
    // Niveau 1 : Lecture et écriture
    {
      id: 'rel1',
      question: 'Écrire en écriture décimale : +7',
      answer: '7',
      steps: [
        'Identifier le nombre : +7',
        'Le signe + devant un nombre positif peut être omis',
        'Écriture décimale : 7',
        'Résultat final : 7'
      ]
    },
    {
      id: 'rel2',
      question: 'Écrire avec un signe : 5',
      answer: '+5',
      steps: [
        'Identifier le nombre : 5',
        'Un nombre positif peut s\'écrire avec le signe +',
        'Écriture avec signe : +5',
        'Résultat final : +5'
      ]
    },
    {
      id: 'rel3',
      question: 'Écrire l\'opposé de +8',
      answer: '-8',
      steps: [
        'Identifier le nombre : +8',
        'L\'opposé d\'un nombre positif est négatif',
        'Opposé de +8 : -8',
        'Résultat final : -8'
      ]
    },
    {
      id: 'rel4',
      question: 'Écrire l\'opposé de -6',
      answer: '+6',
      steps: [
        'Identifier le nombre : -6',
        'L\'opposé d\'un nombre négatif est positif',
        'Opposé de -6 : +6',
        'Résultat final : +6'
      ]
    },
    {
      id: 'rel5',
      question: 'Quelle est la distance à zéro de -4 ?',
      answer: '4',
      steps: [
        'Identifier le nombre : -4',
        'La distance à zéro est la valeur absolue',
        'Distance à zéro de -4 : |−4| = 4',
        'Résultat final : 4'
      ]
    },

    // Niveau 2 : Comparaison
    {
      id: 'rel6',
      question: 'Comparer avec <, > ou = : -3 ... +2',
      answer: '<',
      steps: [
        'Identifier les nombres : -3 et +2',
        'Un nombre négatif est toujours inférieur à un nombre positif',
        'Donc -3 < +2',
        'Résultat final : <'
      ]
    },
    {
      id: 'rel7',
      question: 'Comparer avec <, > ou = : -7 ... -5',
      answer: '<',
      steps: [
        'Identifier les nombres : -7 et -5',
        'Pour les nombres négatifs : plus la valeur absolue est grande, plus le nombre est petit',
        'Donc -7 < -5',
        'Résultat final : <'
      ]
    },
    {
      id: 'rel8',
      question: 'Ranger dans l\'ordre croissant : +3, -2, -8, +1',
      answer: '-8, -2, +1, +3',
      steps: [
        'Identifier les nombres : +3, -2, -8, +1',
        'Placer sur la droite graduée : -8 < -2 < +1 < +3',
        'Ordre croissant : -8, -2, +1, +3',
        'Résultat final : -8, -2, +1, +3'
      ]
    },

    // Niveau 3 : Addition
    {
      id: 'rel9',
      question: 'Calculer : (+5) + (+3)',
      answer: '+8',
      steps: [
        'Identifier l\'opération : (+5) + (+3)',
        'Addition de deux nombres positifs : on additionne les valeurs',
        'Calculer : 5 + 3 = 8',
        'Résultat final : +8'
      ]
    },
    {
      id: 'rel10',
      question: 'Calculer : (-4) + (-6)',
      answer: '-10',
      steps: [
        'Identifier l\'opération : (-4) + (-6)',
        'Addition de deux nombres négatifs : on additionne les valeurs et on garde le signe -',
        'Calculer : 4 + 6 = 10, avec signe -',
        'Résultat final : -10'
      ]
    },
    {
      id: 'rel11',
      question: 'Calculer : (+7) + (-3)',
      answer: '+4',
      steps: [
        'Identifier l\'opération : (+7) + (-3)',
        'Addition de nombres de signes contraires : on soustrait les valeurs',
        'Calculer : 7 - 3 = 4, signe du plus grand : +',
        'Résultat final : +4'
      ]
    },
    {
      id: 'rel12',
      question: 'Calculer : (-8) + (+3)',
      answer: '-5',
      steps: [
        'Identifier l\'opération : (-8) + (+3)',
        'Addition de nombres de signes contraires : on soustrait les valeurs',
        'Calculer : 8 - 3 = 5, signe du plus grand : -',
        'Résultat final : -5'
      ]
    },

    // Niveau 4 : Soustraction
    {
      id: 'rel13',
      question: 'Calculer : (+6) - (+4)',
      answer: '+2',
      steps: [
        'Identifier l\'opération : (+6) - (+4)',
        'Soustraire c\'est ajouter l\'opposé : (+6) + (-4)',
        'Calculer : 6 - 4 = 2',
        'Résultat final : +2'
      ]
    },
    {
      id: 'rel14',
      question: 'Calculer : (+3) - (-5)',
      answer: '+8',
      steps: [
        'Identifier l\'opération : (+3) - (-5)',
        'Soustraire c\'est ajouter l\'opposé : (+3) + (+5)',
        'Calculer : 3 + 5 = 8',
        'Résultat final : +8'
      ]
    },
    {
      id: 'rel15',
      question: 'Calculer : (-7) - (+2)',
      answer: '-9',
      steps: [
        'Identifier l\'opération : (-7) - (+2)',
        'Soustraire c\'est ajouter l\'opposé : (-7) + (-2)',
        'Calculer : 7 + 2 = 9, avec signe -',
        'Résultat final : -9'
      ]
    },
    {
      id: 'rel16',
      question: 'Calculer : (-4) - (-6)',
      answer: '+2',
      steps: [
        'Identifier l\'opération : (-4) - (-6)',
        'Soustraire c\'est ajouter l\'opposé : (-4) + (+6)',
        'Calculer : 6 - 4 = 2',
        'Résultat final : +2'
      ]
    },

    // Niveau 5 : Expressions complexes
    {
      id: 'rel17',
      question: 'Calculer : (+2) + (-5) + (+3)',
      answer: '0',
      steps: [
        'Identifier l\'opération : (+2) + (-5) + (+3)',
        'Regrouper : (+2) + (+3) + (-5) = (+5) + (-5)',
        'Calculer : 5 - 5 = 0',
        'Résultat final : 0'
      ]
    },
    {
      id: 'rel18',
      question: 'Calculer : (-3) + (+7) - (-2)',
      answer: '+6',
      steps: [
        'Identifier l\'opération : (-3) + (+7) - (-2)',
        'Transformer la soustraction : (-3) + (+7) + (+2)',
        'Calculer : -3 + 7 + 2 = 6',
        'Résultat final : +6'
      ]
    },
    {
      id: 'rel19',
      question: 'Calculer : (+5) - (+8) + (-2)',
      answer: '-5',
      steps: [
        'Identifier l\'opération : (+5) - (+8) + (-2)',
        'Transformer : (+5) + (-8) + (-2)',
        'Calculer : 5 - 8 - 2 = -5',
        'Résultat final : -5'
      ]
    },
    {
      id: 'rel20',
      question: 'Calculer : (-6) - (-4) + (+3) - (+5)',
      answer: '-4',
      steps: [
        'Identifier l\'opération : (-6) - (-4) + (+3) - (+5)',
        'Transformer : (-6) + (+4) + (+3) + (-5)',
        'Calculer : -6 + 4 + 3 - 5 = -4',
        'Résultat final : -4'
      ]
    }
  ]

  const textualExercises = [
    {
      id: 'text1',
      question: 'Traduire en écriture mathématique :',
      phrase: 'Le thermomètre indique 5 degrés au-dessus de zéro.',
      answer: '+5',
      calculation: '+5°C',
      steps: [
        'Identifier les éléments : "5 degrés au-dessus de zéro"',
        'Au-dessus de zéro signifie positif',
        'Traduire : +5°C',
        'Résultat final : +5'
      ]
    },
    {
      id: 'text2',
      question: 'Traduire en écriture mathématique :',
      phrase: 'La température est de 8 degrés en dessous de zéro.',
      answer: '-8',
      calculation: '-8°C',
      steps: [
        'Identifier les éléments : "8 degrés en dessous de zéro"',
        'En dessous de zéro signifie négatif',
        'Traduire : -8°C',
        'Résultat final : -8'
      ]
    },
    {
      id: 'text3',
      question: 'Traduire en écriture mathématique :',
      phrase: 'Un sous-marin plonge à 120 mètres de profondeur.',
      answer: '-120',
      calculation: '-120 m',
      steps: [
        'Identifier les éléments : "120 mètres de profondeur"',
        'Profondeur (sous le niveau de la mer) est négative',
        'Traduire : -120 m',
        'Résultat final : -120'
      ]
    },
    {
      id: 'text4',
      question: 'Traduire en écriture mathématique :',
      phrase: 'Le mont Blanc culmine à 4809 mètres d\'altitude.',
      answer: '+4809',
      calculation: '+4809 m',
      steps: [
        'Identifier les éléments : "4809 mètres d\'altitude"',
        'Altitude (au-dessus du niveau de la mer) est positive',
        'Traduire : +4809 m',
        'Résultat final : +4809'
      ]
    },
    {
      id: 'text5',
      question: 'Calculer la variation de température :',
      phrase: 'La température passe de -3°C à +7°C.',
      answer: '+10',
      calculation: '(+7) - (-3) = +10',
      steps: [
        'Identifier les températures : de -3°C à +7°C',
        'Variation = température finale - température initiale',
        'Calculer : (+7) - (-3) = (+7) + (+3) = +10',
        'Résultat final : +10°C'
      ]
    },
    {
      id: 'text6',
      question: 'Calculer la variation d\'altitude :',
      phrase: 'Un ascenseur monte du niveau -2 au niveau +5.',
      answer: '+7',
      calculation: '(+5) - (-2) = +7',
      steps: [
        'Identifier les niveaux : du niveau -2 au niveau +5',
        'Variation = niveau final - niveau initial',
        'Calculer : (+5) - (-2) = (+5) + (+2) = +7',
        'Résultat final : +7 niveaux'
      ]
    },
    {
      id: 'text7',
      question: 'Valider cette affirmation :',
      phrase: 'L\'opposé de -5 est +5.',
      answer: 'Vrai',
      calculation: 'Opposé de -5 = +5',
      steps: [
        'Identifier le nombre : -5',
        'L\'opposé d\'un nombre négatif est positif',
        'Opposé de -5 = +5',
        'L\'affirmation est vraie',
        'Résultat final : Vrai'
      ]
    },
    {
      id: 'text8',
      question: 'Valider cette affirmation :',
      phrase: '-7 est plus grand que -3.',
      answer: 'Faux',
      calculation: '-7 < -3',
      steps: [
        'Identifier les nombres : -7 et -3',
        'Pour les nombres négatifs : plus la valeur absolue est grande, plus le nombre est petit',
        'Donc -7 < -3',
        'L\'affirmation est fausse',
        'Résultat final : Faux'
      ]
    },
    {
      id: 'text9',
      question: 'Compléter avec le bon signe :',
      phrase: 'La somme de deux nombres négatifs est toujours ... zéro.',
      answer: '<',
      calculation: 'Nombre négatif + Nombre négatif < 0',
      steps: [
        'Identifier l\'opération : somme de deux nombres négatifs',
        'Exemple : (-2) + (-3) = -5',
        'Un nombre négatif est toujours inférieur à zéro',
        'Résultat final : < (inférieur à)'
      ]
    },
    {
      id: 'text10',
      question: 'Interpréter le résultat :',
      phrase: 'Un compte bancaire passe de -50€ à +30€. Quelle est la variation ?',
      answer: '+80',
      calculation: '(+30) - (-50) = +80',
      steps: [
        'Identifier les montants : de -50€ à +30€',
        'Variation = montant final - montant initial',
        'Calculer : (+30) - (-50) = (+30) + (+50) = +80',
        'Interprétation : le compte a augmenté de 80€',
        'Résultat final : +80€'
      ]
    }
  ]

  const practicalExercises = [
    {
      id: 'prac1',
      question: 'Températures dans le monde',
      context: 'Voici les températures relevées dans différentes villes : Paris +12°C, Moscou -8°C, New York +5°C, Antarctique -25°C.',
      phrase: 'Quelle est la différence de température entre la ville la plus chaude et la plus froide ?',
      answer: '37',
      calculation: '(+12) - (-25) = +37',
      steps: [
        'Identifier les températures : +12°C, -8°C, +5°C, -25°C',
        'Température la plus chaude : +12°C (Paris)',
        'Température la plus froide : -25°C (Antarctique)',
        'Différence : (+12) - (-25) = (+12) + (+25) = +37',
        'Résultat final : 37°C'
      ]
    },
    {
      id: 'prac2',
      question: 'Altitude d\'un avion',
      context: 'Un avion décolle de l\'aéroport (altitude 0 m), monte à 8000 m d\'altitude, puis redescend à 3000 m.',
      phrase: 'Quelle est la variation d\'altitude entre le décollage et la position finale ?',
      answer: '+3000',
      calculation: '(+3000) - (0) = +3000',
      steps: [
        'Identifier les altitudes : décollage 0 m, finale +3000 m',
        'Variation = altitude finale - altitude initiale',
        'Calculer : (+3000) - (0) = +3000',
        'Résultat final : +3000 m'
      ]
    },
    {
      id: 'prac3',
      question: 'Compte bancaire',
      context: 'Marie a un compte avec un découvert de 150€. Elle reçoit son salaire de 1200€ et dépense 800€.',
      phrase: 'Quel est le solde final de son compte ?',
      answer: '+250',
      calculation: '(-150) + (+1200) + (-800) = +250',
      steps: [
        'Identifier les opérations : découvert -150€, salaire +1200€, dépense -800€',
        'Solde final = solde initial + recettes - dépenses',
        'Calculer : (-150) + (+1200) + (-800)',
        'Résultat : -150 + 1200 - 800 = +250',
        'Résultat final : +250€'
      ]
    },
    {
      id: 'prac4',
      question: 'Profondeur marine',
      context: 'Un sous-marin navigue à -200 m. Il remonte de 80 m, puis plonge de 120 m.',
      phrase: 'À quelle profondeur finale se trouve le sous-marin ?',
      answer: '-240',
      calculation: '(-200) + (+80) + (-120) = -240',
      steps: [
        'Identifier les mouvements : départ -200 m, remonte +80 m, plonge -120 m',
        'Position finale = position initiale + mouvements',
        'Calculer : (-200) + (+80) + (-120)',
        'Résultat : -200 + 80 - 120 = -240',
        'Résultat final : -240 m'
      ]
    },
    {
      id: 'prac5',
      question: 'Variation de poids',
      context: 'Pendant un régime, Paul perd 3 kg la première semaine, prend 1 kg la deuxième, puis perd 2 kg la troisième.',
      phrase: 'Quelle est la variation totale de poids ?',
      answer: '-4',
      calculation: '(-3) + (+1) + (-2) = -4',
      steps: [
        'Identifier les variations : -3 kg, +1 kg, -2 kg',
        'Variation totale = somme des variations',
        'Calculer : (-3) + (+1) + (-2)',
        'Résultat : -3 + 1 - 2 = -4',
        'Résultat final : -4 kg (perte de 4 kg)'
      ]
    }
  ]

  const currentEx = exerciseType === 'numerical' ? exercises[currentExercise] : 
                    exerciseType === 'textual' ? textualExercises[currentExercise] : 
                    practicalExercises[currentExercise]
  const currentExercises = exerciseType === 'numerical' ? exercises : 
                           exerciseType === 'textual' ? textualExercises : 
                           practicalExercises

  const checkAnswer = () => {
    const isCorrect = userAnswer.trim().toLowerCase() === currentEx.answer.toLowerCase()
    setShowAnswer(true)
    if (isCorrect) {
      setScore(score + 1)
    }
  }

  const nextExercise = () => {
    if (currentExercise < currentExercises.length - 1) {
      setCurrentExercise(currentExercise + 1)
      setUserAnswer('')
      setShowAnswer(false)
      setCurrentStep(0)
    }
  }

  const prevExercise = () => {
    if (currentExercise > 0) {
      setCurrentExercise(currentExercise - 1)
      setUserAnswer('')
      setShowAnswer(false)
      setCurrentStep(0)
    }
  }

  const nextStep = () => {
    if (currentStep < currentEx.steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const resetExercise = () => {
    setCurrentExercise(0)
    setUserAnswer('')
    setShowAnswer(false)
    setScore(0)
    setCurrentStep(0)
  }

  const switchExerciseType = (type: 'numerical' | 'textual' | 'practical') => {
    setExerciseType(type)
    setCurrentExercise(0)
    setUserAnswer('')
    setShowAnswer(false)
    setCurrentStep(0)
  }

  const startAnimation = () => {
    setIsAnimating(true)
    setAnimationStep(0)
    const interval = setInterval(() => {
      setAnimationStep(prev => {
        if (prev >= 4) {
          clearInterval(interval)
          setIsAnimating(false)
          return 0
        }
        return prev + 1
      })
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <Link
                href="/cm1"
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <ArrowLeft size={20} />
                <span>Retour au menu</span>
              </Link>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Nombres relatifs</h1>
                <p className="text-gray-600 text-lg">
                  Nombres positifs, négatifs, opérations et comparaisons
                </p>
              </div>
              <div className="ml-auto text-right">
                <div className="text-sm text-gray-600">Durée estimée</div>
                <div className="text-xl font-semibold text-purple-600">70 minutes</div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mt-6">
              {[
                { id: 'cours', label: 'Cours', icon: BookOpen },
                { id: 'exercices', label: 'Exercices', icon: Target }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-purple-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <tab.icon size={20} />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Contenu */}
        {activeTab === 'cours' && (
          <div className="space-y-8">
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-8 border border-purple-200">
              <h2 className="text-2xl font-bold text-purple-800 mb-6">🌡️ Nombres relatifs</h2>
              
              <div className="space-y-6">
                <div className="bg-white rounded-lg p-6 border border-purple-100">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Définition</h3>
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <p className="text-blue-800 font-medium mb-4">
                      Les nombres relatifs sont constitués de :
                    </p>
                    <ul className="text-blue-700 space-y-2">
                      <li>• <strong>Nombres positifs</strong> : supérieurs à zéro (+1, +5, +10, +1,3, +2,5...)</li>
                      <li>• <strong>Nombres négatifs</strong> : inférieurs à zéro (-1, -5, -10, -1,3, -2,5...)</li>
                    </ul>
                    <div className="mt-4 p-3 bg-blue-100 rounded-lg border border-blue-300">
                      <p className="text-blue-800 text-sm">
                        <strong>Important :</strong> Les nombres relatifs peuvent être des nombres entiers ou des nombres décimaux (avec virgule).
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-6 border border-purple-100">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Droite graduée</h3>
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <p className="text-green-800 font-medium mb-4">
                      Sur une droite graduée : -1,5 et +2,3
                    </p>
                    <div className="flex items-center justify-center my-16">
                      <div className="relative py-16">
                        {/* Flèche droite */}
                        <div className="absolute -right-4 top-1/2 w-0 h-0 border-l-4 border-l-gray-600 border-t-2 border-t-transparent border-b-2 border-b-transparent transform -translate-y-1/2"></div>
                        
                        {/* Flèche "plus" partant du 0 vers la droite */}
                        <div className="absolute left-1/2 -top-10">
                          <div className="flex flex-col items-center">
                            <span className="text-2xl font-bold text-blue-600 mb-1">+</span>
                            <svg width="120" height="20" viewBox="0 0 120 20" className="text-blue-600">
                              <line x1="5" y1="10" x2="100" y2="10" stroke="#2563eb" strokeWidth="3"/>
                              <polygon points="100,6 115,10 100,14" fill="#2563eb"/>
                            </svg>
                          </div>
                        </div>
                        
                        {/* Flèche "moins" partant du 0 vers la gauche */}
                        <div className="absolute left-1/2 -top-10 transform -translate-x-full">
                          <div className="flex flex-col items-center">
                            <span className="text-2xl font-bold text-red-600 mb-1">−</span>
                            <svg width="120" height="20" viewBox="0 0 120 20" className="text-red-600">
                              <line x1="115" y1="10" x2="20" y2="10" stroke="#dc2626" strokeWidth="3"/>
                              <polygon points="20,6 5,10 20,14" fill="#dc2626"/>
                            </svg>
                          </div>
                        </div>
                        
                        {/* Droite graduée */}
                        <div className="w-[500px] h-1 bg-gray-600 relative top-1/2 transform -translate-y-1/2">
                          {/* Graduations principales - espacées régulièrement */}
                          <div className="absolute w-0.5 h-6 bg-gray-800 -top-3" style={{left: '10%'}}></div>
                          <div className="absolute w-0.5 h-6 bg-gray-800 -top-3" style={{left: '30%'}}></div>
                          <div className="absolute w-0.5 h-6 bg-gray-800 -top-3" style={{left: '70%'}}></div>
                          <div className="absolute w-0.5 h-6 bg-gray-800 -top-3" style={{left: '90%'}}></div>
                          <div className="absolute left-1/2 w-0.5 h-8 bg-gray-900 -top-4"></div>
                          {/* Graduation pour -1,5 */}
                          <div className="absolute w-0.5 h-4 bg-gray-700 -top-2.5" style={{left: '20%'}}></div>
                          {/* Graduation pour 2,2 */}
                          <div className="absolute w-0.5 h-4 bg-gray-700 -top-2.5" style={{left: '94%'}}></div>
                        </div>
                        
                        {/* Nombres principaux - espacés régulièrement */}
                        <div className="absolute text-lg text-center w-12 font-bold text-red-600" style={{left: '10%', marginLeft: '-24px', top: '20px'}}>-2</div>
                        <div className="absolute text-lg text-center w-12 font-bold text-red-600" style={{left: '30%', marginLeft: '-24px', top: '20px'}}>-1</div>
                        <div className="absolute text-lg text-center w-12 font-bold text-gray-800 bg-yellow-200 rounded px-2 py-1" style={{left: '50%', marginLeft: '-24px', top: '20px'}}>0</div>
                        <div className="absolute text-lg text-center w-12 font-bold text-blue-600" style={{left: '70%', marginLeft: '-24px', top: '20px'}}>1</div>
                        <div className="absolute text-lg text-center w-12 font-bold text-blue-600" style={{left: '90%', marginLeft: '-24px', top: '20px'}}>2</div>
                        {/* Nombre -1,5 */}
                        <div className="absolute text-sm text-center w-12 font-semibold text-red-600" style={{left: '20%', marginLeft: '-24px', top: '20px'}}>-1,5</div>
                        {/* Nombre 2,2 */}
                        <div className="absolute text-sm text-center w-12 font-semibold text-blue-600" style={{left: '94%', marginLeft: '-24px', top: '20px'}}>2,2</div>
                        

                      </div>
                    </div>
                    <ul className="text-green-700 space-y-2 text-sm">
                      <li>• Les nombres négatifs sont à <strong>gauche</strong> de zéro</li>
                      <li>• Les nombres positifs sont à <strong>droite</strong> de zéro</li>
                      <li>• Plus on va vers la droite, plus les nombres sont <strong>grands</strong></li>
                    </ul>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-6 border border-purple-100">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Additions et soustractions de nombres relatifs</h3>
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <p className="text-blue-800 font-medium mb-4">
                      Visualisez les opérations sur la droite graduée :
                    </p>
                    
                    {/* Interface interactive */}
                    <div className="space-y-4 mb-6">
                      <div className="flex items-center space-x-4 justify-center">
                        <input 
                          type="number" 
                          placeholder="Premier nombre" 
                          className="w-24 px-3 py-2 border border-gray-300 rounded text-center"
                          id="firstNumber"
                        />
                        <select className="px-3 py-2 border border-gray-300 rounded" id="operation">
                          <option value="+">+</option>
                          <option value="-">-</option>
                        </select>
                        <input 
                          type="number" 
                          placeholder="Deuxième nombre" 
                          className="w-24 px-3 py-2 border border-gray-300 rounded text-center"
                          id="secondNumber"
                        />
                        <button 
                          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                          onClick={() => {
                            const firstEl = document.getElementById('firstNumber') as HTMLInputElement;
                            const secondEl = document.getElementById('secondNumber') as HTMLInputElement;
                            const opEl = document.getElementById('operation') as HTMLSelectElement;
                            const resultEl = document.getElementById('result');
                            const calcEl = document.getElementById('calculation');
                            
                            if (firstEl && secondEl && opEl && resultEl && calcEl && firstEl.value && secondEl.value) {
                              const result = opEl.value === '+' ? 
                                parseFloat(firstEl.value) + parseFloat(secondEl.value) : 
                                parseFloat(firstEl.value) - parseFloat(secondEl.value);
                              resultEl.textContent = result.toString();
                              calcEl.textContent = `${firstEl.value} ${opEl.value} ${secondEl.value} = ${result}`;
                            }
                          }}
                        >
                          Calculer
                        </button>
                      </div>
                      
                      <div className="text-center">
                        <span className="text-lg font-semibold text-gray-700">Résultat : </span>
                        <span id="result" className="text-xl font-bold text-blue-600">?</span>
                      </div>
                      
                      <div className="text-center">
                        <span id="calculation" className="text-lg text-gray-600">Entrez vos nombres ci-dessus</span>
                      </div>
                    </div>

                    {/* Droite graduée interactive */}
                    <div className="bg-white p-6 rounded-lg border border-gray-200">
                      <h4 className="text-lg font-semibold text-gray-800 mb-4 text-center">Droite graduée interactive</h4>
                      
                      <div className="flex items-center justify-center my-8">
                        <div className="relative py-8">
                          {/* Droite graduée */}
                          <div className="w-[600px] h-1 bg-gray-600 relative">
                            {/* Graduations */}
                            {[-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5].map(num => (
                              <div key={num} className="absolute flex flex-col items-center">
                                <div 
                                  className="w-0.5 h-6 bg-gray-800 -top-3" 
                                  style={{left: `${(num + 5) * 10}%`}}
                                ></div>
                                <span 
                                  className={`text-sm font-semibold mt-2 ${num < 0 ? 'text-red-600' : num > 0 ? 'text-blue-600' : 'text-gray-800'}`}
                                  style={{left: `${(num + 5) * 10}%`, transform: 'translateX(-50%)', position: 'absolute', top: '25px'}}
                                >
                                  {num}
                                </span>
                              </div>
                            ))}
                            
                            {/* Curseur mobile */}
                            <div 
                              id="cursor" 
                              className="absolute w-4 h-4 bg-green-500 rounded-full border-2 border-green-700 -top-2 transition-all duration-500"
                              style={{left: '50%', transform: 'translateX(-50%)'}}
                            ></div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Exemples prédéfinis */}
                      <div className="grid md:grid-cols-2 gap-4 mt-6">
                        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                          <h5 className="font-semibold text-green-800 mb-2">Addition</h5>
                          <p className="text-sm text-green-700 mb-2">
                            <strong>(-2) + (+3)</strong> : Partir de -2, avancer de 3 vers la droite
                          </p>
                          <button 
                            className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                            onClick={() => {
                              const firstEl = document.getElementById('firstNumber') as HTMLInputElement;
                              const secondEl = document.getElementById('secondNumber') as HTMLInputElement;
                              const opEl = document.getElementById('operation') as HTMLSelectElement;
                              const resultEl = document.getElementById('result');
                              const calcEl = document.getElementById('calculation');
                              const cursor = document.getElementById('cursor');
                              
                              if (firstEl && secondEl && opEl && resultEl && calcEl && cursor) {
                                firstEl.value = '-2';
                                secondEl.value = '3';
                                opEl.value = '+';
                                resultEl.textContent = '1';
                                calcEl.textContent = '(-2) + (+3) = +1';
                                // Animation du curseur
                                cursor.style.left = '30%'; // Position -2
                                setTimeout(() => {
                                  cursor.style.left = '60%'; // Position +1
                                }, 500);
                              }
                            }}
                          >
                            Voir l'animation
                          </button>
                        </div>
                        
                        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                          <h5 className="font-semibold text-red-800 mb-2">Soustraction</h5>
                          <p className="text-sm text-red-700 mb-2">
                            <strong>(+1) - (+4)</strong> : Partir de +1, reculer de 4 vers la gauche
                          </p>
                          <button 
                            className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                            onClick={() => {
                              const firstEl = document.getElementById('firstNumber') as HTMLInputElement;
                              const secondEl = document.getElementById('secondNumber') as HTMLInputElement;
                              const opEl = document.getElementById('operation') as HTMLSelectElement;
                              const resultEl = document.getElementById('result');
                              const calcEl = document.getElementById('calculation');
                              const cursor = document.getElementById('cursor');
                              
                              if (firstEl && secondEl && opEl && resultEl && calcEl && cursor) {
                                firstEl.value = '1';
                                secondEl.value = '4';
                                opEl.value = '-';
                                resultEl.textContent = '-3';
                                calcEl.textContent = '(+1) - (+4) = -3';
                                // Animation du curseur
                                cursor.style.left = '60%'; // Position +1
                                setTimeout(() => {
                                  cursor.style.left = '20%'; // Position -3
                                }, 500);
                              }
                            }}
                          >
                            Voir l'animation
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 text-sm text-blue-700">
                      <p><strong>💡 Règle :</strong></p>
                      <ul className="list-disc ml-6 space-y-1">
                        <li>Pour <strong>additionner</strong> : avancer vers la droite si positif, vers la gauche si négatif</li>
                        <li>Pour <strong>soustraire</strong> : faire le contraire de l'addition</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-6 border border-purple-100">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Règles des signes</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                      <h4 className="font-semibold text-orange-800 mb-3">Addition</h4>
                      <ul className="text-orange-700 space-y-2 text-sm">
                        <li>• (+) + (+) = (+)</li>
                        <li>• (-) + (-) = (-)</li>
                        <li>• (+) + (-) = signe du plus grand</li>
                        <li>• (-) + (+) = signe du plus grand</li>
                      </ul>
                    </div>
                    <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                      <h4 className="font-semibold text-red-800 mb-3">Soustraction</h4>
                      <ul className="text-red-700 space-y-2 text-sm">
                        <li>• Soustraire = Ajouter l'opposé</li>
                        <li>• a - b = a + (-b)</li>
                        <li>• a - (-b) = a + b</li>
                        <li>• (-a) - b = (-a) + (-b)</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-6 border border-purple-100">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Exemples pratiques</h3>
                  <div className="space-y-4">
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                        <Thermometer className="w-4 h-4" />
                        Températures
                      </h4>
                      <div className="text-sm text-blue-700 space-y-1">
                        <div>• 5°C au-dessus de zéro → +5°C</div>
                        <div>• 8°C en dessous de zéro → -8°C</div>
                        <div>• De -3°C à +7°C → variation de +10°C</div>
                      </div>
                    </div>
                    
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                      <h4 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
                        <Mountain className="w-4 h-4" />
                        Altitudes
                      </h4>
                      <div className="text-sm text-green-700 space-y-1">
                        <div>• Mont Blanc : +4809 m</div>
                        <div>• Niveau de la mer : 0 m</div>
                        <div>• Fosse marine : -11000 m</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Exercices */}
        {activeTab === 'exercices' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Exercices</h2>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Score :</span>
                  <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-semibold">
                    {score} / {currentExercises.length}
                  </span>
                </div>
              </div>

              <div className="flex gap-2 mb-6">
                <button
                  onClick={() => switchExerciseType('numerical')}
                  className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                    exerciseType === 'numerical'
                      ? 'bg-purple-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Exercices numériques
                </button>
                <button
                  onClick={() => switchExerciseType('textual')}
                  className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                    exerciseType === 'textual'
                      ? 'bg-purple-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Exercices textuels
                </button>
                <button
                  onClick={() => switchExerciseType('practical')}
                  className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                    exerciseType === 'practical'
                      ? 'bg-purple-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Exercices pratiques
                </button>
              </div>

              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800">{currentEx.question}</h3>
                    {exerciseType === 'textual' && (
                      <div className="mt-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <p className="text-blue-800 font-medium italic">
                          "{(currentEx as any).phrase}"
                        </p>
                        {showAnswer && (
                          <div className="mt-2 pt-2 border-t border-blue-300">
                            <p className="text-sm text-blue-700">
                              <strong>Calcul :</strong> {(currentEx as any).calculation}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                    {exerciseType === 'practical' && (
                      <div className="mt-3 space-y-3">
                        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                          <p className="text-green-800 font-medium">
                            <strong>Contexte :</strong> {(currentEx as any).context}
                          </p>
                        </div>
                        <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                          <p className="text-orange-800 font-medium">
                            <strong>Question :</strong> {(currentEx as any).phrase}
                          </p>
                        </div>
                        {showAnswer && (
                          <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                            <p className="text-purple-800 font-medium">
                              <strong>Calcul :</strong> {(currentEx as any).calculation}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                      Exercice {currentExercise + 1} sur {currentExercises.length}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={prevExercise}
                        disabled={currentExercise === 0}
                        className={`px-3 py-2 text-white rounded-lg font-semibold text-sm ${
                          currentExercise === 0 
                            ? 'bg-gray-300 cursor-not-allowed' 
                            : 'bg-gray-500 hover:bg-gray-600'
                        }`}
                      >
                        ← Précédent
                      </button>
                      <button
                        onClick={nextExercise}
                        disabled={currentExercise === currentExercises.length - 1}
                        className={`px-3 py-2 text-white rounded-lg font-semibold text-sm ${
                          currentExercise === currentExercises.length - 1
                            ? 'bg-gray-300 cursor-not-allowed'
                            : 'bg-purple-500 hover:bg-purple-600'
                        }`}
                      >
                        Suivant →
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 mb-6">
                  <input
                    type="text"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    placeholder={exerciseType === 'textual' ? "Votre réponse..." : "Votre réponse..."}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
                  />
                  <button
                    onClick={checkAnswer}
                    disabled={!userAnswer.trim() || showAnswer}
                    className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:bg-gray-400"
                  >
                    Vérifier
                  </button>
                </div>

                {showAnswer && (
                  <div className="space-y-4">
                    <div className={`p-4 rounded-lg border ${
                      userAnswer.trim().toLowerCase() === currentEx.answer.toLowerCase()
                        ? 'bg-green-50 border-green-200'
                        : 'bg-red-50 border-red-200'
                    }`}>
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`font-semibold ${
                          userAnswer.trim().toLowerCase() === currentEx.answer.toLowerCase() ? 'text-green-800' : 'text-red-800'
                        }`}>
                          {userAnswer.trim().toLowerCase() === currentEx.answer.toLowerCase() ? '✅ Correct !' : '❌ Incorrect'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700">
                        Réponse correcte : <strong>{currentEx.answer}</strong>
                      </p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-800">📝 Correction détaillée</h4>
                        <span className="text-sm text-gray-600">
                          Étape {currentStep + 1} sur {currentEx.steps.length}
                        </span>
                      </div>
                      <div className="text-sm text-gray-700 space-y-2">
                        {currentEx.steps.slice(0, currentStep + 1).map((step, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <span className="bg-purple-100 px-2 py-1 rounded text-purple-800 text-xs">
                              {index + 1}
                            </span>
                            <span>{step}</span>
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-between mt-4">
                        <button
                          onClick={prevStep}
                          disabled={currentStep === 0}
                          className={`px-4 py-2 rounded-lg text-sm font-medium ${
                            currentStep === 0
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          }`}
                        >
                          ← Étape précédente
                        </button>
                        <button
                          onClick={nextStep}
                          disabled={currentStep === currentEx.steps.length - 1}
                          className={`px-4 py-2 rounded-lg text-sm font-medium ${
                            currentStep === currentEx.steps.length - 1
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                              : 'bg-purple-500 text-white hover:bg-purple-600'
                          }`}
                        >
                          Étape suivante →
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-center">
                <button
                  onClick={resetExercise}
                  className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 font-medium"
                >
                  Recommencer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 