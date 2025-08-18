'use client';

import ChapterCardTextTest from '../../components/chapter/ChapterCardTextTest';

export default function TestTextStylesPage() {
  // 🎯 Données de test
  const testCardSam = {
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

  const textStyles = [
    { 
      key: 'normal', 
      name: 'Normal', 
      description: 'Style par défaut',
      recommendation: 'Transparence 1-4'
    },
    { 
      key: 'bold', 
      name: 'Gras', 
      description: 'Texte plus épais',
      recommendation: 'Transparence 1-6'
    },
    { 
      key: 'extrabold', 
      name: 'Extra Gras', 
      description: 'Texte très épais',
      recommendation: 'Transparence 1-8'
    },
    { 
      key: 'shadow', 
      name: 'Ombre', 
      description: 'Ombre portée',
      recommendation: 'Transparence 1-7'
    },
    { 
      key: 'outline', 
      name: 'Contour', 
      description: 'Contour blanc',
      recommendation: 'Transparence 1-10'
    },
    { 
      key: 'background', 
      name: 'Fond coloré', 
      description: 'Arrière-plan semi-transparent',
      recommendation: 'Transparence 1-10'
    }
  ] as const;

  const transparencyLevels = [3, 6, 9]; // Niveaux de test représentatifs

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🔤 Test Styles de Texte
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Comparaison des différents styles de texte pour améliorer la lisibilité avec les images de fond
          </p>
        </div>

        {/* Comparaison par style de texte */}
        <div className="space-y-16">
          {textStyles.map((style) => (
            <div key={style.key} className="bg-white rounded-xl shadow-lg p-8">
              
              {/* Header du style */}
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                  {style.name}
                </h2>
                <p className="text-gray-600 text-lg mb-2">{style.description}</p>
                <div className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                  💡 {style.recommendation}
                </div>
              </div>

              {/* Test avec différents niveaux de transparence */}
              <div className="space-y-12">
                {transparencyLevels.map((transparency) => (
                  <div key={`${style.key}-${transparency}`} className="bg-gray-50 rounded-xl p-6">
                    <div className="text-center mb-6">
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">
                        Transparence niveau {transparency}/10
                      </h3>
                      <div className="max-w-md mx-auto">
                        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden border">
                          <div 
                            className="bg-gradient-to-r from-blue-500 to-purple-500 h-full rounded-full"
                            style={{ width: `${transparency * 10}%` }}
                          />
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          {transparency <= 3 && "Léger"}
                          {transparency >= 4 && transparency <= 7 && "Équilibré"}
                          {transparency >= 8 && "Fort"}
                        </div>
                      </div>
                    </div>
                    
                    {/* Comparaison Horizontal vs Vertical */}
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
                      
                      {/* Format Horizontal */}
                      <div className="space-y-4">
                        <h4 className="text-lg font-semibold text-gray-800 text-center border-b border-gray-200 pb-2">
                          🔄 Format Horizontal
                        </h4>
                        <div className="space-y-3">
                          <ChapterCardTextTest 
                            config={testCardSam}
                            transparencyLevel={transparency}
                            textStyle={style.key as any}
                            format="horizontal"
                          />
                          <ChapterCardTextTest 
                            config={testCardMinecraft}
                            transparencyLevel={transparency}
                            textStyle={style.key as any}
                            format="horizontal"
                          />
                        </div>
                      </div>

                      {/* Format Vertical */}
                      <div className="space-y-4">
                        <h4 className="text-lg font-semibold text-gray-800 text-center border-b border-gray-200 pb-2">
                          📱 Format Vertical
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 justify-items-center">
                          <ChapterCardTextTest 
                            config={testCardSam}
                            transparencyLevel={transparency}
                            textStyle={style.key as any}
                            format="vertical"
                          />
                          <ChapterCardTextTest 
                            config={testCardMinecraft}
                            transparencyLevel={transparency}
                            textStyle={style.key as any}
                            format="vertical"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Évaluation de la lisibilité */}
                    <div className="mt-6 bg-white rounded-lg p-4">
                      <h5 className="font-semibold text-gray-800 mb-2">📊 Lisibilité niveau {transparency} :</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <span className="text-blue-600">🔄 Horizontal:</span>
                          {(style.key === 'normal' && transparency > 6) && <span className="text-red-600">❌ Difficile à lire</span>}
                          {(style.key === 'bold' && transparency > 7) && <span className="text-orange-600">⚠️ Attention</span>}
                          {(style.key === 'extrabold' && transparency > 8) && <span className="text-orange-600">⚠️ Attention</span>}
                          {(['shadow', 'outline', 'background'].includes(style.key) || transparency <= 6) && <span className="text-green-600">✅ Lisible</span>}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-purple-600">📱 Vertical:</span>
                          {(style.key === 'normal' && transparency > 5) && <span className="text-red-600">❌ Difficile à lire</span>}
                          {(style.key === 'bold' && transparency > 6) && <span className="text-orange-600">⚠️ Attention</span>}
                          {(style.key === 'extrabold' && transparency > 7) && <span className="text-orange-600">⚠️ Attention</span>}
                          {(['shadow', 'outline', 'background'].includes(style.key) || transparency <= 5) && <span className="text-green-600">✅ Lisible</span>}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Recommandations finales */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-8 mt-16">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">🏆 Mes recommandations</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/70 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-green-700 mb-4">🥇 Meilleur choix</h3>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li>• <strong>Style "Contour"</strong> : Lisible jusqu'à transparence 10</li>
                <li>• <strong>Style "Fond coloré"</strong> : Très lisible, moderne</li>
                <li>• Fonctionne sur tous les niveaux</li>
              </ul>
            </div>
            
            <div className="bg-white/70 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-700 mb-4">🥈 Bon compromis</h3>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li>• <strong>Style "Extra Gras"</strong> : Jusqu'à transparence 8</li>
                <li>• <strong>Style "Ombre"</strong> : Jusqu'à transparence 7</li>
                <li>• Bon équilibre esthétique</li>
              </ul>
            </div>
            
            <div className="bg-white/70 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-orange-700 mb-4">⚠️ À éviter</h3>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li>• <strong>Style "Normal"</strong> : Seulement transparence 1-4</li>
                <li>• <strong>Style "Gras"</strong> : Limité à transparence 1-6</li>
                <li>• Problèmes de lisibilité</li>
              </ul>
            </div>
          </div>

          <div className="text-center mt-6 p-4 bg-white/50 rounded-lg">
            <p className="text-gray-800 font-medium">
              🎯 <strong>Ma recommandation finale :</strong> Style "Contour" ou "Fond coloré" avec transparence 6-8
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="text-center mt-8">
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
              🎨 Retour aux cartes
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

