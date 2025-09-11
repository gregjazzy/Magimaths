'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

const VirtualRuler = dynamic(() => import('./VirtualRuler'), {
  ssr: false
});
import { motion } from 'framer-motion';

interface DrawingExerciseProps {
  type: 'straight' | 'curved' | 'broken' | 'dotted';
  onComplete?: (success: boolean) => void;
}

export default function DrawingExercise({ type, onComplete }: DrawingExerciseProps) {
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [showHint, setShowHint] = useState(false);

  // Évaluer la ligne dessinée
  const handleLineDrawn = (start: { x: number; y: number }, end: { x: number; y: number }) => {
    // Calculer l'angle de la ligne
    const angle = Math.atan2(end.y - start.y, end.x - start.x) * (180 / Math.PI);
    
    // Calculer la longueur de la ligne
    const length = Math.sqrt(
      Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2)
    );

    // Évaluer selon le type de ligne
    if (type === 'straight') {
      // Pour une ligne droite, vérifier si elle est assez horizontale/verticale
      const isHorizontal = Math.abs(angle) < 10 || Math.abs(angle) > 170;
      const isVertical = Math.abs(angle - 90) < 10 || Math.abs(angle + 90) < 10;
      
      if (isHorizontal || isVertical) {
        setScore(prev => Math.min(prev + 25, 100));
        setFeedback('Parfait ! Ta ligne est bien droite ! 🌟');
      } else {
        setFeedback('Essaie de faire une ligne plus droite ! 📏');
      }
    }

    // Mettre à jour le score final
    if (score >= 75) {
      onComplete?.(true);
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          {type === 'straight' && '📏 Trace une ligne droite'}
          {type === 'curved' && '🌙 Dessine une ligne courbe'}
          {type === 'broken' && '⚡ Crée une ligne brisée'}
          {type === 'dotted' && '⋯ Fais une ligne pointillée'}
        </h3>
        
        <p className="text-gray-600 mb-4">
          {type === 'straight' && 'Utilise la règle virtuelle pour tracer une ligne parfaitement droite'}
          {type === 'curved' && 'Dessine une belle courbe douce, comme un sourire'}
          {type === 'broken' && 'Trace plusieurs segments qui se touchent avec des angles'}
          {type === 'dotted' && 'Fais des petits traits réguliers avec des espaces'}
        </p>

        {/* Barre de progression */}
        <div className="w-full h-4 bg-gray-200 rounded-full mb-4">
          <motion.div
            className="h-full bg-green-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${score}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>

        {/* Score et feedback */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-gray-600">Score : {score}%</span>
          <span className={`text-sm ${score >= 75 ? 'text-green-600' : 'text-blue-600'}`}>
            {feedback}
          </span>
        </div>
      </div>

      {/* Tutoriel animé */}
      <div className="bg-blue-50 rounded-xl p-4 mb-6">
        <h3 className="text-lg font-bold text-blue-800 mb-2 flex items-center justify-center gap-2">
          <span>👋</span> Comment utiliser la règle virtuelle
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
          <div className="bg-white rounded-lg p-3 flex flex-col items-center">
            <div className="text-3xl mb-2">✋</div>
            <p className="text-center text-blue-700">
              1. Glisse la règle avec ta souris
            </p>
            <p className="text-xs text-blue-500 mt-1">
              Clique et déplace la règle bleue
            </p>
          </div>
          <div className="bg-white rounded-lg p-3 flex flex-col items-center">
            <div className="text-3xl mb-2">🔄</div>
            <p className="text-center text-blue-700">
              2. Fais-la tourner en maintenant le clic
            </p>
            <p className="text-xs text-blue-500 mt-1">
              Garde le clic et bouge la souris
            </p>
          </div>
          <div className="bg-white rounded-lg p-3 flex flex-col items-center">
            <div className="text-3xl mb-2">✏️</div>
            <p className="text-center text-blue-700">
              3. Trace le long du bord
            </p>
            <p className="text-xs text-blue-500 mt-1">
              Clique et glisse près du bord de la règle
            </p>
          </div>
        </div>
      </div>

      {/* Zone de dessin avec règle virtuelle */}
      <VirtualRuler
        width={400}
        height={300}
        onLineDrawn={handleLineDrawn}
      />

      {/* Bouton d'aide */}
      <button
        onClick={() => setShowHint(!showHint)}
        className="mt-4 px-4 py-2 bg-blue-100 text-blue-800 rounded-lg text-sm hover:bg-blue-200 transition-colors"
      >
        💡 Besoin d'aide ?
      </button>

      {/* Astuces */}
      {showHint && (
        <div className="mt-2 p-4 bg-blue-50 rounded-lg text-sm text-blue-800">
          {type === 'straight' && (
            <>
              <p>• Pose bien ta règle avant de commencer</p>
              <p>• Trace d'un seul coup, sans t'arrêter</p>
              <p>• Vérifie que ta ligne est bien parallèle au bord</p>
            </>
          )}
          {type === 'curved' && (
            <>
              <p>• Fais un mouvement souple et continu</p>
              <p>• Évite les angles brusques</p>
              <p>• Imagine que tu dessines un sourire</p>
            </>
          )}
          {type === 'broken' && (
            <>
              <p>• Trace chaque segment avec la règle</p>
              <p>• Change bien de direction à chaque coin</p>
              <p>• Vérifie que les segments se touchent</p>
            </>
          )}
          {type === 'dotted' && (
            <>
              <p>• Fais des traits de même longueur</p>
              <p>• Laisse des espaces réguliers</p>
              <p>• Utilise la règle pour t'aligner</p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
