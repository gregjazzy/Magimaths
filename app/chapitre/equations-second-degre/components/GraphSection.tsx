'use client';

import { useState } from 'react';
import { Play } from 'lucide-react';
import './slider.css';

interface GraphSectionProps {
  onSectionComplete: (sectionName: string, xp: number) => void;
  completedSections: string[];
  coefficients: { a: number; b: number; c: number };
  setCoefficients: (value: { a: number; b: number; c: number } | ((prev: { a: number; b: number; c: number }) => { a: number; b: number; c: number })) => void;
}

export default function GraphSection({ onSectionComplete, completedSections, coefficients, setCoefficients }: GraphSectionProps) {

  // Fonction pour générer les points de la parabole
  const generateParabolaPoints = () => {
    const points = [];
    const { a, b, c } = coefficients;
    for (let x = -10; x <= 10; x += 0.2) {
      const y = a * x * x + b * x + c;
      // Ajustement des échelles pour une meilleure visibilité
      const scaledX = (x + 10) * (400/20); // Échelle pour x: [-10,10] → [0,400]
      const scaledY = 200 + (y * -20); // Centre en y=200, échelle inversée pour y
      if (scaledY >= 0 && scaledY <= 400) {
        points.push(`${scaledX},${scaledY}`);
      }
    }
    return points.join(' ');
  };

  return (
    <section className="bg-white rounded-3xl p-4 sm:p-8 shadow-xl border border-gray-200">
      <div className="text-center mb-4 sm:mb-8">
        <div className="inline-flex items-center space-x-2 bg-purple-100 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full mb-3 sm:mb-4">
          <Play className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
          <span className="font-semibold text-purple-800 text-sm sm:text-base">Expérimentation</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-4">
          Joue avec la parabole ! 🎮
        </h2>
        <p className="text-sm sm:text-base text-gray-600">Bouge les curseurs et regarde comme la parabole change de forme</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 sm:gap-8">
        {/* Contrôles */}
        <div className="space-y-4 sm:space-y-6">
          <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white p-2 sm:p-6 rounded-lg sm:rounded-2xl">
            <h3 className="text-xs sm:text-xl font-bold mb-1 sm:mb-4">Équation actuelle :</h3>
            <div className="bg-white/20 p-1.5 sm:p-4 rounded-lg text-center">
              <span className="text-sm sm:text-2xl font-mono font-bold">
                {coefficients.a}x² + {coefficients.b}x + {coefficients.c} = 0
              </span>
            </div>
          </div>

          {/* Sliders - Version mobile */}
          <div className="sm:hidden">
            <div className="grid grid-cols-3 gap-1">
              <div className="flex flex-col">
                <div className="text-[10px] text-green-800 font-bold text-center">a = {coefficients.a}</div>
                <input
                  type="range"
                  min="-2"
                  max="2"
                  step="0.25"
                  value={coefficients.a}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value);
                    if (value === 0) return;
                    setCoefficients(prev => ({ ...prev, a: value }));
                  }}
                  className="w-full h-1 rounded-lg appearance-none cursor-pointer slider slider-a"
                />
              </div>

              <div className="flex flex-col">
                <div className="text-[10px] text-yellow-800 font-bold text-center">b = {coefficients.b}</div>
                <input
                  type="range"
                  min="-4"
                  max="4"
                  step="0.5"
                  value={coefficients.b}
                  onChange={(e) => setCoefficients(prev => ({ ...prev, b: parseFloat(e.target.value) }))}
                  className="w-full h-1 rounded-lg appearance-none cursor-pointer slider slider-b"
                />
              </div>

              <div className="flex flex-col">
                <div className="text-[10px] text-purple-800 font-bold text-center">c = {coefficients.c}</div>
                <input
                  type="range"
                  min="-4"
                  max="4"
                  step="0.5"
                  value={coefficients.c}
                  onChange={(e) => setCoefficients(prev => ({ ...prev, c: parseFloat(e.target.value) }))}
                  className="w-full h-1 rounded-lg appearance-none cursor-pointer slider slider-c"
                />
              </div>
            </div>
          </div>

          {/* Sliders - Version desktop */}
          <div className="hidden sm:block space-y-4">
            <div className="p-4 bg-green-50 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <label className="text-base text-green-800 font-bold">
                  a = {coefficients.a}
                </label>
                <span className="text-sm text-green-600">Ouverture</span>
              </div>
              <input
                type="range"
                min="-2"
                max="2"
                step="0.25"
                value={coefficients.a}
                onChange={(e) => {
                  const value = parseFloat(e.target.value);
                  if (value === 0) return;
                  setCoefficients(prev => ({ ...prev, a: value }));
                }}
                className="w-full h-3 rounded-lg appearance-none cursor-pointer slider slider-a"
              />
            </div>

            <div className="p-4 bg-yellow-50 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <label className="text-base text-yellow-800 font-bold">
                  b = {coefficients.b}
                </label>
                <span className="text-sm text-yellow-600">Horizontal</span>
              </div>
              <input
                type="range"
                min="-4"
                max="4"
                step="0.5"
                value={coefficients.b}
                onChange={(e) => setCoefficients(prev => ({ ...prev, b: parseFloat(e.target.value) }))}
                className="w-full h-3 rounded-lg appearance-none cursor-pointer slider slider-b"
              />
            </div>

            <div className="p-4 bg-purple-50 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <label className="text-base text-purple-800 font-bold">
                  c = {coefficients.c}
                </label>
                <span className="text-sm text-purple-600">Vertical</span>
              </div>
              <input
                type="range"
                min="-4"
                max="4"
                step="0.5"
                value={coefficients.c}
                onChange={(e) => setCoefficients(prev => ({ ...prev, c: parseFloat(e.target.value) }))}
                className="w-full h-3 rounded-lg appearance-none cursor-pointer slider slider-c"
              />
            </div>
          </div>
        </div>

        {/* Graphique */}
        <div className="bg-gray-50 rounded-xl sm:rounded-2xl p-2 sm:p-6">
          <div className="bg-white rounded-lg sm:rounded-xl p-2 sm:p-4 border-2 border-gray-200 h-[200px] sm:h-80">
            <svg viewBox="0 0 400 400" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
              {/* Grille */}
              <defs>
                <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e5e7eb" strokeWidth="1"/>
                </pattern>
              </defs>
              <rect width="400" height="400" fill="url(#grid)" />
              
              {/* Axes */}
              <line x1="200" y1="0" x2="200" y2="400" stroke="#9ca3af" strokeWidth="2" />
              <line x1="0" y1="200" x2="400" y2="200" stroke="#9ca3af" strokeWidth="2" />
              
              {/* Parabole */}
              <polyline
                points={generateParabolaPoints()}
                fill="none"
                stroke="url(#parabolaGradient)"
                strokeWidth="3"
                className="drop-shadow-sm"
              />
              
              <defs>
                <linearGradient id="parabolaGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#8b5cf6" />
                  <stop offset="50%" stopColor="#06b6d4" />
                  <stop offset="100%" stopColor="#10b981" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          
          <div className="text-center mt-3 sm:mt-4">
            <button
              onClick={() => onSectionComplete('graph', 30)}
              className={`px-4 py-2 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base transition-all transform hover:scale-105 ${
                completedSections.includes('graph')
                  ? 'bg-green-500 text-white'
                  : 'bg-purple-500 hover:bg-purple-600 text-white'
              }`}
            >
              {completedSections.includes('graph') ? '✓ Maîtrisé ! +30 XP' : 'C\'est clair ! +30 XP'}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
