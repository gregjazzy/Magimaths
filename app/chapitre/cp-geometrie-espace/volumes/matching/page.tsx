'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';

interface MatchingItem {
  id: string;
  type: 'object' | 'shape';
  image: string;
  name: string;
  matches: string;
}

const matchingItems: MatchingItem[] = [
  {
    id: 'cube-shape',
    type: 'shape',
    image: '/images/solides et formes/formecube.png',
    name: 'Cube',
    matches: 'cube-object'
  },
  {
    id: 'cube-object',
    type: 'object',
    image: '/images/solides et formes/dé2.png',
    name: 'Dé',
    matches: 'cube-shape'
  },
  {
    id: 'sphere-shape',
    type: 'shape',
    image: '/images/solides et formes/ballon.png',
    name: 'Sphère',
    matches: 'sphere-object'
  },
  {
    id: 'sphere-object',
    type: 'object',
    image: '/images/solides et formes/balletennis.png',
    name: 'Balle de tennis',
    matches: 'sphere-shape'
  },
  {
    id: 'cylinder-shape',
    type: 'shape',
    image: '/images/solides et formes/boiteconserve.png',
    name: 'Cylindre',
    matches: 'cylinder-object'
  },
  {
    id: 'cylinder-object',
    type: 'object',
    image: '/images/solides et formes/verrelait.png',
    name: 'Verre',
    matches: 'cylinder-shape'
  }
];

export default function MatchingGame() {
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<Set<string>>(new Set());
  const [attempts, setAttempts] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const handleItemClick = (itemId: string) => {
    if (matchedPairs.has(itemId)) return;

    if (selectedItem === null) {
      setSelectedItem(itemId);
      return;
    }

    const selectedItemData = matchingItems.find(item => item.id === selectedItem);
    const clickedItemData = matchingItems.find(item => item.id === itemId);

    if (!selectedItemData || !clickedItemData) return;

    setAttempts(prev => prev + 1);

    if (selectedItemData.matches === itemId) {
      // Correct match
      setMatchedPairs(prev => new Set([...prev, selectedItem, itemId]));
      if (matchedPairs.size + 2 === matchingItems.length) {
        setIsComplete(true);
      }
    }

    setSelectedItem(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/chapitre/cp-geometrie-espace/volumes" 
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour aux volumes</span>
          </Link>
          
          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Associe les objets à leur forme !
            </h1>
            <p className="text-gray-600">
              Clique sur deux images qui vont ensemble
            </p>
          </div>
        </div>

        {/* Game stats */}
        <div className="bg-white rounded-lg p-4 mb-6 shadow-md">
          <div className="flex justify-between items-center">
            <div>Paires trouvées : {matchedPairs.size / 2} sur {matchingItems.length / 2}</div>
            <div>Essais : {attempts}</div>
          </div>
        </div>

        {/* Game grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {matchingItems.map((item) => (
            <div
              key={item.id}
              onClick={() => handleItemClick(item.id)}
              className={`
                relative aspect-square bg-white rounded-xl shadow-md cursor-pointer
                transition-all transform hover:scale-105
                ${matchedPairs.has(item.id) ? 'opacity-50' : ''}
                ${selectedItem === item.id ? 'ring-4 ring-purple-500' : ''}
              `}
            >
              <div className="absolute inset-0 flex items-center justify-center p-4">
                <Image
                  src={item.image}
                  alt={item.name}
                  width={150}
                  height={150}
                  className="object-contain"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Completion modal */}
        {isComplete && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
            <div className="bg-white rounded-xl p-8 max-w-sm mx-4 text-center">
              <div className="text-4xl mb-4">🎉</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Bravo !
              </h2>
              <p className="text-gray-600 mb-6">
                Tu as trouvé toutes les paires en {attempts} essais !
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => {
                    setMatchedPairs(new Set());
                    setAttempts(0);
                    setIsComplete(false);
                  }}
                  className="bg-purple-100 text-purple-800 px-4 py-2 rounded-lg font-medium hover:bg-purple-200 transition-colors"
                >
                  Rejouer
                </button>
                <Link
                  href="/chapitre/cp-geometrie-espace/volumes"
                  className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                  Retour
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
