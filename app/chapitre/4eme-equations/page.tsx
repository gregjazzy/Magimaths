'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, XCircle, RotateCcw, Lightbulb, Play, Eye } from 'lucide-react';

export default function IntroductionEquationsPage() {
  const [activeTab, setActiveTab] = useState<'cours' | 'exercices'>('cours');
  const [currentExercise, setCurrentExercise] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [showSolution, setShowSolution] = useState(false);
  const [currentCourseSection, setCurrentCourseSection] = useState(0);

  const courseContent = [
    {
      id: 'notion',
      title: '1. Notion d\'égalité et d\'équation',
      content: {
        definition: 'Une équation est une égalité dans laquelle figure une ou plusieurs lettres appelées inconnues ou variables.',
        examples: [
          { equation: '2x + 3 = 7', description: 'x est l\'inconnue' },
          { equation: '5y - 1 = 2y + 8', description: 'y est l\'inconnue' },
          { equation: '3t = 15', description: 't est l\'inconnue' }
        ],
        explanation: 'Une équation se compose de deux membres séparés par le signe égal (=). Le premier membre est à gauche du signe égal, le second membre est à droite.'
      }
    },
    {
      id: 'solution',
      title: '2. Solution d\'une équation',
      content: {
        definition: 'Une solution d\'une équation est une valeur de l\'inconnue qui rend l\'égalité vraie.',
        examples: [
          { 
            equation: '2x + 3 = 7', 
            test: 'Si x = 2 : 2×2 + 3 = 4 + 3 = 7 ✓',
            conclusion: 'x = 2 est solution'
          },
          { 
            equation: '2x + 3 = 7', 
            test: 'Si x = 1 : 2×1 + 3 = 2 + 3 = 5 ≠ 7 ✗',
            conclusion: 'x = 1 n\'est pas solution'
          }
        ],
        explanation: 'Pour vérifier qu\'une valeur est solution, on remplace l\'inconnue par cette valeur et on vérifie que l\'égalité est vraie.'
      }
    },
    {
      id: 'resolution',
      title: '3. Résolution d\'équations du premier degré',
      content: {
        definition: 'Résoudre une équation, c\'est trouver toutes ses solutions. Pour cela, on transforme l\'équation en une équation équivalente plus simple.',
        rules: [
          'On peut ajouter ou soustraire le même nombre aux deux membres',
          'On peut multiplier ou diviser les deux membres par le même nombre non nul',
          'Ces transformations donnent des équations équivalentes (même ensemble de solutions)'
        ],
        method: [
          '1. Rassembler les termes avec l\'inconnue d\'un côté',
          '2. Rassembler les termes constants de l\'autre côté', 
          '3. Diviser par le coefficient de l\'inconnue',
          '4. Vérifier la solution trouvée'
        ]
      }
    },
    {
      id: 'exemples',
      title: '4. Exemples détaillés',
      content: {
        examples: [
          {
            equation: '2x + 3 = 7',
            steps: [
              { step: '2x + 3 = 7', explanation: 'Équation de départ' },
              { step: '2x + 3 - 3 = 7 - 3', explanation: 'On soustrait 3 aux deux membres' },
              { step: '2x = 4', explanation: 'Simplification' },
              { step: 'x = 4 ÷ 2', explanation: 'On divise par 2' },
              { step: 'x = 2', explanation: 'Solution' }
            ],
            verification: 'Vérification : 2×2 + 3 = 4 + 3 = 7 ✓'
          },
          {
            equation: '5x - 2 = 3x + 4',
            steps: [
              { step: '5x - 2 = 3x + 4', explanation: 'Équation de départ' },
              { step: '5x - 2 - 3x = 3x + 4 - 3x', explanation: 'On soustrait 3x aux deux membres' },
              { step: '2x - 2 = 4', explanation: 'Simplification' },
              { step: '2x - 2 + 2 = 4 + 2', explanation: 'On ajoute 2 aux deux membres' },
              { step: '2x = 6', explanation: 'Simplification' },
              { step: 'x = 3', explanation: 'Solution' }
            ],
            verification: 'Vérification : 5×3 - 2 = 15 - 2 = 13 et 3×3 + 4 = 9 + 4 = 13 ✓'
          }
        ]
      }
    }
  ];

  const exercises = [
    {
      type: 'verification',
      question: 'x = 3 est-il solution de l\'équation 2x + 1 = 7 ?',
      answer: 'oui',
      explanation: '2×3 + 1 = 6 + 1 = 7 ✓',
      hint: 'Remplace x par 3 dans l\'équation et calcule'
    },
    {
      type: 'verification',
      question: 'x = 5 est-il solution de l\'équation 3x - 2 = 10 ?',
      answer: 'non',
      explanation: '3×5 - 2 = 15 - 2 = 13 ≠ 10 ✗',
      hint: 'Remplace x par 5 dans l\'équation et vérifie'
    },
    {
      type: 'resolution',
      question: 'Résous l\'équation : x + 5 = 8',
      answer: '3',
      explanation: 'x + 5 = 8 → x = 8 - 5 → x = 3',
      hint: 'Soustrais 5 des deux côtés'
    },
    {
      type: 'resolution',
      question: 'Résous l\'équation : 2x = 10',
      answer: '5',
      explanation: '2x = 10 → x = 10 ÷ 2 → x = 5',
      hint: 'Divise les deux côtés par 2'
    },
    {
      type: 'resolution',
      question: 'Résous l\'équation : 3x + 2 = 11',
      answer: '3',
      explanation: '3x + 2 = 11 → 3x = 11 - 2 → 3x = 9 → x = 3',
      hint: 'Soustrais 2, puis divise par 3'
    },
    {
      type: 'resolution',
      question: 'Résous l\'équation : 5x - 3 = 12',
      answer: '3',
      explanation: '5x - 3 = 12 → 5x = 12 + 3 → 5x = 15 → x = 3',
      hint: 'Ajoute 3, puis divise par 5'
    },
    {
      type: 'resolution',
      question: 'Résous l\'équation : 2x + 4 = x + 9',
      answer: '5',
      explanation: '2x + 4 = x + 9 → 2x - x = 9 - 4 → x = 5',
      hint: 'Rassemble les x d\'un côté et les nombres de l\'autre'
    },
    {
      type: 'resolution',
      question: 'Résous l\'équation : 4x - 1 = 2x + 7',
      answer: '4',
      explanation: '4x - 1 = 2x + 7 → 4x - 2x = 7 + 1 → 2x = 8 → x = 4',
      hint: 'Rassemble les termes similaires'
    },
    {
      type: 'resolution',
      question: 'Résous l\'équation : 6x - 5 = 3x + 4',
      answer: '3',
      explanation: '6x - 5 = 3x + 4 → 6x - 3x = 4 + 5 → 3x = 9 → x = 3',
      hint: 'Déplace les termes et simplifie'
    },
    {
      type: 'resolution',
      question: 'Résous l\'équation : 7x + 2 = 4x + 14',
      answer: '4',
      explanation: '7x + 2 = 4x + 14 → 7x - 4x = 14 - 2 → 3x = 12 → x = 4',
      hint: 'Isole les x d\'un côté'
    },
    {
      type: 'probleme',
      question: 'Je pense à un nombre, je le multiplie par 3 et j\'ajoute 5. J\'obtiens 20. Quel est ce nombre ?',
      answer: '5',
      explanation: 'Soit x le nombre. 3x + 5 = 20 → 3x = 15 → x = 5',
      hint: 'Écris l\'équation : 3x + 5 = 20'
    },
    {
      type: 'probleme',
      question: 'Le périmètre d\'un carré est 24 cm. Quelle est la longueur de son côté ?',
      answer: '6',
      explanation: 'Soit x la longueur du côté. 4x = 24 → x = 6 cm',
      hint: 'Périmètre d\'un carré = 4 × côté'
    },
    {
      type: 'verification',
      question: 'x = 2 est-il solution de l\'équation 4x - 3 = 5 ?',
      answer: 'oui',
      explanation: '4×2 - 3 = 8 - 3 = 5 ✓',
      hint: 'Calcule 4×2 - 3'
    },
    {
      type: 'verification',
      question: 'x = 4 est-il solution de l\'équation 2x + 1 = 10 ?',
      answer: 'non',
      explanation: '2×4 + 1 = 8 + 1 = 9 ≠ 10 ✗',
      hint: 'Calcule 2×4 + 1'
    },
    {
      type: 'resolution',
      question: 'Résous l\'équation : 8x - 12 = 4x + 8',
      answer: '5',
      explanation: '8x - 12 = 4x + 8 → 8x - 4x = 8 + 12 → 4x = 20 → x = 5',
      hint: 'Regroupe les termes similaires'
    }
  ];

  const checkAnswer = () => {
    const currentEx = exercises[currentExercise];
    let correct = false;
    
    if (currentEx.type === 'verification') {
      correct = userAnswer.toLowerCase().trim() === currentEx.answer.toLowerCase();
    } else {
      correct = userAnswer.trim() === currentEx.answer;
    }
    
    setIsCorrect(correct);
    if (correct) {
      setScore(score + 1);
    }
  };

  const nextExercise = () => {
    if (currentExercise < exercises.length - 1) {
      setCurrentExercise(currentExercise + 1);
      setUserAnswer('');
      setIsCorrect(null);
      setShowSolution(false);
    }
  };

  const resetExercise = () => {
    setUserAnswer('');
    setIsCorrect(null);
    setShowSolution(false);
  };

  const resetAll = () => {
    setCurrentExercise(0);
    setUserAnswer('');
    setIsCorrect(null);
    setScore(0);
    setShowSolution(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/4eme" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-4">
            <ArrowLeft className="w-4 h-4" />
            <span>Retour à la 4ème</span>
          </Link>
          
          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              🔢 Introduction aux équations
            </h1>
            <p className="text-lg text-gray-600">
              Découvre les équations du premier degré et apprends à les résoudre !
            </p>
          </div>
        </div>

        {/* Navigation entre cours et exercices */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-1 shadow-md">
            <button
              onClick={() => setActiveTab('cours')}
              className={`px-6 py-3 rounded-lg font-bold transition-all ${
                activeTab === 'cours' 
                  ? 'bg-blue-500 text-white shadow-md' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              📖 Cours
            </button>
            <button
              onClick={() => setActiveTab('exercices')}
              className={`px-6 py-3 rounded-lg font-bold transition-all ${
                activeTab === 'exercices' 
                  ? 'bg-purple-500 text-white shadow-md' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              ✏️ Exercices ({score}/{exercises.length})
            </button>
          </div>
        </div>

        {activeTab === 'cours' ? (
          /* COURS */
          <div className="space-y-8">
            {/* Navigation du cours */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
                📚 Plan du cours
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {courseContent.map((section, index) => (
                  <button
                    key={section.id}
                    onClick={() => setCurrentCourseSection(index)}
                    className={`p-4 rounded-lg text-left transition-all ${
                      currentCourseSection === index
                        ? 'bg-blue-500 text-white shadow-lg scale-105'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <div className="font-bold text-sm mb-2">{section.title}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Contenu du cours */}
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <h2 className="text-3xl font-bold text-blue-600 mb-6">
                {courseContent[currentCourseSection].title}
              </h2>

              {/* Section 1: Notion */}
              {currentCourseSection === 0 && (
                <div className="space-y-6">
                  <div className="bg-blue-50 rounded-lg p-6">
                    <h3 className="text-xl font-bold text-blue-800 mb-3">Définition</h3>
                    <p className="text-blue-900">{courseContent[0].content.definition}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Exemples</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {courseContent[0]?.content?.examples?.map((example, index) => (
                        <div key={index} className="bg-gray-50 rounded-lg p-4 text-center">
                          <div className="text-2xl font-bold text-purple-600 mb-2">
                            {example.equation}
                          </div>
                          <div className="text-sm text-gray-600">
                            {'description' in example ? example.description : 
                             'test' in example ? example.test : 
                             'steps' in example ? 'Exemple détaillé' : 
                             'Exemple'}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-yellow-50 rounded-lg p-6">
                    <h3 className="text-xl font-bold text-yellow-800 mb-3">Important</h3>
                    <p className="text-yellow-900">{courseContent[0].content.explanation}</p>
                  </div>
                </div>
              )}

              {/* Section 2: Solution */}
              {currentCourseSection === 1 && (
                <div className="space-y-6">
                  <div className="bg-green-50 rounded-lg p-6">
                    <h3 className="text-xl font-bold text-green-800 mb-3">Définition</h3>
                    <p className="text-green-900">{courseContent[1].content.definition}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Exemples de vérification</h3>
                    <div className="space-y-4">
                      {courseContent[1].content.examples?.map((example, index) => (
                        <div key={index} className="bg-gray-50 rounded-lg p-6">
                          <div className="text-lg font-bold text-purple-600 mb-3">
                            {example.equation}
                          </div>
                          {'test' in example && (
                            <div className="text-gray-700 mb-2">{example.test}</div>
                          )}
                          {'conclusion' in example && (
                            <div className="font-bold text-green-600">{example.conclusion}</div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-orange-50 rounded-lg p-6">
                    <h3 className="text-xl font-bold text-orange-800 mb-3">Méthode</h3>
                    <p className="text-orange-900">{courseContent[1].content.explanation}</p>
                  </div>
                </div>
              )}

              {/* Section 3: Résolution */}
              {currentCourseSection === 2 && (
                <div className="space-y-6">
                  <div className="bg-purple-50 rounded-lg p-6">
                    <h3 className="text-xl font-bold text-purple-800 mb-3">Définition</h3>
                    <p className="text-purple-900">{courseContent[2].content.definition}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Règles de transformation</h3>
                    <div className="space-y-3">
                      {courseContent[2].content.rules?.map((rule, index) => (
                        <div key={index} className="bg-gray-50 rounded-lg p-4">
                          <div className="text-gray-800">• {rule}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Méthode générale</h3>
                    <div className="space-y-3">
                      {courseContent[2].content.method?.map((step, index) => (
                        <div key={index} className="bg-blue-50 rounded-lg p-4">
                          <div className="text-blue-800 font-semibold">{step}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Section 4: Exemples */}
              {currentCourseSection === 3 && (
                <div className="space-y-8">
                  {courseContent[3].content.examples?.map((example, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-6">
                      <h3 className="text-xl font-bold text-gray-800 mb-4">
                        Exemple {index + 1} : {example.equation}
                      </h3>
                      
                      {'steps' in example && (
                        <div className="space-y-3 mb-6">
                          {example.steps.map((step: any, stepIndex: number) => (
                            <div key={stepIndex} className="flex items-center space-x-4">
                              <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                                {stepIndex + 1}
                              </div>
                              <div className="flex-1">
                                <div className="text-lg font-mono">{step.step}</div>
                                <div className="text-sm text-gray-600">{step.explanation}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {'verification' in example && (
                        <div className="bg-green-100 rounded-lg p-4">
                          <div className="text-green-800 font-semibold">{example.verification}</div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Résumé */}
            <div className="bg-gradient-to-r from-blue-400 to-purple-400 rounded-xl p-6 text-white">
              <h3 className="text-xl font-bold mb-3">💡 Points clés à retenir</h3>
              <ul className="space-y-2">
                <li>• Une équation est une égalité avec une inconnue</li>
                <li>• Une solution rend l'égalité vraie</li>
                <li>• On résout en transformant l'équation</li>
                <li>• On peut ajouter/soustraire/multiplier/diviser les deux membres</li>
                <li>• Il faut toujours vérifier la solution trouvée</li>
              </ul>
            </div>
          </div>
        ) : (
          /* EXERCICES */
          <div className="space-y-8">
            {/* Header exercices */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-900">
                  ✏️ Exercice {currentExercise + 1} sur {exercises.length}
                </h2>
                <div className="flex items-center space-x-4">
                  <div className="text-lg font-bold text-purple-600">
                    Score : {score}/{exercises.length}
                  </div>
                  <button
                    onClick={resetAll}
                    className="bg-gray-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-gray-600 transition-colors"
                  >
                    <RotateCcw className="inline w-4 h-4 mr-2" />
                    Recommencer
                  </button>
                </div>
              </div>
              
              {/* Barre de progression */}
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-purple-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${((currentExercise + 1) / exercises.length) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Question */}
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <div className="text-center mb-6">
                <span className={`px-4 py-2 rounded-full text-sm font-bold ${
                  exercises[currentExercise].type === 'verification' ? 'bg-green-100 text-green-800' :
                  exercises[currentExercise].type === 'resolution' ? 'bg-blue-100 text-blue-800' :
                  'bg-orange-100 text-orange-800'
                }`}>
                  {exercises[currentExercise].type === 'verification' ? 'Vérification' :
                   exercises[currentExercise].type === 'resolution' ? 'Résolution' :
                   'Problème'}
                </span>
              </div>
              
              <h3 className="text-xl font-bold mb-6 text-center text-gray-900">
                {exercises[currentExercise].question}
              </h3>
              
              <div className="max-w-md mx-auto mb-6">
                <input
                  type="text"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder={exercises[currentExercise].type === 'verification' ? 'oui ou non' : 'Ta réponse...'}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-center text-lg font-bold focus:border-purple-500 focus:outline-none bg-white text-gray-900"
                />
              </div>
              
              <div className="flex justify-center space-x-4 mb-6">
                <button
                  onClick={checkAnswer}
                  disabled={!userAnswer.trim()}
                  className="bg-purple-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-purple-600 transition-colors disabled:opacity-50"
                >
                  Vérifier
                </button>
                <button
                  onClick={() => setShowSolution(!showSolution)}
                  className="bg-yellow-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-yellow-600 transition-colors"
                >
                  <Lightbulb className="inline w-4 h-4 mr-2" />
                  Indice
                </button>
                <button
                  onClick={resetExercise}
                  className="bg-gray-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-gray-600 transition-colors"
                >
                  Effacer
                </button>
              </div>

              {/* Indice */}
              {showSolution && (
                <div className="bg-yellow-50 rounded-lg p-4 mb-6">
                  <div className="flex items-center justify-center space-x-2 text-yellow-800">
                    <Lightbulb className="w-5 h-5" />
                    <span className="font-bold">{exercises[currentExercise].hint}</span>
                  </div>
                </div>
              )}
              
              {/* Résultat */}
              {isCorrect !== null && (
                <div className={`p-4 rounded-lg mb-6 ${
                  isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  <div className="flex items-center justify-center space-x-2">
                    {isCorrect ? (
                      <>
                        <CheckCircle className="w-6 h-6" />
                        <span className="font-bold">Excellent ! C'est la bonne réponse !</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-6 h-6" />
                        <div className="text-center">
                          <div className="font-bold mb-2">
                            Pas tout à fait... La bonne réponse est : {exercises[currentExercise].answer}
                          </div>
                          <div className="text-sm">
                            {exercises[currentExercise].explanation}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
              
              {/* Navigation */}
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => setCurrentExercise(Math.max(0, currentExercise - 1))}
                  disabled={currentExercise === 0}
                  className="bg-gray-300 text-gray-700 px-6 py-3 rounded-lg font-bold hover:bg-gray-400 transition-colors disabled:opacity-50"
                >
                  ← Précédent
                </button>
                <button
                  onClick={nextExercise}
                  disabled={currentExercise === exercises.length - 1}
                  className="bg-blue-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-600 transition-colors disabled:opacity-50"
                >
                  Suivant →
                </button>
              </div>
            </div>

            {/* Félicitations */}
            {currentExercise === exercises.length - 1 && isCorrect !== null && (
              <div className="bg-gradient-to-r from-purple-400 to-blue-400 rounded-xl p-6 text-white text-center">
                <div className="text-4xl mb-3">🎉</div>
                <h3 className="text-2xl font-bold mb-2">Bravo !</h3>
                <p className="text-lg">
                  Tu as terminé l'introduction aux équations ! Tu maîtrises maintenant les bases.
                </p>
                <p className="text-xl font-bold mt-4">
                  Score final : {score}/{exercises.length}
                  {score === exercises.length && ' - Parfait ! 🏆'}
                  {score >= exercises.length * 0.8 && score < exercises.length && ' - Très bien ! 👏'}
                  {score >= exercises.length * 0.6 && score < exercises.length * 0.8 && ' - Bien ! 👍'}
                  {score < exercises.length * 0.6 && ' - Continue à t\'entraîner ! 💪'}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 