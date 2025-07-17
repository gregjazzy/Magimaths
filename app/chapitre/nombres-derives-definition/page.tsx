'use client';

import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Play, RotateCcw } from 'lucide-react';
import ChapterLayout from '../../components/ChapterLayout';

const DerivativeAnimation: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [h, setH] = useState(0.8);
  const [a, setA] = useState(1);
  const [showTangent, setShowTangent] = useState(false);

  // Fonction f(x) = x²/2 pour avoir une belle courbe
  const f = (x: number) => (x * x) / 2;

  // Animation automatique
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isAnimating && h > 0.1) {
      interval = setInterval(() => {
        setH(prev => Math.max(0.1, prev - 0.03));
      }, 100);
    } else if (isAnimating && h <= 0.1) {
      setShowTangent(true);
      setIsAnimating(false);
    }
    return () => clearInterval(interval);
  }, [isAnimating, h]);

  // Dessin du graphique
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Configuration
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const scale = 60;

    // Effacer le canvas
    ctx.clearRect(0, 0, width, height);

    // Dessiner les axes avec graduations
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 2;
    
    // Axe X
    ctx.beginPath();
    ctx.moveTo(50, centerY);
    ctx.lineTo(width - 50, centerY);
    ctx.stroke();
    
    // Axe Y
    ctx.beginPath();
    ctx.moveTo(centerX, 50);
    ctx.lineTo(centerX, height - 50);
    ctx.stroke();

    // Graduations et labels des axes
    ctx.fillStyle = '#374151';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    
    // Graduations axe X
    for (let i = -3; i <= 3; i++) {
      if (i !== 0) {
        const x = centerX + i * scale;
        ctx.beginPath();
        ctx.moveTo(x, centerY - 5);
        ctx.lineTo(x, centerY + 5);
        ctx.stroke();
        ctx.fillText(i.toString(), x, centerY + 20);
      }
    }
    
    // Graduations axe Y
    ctx.textAlign = 'right';
    for (let i = -2; i <= 4; i++) {
      if (i !== 0) {
        const y = centerY - i * scale;
        ctx.beginPath();
        ctx.moveTo(centerX - 5, y);
        ctx.lineTo(centerX + 5, y);
        ctx.stroke();
        ctx.fillText(i.toString(), centerX - 10, y + 4);
      }
    }
    
    // Labels des axes
    ctx.fillStyle = '#1f2937';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('x', width - 30, centerY + 20);
    ctx.fillText('y', centerX + 20, 30);

    // Dessiner la courbe f(x) = x²/2
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 3;
    ctx.beginPath();
    
    for (let x = -4; x <= 4; x += 0.1) {
      const screenX = centerX + x * scale;
      const screenY = centerY - f(x) * scale;
      
      if (x === -4) {
        ctx.moveTo(screenX, screenY);
      } else {
        ctx.lineTo(screenX, screenY);
      }
    }
    ctx.stroke();

    // Calculer les points A et B
    const pointA = { x: a, y: f(a) };
    const pointB = { x: a + h, y: f(a + h) };
    
    const screenAX = centerX + pointA.x * scale;
    const screenAY = centerY - pointA.y * scale;
    const screenBX = centerX + pointB.x * scale;
    const screenBY = centerY - pointB.y * scale;

    // Dessiner les points A et B
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(screenAX, screenAY, 8, 0, 2 * Math.PI);
    ctx.fill();
    
    ctx.fillStyle = '#10b981';
    ctx.beginPath();
    ctx.arc(screenBX, screenBY, 8, 0, 2 * Math.PI);
    ctx.fill();

    // Labels des points avec coordonnées symboliques
    ctx.fillStyle = '#1f2937';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'right';
    ctx.fillText('A(a, f(a))', screenAX - 10, screenAY - 10);
    ctx.textAlign = 'left';
    ctx.fillText('B(a+h, f(a+h))', screenBX + 10, screenBY - 10);

    // Dessiner Δx et Δy avant la sécante
    // Dessiner Δx (ligne horizontale)
    ctx.strokeStyle = '#16a34a';
    ctx.lineWidth = 3;
    ctx.setLineDash([8, 4]);
    ctx.beginPath();
    ctx.moveTo(screenAX, screenAY);
    ctx.lineTo(screenBX, screenAY);
    ctx.stroke();
    
    // Label Δx
    ctx.fillStyle = '#16a34a';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Δx = h', (screenAX + screenBX) / 2, screenAY + 25);
    
    // Dessiner Δy (ligne verticale)
    ctx.strokeStyle = '#dc2626';
    ctx.lineWidth = 3;
    ctx.setLineDash([8, 4]);
    ctx.beginPath();
    ctx.moveTo(screenBX, screenAY);
    ctx.lineTo(screenBX, screenBY);
    ctx.stroke();
    
    // Label Δy
    ctx.fillStyle = '#dc2626';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('Δy = f(a+h) - f(a)', screenBX + 15, (screenAY + screenBY) / 2);

    // Dessiner la sécante AB
    ctx.strokeStyle = '#9333ea';
    ctx.lineWidth = 4;
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.moveTo(screenAX, screenAY);
    ctx.lineTo(screenBX, screenBY);
    ctx.stroke();

    // Coefficient directeur de la sécante
    const coefficient = (pointB.y - pointA.y) / (pointB.x - pointA.x);
    
    // Afficher le coefficient directeur
    ctx.fillStyle = '#9333ea';
    ctx.font = 'bold 18px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(
      `Coefficient directeur = ${coefficient.toFixed(3)}`,
      centerX,
      50
    );
    
    // Si h est petit, dessiner la tangente
    if (showTangent || h < 0.15) {
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 4;
      ctx.setLineDash([]);
      ctx.beginPath();
      
      // Tangente : y - f(a) = f'(a)(x - a)
      // f'(x) = x pour f(x) = x²/2
      const derivative = a; // f'(a) = a
      const tangentY1 = f(a) + derivative * (-2 - a);
      const tangentY2 = f(a) + derivative * (2 - a);
      
      ctx.moveTo(centerX + (-2) * scale, centerY - tangentY1 * scale);
      ctx.lineTo(centerX + (2) * scale, centerY - tangentY2 * scale);
      ctx.stroke();
      
      // Label tangente
      ctx.fillStyle = '#f59e0b';
      ctx.font = 'bold 18px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('TANGENTE', centerX, height - 30);
      ctx.fillText(`f'(${a}) = ${derivative.toFixed(3)}`, centerX, height - 10);
    }
    
    // Afficher la valeur de h
    ctx.fillStyle = '#1f2937';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`h = ${h.toFixed(2)}`, 20, 30);
    
    // Message explicatif
    if (h > 0.2) {
      ctx.fillStyle = '#6b7280';
      ctx.font = '14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('La sécante relie les points A et B', centerX, height - 60);
    } else {
      ctx.fillStyle = '#059669';
      ctx.font = 'bold 14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Quand h → 0, la sécante devient la tangente !', centerX, height - 60);
    }
  }, [h, a, showTangent]);

  const startAnimation = () => {
    setIsAnimating(true);
    setShowTangent(false);
    setH(0.8);
  };

  const resetAnimation = () => {
    setIsAnimating(false);
    setShowTangent(false);
    setH(0.8);
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-500 to-blue-600 text-white p-6 rounded-2xl">
        <h3 className="text-xl font-bold mb-3">Animation Interactive</h3>
        <p className="text-lg">
          Voyez comment la sécante devient tangente quand h tend vers 0 !
        </p>
      </div>

      <div className="bg-white p-6 rounded-xl border-2 border-gray-300">
        <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
          🎬 Transformation Sécante → Tangente
        </h3>
        
        <div className="text-center space-y-4 mb-6">
          <button
            onClick={startAnimation}
            disabled={isAnimating}
            className={`px-6 py-3 rounded-xl font-bold text-lg transition-all transform hover:scale-110 shadow-2xl border-4 mr-4 ${
              isAnimating
                ? 'bg-gray-400 text-gray-600 cursor-not-allowed border-gray-300'
                : 'bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white border-green-300'
            }`}
          >
            <Play className="h-5 w-5 inline mr-2" />
            {isAnimating ? 'ANIMATION EN COURS...' : 'DÉMARRER L\'ANIMATION'}
          </button>
          
          <button
            onClick={resetAnimation}
            className="px-6 py-3 rounded-xl font-bold text-lg transition-all transform hover:scale-110 shadow-2xl border-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-blue-300"
          >
            <RotateCcw className="h-5 w-5 inline mr-2" />
            RESET
          </button>
        </div>
      </div>

      {/* Canvas d'illustration */}
      <div className="bg-gray-50 rounded-2xl p-4 mb-6 relative">
        <canvas
          ref={canvasRef}
          width={600}
          height={400}
          className="w-full max-w-3xl mx-auto border-2 border-gray-300 rounded-xl bg-white"
        />
      </div>

      {/* Contrôles pour exploration manuelle */}
      <div className="bg-blue-50 p-4 rounded-xl mb-6">
        <h4 className="font-bold text-blue-800 mb-3 text-center">⚙️ Explore par toi-même</h4>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Point A : x = {a}
            </label>
            <input
              type="range"
              min="0.2"
              max="2.5"
              step="0.1"
              value={a}
              onChange={(e) => setA(parseFloat(e.target.value))}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Distance h = {h.toFixed(2)}
            </label>
            <input
              type="range"
              min="0.1"
              max="3"
              step="0.1"
              value={h}
              onChange={(e) => setH(parseFloat(e.target.value))}
              className="w-full"
            />
          </div>
        </div>
        
        <div className="mt-4 bg-white p-4 rounded-lg">
          <div className="text-center">
            <div className="text-lg font-bold text-gray-800 mb-2">Résultat du calcul :</div>
            <div className="text-2xl font-mono text-purple-600">
              {((f(a + h) - f(a)) / h).toFixed(3)}
            </div>
            <div className="text-sm text-gray-600 mt-1">
              = coefficient directeur de la sécante AB
            </div>
            <div className="text-sm text-purple-600 mt-1 font-semibold">
              = dérivée en a quand les 2 points sont presque confondus
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function DefinitionDerivePage() {
  const sections = [
    {
      id: 'intro',
      title: 'LA DÉRIVÉE = COEFFICIENT DIRECTEUR DE LA TANGENTE 🎯',
      icon: '🔍',
      content: (
        <div className="space-y-8">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl p-8 shadow-xl text-white">
            <div className="text-center">
              <div className="text-6xl mb-6">🎯</div>
              <h1 className="text-4xl font-bold mb-6">
                LA DÉRIVÉE = COEFFICIENT DIRECTEUR DE LA TANGENTE
              </h1>
              <div className="text-2xl mb-6">
                Quand la distance entre 2 points tend vers 0
              </div>
              
              <div className="bg-white/20 p-6 rounded-2xl mb-6">
                <div className="flex items-center justify-center text-4xl font-bold mb-4">
                  <span>f'(a) = </span>
                  <div className="flex flex-col items-center mx-3">
                    <span className="text-2xl">lim</span>
                    <span className="text-lg">h→0</span>
                  </div>
                  <div className="flex flex-col items-center mx-3">
                    <span className="border-b-2 border-white pb-1">f(a + h) - f(a)</span>
                    <span className="text-2xl mt-2">h</span>
                  </div>
                </div>
                <div className="text-xl text-blue-100">
                  La dérivée en un point = pente de la tangente en ce point
                </div>
              </div>
              
              <div className="text-lg text-blue-100">
                📐 Nous allons voir comment cette limite transforme une <strong>sécante</strong> en <strong>tangente</strong>
              </div>
            </div>
          </div>
        </div>
      ),
      xpReward: 10
    },
    {
      id: 'animation',
      title: 'Animation Interactive 🎬',
      icon: '🎥',
      content: (
        <div className="space-y-6">
          <DerivativeAnimation />
        </div>
      ),
      xpReward: 25
    },
    {
      id: 'recapitulatif',
      title: 'Récapitulatif 📐',
      icon: '📋',
      content: (
        <div className="space-y-8">
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-200">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                📐 Récapitulatif
              </h2>
            </div>

            {/* Taux d'accroissement */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-center text-gray-800 mb-4">
                📊 Le Taux d'Accroissement
              </h3>
              <div className="bg-gradient-to-r from-green-100 to-blue-100 p-6 rounded-2xl border-2 border-green-300">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-700 mb-4">
                    τ = <span className="mx-4">
                      <span className="border-b-2 border-green-500 pb-1">f(a + h) - f(a)</span>
                      <div className="text-2xl mt-2">h</div>
                    </span>
                  </div>
                  <div className="text-lg text-gray-700 font-medium">
                    <strong>C'est le taux d'accroissement</strong> entre deux points de la courbe
                  </div>
                </div>
              </div>
            </div>

            {/* Dérivée */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-center text-gray-800 mb-4">
                🎯 La Dérivée
              </h3>
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-2xl">
                <div className="text-center">
                  <div className="text-white text-3xl font-bold mb-4">
                    f'(a) = lim<sub className="text-xl">h→0</sub> 
                    <span className="mx-4">
                      <span className="border-b-2 border-white pb-1">f(a + h) - f(a)</span>
                      <div className="text-2xl mt-2">h</div>
                    </span>
                  </div>
                  <div className="text-blue-100 text-lg font-medium">
                    <strong>C'est le taux d'accroissement quand h tend vers 0</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
      xpReward: 15
    }
  ];

  return (
    <ChapterLayout 
      title="Définition de la Dérivée"
      description="Comprendre le concept de dérivée comme limite du taux d'accroissement"
      sections={sections}
      navigation={{
        previous: { href: '/chapitre/nombres-derives-overview', text: 'Vue d\'ensemble' },
        next: { href: '/chapitre/nombres-derives-taux-accroissement', text: 'Taux d\'accroissement' }
      }}
    />
  );
} 