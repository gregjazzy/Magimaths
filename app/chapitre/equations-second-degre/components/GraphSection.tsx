'use client';

import { useState } from 'react';
import { Play } from 'lucide-react';

interface GraphSectionProps {
  onSectionComplete: (sectionName: string, xp: number) => void;
  completedSections: string[];
}

export default function GraphSection({ onSectionComplete, completedSections }: GraphSectionProps) {
  const [coefficients, setCoefficients] = useState({ a: 1, b: 0, c: 0 });

  // Fonction pour générer les points de la parabole
  const generateParabolaPoints = () => {
    const points = [];
    const { a, b, c } = coefficients;
    for (let x = -8; x <= 8; x += 0.3) {
      const y = a * x * x + b * x + c;
      if (y >= -15 && y <= 15) {
        points.push(`${(x + 8) * 12.5},${(15 - y) * 8 + 120}`);
      }
    }
    return points.join(' ');
  };

  return (
    <section className="bg-white rounded-3xl p-8 shadow-xl border border-gray-200">
      <div className="text-center mb-8">
        <div className="inline-flex items-center space-x-2 bg-purple-100 px-4 py-2 rounded-full mb-4">
          <Play className="h-5 w-5 text-purple-600" />
          <span className="font-semibold text-purple-800">Expérimentation</span>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Joue avec la parabole ! 🎮
        </h2>
        <p className="text-gray-600">Bouge les curseurs et regarde comme la parabole change de forme</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Contrôles */}
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white p-6 rounded-2xl">
            <h3 className="text-xl font-bold mb-4">Équation actuelle :</h3>
            <div className="bg-white/20 p-4 rounded-lg text-center">
              <span className="text-2xl font-mono font-bold">
                {coefficients.a}x² + {coefficients.b}x + {coefficients.c} = 0
              </span>
            </div>
          </div>

          {/* Sliders */}
          <div className="space-y-4">
            <div className="p-4 bg-green-50 rounded-xl">
              <label className="block text-green-800 font-bold mb-2">
                Coefficient a = {coefficients.a}
              </label>
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
                className="w-full h-3 bg-green-200 rounded-lg appearance-none cursor-pointer slider"
              />
              <p className="text-sm text-green-600 mt-1">Contrôle l'ouverture de la parabole (a ≠ 0)</p>
            </div>

            <div className="p-4 bg-yellow-50 rounded-xl">
              <label className="block text-yellow-800 font-bold mb-2">
                Coefficient b = {coefficients.b}
              </label>
              <input
                type="range"
                min="-4"
                max="4"
                step="0.5"
                value={coefficients.b}
                onChange={(e) => setCoefficients(prev => ({ ...prev, b: parseFloat(e.target.value) }))}
                className="w-full h-3 bg-yellow-200 rounded-lg appearance-none cursor-pointer slider"
              />
              <p className="text-sm text-yellow-600 mt-1">Décale la parabole horizontalement</p>
            </div>

            <div className="p-4 bg-purple-50 rounded-xl">
              <label className="block text-purple-800 font-bold mb-2">
                Coefficient c = {coefficients.c}
              </label>
              <input
                type="range"
                min="-4"
                max="4"
                step="0.5"
                value={coefficients.c}
                onChange={(e) => setCoefficients(prev => ({ ...prev, c: parseFloat(e.target.value) }))}
                className="w-full h-3 bg-purple-200 rounded-lg appearance-none cursor-pointer slider"
              />
              <p className="text-sm text-purple-600 mt-1">Décale la parabole verticalement</p>
            </div>
          </div>
        </div>

        {/* Graphique */}
        <div className="bg-gray-50 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-center mb-4">Ta parabole en temps réel</h3>
          <div className="bg-white rounded-xl p-4 border-2 border-gray-200 h-80">
            <svg viewBox="0 0 400 400" className="w-full h-full">
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
                strokeWidth="4"
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
          
          <div className="text-center mt-4">
            <button
              onClick={() => onSectionComplete('graph', 30)}
              className={`px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 ${
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