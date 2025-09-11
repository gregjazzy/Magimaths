'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, ArrowUp, ArrowDown, ArrowRight, CheckCircle, XCircle, RotateCcw } from 'lucide-react';

export default function QuadrillagesCP() {
  // États pour le jeu et l'interaction
  const [currentStep, setCurrentStep] = useState(0);
  const [showExercises, setShowExercises] = useState(false);
  const [playerPosition, setPlayerPosition] = useState({ x: 0, y: 0 });
  const [targetPosition, setTargetPosition] = useState({ x: 3, y: 3 });
  const [moves, setMoves] = useState<string[]>([]);
  const [success, setSuccess] = useState(false);
  const [currentGame, setCurrentGame] = useState(0);
  const [score, setScore] = useState(0);

  // Définition des jeux de quadrillage
  const gridGames = [
    {
      name: "Le Trésor Caché 🗺️",
      grid: [
        ['🌳', '🌳', '🌳', '🌳', '🌳'],
        ['🌳', '⬜', '⬜', '⬜', '🌳'],
        ['🌳', '⬜', '⬜', '⬜', '🌳'],
        ['🌳', '⬜', '⬜', '💎', '🌳'],
        ['🌳', '🌳', '🌳', '🌳', '🌳']
      ],
      startPos: { x: 1, y: 1 },
      targetPos: { x: 3, y: 3 },
      instructions: "Aide le pirate 🏴‍☠️ à trouver le trésor ! Utilise les flèches pour te déplacer."
    },
    {
      name: "Le Jardin Magique 🌺",
      grid: [
        ['🌿', '🌿', '🌿', '🌿', '🌿'],
        ['🌿', '⬜', '🌸', '⬜', '🌿'],
        ['🌿', '⬜', '⬜', '🌸', '🌿'],
        ['🌿', '🌸', '⬜', '🎯', '🌿'],
        ['🌿', '🌿', '🌿', '🌿', '🌿']
      ],
      startPos: { x: 1, y: 1 },
      targetPos: { x: 3, y: 3 },
      instructions: "Cueille toutes les fleurs 🌸 sur ton chemin vers le but !"
    },
    {
      name: "L'École des Animaux 🏫",
      grid: [
        ['🌲', '🌲', '🌲', '🌲', '🌲'],
        ['🌲', '⬜', '🦊', '⬜', '🌲'],
        ['🌲', '🐰', '⬜', '🦁', '🌲'],
        ['🌲', '⬜', '🐯', '📚', '🌲'],
        ['🌲', '🌲', '🌲', '🌲', '🌲']
      ],
      startPos: { x: 1, y: 1 },
      targetPos: { x: 3, y: 3 },
      instructions: "Aide les animaux à aller à l'école ! Ramasse-les sur ton chemin."
    }
  ];

  // Fonction pour déplacer le joueur
  const movePlayer = (direction: 'up' | 'down' | 'left' | 'right') => {
    const newPosition = { ...playerPosition };
    
    switch (direction) {
      case 'up':
        if (newPosition.y > 1) newPosition.y--;
        break;
      case 'down':
        if (newPosition.y < 3) newPosition.y++;
        break;
      case 'left':
        if (newPosition.x > 1) newPosition.x--;
        break;
      case 'right':
        if (newPosition.x < 3) newPosition.x++;
        break;
    }

    setPlayerPosition(newPosition);
    setMoves([...moves, direction]);

    // Vérifier si le joueur a atteint la cible
    if (newPosition.x === targetPosition.x && newPosition.y === targetPosition.y) {
      setSuccess(true);
      setScore(score + 1);
    }
  };

  // Gérer les touches du clavier
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          movePlayer('up');
          break;
        case 'ArrowDown':
          movePlayer('down');
          break;
        case 'ArrowLeft':
          movePlayer('left');
          break;
        case 'ArrowRight':
          movePlayer('right');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [playerPosition]);

  // Réinitialiser le jeu
  const resetGame = () => {
    const currentGameData = gridGames[currentGame];
    setPlayerPosition(currentGameData.startPos);
    setTargetPosition(currentGameData.targetPos);
    setMoves([]);
    setSuccess(false);
  };

  // Passer au jeu suivant
  const nextGame = () => {
    if (currentGame < gridGames.length - 1) {
      setCurrentGame(currentGame + 1);
      resetGame();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 p-4">
      {/* En-tête */}
      <div className="flex items-center mb-8">
        <Link href="/chapitre/cp-geometrie-espace" className="mr-4">
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </Link>
        <h1 className="text-2xl font-bold text-purple-600">
          Les Quadrillages Magiques 🎯
        </h1>
      </div>

      {/* Jeu principal */}
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-center mb-4 text-indigo-600">
          {gridGames[currentGame].name}
        </h2>
        
        <p className="text-gray-600 text-center mb-6">
          {gridGames[currentGame].instructions}
        </p>

        {/* Grille de jeu */}
        <div className="grid grid-cols-5 gap-2 mb-8">
          {gridGames[currentGame].grid.map((row, y) => (
            <div key={y} className="flex">
              {row.map((cell, x) => (
                <div
                  key={`${x}-${y}`}
                  className={`w-16 h-16 flex items-center justify-center text-2xl border-2 
                    ${playerPosition.x === x && playerPosition.y === y ? 'bg-yellow-200 border-yellow-400' : 
                    targetPosition.x === x && targetPosition.y === y ? 'bg-green-200 border-green-400' : 
                    'border-gray-200'}`}
                >
                  {playerPosition.x === x && playerPosition.y === y ? '🏴‍☠️' : cell}
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Contrôles */}
        <div className="flex flex-col items-center gap-4">
          <button
            onClick={() => movePlayer('up')}
            className="p-3 bg-blue-500 text-white rounded-full hover:bg-blue-600"
          >
            <ArrowUp className="w-6 h-6" />
          </button>
          <div className="flex gap-4">
            <button
              onClick={() => movePlayer('left')}
              className="p-3 bg-blue-500 text-white rounded-full hover:bg-blue-600"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <button
              onClick={() => movePlayer('down')}
              className="p-3 bg-blue-500 text-white rounded-full hover:bg-blue-600"
            >
              <ArrowDown className="w-6 h-6" />
            </button>
            <button
              onClick={() => movePlayer('right')}
              className="p-3 bg-blue-500 text-white rounded-full hover:bg-blue-600"
            >
              <ArrowRight className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Score et contrôles de jeu */}
        <div className="mt-8 flex justify-between items-center">
          <div className="text-lg font-bold text-purple-600">
            Score: {score} / {gridGames.length}
          </div>
          <div className="flex gap-4">
            <button
              onClick={resetGame}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
            >
              Recommencer
            </button>
            {success && (
              <button
                onClick={nextGame}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
              >
                Niveau Suivant
              </button>
            )}
          </div>
        </div>

        {/* Message de succès */}
        {success && (
          <div className="mt-4 p-4 bg-green-100 text-green-700 rounded-lg text-center">
            Bravo ! Tu as réussi ! 🎉
          </div>
        )}
      </div>
    </div>
  );
}