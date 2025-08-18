'use client';

import ChapterCardTransparencyTest from '../../components/chapter/ChapterCardTransparencyTest';

export default function TestTransparencyPage() {
  // 🎯 Données de test
  const testCard = {
    id: 'cp-additions-simples',
    title: 'Additions simples',
    description: 'Apprendre à additionner des nombres jusqu\'à 100 avec des méthodes ludiques et progressives',
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
    description: 'Mémoriser les tables de multiplication de 2 à 10 avec des jeux et des astuces',
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🎨 Test Niveaux de Transparence
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Comparez les 10 niveaux de transparence pour trouver le parfait équilibre entre esthétique et lisibilité
          </p>
        </div>

        {/* Guide des niveaux */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">📊 Guide des niveaux :</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
            <div className="text-center">
              <div className="w-full h-4 bg-gradient-to-r from-white/95 to-white/85 rounded mb-2"></div>
              <span className="font-semibold">1-2</span>
              <p className="text-gray-600">Très subtil</p>
            </div>
            <div className="text-center">
              <div className="w-full h-4 bg-gradient-to-r from-white/85 to-white/65 rounded mb-2"></div>
              <span className="font-semibold">3-4</span>
              <p className="text-gray-600">Léger</p>
            </div>
            <div className="text-center">
              <div className="w-full h-4 bg-gradient-to-r from-white/75 to-white/45 rounded mb-2"></div>
              <span className="font-semibold">5-6</span>
              <p className="text-gray-600">Équilibré</p>
            </div>
            <div className="text-center">
              <div className="w-full h-4 bg-gradient-to-r from-white/65 to-white/25 rounded mb-2"></div>
              <span className="font-semibold">7-8</span>
              <p className="text-gray-600">Visible</p>
            </div>
            <div className="text-center">
              <div className="w-full h-4 bg-gradient-to-r from-white/45 to-white/10 rounded mb-2"></div>
              <span className="font-semibold">9-10</span>
              <p className="text-gray-600">Maximum</p>
            </div>
          </div>
        </div>

        {/* Test avec Sam le Pirate (CP) */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            🏴‍☠️ Sam le Pirate - Images : Carte au trésor, Boussole, Coffre, Bateau
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((level) => (
              <div key={`sam-${level}`} className="relative pt-6">
                <ChapterCardTransparencyTest 
                  config={testCard}
                  transparencyLevel={level}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Test avec Minecraft (CE1) */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            🎮 Minecraft - Images : Blocs, Motifs, Paysages, Interface de jeu
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((level) => (
              <div key={`minecraft-${level}`} className="relative pt-6">
                <ChapterCardTransparencyTest 
                  config={testCardMinecraft}
                  transparencyLevel={level}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Recommandations */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">💡 Mes recommandations :</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-white/70 rounded-lg p-4">
              <h3 className="font-semibold text-green-700 mb-2">🟢 Optimal pour la lisibilité</h3>
              <p className="text-gray-700">Niveaux <strong>2-4</strong> : Images subtiles, texte parfaitement lisible</p>
            </div>
            <div className="bg-white/70 rounded-lg p-4">
              <h3 className="font-semibold text-blue-700 mb-2">🔵 Équilibre parfait</h3>
              <p className="text-gray-700">Niveaux <strong>5-6</strong> : Bon compromis esthétique/lisibilité</p>
            </div>
            <div className="bg-white/70 rounded-lg p-4">
              <h3 className="font-semibold text-purple-700 mb-2">🟣 Maximum esthétique</h3>
              <p className="text-gray-700">Niveaux <strong>7-8</strong> : Images bien visibles, attention à la lisibilité</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="text-center">
          <p className="text-gray-600 mb-4">
            Quel niveau préférez-vous ? Testez sur différents écrans (mobile/desktop) !
          </p>
          <button
            onClick={() => {
              localStorage.removeItem('xp-hierarchy');
              window.location.reload();
            }}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            🗑️ Reset XP Data
          </button>
        </div>
      </div>
    </div>
  );
}

