'use client';

import { useState } from 'react';
import ChapterCardSquare from '../../components/chapter/ChapterCardSquare';
import ChapterCardVertical from '../../components/chapter/ChapterCardVertical';
import ChapterCardMini from '../../components/chapter/ChapterCardMini';
import ChapterCardLarge from '../../components/chapter/ChapterCardLarge';
import ChapterCardCircular from '../../components/chapter/ChapterCardCircular';
import ChapterCardPersonnageHorizontal from '../../components/chapter/ChapterCardPersonnageHorizontal';

export default function TestFormatsPage() {
  const [selectedTransparency, setSelectedTransparency] = useState(5);

  // 🎯 Données de test
  const testCardSam = {
    id: 'cp-additions-simples',
    title: 'Additions simples',
    description: 'Apprendre à additionner des nombres jusqu\'à 100 avec des méthodes ludiques et progressives pour développer les compétences mathématiques de base',
    level: 'CP' as const,
    icon: '🧮',
    estimatedDuration: '2h',
    difficulty: 'Facile' as const,
    subChapters: ['problemes', 'calcul-pose', 'sens'],
    isLocked: false,
    character: {
      name: 'sam-pirate',
      image: '/image/pirate-small.png',
      expressions: ['Mille sabords !', 'Tonnerre de Brest !', 'En avant moussaillon !']
    }
  };

  const testCardMinecraft = {
    id: 'ce1-multiplications',
    title: 'Tables de multiplication',
    description: 'Mémoriser les tables de multiplication de 2 à 10 avec des jeux et des astuces pour maîtriser parfaitement ces opérations essentielles',
    level: 'CE1' as const,
    icon: '✖️',
    estimatedDuration: '3h',
    difficulty: 'Difficile' as const,
    subChapters: ['table-2', 'table-5', 'table-10', 'problemes'],
    isLocked: false,
    character: {
      name: 'minecraft',
      image: '/image/Minecraftstyle.png',
      expressions: ['Super !', 'Génial !', 'On y va !']
    }
  };

  // 🎮 Simuler des données XP pour le test
  const simulateXpData = () => {
    const mockXpData = {
      "cp": {
        "cp-additions-simples": {
          "problemes": { xp: 800, maxXp: 1000, completed: true },
          "calcul-pose": { xp: 600, maxXp: 1000, completed: false },
          "sens": { xp: 0, maxXp: 1000, completed: false }
        }
      },
      "ce1": {
        "ce1-multiplications": {
          "table-2": { xp: 1000, maxXp: 1000, completed: true },
          "table-5": { xp: 750, maxXp: 1000, completed: false },
          "table-10": { xp: 0, maxXp: 1000, completed: false },
          "problemes": { xp: 0, maxXp: 1000, completed: false }
        }
      }
    };

    localStorage.setItem('xp-hierarchy', JSON.stringify(mockXpData));
  };

  // Simuler les données au chargement
  if (typeof window !== 'undefined') {
    simulateXpData();
  }

  const formats = [
    { name: 'Horizontale (Original)', component: ChapterCardPersonnageHorizontal, description: 'Format compact horizontal avec personnage' },
    { name: 'Carrée', component: ChapterCardSquare, description: 'Format carré équilibré' },
    { name: 'Verticale', component: ChapterCardVertical, description: 'Format vertical avec plus de détails' },
    { name: 'Mini', component: ChapterCardMini, description: 'Format très compact pour listes' },
    { name: 'Large', component: ChapterCardLarge, description: 'Format étendu avec toutes les infos' },
    { name: 'Circulaire', component: ChapterCardCircular, description: 'Format avec progression circulaire' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🎨 Test Formats de Cartes
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-6">
            Comparez tous les formats de cartes avec différents niveaux de transparence
          </p>
          
          {/* Contrôle de transparence */}
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-2xl mx-auto">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">🎛️ Niveau de transparence</h2>
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-600">Subtil</span>
              <input
                type="range"
                min="1"
                max="10"
                value={selectedTransparency}
                onChange={(e) => setSelectedTransparency(Number(e.target.value))}
                className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-sm font-medium text-gray-600">Maximum</span>
              <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold min-w-[60px] text-center">
                {selectedTransparency}/10
              </div>
            </div>
          </div>
        </div>

        {/* Comparaison des formats */}
        <div className="space-y-12">
          {formats.map((format, index) => (
            <div key={format.name} className="bg-white rounded-xl shadow-lg p-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  {index + 1}. {format.name}
                </h2>
                <p className="text-gray-600">{format.description}</p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
                {/* Sam le Pirate */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-700 text-center">
                    🏴‍☠️ Sam le Pirate (CP)
                  </h3>
                  <div className="flex justify-center">
                    <format.component 
                      config={testCardSam}
                      transparencyLevel={selectedTransparency}
                    />
                  </div>
                </div>
                
                {/* Minecraft */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-700 text-center">
                    🎮 Minecraft (CE1)
                  </h3>
                  <div className="flex justify-center">
                    <format.component 
                      config={testCardMinecraft}
                      transparencyLevel={selectedTransparency}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Guide des transparences */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mt-12">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">📊 Guide des niveaux de transparence</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
            <div className="text-center">
              <div className="w-full h-4 bg-gradient-to-r from-white/95 to-white/85 rounded mb-2 border"></div>
              <span className="font-semibold">1-2</span>
              <p className="text-gray-600">Très subtil</p>
              <p className="text-xs text-gray-500">Lisibilité maximale</p>
            </div>
            <div className="text-center">
              <div className="w-full h-4 bg-gradient-to-r from-white/85 to-white/65 rounded mb-2 border"></div>
              <span className="font-semibold">3-4</span>
              <p className="text-gray-600">Léger</p>
              <p className="text-xs text-gray-500">Bon équilibre</p>
            </div>
            <div className="text-center">
              <div className="w-full h-4 bg-gradient-to-r from-white/75 to-white/45 rounded mb-2 border"></div>
              <span className="font-semibold">5-6</span>
              <p className="text-gray-600">Équilibré</p>
              <p className="text-xs text-gray-500">Recommandé</p>
            </div>
            <div className="text-center">
              <div className="w-full h-4 bg-gradient-to-r from-white/65 to-white/25 rounded mb-2 border"></div>
              <span className="font-semibold">7-8</span>
              <p className="text-gray-600">Visible</p>
              <p className="text-xs text-gray-500">Esthétique</p>
            </div>
            <div className="text-center">
              <div className="w-full h-4 bg-gradient-to-r from-white/45 to-white/10 rounded mb-2 border"></div>
              <span className="font-semibold">9-10</span>
              <p className="text-gray-600">Maximum</p>
              <p className="text-xs text-gray-500">Attention lisibilité</p>
            </div>
          </div>
        </div>

        {/* Recommandations par format */}
        <div className="bg-white rounded-xl shadow-lg p-6 mt-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">💡 Mes recommandations par format</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="font-semibold text-blue-700 mb-2">🔵 Formats compacts (Mini, Horizontale)</h3>
              <p className="text-gray-700">Niveaux <strong>2-4</strong> : Privilégier la lisibilité</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <h3 className="font-semibold text-green-700 mb-2">🟢 Formats moyens (Carrée, Verticale)</h3>
              <p className="text-gray-700">Niveaux <strong>4-6</strong> : Bon équilibre possible</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <h3 className="font-semibold text-purple-700 mb-2">🟣 Formats larges (Large, Circulaire)</h3>
              <p className="text-gray-700">Niveaux <strong>5-8</strong> : Plus d'espace pour l'esthétique</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="text-center mt-8">
          <p className="text-gray-600 mb-4">
            Testez sur différents écrans et choisissez votre format préféré !
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => {
                localStorage.removeItem('xp-hierarchy');
                window.location.reload();
              }}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              🗑️ Reset XP Data
            </button>
            <button
              onClick={() => setSelectedTransparency(5)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              🎯 Transparence par défaut (5)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

