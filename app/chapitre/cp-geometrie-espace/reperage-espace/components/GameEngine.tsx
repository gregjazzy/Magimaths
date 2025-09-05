'use client';

import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Types pour notre module isolé
type GameState = {
  isRunning: boolean;
  currentLevel: number;
  score: number;
  position: { x: number; y: number };
};

type GameAction =
  | { type: 'START_GAME' }
  | { type: 'MOVE_PLAYER'; direction: 'up' | 'down' | 'left' | 'right' }
  | { type: 'COMPLETE_LEVEL' }
  | { type: 'RESET_GAME' };

// Contexte isolé pour notre jeu
const GameContext = createContext<{
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
} | null>(null);

// Réducteur isolé pour la logique du jeu
function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'START_GAME':
      return { ...state, isRunning: true };
    case 'MOVE_PLAYER':
      const newPosition = { ...state.position };
      switch (action.direction) {
        case 'up':
          newPosition.y = Math.max(0, newPosition.y - 1);
          break;
        case 'down':
          newPosition.y = Math.min(5, newPosition.y + 1);
          break;
        case 'left':
          newPosition.x = Math.max(0, newPosition.x - 1);
          break;
        case 'right':
          newPosition.x = Math.min(5, newPosition.x + 1);
          break;
      }
      return { ...state, position: newPosition };
    case 'COMPLETE_LEVEL':
      return {
        ...state,
        currentLevel: state.currentLevel + 1,
        score: state.score + 100
      };
    case 'RESET_GAME':
      return initialState;
    default:
      return state;
  }
}

// État initial isolé
const initialState: GameState = {
  isRunning: false,
  currentLevel: 1,
  score: 0,
  position: { x: 0, y: 0 }
};

// Hook personnalisé isolé
function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}

// Gestionnaire de son isolé
class SoundManager {
  private static instance: SoundManager;
  private audio: HTMLAudioElement | null = null;

  private constructor() {}

  static getInstance(): SoundManager {
    if (!SoundManager.instance) {
      SoundManager.instance = new SoundManager();
    }
    return SoundManager.instance;
  }

  playSound(text: string) {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'fr-FR';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  }
}

// Composant Provider isolé
export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
}

// Composants de jeu isolés
export function GameBoard() {
  const { state, dispatch } = useGame();
  const soundManager = SoundManager.getInstance();

  const handleMove = (direction: 'up' | 'down' | 'left' | 'right') => {
    dispatch({ type: 'MOVE_PLAYER', direction });
    soundManager.playSound('Déplacement');
  };

  return (
    <div className="relative w-full h-full bg-gradient-to-b from-sky-100 to-green-100 rounded-xl overflow-hidden">
      {/* Grille de jeu */}
      <div className="absolute inset-4 grid grid-cols-6 grid-rows-6 gap-1">
        {Array.from({ length: 36 }).map((_, index) => (
          <div
            key={index}
            className="border border-blue-200 rounded-lg bg-white/50"
          />
        ))}
      </div>

      {/* Joueur */}
      <div
        className="absolute w-12 h-12 transition-all duration-300 ease-in-out"
        style={{
          left: `${(state.position.x * 100) / 6}%`,
          top: `${(state.position.y * 100) / 6}%`,
          transform: 'translate(-50%, -50%)'
        }}
      >
        <div className="w-full h-full bg-blue-500 rounded-full flex items-center justify-center text-2xl">
          🤖
        </div>
      </div>

      {/* Contrôles */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 grid grid-cols-3 gap-2">
        <button
          onClick={() => handleMove('up')}
          className="p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          ⬆️
        </button>
        <div className="grid grid-cols-2 gap-2 col-span-3">
          <button
            onClick={() => handleMove('left')}
            className="p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            ⬅️
          </button>
          <button
            onClick={() => handleMove('right')}
            className="p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            ➡️
          </button>
        </div>
        <button
          onClick={() => handleMove('down')}
          className="p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          ⬇️
        </button>
      </div>
    </div>
  );
}

// Interface de jeu isolée
export function GameInterface() {
  const { state } = useGame();

  return (
    <div className="absolute top-4 left-4 right-4 bg-white/90 rounded-lg p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-blue-600">
          Niveau {state.currentLevel}
        </h2>
        <div className="text-yellow-500 text-xl">
          ⭐ {state.score}
        </div>
      </div>
    </div>
  );
}

// Composant principal isolé
export function GameContainer() {
  return (
    <GameProvider>
      <div className="w-full h-[600px] relative bg-white rounded-xl shadow-lg overflow-hidden">
        <GameBoard />
        <GameInterface />
      </div>
    </GameProvider>
  );
}
