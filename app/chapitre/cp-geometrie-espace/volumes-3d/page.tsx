'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function Volumes3D() {
  const [selectedShape, setSelectedShape] = useState('cube');
  const [rotation, setRotation] = useState(0);

  const shapes = {
    cube: {
      name: 'Cube',
      description: 'Un cube a 6 faces carrées égales',
      examples: ['dé 🎲', 'boîte de jeu 🎮', 'bloc de construction 🧱'],
      color: 'bg-orange-500'
    },
    sphere: {
      name: 'Sphère',
      description: 'Une sphère est parfaitement ronde',
      examples: ['ballon ⚽', 'bille 🔮', 'bulle de savon 🫧'],
      color: 'bg-blue-500'
    },
    cylinder: {
      name: 'Cylindre',
      description: 'Un cylindre a 2 faces circulaires et une face courbe',
      examples: ['boîte de conserve 🥫', 'rouleau 📜', 'crayon ✏️'],
      color: 'bg-green-500'
    },
    pyramid: {
      name: 'Pyramide',
      description: 'Une pyramide a une base carrée et 4 faces triangulaires',
      examples: ['pyramide d\'Égypte 🏛️', 'tente ⛺', 'toit pointu 🏠'],
      color: 'bg-red-500'
    }
  };

  const handleShapeClick = (shapeName: string) => {
    setSelectedShape(shapeName);
    setRotation(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/chapitre/cp-geometrie-espace" 
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-all duration-300 mb-4 group"
          >
            <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform duration-300" />
            <span>Retour à la géométrie et espace</span>
          </Link>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-8 shadow-lg border border-white/50 transition-all duration-300 hover:shadow-xl text-center">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text mb-4">
              📦 Les volumes
            </h1>
            <p className="text-lg text-gray-600">
              Découvre les formes en trois dimensions !
            </p>
          </div>
        </div>

        {/* Contenu principal */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Liste des formes */}
          <div className="space-y-4">
            {Object.entries(shapes).map(([key, shape]) => (
              <button
                key={key}
                onClick={() => handleShapeClick(key)}
                className={`
                  w-full p-4 rounded-xl text-left transition-all duration-300
                  ${selectedShape === key
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg'
                    : 'bg-white/80 hover:bg-white/90 text-gray-700'
                  }
                `}
              >
                <div className="font-bold text-lg">{shape.name}</div>
                <p className="text-sm opacity-80">{shape.description}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {shape.examples.map((example, index) => (
                    <span
                      key={index}
                      className={`text-xs px-2 py-1 rounded-full ${
                        selectedShape === key
                          ? 'bg-white/20'
                          : 'bg-indigo-100'
                      }`}
                    >
                      {example}
                    </span>
                  ))}
                </div>
              </button>
            ))}
          </div>

          {/* Zone d'affichage */}
          <div className="md:col-span-2 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/50 overflow-hidden p-8">
            <div className="flex flex-col items-center justify-center h-full">
              {/* Image de la forme */}
              <div 
                className="text-8xl mb-8 transform transition-transform duration-500 cursor-pointer hover:scale-110"
                style={{ transform: `rotate(${rotation}deg)` }}
                onClick={() => setRotation(rotation + 45)}
              >
                {selectedShape === 'cube' && '📦'}
                {selectedShape === 'sphere' && '⚽'}
                {selectedShape === 'cylinder' && '🥫'}
                {selectedShape === 'pyramid' && '🏛️'}
              </div>

              {/* Description */}
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-4">{shapes[selectedShape as keyof typeof shapes].name}</h3>
                <p className="text-gray-600">{shapes[selectedShape as keyof typeof shapes].description}</p>
              </div>

              {/* Instructions */}
              <div className="mt-8 text-center text-gray-500">
                <p>Clique sur la forme pour la faire tourner !</p>
              </div>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-white/80 backdrop-blur-sm rounded-xl p-8 shadow-lg border border-white/50">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text mb-6">
            🎮 Comment observer les formes ?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-xl">
              <div className="text-4xl mb-4">👆</div>
              <h3 className="font-bold text-lg mb-2">Sélection</h3>
              <p className="text-gray-600">Clique sur une forme dans la liste pour la découvrir</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl">
              <div className="text-4xl mb-4">🔄</div>
              <h3 className="font-bold text-lg mb-2">Rotation</h3>
              <p className="text-gray-600">Clique sur la forme pour la faire tourner</p>
            </div>
            <div className="bg-gradient-to-br from-pink-50 to-red-50 p-6 rounded-xl">
              <div className="text-4xl mb-4">👀</div>
              <h3 className="font-bold text-lg mb-2">Observation</h3>
              <p className="text-gray-600">Regarde bien les caractéristiques de chaque forme</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}