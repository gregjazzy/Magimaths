'use client';

import { useState } from 'react';
import { motion, AnimatePresence, useDragControls } from 'framer-motion';
import confetti from 'canvas-confetti';

interface DraggableItem {
  id: string;
  type: 'forme' | 'objet';
  content: string;
  shape: string;
  position: { x: number; y: number };
}

interface DragAndDropGameProps {
  onSuccess: () => void;
  playAudio: (text: string) => Promise<void>;
}

export default function DragAndDropGame({ onSuccess, playAudio }: DragAndDropGameProps) {
  const [draggableItems, setDraggableItems] = useState<DraggableItem[]>([
    // Formes
    { id: 'cercle', type: 'forme', content: '⭕', shape: 'cercle', position: { x: 0, y: 0 } },
    { id: 'carre', type: 'forme', content: '⬛', shape: 'carré', position: { x: 0, y: 0 } },
    { id: 'rectangle', type: 'forme', content: '▬', shape: 'rectangle', position: { x: 0, y: 0 } },
    { id: 'triangle', type: 'forme', content: '🔺', shape: 'triangle', position: { x: 0, y: 0 } },
    // Objets
    { id: 'ballon', type: 'objet', content: '⚽', shape: 'cercle', position: { x: 0, y: 0 } },
    { id: 'boite', type: 'objet', content: '📦', shape: 'carré', position: { x: 0, y: 0 } },
    { id: 'livre', type: 'objet', content: '📱', shape: 'rectangle', position: { x: 0, y: 0 } },
    { id: 'montagne', type: 'objet', content: '🏔️', shape: 'triangle', position: { x: 0, y: 0 } },
  ]);
  
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const [matches, setMatches] = useState<{[key: string]: boolean}>({});
  const [showSuccess, setShowSuccess] = useState(false);
  const dragControls = useDragControls();

  const handleDragStart = (itemId: string) => {
    setActiveItem(itemId);
  };

  const handleDragEnd = (event: any, itemId: string) => {
    const draggedItem = draggableItems.find(item => item.id === itemId);
    const dropTargets = draggableItems.filter(item => 
      item.type !== draggedItem?.type && item.shape === draggedItem?.shape
    );

    // Vérifier si l'item a été déposé près d'une cible valide
    const isNearTarget = dropTargets.some(target => {
      const targetElement = document.getElementById(target.id);
      if (targetElement) {
        const rect = targetElement.getBoundingClientRect();
        const distance = Math.sqrt(
          Math.pow(event.clientX - (rect.left + rect.width/2), 2) +
          Math.pow(event.clientY - (rect.top + rect.height/2), 2)
        );
        return distance < 100; // Distance en pixels pour considérer comme "proche"
      }
      return false;
    });

    if (isNearTarget) {
      // Marquer la correspondance comme réussie
      setMatches(prev => ({
        ...prev,
        [draggedItem?.shape || '']: true
      }));

      // Jouer un son de succès
      playAudio('Bravo ! Tu as trouvé la bonne forme !');

      // Vérifier si toutes les correspondances sont faites
      const allMatched = Object.values(matches).every(match => match);
      if (allMatched) {
        setShowSuccess(true);
        onSuccess();
        playAudio('Félicitations ! Tu as trouvé toutes les correspondances !');
      }
    } else {
      // Réinitialiser la position si pas de correspondance
      setDraggableItems(prev => prev.map(item => 
        item.id === itemId ? { ...item, position: { x: 0, y: 0 } } : item
      ));
    }

    setActiveItem(null);
  };

  const resetGame = () => {
    setMatches({});
    setShowSuccess(false);
    setDraggableItems(prev => prev.map(item => ({
      ...item,
      position: { x: 0, y: 0 }
    })));
  };

  return (
    <motion.div 
      className="relative bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-8 mb-8"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <div className="text-xl text-center text-purple-800 font-semibold mb-8">
        Associe chaque forme à un objet qui lui ressemble !
      </div>

      {/* Zone de jeu drag & drop */}
      <div className="relative min-h-[400px] bg-white/50 rounded-xl p-6 border border-white/50">
        {/* Formes géométriques */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-12">
          {draggableItems.filter(item => item.type === 'forme').map((item) => (
            <motion.div
              key={item.id}
              id={item.id}
              drag
              dragControls={dragControls}
              dragMomentum={false}
              onDragStart={() => handleDragStart(item.id)}
              onDragEnd={(event) => handleDragEnd(event, item.id)}
              className={`
                cursor-grab active:cursor-grabbing
                w-20 h-20 flex items-center justify-center
                text-4xl
                bg-white rounded-xl shadow-lg
                transition-all duration-300
                ${matches[item.shape] ? 'ring-4 ring-green-400/50 bg-green-50' : ''}
                ${activeItem === item.id ? 'scale-110 shadow-xl z-50' : ''}
              `}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {item.content}
            </motion.div>
          ))}
        </div>

        {/* Objets du quotidien */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {draggableItems.filter(item => item.type === 'objet').map((item) => (
            <motion.div
              key={item.id}
              id={item.id}
              className={`
                w-20 h-20 flex items-center justify-center
                text-4xl
                bg-white/80 backdrop-blur-sm rounded-xl shadow-lg
                transition-all duration-300
                ${matches[item.shape] ? 'ring-4 ring-green-400/50 bg-green-50' : ''}
              `}
              whileHover={{ scale: 1.05 }}
            >
              {item.content}
            </motion.div>
          ))}
        </div>

        {/* Message de succès */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="absolute inset-0 flex items-center justify-center bg-white/90 backdrop-blur-sm rounded-xl"
            >
              <div className="text-center">
                <motion.div
                  animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, 10, -10, 0]
                  }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                  className="text-6xl mb-4"
                >
                  🎉
                </motion.div>
                <h3 className="text-2xl font-bold text-purple-600 mb-4">
                  Bravo ! Tu es un expert des formes !
                </h3>
                <motion.button
                  onClick={resetGame}
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-3 rounded-xl font-bold shadow-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Rejouer
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
