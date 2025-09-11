'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';

interface DrawingShape {
  name: string;
  guide: (ctx: CanvasRenderingContext2D, width: number, height: number) => void;
  validate: (points: {x: number; y: number}[]) => number;
}

interface DrawingGameProps {
  shapes: DrawingShape[];
  playAudio: (text: string) => Promise<void>;
}

export default function DrawingGame({ shapes, playAudio }: DrawingGameProps) {
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentShape, setCurrentShape] = useState<string | null>(null);
  const [drawingPoints, setDrawingPoints] = useState<{x: number; y: number}[]>([]);
  const [drawingScore, setDrawingScore] = useState(0);
  const [showDrawingGuide, setShowDrawingGuide] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const guideCanvasRef = useRef<HTMLCanvasElement>(null);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = ('touches' in e) ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = ('touches' in e) ? e.touches[0].clientY - rect.top : e.clientY - rect.top;
    
    setDrawingPoints([{ x, y }]);
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.strokeStyle = '#4F46E5';
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !currentShape) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = ('touches' in e) ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = ('touches' in e) ? e.touches[0].clientY - rect.top : e.clientY - rect.top;
    
    setDrawingPoints(prev => [...prev, { x, y }]);
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  };

  const endDrawing = () => {
    setIsDrawing(false);
    if (!currentShape) return;

    const shape = shapes.find(s => s.name === currentShape);
    if (shape) {
      const score = shape.validate(drawingPoints);
      setDrawingScore(score);

      if (score > 70) {
        playAudio('Bravo ! Tu as très bien dessiné cette forme !');
        // Effet de confetti pour une bonne note
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#4F46E5', '#7C3AED', '#EC4899']
        });
      } else if (score > 40) {
        playAudio('Pas mal ! Continue à t\'entraîner !');
      } else {
        playAudio('Essaie encore ! Suis bien les pointillés pour t\'aider.');
      }
    }
  };

  const resetDrawing = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
    setDrawingPoints([]);
    setDrawingScore(0);
  };

  // Effet pour dessiner le guide
  useEffect(() => {
    if (!currentShape || !showDrawingGuide) return;

    const canvas = guideCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const shape = shapes.find(s => s.name === currentShape);
    if (shape) {
      shape.guide(ctx, canvas.width, canvas.height);
    }
  }, [currentShape, showDrawingGuide, shapes]);

  return (
    <motion.div 
      className="relative bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-8 mt-8"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <div className="text-xl text-center text-purple-800 font-semibold mb-8">
        Entraîne-toi à dessiner les formes !
      </div>

      <div className="flex flex-col items-center space-y-6">
        {/* Sélection de la forme */}
        <div className="flex space-x-4">
          {shapes.map(shape => (
            <motion.button
              key={shape.name}
              onClick={() => {
                setCurrentShape(shape.name);
                resetDrawing();
              }}
              className={`
                px-4 py-2 rounded-xl font-medium
                transition-all duration-300
                ${currentShape === shape.name
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg'
                  : 'bg-white/80 text-gray-700 hover:bg-white'
                }
              `}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {shape.name.charAt(0).toUpperCase() + shape.name.slice(1)}
            </motion.button>
          ))}
        </div>

        {/* Zone de dessin */}
        <div className="relative w-full max-w-md aspect-square">
          {/* Canvas de guide */}
          <canvas
            ref={guideCanvasRef}
            className="absolute inset-0 w-full h-full"
            width={400}
            height={400}
          />
          
          {/* Canvas de dessin */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full bg-white/50 rounded-xl border-2 border-white/50"
            width={400}
            height={400}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={endDrawing}
            onMouseLeave={endDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={endDrawing}
          />

          {/* Score et feedback */}
          {drawingScore > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`
                absolute top-4 right-4
                px-4 py-2 rounded-full
                font-bold text-white
                ${drawingScore > 70 ? 'bg-green-500' : drawingScore > 40 ? 'bg-yellow-500' : 'bg-red-500'}
              `}
            >
              {drawingScore}%
            </motion.div>
          )}
        </div>

        {/* Contrôles */}
        <div className="flex space-x-4">
          <motion.button
            onClick={resetDrawing}
            className="px-4 py-2 bg-gray-500 text-white rounded-xl font-medium"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Effacer
          </motion.button>
          <motion.button
            onClick={() => setShowDrawingGuide(!showDrawingGuide)}
            className={`
              px-4 py-2 rounded-xl font-medium
              ${showDrawingGuide
                ? 'bg-purple-500 text-white'
                : 'bg-white text-purple-500'
              }
            `}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {showDrawingGuide ? 'Masquer le guide' : 'Afficher le guide'}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
