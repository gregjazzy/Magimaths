'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, Settings, CheckCircle } from 'lucide-react';

interface ExponentialGraphSectionProps {
  onSectionComplete: (sectionName: string, xp: number) => void;
  completedSections: string[];
}

export default function ExponentialGraphSection({ onSectionComplete, completedSections }: ExponentialGraphSectionProps) {
  const [paramA, setParamA] = useState(1);
  const [paramK, setParamK] = useState(1);
  const [paramH, setParamH] = useState(0);
  const [showFormula, setShowFormula] = useState(true);

  // Générer les points de la courbe
  const generatePoints = () => {
    const points = [];
    const xMin = -3;
    const xMax = 3;
    const step = 0.1;
    
    for (let x = xMin; x <= xMax; x += step) {
      const y = paramA * Math.exp(paramK * x) + paramH;
      // Limiter y pour l'affichage
      if (y >= -10 && y <= 10) {
        points.push({ x, y });
      }
    }
    return points;
  };

  const points = generatePoints();
  
  // Convertir les coordonnées mathématiques vers les coordonnées SVG
  const toSVG = (x: number, y: number) => {
    const width = 400;
    const height = 300;
    const padding = 40;
    
    const svgX = ((x + 3) / 6) * (width - 2 * padding) + padding;
    const svgY = height - padding - ((y + 5) / 10) * (height - 2 * padding);
    
    return { x: svgX, y: svgY };
  };

  // Créer le chemin SVG pour la courbe
  const createPath = () => {
    if (points.length === 0) return '';
    
    const firstPoint = toSVG(points[0].x, points[0].y);
    let path = `M ${firstPoint.x} ${firstPoint.y}`;
    
    for (let i = 1; i < points.length; i++) {
      const point = toSVG(points[i].x, points[i].y);
      path += ` L ${point.x} ${point.y}`;
    }
    
    return path;
  };

  const handleComplete = () => {
    if (!completedSections.includes('graph')) {
      onSectionComplete('graph', 30);
    }
  };

  return (
    <section className="bg-white rounded-3xl p-8 shadow-xl border border-gray-200">
      <div className="text-center mb-8">
        <div className="inline-flex items-center space-x-2 bg-cyan-100 px-4 py-2 rounded-full mb-4">
          <TrendingUp className="h-5 w-5 text-cyan-600" />
          <span className="font-semibold text-cyan-800">Graphique interactif</span>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Visualise la fonction exponentielle 📊
        </h2>
        <p className="text-gray-600">Modifie les paramètres pour comprendre l'impact sur la courbe</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Graphique */}
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-cyan-50 to-blue-50 p-6 rounded-2xl border-2 border-cyan-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4 text-center">
              {showFormula && (
                <div className="bg-white p-3 rounded-lg mb-4 border-2 border-orange-200">
                  <div className="text-xl font-mono text-orange-600">
                    f(x) = {paramA !== 1 && `${paramA} × `}e^({paramK !== 1 && `${paramK} × `}x){paramH !== 0 && ` ${paramH >= 0 ? '+' : ''} ${paramH}`}
                  </div>
                </div>
              )}
            </h3>
            
            <svg viewBox="0 0 400 300" className="w-full h-64 bg-white rounded-lg border">
              {/* Grille */}
              <defs>
                <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#f3f4f6" strokeWidth="1"/>
                </pattern>
              </defs>
              <rect width="400" height="300" fill="url(#grid)" />
              
              {/* Axes */}
              <line x1="40" y1="150" x2="360" y2="150" stroke="#6b7280" strokeWidth="2" />
              <line x1="200" y1="40" x2="200" y2="260" stroke="#6b7280" strokeWidth="2" />
              
              {/* Graduations X */}
              {[-3, -2, -1, 0, 1, 2, 3].map(x => {
                const svgPos = toSVG(x, 0);
                return (
                  <g key={x}>
                    <line x1={svgPos.x} y1="145" x2={svgPos.x} y2="155" stroke="#6b7280" strokeWidth="1" />
                    <text x={svgPos.x} y="170" textAnchor="middle" fontSize="12" fill="#6b7280">{x}</text>
                  </g>
                );
              })}
              
              {/* Graduations Y */}
              {[-4, -2, 0, 2, 4].map(y => {
                const svgPos = toSVG(0, y);
                return (
                  <g key={y}>
                    <line x1="195" y1={svgPos.y} x2="205" y2={svgPos.y} stroke="#6b7280" strokeWidth="1" />
                    <text x="190" y={svgPos.y + 4} textAnchor="end" fontSize="12" fill="#6b7280">{y}</text>
                  </g>
                );
              })}
              
              {/* Courbe exponentielle */}
              <path
                d={createPath()}
                fill="none"
                stroke="#f59e0b"
                strokeWidth="3"
                className="drop-shadow-sm"
              />
              
              {/* Points remarquables */}
              {points.filter((_, i) => i % 10 === 0).map((point, i) => {
                const svgPoint = toSVG(point.x, point.y);
                return (
                  <circle
                    key={i}
                    cx={svgPoint.x}
                    cy={svgPoint.y}
                    r="3"
                    fill="#dc2626"
                    className="animate-pulse"
                  />
                );
              })}
            </svg>
          </div>
        </div>

        {/* Contrôles */}
        <div className="space-y-6">
          <div className="bg-orange-50 p-6 rounded-2xl border-2 border-orange-200">
            <div className="flex items-center space-x-2 mb-4">
              <Settings className="h-5 w-5 text-orange-600" />
              <h3 className="text-lg font-bold text-gray-900">Paramètres</h3>
            </div>
            
            <div className="space-y-6">
              {/* Paramètre A */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Coefficient multiplicateur (a) : {paramA}
                </label>
                <input
                  type="range"
                  min="0.1"
                  max="3"
                  step="0.1"
                  value={paramA}
                  onChange={(e) => setParamA(parseFloat(e.target.value))}
                  className="slider w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="text-xs text-gray-600 mt-1">
                  Étire ou comprime verticalement la courbe
                </div>
              </div>

              {/* Paramètre K */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Coefficient exponentiel (k) : {paramK}
                </label>
                <input
                  type="range"
                  min="0.2"
                  max="2"
                  step="0.1"
                  value={paramK}
                  onChange={(e) => setParamK(parseFloat(e.target.value))}
                  className="slider w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="text-xs text-gray-600 mt-1">
                  Modifie la vitesse de croissance
                </div>
              </div>

              {/* Paramètre H */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Translation verticale (h) : {paramH}
                </label>
                <input
                  type="range"
                  min="-3"
                  max="3"
                  step="0.5"
                  value={paramH}
                  onChange={(e) => setParamH(parseFloat(e.target.value))}
                  className="slider w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="text-xs text-gray-600 mt-1">
                  Déplace la courbe vers le haut ou le bas
                </div>
              </div>
            </div>
          </div>

          {/* Informations sur la fonction */}
          <div className="bg-blue-50 p-6 rounded-2xl border-2 border-blue-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">📋 Propriétés actuelles</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Passe par :</span>
                <span className="font-mono text-blue-800">(0, {(paramA + paramH).toFixed(1)})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Croissance :</span>
                <span className="font-mono text-blue-800">{paramK > 0 ? 'Croissante' : 'Décroissante'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Vitesse :</span>
                <span className="font-mono text-blue-800">{paramK > 1 ? 'Rapide' : paramK < 1 ? 'Lente' : 'Normale'}</span>
              </div>
            </div>
          </div>

          {/* Bouton de validation */}
          <div className="text-center">
            <button
              onClick={handleComplete}
              className={`px-8 py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-105 ${
                completedSections.includes('graph')
                  ? 'bg-green-500 text-white'
                  : 'bg-cyan-500 hover:bg-cyan-600 text-white'
              }`}
            >
              {completedSections.includes('graph') ? (
                <span className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5" />
                  <span>✓ Graphique maîtrisé ! +30 XP</span>
                </span>
              ) : (
                'J\'ai exploré le graphique ! +30 XP'
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
} 