'use client';

import ChapterCardPersonnageHorizontal from '../../components/chapter/ChapterCardPersonnageHorizontal';
import ChapterCardVertical from '../../components/chapter/ChapterCardVertical';

export default function TestHorizontalVerticalPage() {
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

  const transparencyLevels = [
    { level: 2, name: 'Très subtil', description: 'Lisibilité maximale' },
    { level: 4, name: 'Léger', description: 'Bon équilibre' },
    { level: 6, name: 'Équilibré', description: 'Recommandé' },
    { level: 8, name: 'Visible', description: 'Esthétique' },
    { level: 10, name: 'Maximum', description: 'Attention lisibilité' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🔄 Horizontale vs Verticale
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Comparaison directe des formats Horizontal et Vertical avec différents niveaux de transparence
          </p>
        </div>

        {/* Comparaison par niveau de transparence */}
        <div className="space-y-16">
          {transparencyLevels.map((transparency) => (
            <div key={transparency.level} className="bg-white rounded-xl shadow-lg p-8">
              
              {/* Header du niveau */}
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                  Niveau {transparency.level}/10 - {transparency.name}
                </h2>
                <p className="text-gray-600 text-lg">{transparency.description}</p>
                
                {/* Barre de transparence visuelle */}
                <div className="mt-4 max-w-md mx-auto">
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden border">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-full rounded-full transition-all duration-300"
                      style={{ width: `${transparency.level * 10}%` }}
                    />
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    {transparency.level * 10}% d'opacité des images
                  </div>
                </div>
              </div>

              {/* Comparaison Horizontal vs Vertical */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
                
                {/* Format Horizontal */}
                <div className="space-y-6">
                  <h3 className="text-2xl font-semibold text-gray-800 text-center border-b-2 border-blue-200 pb-2">
                    🔄 Format Horizontal
                  </h3>
                  <p className="text-center text-gray-600 text-sm mb-6">
                    Compact • Idéal pour listes • Personnage à gauche
                  </p>
                  
                  <div className="space-y-4">
                    <ChapterCardPersonnageHorizontal 
                      config={testCardSam}
                      transparencyLevel={transparency.level}
                    />
                    <ChapterCardPersonnageHorizontal 
                      config={testCardMinecraft}
                      transparencyLevel={transparency.level}
                    />
                  </div>
                </div>

                {/* Format Vertical */}
                <div className="space-y-6">
                  <h3 className="text-2xl font-semibold text-gray-800 text-center border-b-2 border-purple-200 pb-2">
                    📱 Format Vertical
                  </h3>
                  <p className="text-center text-gray-600 text-sm mb-6">
                    Détaillé • Personnage centré • Plus d'infos
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 justify-items-center">
                    <ChapterCardVertical 
                      config={testCardSam}
                      transparencyLevel={transparency.level}
                    />
                    <ChapterCardVertical 
                      config={testCardMinecraft}
                      transparencyLevel={transparency.level}
                    />
                  </div>
                </div>
              </div>

              {/* Analyse du niveau */}
              <div className="mt-8 bg-gray-50 rounded-lg p-6">
                <h4 className="font-semibold text-gray-800 mb-3">📊 Analyse niveau {transparency.level} :</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h5 className="font-semibold text-blue-700 mb-2">🔄 Horizontal</h5>
                    {transparency.level <= 4 && <p className="text-gray-700">✅ Texte très lisible, images discrètes</p>}
                    {transparency.level >= 5 && transparency.level <= 7 && <p className="text-gray-700">⚖️ Bon équilibre, images visibles</p>}
                    {transparency.level >= 8 && <p className="text-gray-700">⚠️ Images dominantes, vérifier lisibilité</p>}
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4">
                    <h5 className="font-semibold text-purple-700 mb-2">📱 Vertical</h5>
                    {transparency.level <= 4 && <p className="text-gray-700">✅ Parfait pour la lecture, images subtiles</p>}
                    {transparency.level >= 5 && transparency.level <= 7 && <p className="text-gray-700">⚖️ Plus d'espace, images bien intégrées</p>}
                    {transparency.level >= 8 && <p className="text-gray-700">🎨 Très esthétique, attention au contraste</p>}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Recommandations finales */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-8 mt-16">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">💡 Mes recommandations</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white/70 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-blue-700 mb-4">🔄 Format Horizontal</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• <strong>Niveau 2-4</strong> : Parfait pour les listes de chapitres</li>
                <li>• <strong>Niveau 5-6</strong> : Bon compromis esthétique</li>
                <li>• <strong>Avantages</strong> : Compact, économise l'espace vertical</li>
                <li>• <strong>Idéal pour</strong> : Navigation, aperçus rapides</li>
              </ul>
            </div>
            
            <div className="bg-white/70 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-purple-700 mb-4">📱 Format Vertical</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• <strong>Niveau 4-6</strong> : Équilibre parfait</li>
                <li>• <strong>Niveau 7-8</strong> : Très esthétique possible</li>
                <li>• <strong>Avantages</strong> : Plus d'infos, personnage mis en valeur</li>
                <li>• <strong>Idéal pour</strong> : Galeries, sélection de chapitres</li>
              </ul>
            </div>
          </div>

          <div className="text-center mt-6">
            <p className="text-gray-600 font-medium">
              🏆 <strong>Mon choix :</strong> Horizontal niveau 4 pour les listes • Vertical niveau 6 pour les galeries
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="text-center mt-8">
          <p className="text-gray-600 mb-4">
            Quel format et niveau préférez-vous ?
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
            <a
              href="/test-cards"
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors inline-block"
            >
              🎨 Voir tous les formats
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

