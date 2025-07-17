'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, BookOpen, Square, Calculator, Play, Trophy, Clock, Grid } from 'lucide-react';

// Composant pour afficher les exercices interactifs
function ExerciceInteractif({ exercice }: { exercice: any }) {
  const [showHint, setShowHint] = useState(false);
  const [highlightedSquares, setHighlightedSquares] = useState<number[]>([]);

  const generateGrid = (width: number, height: number) => {
    const squares = [];
    for (let i = 0; i < height; i++) {
      for (let j = 0; j < width; j++) {
        const index = i * width + j;
        squares.push(
          <div
            key={index}
            className={`w-8 h-8 border-2 border-gray-400 cursor-pointer transition-all duration-200 ${
              highlightedSquares.includes(index) ? 'bg-green-300' : 'bg-blue-100 hover:bg-blue-200'
            }`}
            onClick={() => {
              if (highlightedSquares.includes(index)) {
                setHighlightedSquares(highlightedSquares.filter(i => i !== index));
              } else {
                setHighlightedSquares([...highlightedSquares, index]);
              }
            }}
          />
        );
      }
    }
    return squares;
  };

  const renderExerciceContent = () => {
    switch (exercice.type) {
      case 'comptage':
        return (
          <div className="flex flex-col items-center">
            <div 
              className="grid gap-1 mb-4"
              style={{ gridTemplateColumns: `repeat(${exercice.dimensions.width}, 1fr)` }}
            >
              {generateGrid(exercice.dimensions.width, exercice.dimensions.height)}
            </div>
            <p className="text-sm text-gray-600 mb-2">
              Rectangle de {exercice.dimensions.width} × {exercice.dimensions.height} carreaux
            </p>
            <p className="text-xs text-gray-500">
              Clique sur les carreaux pour les compter ! ({highlightedSquares.length} comptés)
            </p>
          </div>
        );

      case 'comparaison':
        return (
          <div className="flex justify-center gap-8">
            {exercice.figures.map((figure: any, index: number) => (
              <div key={index} className="text-center">
                <div className="mb-2">
                  {figure.type === 'carre' ? (
                    <div 
                      className="grid gap-1 mx-auto"
                      style={{ gridTemplateColumns: `repeat(${figure.size}, 1fr)` }}
                    >
                      {Array.from({ length: figure.size * figure.size }).map((_, i) => (
                        <div key={i} className="w-6 h-6 bg-green-100 border border-green-400" />
                      ))}
                    </div>
                  ) : (
                    <div 
                      className="grid gap-1 mx-auto"
                      style={{ gridTemplateColumns: `repeat(${figure.width}, 1fr)` }}
                    >
                      {Array.from({ length: figure.width * figure.height }).map((_, i) => (
                        <div key={i} className="w-6 h-6 bg-blue-100 border border-blue-400" />
                      ))}
                    </div>
                  )}
                </div>
                <p className="font-medium text-gray-700">{figure.label}</p>
                <p className="text-sm text-gray-500">
                  {figure.type === 'carre' ? `${figure.size} × ${figure.size}` : `${figure.width} × ${figure.height}`}
                </p>
              </div>
            ))}
          </div>
        );

      case 'calcul':
        return (
          <div className="flex flex-col items-center">
            <div className="mb-4">
              <svg width="200" height="120" viewBox="0 0 200 120">
                <rect
                  x="20"
                  y="20"
                  width={exercice.dimensions.width * 30}
                  height={exercice.dimensions.height * 30}
                  fill="#ddd6fe"
                  stroke="#7c3aed"
                  strokeWidth="2"
                />
                <text x="25" y="15" className="text-sm font-medium fill-gray-700">{exercice.dimensions.width} cm</text>
                <text x="10" y="40" className="text-sm font-medium fill-gray-700">{exercice.dimensions.height} cm</text>
              </svg>
            </div>
            <p className="text-sm text-gray-600">
              Rectangle de {exercice.dimensions.width} cm × {exercice.dimensions.height} cm
            </p>
          </div>
        );

      case 'pavage':
        return (
          <div className="flex flex-col items-center">
            <div 
              className="grid gap-0.5 mb-4 p-2 bg-gray-100 rounded"
              style={{ gridTemplateColumns: `repeat(${exercice.dimensions.width}, 1fr)` }}
            >
              {Array.from({ length: exercice.dimensions.width * exercice.dimensions.height }).map((_, i) => (
                <div key={i} className="w-8 h-8 bg-yellow-100 border border-yellow-400 flex items-center justify-center text-xs text-gray-800">
                  1cm²
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-600">
              Rectangle de {exercice.dimensions.width} cm × {exercice.dimensions.height} cm
            </p>
          </div>
        );

      case 'estimation':
        return (
          <div className="flex flex-col items-center">
            <div 
              className="grid gap-1 mb-4"
              style={{ gridTemplateColumns: `repeat(${exercice.dimensions.size}, 1fr)` }}
            >
              {Array.from({ length: exercice.dimensions.size * exercice.dimensions.size }).map((_, i) => (
                <div key={i} className="w-7 h-7 bg-orange-100 border border-orange-400" />
              ))}
            </div>
            <p className="text-sm text-gray-600 mb-2">
              Carré de {exercice.dimensions.size} × {exercice.dimensions.size} carreaux
            </p>
            <button
              onClick={() => setShowHint(!showHint)}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              {showHint ? 'Masquer' : 'Montrer'} l'aide
            </button>
          </div>
        );

      default:
        return <div>Type d'exercice non reconnu</div>;
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 border-2 border-dashed border-green-300">
      {renderExerciceContent()}
      {showHint && (
        <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
          <p className="text-sm text-yellow-800">
            <strong>Indice :</strong> {exercice.hint}
          </p>
        </div>
      )}
    </div>
  );
}

// Composant cours interactif pour l'aire
function CoursAireInteractif() {
  const [rectLongueur, setRectLongueur] = useState(6);
  const [rectLargeur, setRectLargeur] = useState(4);
  const [carreCote, setCarreCote] = useState(5);
  const [activeFormule, setActiveFormule] = useState<'rectangle' | 'carre' | 'quadrillage'>('rectangle');
  const [showAnimation, setShowAnimation] = useState(false);

  const aireRectangle = rectLongueur * rectLargeur;
  const aireCarre = carreCote * carreCote;

  // Fonction pour générer la grille de carreaux
  const generateGrid = (longueur: number, largeur: number) => {
    const carreaux = [];
    for (let i = 0; i < largeur; i++) {
      for (let j = 0; j < longueur; j++) {
        carreaux.push(
          <div 
            key={`${i}-${j}`} 
            className={`w-6 h-6 border border-gray-400 bg-blue-200 ${showAnimation ? 'animate-pulse' : ''}`}
            style={{ animationDelay: `${(i * longueur + j) * 0.1}s` }}
          />
        );
      }
    }
    return carreaux;
  };

  return (
    <div className="space-y-8">
      {/* Définition animée */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-8 border-2 border-green-200">
        <h2 className="text-2xl font-bold text-green-800 mb-6 flex items-center gap-3">
          <span className="animate-pulse">⬜</span> Qu'est-ce que l'aire ?
        </h2>
        <div className="bg-white rounded-lg p-6 shadow-lg">
          <p className="text-xl text-gray-800 mb-4">
            L'<span className="font-bold text-green-600">aire</span> est la <span className="font-bold text-red-600">surface</span> qu'occupe une figure.
          </p>
          <div className="flex items-center gap-4 p-4 bg-yellow-50 rounded-lg border-2 border-yellow-300">
            <div className="text-4xl">🎨</div>
            <p className="text-lg text-gray-700">
              Imagine que tu peins une figure : l'aire = la quantité de peinture nécessaire !
            </p>
          </div>
        </div>
      </div>

      {/* Calculatrices interactives */}
      <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
          <span className="animate-bounce">🧮</span> Calculatrices interactives
        </h2>
        
        {/* Sélecteur de méthode */}
        <div className="flex gap-2 mb-6">
          {[
            { id: 'rectangle', label: 'Rectangle', emoji: '▭' },
            { id: 'carre', label: 'Carré', emoji: '⬜' },
            { id: 'quadrillage', label: 'Quadrillage', emoji: '⊞' }
          ].map((methode) => (
            <button
              key={methode.id}
              onClick={() => setActiveFormule(methode.id as any)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                activeFormule === methode.id
                  ? 'bg-green-500 text-white shadow-lg scale-105'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {methode.emoji} {methode.label}
            </button>
          ))}
        </div>

        {/* Calculatrice Rectangle */}
        {activeFormule === 'rectangle' && (
          <div className="bg-blue-50 rounded-lg p-6 border-2 border-blue-200">
            <h3 className="text-xl font-bold text-blue-800 mb-4">▭ Aire du Rectangle</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Longueur (cm)</label>
                  <input
                    type="range"
                    min="1"
                    max="12"
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
                    max="12"
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
                    className="mx-auto border-4 border-blue-500 bg-blue-100 relative"
                    style={{
                      width: `${Math.min(rectLongueur * 15, 180)}px`,
                      height: `${Math.min(rectLargeur * 15, 120)}px`
                    }}
                  >
                    <div className="absolute inset-0 bg-blue-200 opacity-70"></div>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">Rectangle {rectLongueur} × {rectLargeur}</p>
                </div>
                <div className="space-y-2">
                  <div className="bg-yellow-100 p-3 rounded-lg">
                    <p className="font-bold text-gray-800">Formule :</p>
                    <p className="text-lg text-gray-800">Aire = Longueur × Largeur</p>
                  </div>
                  <div className="bg-green-100 p-3 rounded-lg">
                    <p className="font-bold text-gray-800">Calcul :</p>
                    <p className="text-lg text-gray-800">Aire = {rectLongueur} × {rectLargeur} = {aireRectangle} cm²</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Calculatrice Carré */}
        {activeFormule === 'carre' && (
          <div className="bg-green-50 rounded-lg p-6 border-2 border-green-200">
            <h3 className="text-xl font-bold text-green-800 mb-4">⬜ Aire du Carré</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Côté (cm)</label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={carreCote}
                    onChange={(e) => setCarreCote(Number(e.target.value))}
                    className="w-full"
                  />
                  <div className="text-center text-lg font-bold text-green-600">{carreCote} cm</div>
                </div>
                <button
                  onClick={() => setShowAnimation(!showAnimation)}
                  className="w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors"
                >
                  {showAnimation ? 'Arrêter' : 'Animer'} les carreaux
                </button>
              </div>
              <div className="bg-white rounded-lg p-4 border-2 border-dashed border-green-300">
                <div className="text-center mb-4">
                  <div 
                    className="mx-auto border-4 border-green-500 bg-green-100 relative"
                    style={{
                      width: `${Math.min(carreCote * 15, 150)}px`,
                      height: `${Math.min(carreCote * 15, 150)}px`
                    }}
                  >
                    <div className="absolute inset-0 bg-green-200 opacity-70"></div>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">Carré {carreCote} × {carreCote}</p>
                </div>
                <div className="space-y-2">
                  <div className="bg-yellow-100 p-3 rounded-lg">
                    <p className="font-bold text-gray-800">Formule :</p>
                    <p className="text-lg text-gray-800">Aire = Côté × Côté</p>
                  </div>
                  <div className="bg-green-100 p-3 rounded-lg">
                    <p className="font-bold text-gray-800">Calcul :</p>
                    <p className="text-lg text-gray-800">Aire = {carreCote} × {carreCote} = {aireCarre} cm²</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Méthode du quadrillage */}
        {activeFormule === 'quadrillage' && (
          <div className="bg-purple-50 rounded-lg p-6 border-2 border-purple-200">
            <h3 className="text-xl font-bold text-purple-800 mb-4">⊞ Méthode du quadrillage</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Longueur (carreaux)</label>
                  <input
                    type="range"
                    min="2"
                    max="8"
                    value={rectLongueur}
                    onChange={(e) => setRectLongueur(Number(e.target.value))}
                    className="w-full"
                  />
                  <div className="text-center text-lg font-bold text-purple-600">{rectLongueur} carreaux</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Largeur (carreaux)</label>
                  <input
                    type="range"
                    min="2"
                    max="6"
                    value={rectLargeur}
                    onChange={(e) => setRectLargeur(Number(e.target.value))}
                    className="w-full"
                  />
                  <div className="text-center text-lg font-bold text-purple-600">{rectLargeur} carreaux</div>
                </div>
                <button
                  onClick={() => setShowAnimation(!showAnimation)}
                  className="w-full bg-purple-500 text-white py-2 px-4 rounded-lg hover:bg-purple-600 transition-colors"
                >
                  {showAnimation ? 'Arrêter' : 'Compter'} les carreaux
                </button>
              </div>
              <div className="bg-white rounded-lg p-4 border-2 border-dashed border-purple-300">
                <div className="text-center mb-4">
                  <div 
                    className="mx-auto grid gap-1 p-2 bg-gray-100 rounded-lg"
                    style={{
                      gridTemplateColumns: `repeat(${rectLongueur}, 1fr)`,
                      width: 'fit-content'
                    }}
                  >
                    {generateGrid(rectLongueur, rectLargeur)}
                  </div>
                  <p className="text-sm text-gray-600 mt-2">Grille {rectLongueur} × {rectLargeur}</p>
                </div>
                <div className="space-y-2">
                  <div className="bg-yellow-100 p-3 rounded-lg">
                    <p className="font-bold text-gray-800">Méthode :</p>
                    <p className="text-lg text-gray-800">Compter tous les carreaux</p>
                  </div>
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <p className="font-bold text-gray-800">Résultat :</p>
                    <p className="text-lg text-gray-800">Aire = {rectLongueur} × {rectLargeur} = {aireRectangle} carreaux</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mémo des formules */}
      <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-6 border-2 border-orange-300">
        <h2 className="text-2xl font-bold text-red-800 mb-6 flex items-center gap-3">
          <span className="animate-pulse">📝</span> Mémo des formules
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-4 border-2 border-blue-200 hover:shadow-lg transition-shadow">
            <h3 className="font-bold text-blue-800 mb-2">▭ Rectangle</h3>
            <p className="text-lg font-mono bg-blue-50 p-2 rounded text-gray-800">Aire = L × l</p>
            <p className="text-sm text-gray-600 mt-2">L = longueur, l = largeur</p>
          </div>
          <div className="bg-white rounded-lg p-4 border-2 border-green-200 hover:shadow-lg transition-shadow">
            <h3 className="font-bold text-green-800 mb-2">⬜ Carré</h3>
            <p className="text-lg font-mono bg-green-50 p-2 rounded text-gray-800">Aire = côté²</p>
            <p className="text-sm text-gray-600 mt-2">côté² = côté × côté</p>
          </div>
        </div>
      </div>

      {/* Unités d'aire */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 border-2 border-indigo-300">
        <h2 className="text-2xl font-bold text-indigo-800 mb-6 flex items-center gap-3">
          <span className="animate-bounce">📏</span> Unités d'aire
        </h2>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4 border-2 border-indigo-200 hover:shadow-lg transition-shadow">
            <h3 className="font-bold text-indigo-800 mb-2">cm²</h3>
            <p className="text-sm text-gray-600">centimètre carré</p>
            <div className="mt-2 w-4 h-4 bg-indigo-200 border border-indigo-400 mx-auto"></div>
            <p className="text-xs text-gray-500 mt-1">Pour les petites surfaces</p>
          </div>
          <div className="bg-white rounded-lg p-4 border-2 border-green-200 hover:shadow-lg transition-shadow">
            <h3 className="font-bold text-green-800 mb-2">dm²</h3>
            <p className="text-sm text-gray-600">décimètre carré</p>
            <div className="mt-2 w-8 h-8 bg-green-200 border border-green-400 mx-auto"></div>
            <p className="text-xs text-gray-500 mt-1">Pour les surfaces moyennes</p>
          </div>
          <div className="bg-white rounded-lg p-4 border-2 border-red-200 hover:shadow-lg transition-shadow">
            <h3 className="font-bold text-red-800 mb-2">m²</h3>
            <p className="text-sm text-gray-600">mètre carré</p>
            <div className="mt-2 w-12 h-12 bg-red-200 border border-red-400 mx-auto"></div>
            <p className="text-xs text-gray-500 mt-1">Pour les grandes surfaces</p>
          </div>
        </div>
      </div>

      {/* Astuces et conseils */}
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6 border-2 border-yellow-300">
        <h2 className="text-2xl font-bold text-orange-800 mb-6 flex items-center gap-3">
          <span className="animate-bounce">💡</span> Astuces pour retenir
        </h2>
        <div className="space-y-4">
          <div className="bg-white rounded-lg p-4 border-l-4 border-yellow-500 hover:shadow-lg transition-shadow">
            <h3 className="font-bold text-yellow-800">🎨 Astuce du peintre</h3>
            <p className="text-gray-700">L'aire = la surface à peindre ! Plus c'est grand, plus il faut de peinture.</p>
          </div>
          <div className="bg-white rounded-lg p-4 border-l-4 border-blue-500 hover:shadow-lg transition-shadow">
            <h3 className="font-bold text-blue-800">⊞ Astuce du quadrillage</h3>
            <p className="text-gray-700">Compte les carreaux dans un rectangle : c'est toujours longueur × largeur !</p>
          </div>
          <div className="bg-white rounded-lg p-4 border-l-4 border-green-500 hover:shadow-lg transition-shadow">
            <h3 className="font-bold text-green-800">📦 Astuce du carré</h3>
            <p className="text-gray-700">Pour un carré, c'est facile : côté × côté (ou côté²) !</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AirePage() {
  const [currentSection, setCurrentSection] = useState<'cours' | 'exercices' | 'problemes'>('cours');
  const [currentExercise, setCurrentExercise] = useState(0);
  const [currentProblem, setCurrentProblem] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [userAnswer, setUserAnswer] = useState('');
  const [selectedAnswer, setSelectedAnswer] = useState('');

  const exercises = [
    {
      id: 1,
      type: 'comptage',
      question: 'Compte les carreaux pour trouver l\'aire de ce rectangle.',
      interactive: true,
      dimensions: { width: 4, height: 3 },
      answer: '12',
      unit: 'carreaux',
      explanation: 'On compte 4 × 3 = 12 carreaux dans le rectangle',
      hint: 'Compte rangée par rangée : 4 carreaux × 3 rangées'
    },
    {
      id: 2,
      type: 'comparaison',
      question: 'Compare ces deux figures. Laquelle a la plus grande aire ?',
      interactive: true,
      figures: [
        { type: 'carre', size: 3, label: 'Carré A' },
        { type: 'rectangle', width: 4, height: 2, label: 'Rectangle B' }
      ],
      answer: 'A',
      unit: '',
      explanation: 'Carré A = 3 × 3 = 9 carreaux, Rectangle B = 4 × 2 = 8 carreaux. Le carré A est plus grand.',
      hint: 'Calcule l\'aire de chaque figure et compare'
    },
    {
      id: 3,
      type: 'calcul',
      question: 'Calcule l\'aire de ce rectangle.',
      interactive: true,
      dimensions: { width: 5, height: 2 },
      answer: '10',
      unit: 'cm²',
      explanation: 'Aire = longueur × largeur = 5 × 2 = 10 cm²',
      hint: 'Utilise la formule : Aire = L × l'
    },
    {
      id: 4,
      type: 'pavage',
      question: 'Combien de petits carrés de 1 cm² faut-il pour couvrir ce rectangle ?',
      interactive: true,
      dimensions: { width: 3, height: 4 },
      answer: '12',
      unit: 'carrés',
      explanation: 'Il faut 3 × 4 = 12 carrés de 1 cm² pour paver le rectangle',
      hint: 'Imagine que tu poses des carreaux de 1 cm² sur toute la surface'
    },
    {
      id: 5,
      type: 'estimation',
      question: 'Estime l\'aire de ce carré puis vérifie en comptant.',
      interactive: true,
      dimensions: { size: 4 },
      answer: '16',
      unit: 'carreaux',
      explanation: 'Aire du carré = 4 × 4 = 16 carreaux',
      hint: 'Pour un carré : Aire = côté × côté'
    }
  ];

  const problems = [
    {
      id: 1,
      question: 'Marie veut couvrir sa table rectangulaire de 60 cm sur 40 cm avec du papier. Quelle surface de papier lui faut-il ?',
      answer: '2400',
      unit: 'cm²',
      explanation: 'Surface = 60 × 40 = 2400 cm²'
    },
    {
      id: 2,
      question: 'Un carré a une aire de 16 cm². Quelle est la longueur de son côté ?',
      answer: '4',
      unit: 'cm',
      explanation: 'Côté = √16 = 4 cm'
    },
    {
      id: 3,
      question: 'Pierre veut peindre un mur rectangulaire de 3 m sur 2 m. Quelle surface doit-il peindre ?',
      answer: '6',
      unit: 'm²',
      explanation: 'Surface = 3 × 2 = 6 m²'
    },
    {
      id: 4,
      question: 'Un rectangle a une longueur de 8 cm et une aire de 24 cm². Quelle est sa largeur ?',
      answer: '3',
      unit: 'cm',
      explanation: 'Largeur = 24 ÷ 8 = 3 cm'
    },
    {
      id: 5,
      question: 'Combien de carreaux de 1 dm² faut-il pour carreler une surface de 1 m² ?',
      answer: '100',
      unit: 'carreaux',
      explanation: '1 m² = 100 dm², donc il faut 100 carreaux'
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-green-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation */}
        <div className="flex items-center gap-4 mb-6">
          <Link href="/chapitre/cm1-aires-perimetres" className="flex items-center gap-2 text-green-600 hover:text-green-800 transition-colors">
            <ArrowLeft size={20} />
            <span>Retour aux Aires et périmètres</span>
          </Link>
        </div>
        
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg">
              ⬜
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Aire</h1>
              <p className="text-gray-600 text-lg">
                Comparer et mesurer les aires de figures simples
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
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg'
                    : 'bg-white/60 text-gray-700 hover:bg-white/80'
                }`}
              >
                <tab.icon size={16} />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Contenu du cours */}
          {currentSection === 'cours' && (
            <CoursAireInteractif />
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
                      <span>7 min</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Trophy size={16} />
                      <span>15 XP</span>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 rounded-lg p-6 mb-6">
                  <h3 className="font-semibold text-green-800 mb-2">Question</h3>
                  <p className="text-gray-700">{currentEx.question}</p>
                  <div className="mt-4">
                    <ExerciceInteractif exercice={currentEx} />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex gap-4">
                    <input
                      type="text"
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      placeholder="Votre réponse"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900"
                      disabled={showAnswer}
                    />
                    <span className="px-4 py-2 bg-gray-100 rounded-lg text-gray-700">{currentEx.unit}</span>
                  </div>

                  {!showAnswer && (
                    <button
                      onClick={handleExerciseAnswer}
                      className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors"
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
                    className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors"
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
                      <span>12 min</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Trophy size={16} />
                      <span>25 XP</span>
                    </div>
                  </div>
                </div>

                <div className="bg-orange-50 rounded-lg p-6 mb-6">
                  <h3 className="font-semibold text-orange-800 mb-2">Problème</h3>
                  <p className="text-gray-700">{currentProb.question}</p>
                </div>

                <div className="space-y-4">
                  <div className="flex gap-4">
                    <input
                      type="text"
                      value={selectedAnswer}
                      onChange={(e) => setSelectedAnswer(e.target.value)}
                      placeholder="Votre réponse"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900"
                      disabled={showAnswer}
                    />
                    <span className="px-4 py-2 bg-gray-100 rounded-lg text-gray-700">{currentProb.unit}</span>
                  </div>

                  {!showAnswer && (
                    <button
                      onClick={() => setShowAnswer(true)}
                      className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
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
                    className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
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