'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, BookOpen, Ruler, Calculator, Play, Trophy, Clock, Eye } from 'lucide-react';

// Composant pour afficher les exercices interactifs de périmètre
function ExercicePerimetreInteractif({ exercice }: { exercice: any }) {
  const [showHint, setShowHint] = useState(false);
  const [tracedPath, setTracedPath] = useState<boolean>(false);

  const renderExerciceContent = () => {
    switch (exercice.type) {
      case 'mesure':
        return (
          <div className="flex flex-col items-center">
            <div className="mb-4 relative">
              <svg width="200" height="140" viewBox="0 0 200 140">
                <rect
                  x="50"
                  y="50"
                  width={exercice.dimensions.width * 20}
                  height={exercice.dimensions.height * 20}
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="3"
                  strokeDasharray={tracedPath ? "none" : "5,5"}
                  className="transition-all duration-500"
                />
                <text x="55" y="45" className="text-sm font-medium fill-blue-600">{exercice.dimensions.width} cm</text>
                <text x="35" y="70" className="text-sm font-medium fill-blue-600">{exercice.dimensions.height} cm</text>
                <text x="55" y={70 + exercice.dimensions.height * 20} className="text-sm font-medium fill-blue-600">{exercice.dimensions.width} cm</text>
                <text x="35" y={70 + exercice.dimensions.height * 10} className="text-sm font-medium fill-blue-600">{exercice.dimensions.height} cm</text>
              </svg>
            </div>
            <button
              onClick={() => setTracedPath(!tracedPath)}
              className="mb-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              {tracedPath ? 'Effacer' : 'Tracer'} le contour
            </button>
            <p className="text-sm text-gray-600">
              Rectangle de {exercice.dimensions.width} cm × {exercice.dimensions.height} cm
            </p>
          </div>
        );

      case 'calcul':
        return (
          <div className="flex flex-col items-center">
            <div className="mb-4">
              <svg width="160" height="160" viewBox="0 0 160 160">
                <rect
                  x="40"
                  y="40"
                  width={exercice.dimensions.size * 20}
                  height={exercice.dimensions.size * 20}
                  fill="#f3f4f6"
                  stroke="#10b981"
                  strokeWidth="3"
                />
                <text x="45" y="35" className="text-sm font-medium fill-green-600">{exercice.dimensions.size} cm</text>
                <text x="30" y="55" className="text-sm font-medium fill-green-600">{exercice.dimensions.size} cm</text>
              </svg>
            </div>
            <p className="text-sm text-gray-600">
              Carré de {exercice.dimensions.size} cm de côté
            </p>
          </div>
        );

      case 'comparaison':
        return (
          <div className="flex justify-center gap-8">
            {exercice.figures.map((figure: any, index: number) => (
              <div key={index} className="text-center">
                <div className="mb-2">
                  <svg width="120" height="100" viewBox="0 0 120 100">
                    {figure.type === 'carre' ? (
                      <rect
                        x="30"
                        y="20"
                        width={figure.size * 15}
                        height={figure.size * 15}
                        fill="#dcfce7"
                        stroke="#16a34a"
                        strokeWidth="2"
                      />
                    ) : (
                      <rect
                        x="20"
                        y="30"
                        width={figure.width * 15}
                        height={figure.height * 15}
                        fill="#dbeafe"
                        stroke="#2563eb"
                        strokeWidth="2"
                      />
                    )}
                  </svg>
                </div>
                <p className="font-medium text-gray-700">{figure.label}</p>
                <p className="text-sm text-gray-500">
                  {figure.type === 'carre' ? `${figure.size} × ${figure.size}` : `${figure.width} × ${figure.height}`}
                </p>
              </div>
            ))}
          </div>
        );

      case 'triangle':
        return (
          <div className="flex flex-col items-center">
            <div className="mb-4">
              <svg width="150" height="120" viewBox="0 0 150 120">
                <polygon
                  points="75,20 30,90 120,90"
                  fill="#fef3c7"
                  stroke="#f59e0b"
                  strokeWidth="2"
                />
                <text x="45" y="85" className="text-sm font-medium fill-amber-600">{exercice.dimensions.sides[0]} cm</text>
                <text x="90" y="85" className="text-sm font-medium fill-amber-600">{exercice.dimensions.sides[1]} cm</text>
                <text x="65" y="15" className="text-sm font-medium fill-amber-600">{exercice.dimensions.sides[2]} cm</text>
              </svg>
            </div>
            <p className="text-sm text-gray-600">
              Triangle avec côtés de {exercice.dimensions.sides.join(', ')} cm
            </p>
          </div>
        );

      case 'formule':
        return (
          <div className="flex flex-col items-center">
            <div className="mb-4">
              <svg width="200" height="120" viewBox="0 0 200 120">
                <rect
                  x="50"
                  y="30"
                  width={exercice.dimensions.width * 20}
                  height={exercice.dimensions.height * 20}
                  fill="#f0f9ff"
                  stroke="#0ea5e9"
                  strokeWidth="3"
                />
                <text x="55" y="25" className="text-sm font-medium fill-sky-600">{exercice.dimensions.width} cm</text>
                <text x="35" y="45" className="text-sm font-medium fill-sky-600">{exercice.dimensions.height} cm</text>
              </svg>
            </div>
            <div className="bg-sky-50 p-3 rounded-lg border border-sky-200">
              <p className="text-sm font-medium text-sky-800 mb-1">Formule du rectangle :</p>
              <p className="text-lg font-mono text-sky-700">P = 2 × (L + l)</p>
            </div>
          </div>
        );

      default:
        return <div>Type d'exercice non reconnu</div>;
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 border-2 border-dashed border-blue-300">
      {renderExerciceContent()}
      {showHint && (
        <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
          <p className="text-sm text-yellow-800">
            <strong>Indice :</strong> {exercice.hint}
          </p>
        </div>
      )}
      <div className="mt-4 text-center">
        <button
          onClick={() => setShowHint(!showHint)}
          className="text-sm text-blue-600 hover:text-blue-800 underline"
        >
          {showHint ? 'Masquer' : 'Afficher'} l'indice
        </button>
      </div>
    </div>
  );
}

// Composant cours interactif pour le périmètre
function CoursPerimetreInteractif() {
  const [rectLongueur, setRectLongueur] = useState(5);
  const [rectLargeur, setRectLargeur] = useState(3);
  const [carreCote, setCarreCote] = useState(4);
  const [triangleCote1, setTriangleCote1] = useState(3);
  const [triangleCote2, setTriangleCote2] = useState(4);
  const [triangleCote3, setTriangleCote3] = useState(5);
  const [activeFormule, setActiveFormule] = useState<'rectangle' | 'carre' | 'triangle'>('rectangle');

  const perimetreRectangle = (2 * rectLongueur) + (2 * rectLargeur);
  const perimetreCarre = 4 * carreCote;
  const perimetreTriangle = triangleCote1 + triangleCote2 + triangleCote3;

  return (
    <div className="space-y-8">
      {/* Définition animée */}
      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-8 border-2 border-blue-200">
        <h2 className="text-2xl font-bold text-blue-800 mb-6 flex items-center gap-3">
          <span className="animate-pulse">📏</span> Qu'est-ce que le périmètre ?
        </h2>
        <div className="bg-white rounded-lg p-6 shadow-lg">
          <p className="text-xl text-gray-800 mb-4">
            Le <span className="font-bold text-blue-600">périmètre</span> est la <span className="font-bold text-red-600">longueur du contour</span> d'une figure.
          </p>
          <div className="flex items-center gap-4 p-4 bg-yellow-50 rounded-lg border-2 border-yellow-300">
            <div className="text-4xl">🏃‍♂️</div>
            <p className="text-lg text-gray-700">
              Imagine que tu fais le tour d'une figure en courant : la distance parcourue = le périmètre !
            </p>
          </div>
        </div>
      </div>

      {/* Calculatrices interactives */}
      <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
          <span className="animate-bounce">🧮</span> Calculatrices interactives
        </h2>
        
        {/* Sélecteur de forme */}
        <div className="flex gap-2 mb-6">
          {[
            { id: 'rectangle', label: 'Rectangle', emoji: '▭' },
            { id: 'carre', label: 'Carré', emoji: '⬜' },
            { id: 'triangle', label: 'Triangle', emoji: '▲' }
          ].map((forme) => (
            <button
              key={forme.id}
              onClick={() => setActiveFormule(forme.id as any)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                activeFormule === forme.id
                  ? 'bg-blue-500 text-white shadow-lg scale-105'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {forme.emoji} {forme.label}
            </button>
          ))}
        </div>

        {/* Calculatrice Rectangle */}
        {activeFormule === 'rectangle' && (
          <div className="bg-blue-50 rounded-lg p-6 border-2 border-blue-200">
            <h3 className="text-xl font-bold text-blue-800 mb-4">▭ Rectangle</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Longueur (cm)</label>
                  <input
                    type="range"
                    min="1"
                    max="20"
                    value={rectLongueur}
                    onChange={(e) => setRectLongueur(Number(e.target.value))}
                    className="w-full"
                  />
                  <div className="text-center text-lg font-bold text-blue-600">{rectLongueur} cm</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Largeur (cm)</label>
                  <input
                    type="range"
                    min="1"
                    max="20"
                    value={rectLargeur}
                    onChange={(e) => setRectLargeur(Number(e.target.value))}
                    className="w-full"
                  />
                  <div className="text-center text-lg font-bold text-blue-600">{rectLargeur} cm</div>
                </div>
              </div>
              <div className="bg-white rounded-lg p-4 border-2 border-dashed border-blue-300">
                <div className="text-center mb-4">
                  <div 
                    className="mx-auto border-4 border-blue-500 bg-blue-100"
                    style={{
                      width: `${Math.min(rectLongueur * 10, 200)}px`,
                      height: `${Math.min(rectLargeur * 10, 120)}px`
                    }}
                  />
                  <p className="text-sm text-gray-600 mt-2">Rectangle {rectLongueur} × {rectLargeur}</p>
                </div>
                <div className="space-y-2">
                  <div className="bg-yellow-100 p-3 rounded-lg">
                    <p className="font-bold text-gray-800">Formule :</p>
                    <p className="text-lg text-gray-800">P = 2 × (L + l)</p>
                    <p className="text-sm text-gray-600 mt-1">L = longueur, l = largeur</p>
                  </div>
                  <div className="bg-green-100 p-3 rounded-lg">
                    <p className="font-bold text-gray-800">Calcul :</p>
                    <p className="text-lg text-gray-800">P = 2 × ({rectLongueur} + {rectLargeur}) = {perimetreRectangle} cm</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Calculatrice Carré */}
        {activeFormule === 'carre' && (
          <div className="bg-green-50 rounded-lg p-6 border-2 border-green-200">
            <h3 className="text-xl font-bold text-green-800 mb-4">⬜ Carré</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Côté (cm)</label>
                  <input
                    type="range"
                    min="1"
                    max="15"
                    value={carreCote}
                    onChange={(e) => setCarreCote(Number(e.target.value))}
                    className="w-full"
                  />
                  <div className="text-center text-lg font-bold text-green-600">{carreCote} cm</div>
                </div>
              </div>
              <div className="bg-white rounded-lg p-4 border-2 border-dashed border-green-300">
                <div className="text-center mb-4">
                  <div 
                    className="mx-auto border-4 border-green-500 bg-green-100"
                    style={{
                      width: `${Math.min(carreCote * 10, 150)}px`,
                      height: `${Math.min(carreCote * 10, 150)}px`
                    }}
                  />
                  <p className="text-sm text-gray-600 mt-2">Carré {carreCote} × {carreCote}</p>
                </div>
                <div className="space-y-2">
                  <div className="bg-yellow-100 p-3 rounded-lg">
                    <p className="font-bold text-gray-800">Formule :</p>
                    <p className="text-lg text-gray-800">P = 4 × côté</p>
                  </div>
                  <div className="bg-green-100 p-3 rounded-lg">
                    <p className="font-bold text-gray-800">Calcul :</p>
                    <p className="text-lg text-gray-800">P = 4 × {carreCote} = {perimetreCarre} cm</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Calculatrice Triangle */}
        {activeFormule === 'triangle' && (
          <div className="bg-purple-50 rounded-lg p-6 border-2 border-purple-200">
            <h3 className="text-xl font-bold text-purple-800 mb-4">▲ Triangle</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Côté 1 (cm)</label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={triangleCote1}
                    onChange={(e) => setTriangleCote1(Number(e.target.value))}
                    className="w-full"
                  />
                  <div className="text-center text-lg font-bold text-purple-600">{triangleCote1} cm</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Côté 2 (cm)</label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={triangleCote2}
                    onChange={(e) => setTriangleCote2(Number(e.target.value))}
                    className="w-full"
                  />
                  <div className="text-center text-lg font-bold text-purple-600">{triangleCote2} cm</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Côté 3 (cm)</label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={triangleCote3}
                    onChange={(e) => setTriangleCote3(Number(e.target.value))}
                    className="w-full"
                  />
                  <div className="text-center text-lg font-bold text-purple-600">{triangleCote3} cm</div>
                </div>
              </div>
              <div className="bg-white rounded-lg p-4 border-2 border-dashed border-purple-300">
                <div className="text-center mb-4">
                  <div className="mx-auto w-32 h-32 flex items-center justify-center">
                    <svg width="100" height="100" viewBox="0 0 100 100">
                      <polygon 
                        points="50,10 20,80 80,80" 
                        fill="#e9d5ff" 
                        stroke="#a855f7" 
                        strokeWidth="3"
                      />
                    </svg>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">Triangle {triangleCote1}, {triangleCote2}, {triangleCote3}</p>
                </div>
                <div className="space-y-2">
                  <div className="bg-yellow-100 p-3 rounded-lg">
                    <p className="font-bold text-gray-800">Formule :</p>
                    <p className="text-lg text-gray-800">P = côté1 + côté2 + côté3</p>
                  </div>
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <p className="font-bold text-gray-800">Calcul :</p>
                    <p className="text-lg text-gray-800">P = {triangleCote1} + {triangleCote2} + {triangleCote3} = {perimetreTriangle} cm</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mémo des formules */}
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6 border-2 border-yellow-300">
        <h2 className="text-2xl font-bold text-orange-800 mb-6 flex items-center gap-3">
          <span className="animate-pulse">📝</span> Mémo des formules
        </h2>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4 border-2 border-blue-200 hover:shadow-lg transition-shadow">
            <h3 className="font-bold text-blue-800 mb-2">▭ Rectangle</h3>
            <p className="text-lg font-mono bg-blue-50 p-2 rounded text-gray-800">P = 2 × (L + l)</p>
            <p className="text-sm text-gray-600 mt-2">L = longueur, l = largeur</p>
          </div>
          <div className="bg-white rounded-lg p-4 border-2 border-green-200 hover:shadow-lg transition-shadow">
            <h3 className="font-bold text-green-800 mb-2">⬜ Carré</h3>
            <p className="text-lg font-mono bg-green-50 p-2 rounded text-gray-800">P = 4 × côté</p>
            <p className="text-sm text-gray-600 mt-2">Tous les côtés sont égaux</p>
          </div>
          <div className="bg-white rounded-lg p-4 border-2 border-purple-200 hover:shadow-lg transition-shadow">
            <h3 className="font-bold text-purple-800 mb-2">▲ Triangle</h3>
            <p className="text-lg font-mono bg-purple-50 p-2 rounded text-gray-800">P = a + b + c</p>
            <p className="text-sm text-gray-600 mt-2">a, b, c = longueurs des côtés</p>
          </div>
        </div>
      </div>

      {/* Astuces et conseils */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border-2 border-green-300">
        <h2 className="text-2xl font-bold text-green-800 mb-6 flex items-center gap-3">
          <span className="animate-bounce">💡</span> Astuces pour retenir
        </h2>
        <div className="space-y-4">
          <div className="bg-white rounded-lg p-4 border-l-4 border-green-500 hover:shadow-lg transition-shadow">
            <h3 className="font-bold text-green-800">🏃‍♂️ Astuce du coureur</h3>
            <p className="text-gray-700">Le périmètre = la distance parcourue si tu fais le tour de la figure en courant !</p>
          </div>
          <div className="bg-white rounded-lg p-4 border-l-4 border-blue-500 hover:shadow-lg transition-shadow">
            <h3 className="font-bold text-blue-800">📏 Astuce de la ficelle</h3>
            <p className="text-gray-700">Tu peux mesurer le périmètre en posant une ficelle autour de la figure, puis en mesurant la ficelle !</p>
          </div>
          <div className="bg-white rounded-lg p-4 border-l-4 border-purple-500 hover:shadow-lg transition-shadow">
            <h3 className="font-bold text-purple-800">🔢 Astuce du calcul</h3>
            <p className="text-gray-700">Pour le rectangle : pense à compter 2 longueurs + 2 largeurs. Pour le carré : 4 fois le même côté !</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PerimetrePage() {
  const [currentSection, setCurrentSection] = useState<'cours' | 'exercices' | 'problemes'>('cours');
  const [currentExercise, setCurrentExercise] = useState(0);
  const [currentProblem, setCurrentProblem] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [userAnswer, setUserAnswer] = useState('');
  const [selectedAnswer, setSelectedAnswer] = useState('');

  const exercises = [
    {
      id: 1,
      type: 'mesure',
      question: 'Trace le contour de ce rectangle avec ton doigt et calcule son périmètre.',
      interactive: true,
      dimensions: { width: 5, height: 3 },
      answer: '16',
      unit: 'cm',
      explanation: 'Périmètre = 5 + 3 + 5 + 3 = 16 cm',
      hint: 'Le périmètre = le tour complet de la figure'
    },
    {
      id: 2,
      type: 'calcul',
      question: 'Calcule le périmètre de ce carré.',
      interactive: true,
      dimensions: { size: 4 },
      answer: '16',
      unit: 'cm',
      explanation: 'Périmètre du carré = 4 × 4 = 16 cm',
      hint: 'Pour un carré : P = 4 × côté'
    },
    {
      id: 3,
      type: 'comparaison',
      question: 'Compare le périmètre de ces deux figures.',
      interactive: true,
      figures: [
        { type: 'rectangle', width: 6, height: 2, label: 'Rectangle A' },
        { type: 'carre', size: 4, label: 'Carré B' }
      ],
      answer: 'A',
      unit: '',
      explanation: 'Rectangle A : P = 2×(6+2) = 16 cm, Carré B : P = 4×4 = 16 cm. Ils ont le même périmètre !',
      hint: 'Calcule le périmètre de chaque figure'
    },
    {
      id: 4,
      type: 'triangle',
      question: 'Calcule le périmètre de ce triangle.',
      interactive: true,
      dimensions: { sides: [3, 4, 5] },
      answer: '12',
      unit: 'cm',
      explanation: 'Périmètre = 3 + 4 + 5 = 12 cm',
      hint: 'Pour un triangle : P = côté1 + côté2 + côté3'
    },
    {
      id: 5,
      type: 'formule',
      question: 'Utilise la formule pour calculer le périmètre de ce rectangle.',
      interactive: true,
      dimensions: { width: 6, height: 2 },
      answer: '16',
      unit: 'cm',
      explanation: 'Périmètre = 2 × (6 + 2) = 2 × 8 = 16 cm',
      hint: 'Formule du rectangle : P = 2 × (L + l)'
    }
  ];

  const problems = [
    {
      id: 1,
      question: 'Claire veut faire le tour de son jardin rectangulaire qui mesure 8 m sur 5 m. Quelle distance va-t-elle parcourir ?',
      answer: '26 m',
      unit: 'm',
      explanation: 'Périmètre = 8 + 5 + 8 + 5 = 26 m'
    },
    {
      id: 2,
      question: 'Un carré a un périmètre de 20 cm. Quelle est la longueur de chaque côté ?',
      answer: '5 cm',
      unit: 'cm',
      explanation: 'Côté = 20 ÷ 4 = 5 cm'
    },
    {
      id: 3,
      question: 'Paul veut entourer son potager carré de 3 m de côté avec une clôture. Quelle longueur de clôture lui faut-il ?',
      answer: '12 m',
      unit: 'm',
      explanation: 'Périmètre = 3 × 4 = 12 m'
    },
    {
      id: 4,
      question: 'Une piscine rectangulaire mesure 10 m sur 6 m. Combien de mètres doit-on parcourir pour en faire le tour ?',
      answer: '32 m',
      unit: 'm',
      explanation: 'Périmètre = 10 + 6 + 10 + 6 = 32 m'
    },
    {
      id: 5,
      question: 'Un triangle a des côtés de 4 cm, 5 cm et 6 cm. Quel est son périmètre ?',
      answer: '15 cm',
      unit: 'cm',
      explanation: 'Périmètre = 4 + 5 + 6 = 15 cm'
    }
  ];

  const currentEx = exercises[currentExercise];
  const currentProb = problems[currentProblem];

  const handleExerciseAnswer = () => {
    setShowAnswer(true);
  };

  const nextExercise = () => {
    setCurrentExercise((prev) => (prev + 1) % exercises.length);
    setShowAnswer(false);
    setUserAnswer('');
    setSelectedAnswer('');
  };

  const nextProblem = () => {
    setCurrentProblem((prev) => (prev + 1) % problems.length);
    setShowAnswer(false);
    setUserAnswer('');
    setSelectedAnswer('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation */}
        <div className="flex items-center gap-4 mb-6">
          <Link href="/chapitre/cm1-aires-perimetres" className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors">
            <ArrowLeft size={20} />
            <span>Retour aux Aires et périmètres</span>
          </Link>
        </div>
        
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-blue-100">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
              📏
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Périmètre</h1>
              <p className="text-gray-600 text-lg">
                Mesurer et calculer le périmètre de figures géométriques
              </p>
            </div>
          </div>

          {/* Navigation par onglets */}
          <div className="flex space-x-1 mb-6">
            {[
              { id: 'cours', label: 'Cours', icon: BookOpen },
              { id: 'exercices', label: 'Exercices', icon: Calculator },
              { id: 'problemes', label: 'Problèmes', icon: Play }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setCurrentSection(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  currentSection === tab.id
                    ? 'bg-blue-500 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                <tab.icon size={16} />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Contenu du cours */}
          {currentSection === 'cours' && (
            <CoursPerimetreInteractif />
          )}

          {/* Exercices */}
          {currentSection === 'exercices' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-800">Exercice {currentExercise + 1} sur {exercises.length}</h2>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Clock size={16} />
                      <span>5 min</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Trophy size={16} />
                      <span>10 XP</span>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-lg p-6 mb-6">
                  <h3 className="font-semibold text-blue-800 mb-2">Question</h3>
                  <p className="text-gray-700">{currentEx.question}</p>
                  <div className="mt-4">
                    <ExercicePerimetreInteractif exercice={currentEx} />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex gap-4">
                    <input
                      type="text"
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      placeholder="Votre réponse"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                      disabled={showAnswer}
                    />
                    <span className="px-4 py-2 bg-gray-100 rounded-lg text-gray-700">{currentEx.unit}</span>
                  </div>

                  {!showAnswer && (
                    <button
                      onClick={handleExerciseAnswer}
                      className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      Vérifier
                    </button>
                  )}

                  {showAnswer && (
                    <div className={`p-4 rounded-lg ${
                      userAnswer === currentEx.answer ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                    }`}>
                      <p className="font-bold mb-2 text-gray-800">
                        {userAnswer === currentEx.answer ? '✅ Bonne réponse !' : '❌ Réponse incorrecte'}
                      </p>
                      <p className="text-sm mb-2 text-gray-800">
                        <strong>Réponse correcte :</strong> {currentEx.answer} {currentEx.unit}
                      </p>
                      <p className="text-sm text-gray-800">
                        <strong>Explication :</strong> {currentEx.explanation}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex justify-between mt-6">
                  <button
                    onClick={nextExercise}
                    className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Exercice suivant
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Problèmes */}
          {currentSection === 'problemes' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-800">Problème {currentProblem + 1} sur {problems.length}</h2>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Clock size={16} />
                      <span>10 min</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Trophy size={16} />
                      <span>20 XP</span>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 rounded-lg p-6 mb-6">
                  <h3 className="font-semibold text-green-800 mb-2">Problème</h3>
                  <p className="text-gray-700">{currentProb.question}</p>
                </div>

                <div className="space-y-4">
                  <div className="flex gap-4">
                    <input
                      type="text"
                      value={selectedAnswer}
                      onChange={(e) => setSelectedAnswer(e.target.value)}
                      placeholder="Votre réponse"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
                      disabled={showAnswer}
                    />
                    <span className="px-4 py-2 bg-gray-100 rounded-lg text-gray-700">{currentProb.unit}</span>
                  </div>

                  {!showAnswer && (
                    <button
                      onClick={() => setShowAnswer(true)}
                      className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors"
                    >
                      Vérifier
                    </button>
                  )}

                  {showAnswer && (
                    <div className={`p-4 rounded-lg ${
                      selectedAnswer === currentProb.answer ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                    }`}>
                      <p className="font-bold mb-2 text-gray-800">
                        {selectedAnswer === currentProb.answer ? '✅ Bonne réponse !' : '❌ Réponse incorrecte'}
                      </p>
                      <p className="text-sm mb-2 text-gray-800">
                        <strong>Réponse correcte :</strong> {currentProb.answer} {currentProb.unit}
                      </p>
                      <p className="text-sm text-gray-800">
                        <strong>Explication :</strong> {currentProb.explanation}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex justify-between mt-6">
                  <button
                    onClick={nextProblem}
                    className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors"
                  >
                    Problème suivant
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 