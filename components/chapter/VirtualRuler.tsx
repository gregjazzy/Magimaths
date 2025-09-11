'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Move, RotateCw, Pencil } from 'lucide-react';

interface VirtualRulerProps {
  width?: number;
  height?: number;
  onLineDrawn?: (start: { x: number; y: number }, end: { x: number; y: number }) => void;
}

export default function VirtualRuler({ 
  width = 600, 
  height = 400,
  onLineDrawn 
}: VirtualRulerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [lineType, setLineType] = useState<'line' | 'curve' | 'zigzag' | 'dots'>('line');
  const [mode, setMode] = useState<'move' | 'rotate' | 'draw'>('move');
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [rotation, setRotation] = useState(0);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState<{ x: number; y: number } | null>(null);
  const [endPoint, setEndPoint] = useState<{ x: number; y: number } | null>(null);
  const [drawnLines, setDrawnLines] = useState<Array<{ start: { x: number; y: number }, end: { x: number; y: number } }>>([]);

  const handleRulerDrag = (event: any, info: any) => {
    setPosition({ x: info.point.x, y: info.point.y });
  };

  const handleDrawStart = (event: React.MouseEvent) => {
    if (!containerRef.current || mode !== 'draw') return;
    const rect = containerRef.current.getBoundingClientRect();
    setStartPoint({ 
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    });
    setIsDrawing(true);
  };

  const handleDrawMove = (event: React.MouseEvent) => {
    if (!isDrawing || !startPoint || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    setEndPoint({ x, y });
  };

  const handleDrawEnd = () => {
    if (startPoint && endPoint) {
      setDrawnLines([...drawnLines, { start: startPoint, end: endPoint }]);
      onLineDrawn?.(startPoint, endPoint);
    }
    setIsDrawing(false);
    setStartPoint(null);
    setEndPoint(null);
  };

  return (
    <div 
      ref={containerRef}
      className="relative bg-white p-6 rounded-lg h-[500px]"
      onMouseMove={handleDrawMove}
      onMouseUp={handleDrawEnd}
      onMouseLeave={handleDrawEnd}
    >
      <div className="absolute top-4 right-4 flex gap-2">
        <button
          onClick={() => setLineType('line')}
          className={`p-2 rounded-lg ${lineType === 'line' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
        >
          📏 Droite
        </button>
        <button
          onClick={() => setLineType('curve')}
          className={`p-2 rounded-lg ${lineType === 'curve' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
        >
          🌙 Courbe
        </button>
        <button
          onClick={() => setLineType('zigzag')}
          className={`p-2 rounded-lg ${lineType === 'zigzag' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
        >
          ⚡ Brisée
        </button>
        <button
          onClick={() => setLineType('dots')}
          className={`p-2 rounded-lg ${lineType === 'dots' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
        >
          ⋯ Pointillés
        </button>
      </div>

      <div className="absolute top-4 left-4 flex gap-2 bg-white rounded-lg shadow p-1">
        <button
          onClick={() => setMode('move')}
          className={`p-2 rounded ${mode === 'move' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100'}`}
        >
          <Move className="w-5 h-5" />
        </button>
        <button
          onClick={() => setMode('rotate')}
          className={`p-2 rounded ${mode === 'rotate' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100'}`}
        >
          <RotateCw className="w-5 h-5" />
        </button>
        <button
          onClick={() => setMode('draw')}
          className={`p-2 rounded ${mode === 'draw' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100'}`}
        >
          <Pencil className="w-5 h-5" />
        </button>
      </div>

      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {drawnLines.map((line, index) => (
          <line
            key={index}
            x1={line.start.x}
            y1={line.start.y}
            x2={line.end.x}
            y2={line.end.y}
            stroke="#2563eb"
            strokeWidth="2"
          />
        ))}
        {isDrawing && startPoint && endPoint && (
          <line
            x1={startPoint.x}
            y1={startPoint.y}
            x2={endPoint.x}
            y2={endPoint.y}
            stroke="#2563eb"
            strokeWidth="2"
            strokeDasharray="4"
          />
        )}
      </svg>

      <motion.div
        className="absolute"
        style={{
          width: '200px',
          height: '40px',
          backgroundColor: 'rgba(59, 130, 246, 0.2)',
          border: '2px solid #3b82f6',
          borderRadius: '4px',
          x: position.x,
          y: position.y,
          rotate: rotation
        }}
        drag={mode === 'move'}
        dragMomentum={false}
        onDrag={handleRulerDrag}
        onMouseDown={mode === 'draw' ? handleDrawStart : undefined}
      >
        {mode === 'rotate' && (
          <button
            className="absolute -top-12 left-1/2 transform -translate-x-1/2 w-10 h-10 bg-blue-500 rounded-full text-white"
            onClick={() => setRotation(prev => (prev + 90) % 360)}
          >
            <RotateCw className="w-6 h-6" />
          </button>
        )}

        {mode === 'draw' && (
          <div className="absolute left-0 top-0 bottom-0 w-16 bg-green-200 opacity-30" />
        )}

        {Array.from({ length: 21 }).map((_, i) => (
          <div
            key={i}
            className="absolute bg-blue-500"
            style={{
              left: `${(i / 20) * 100}%`,
              width: '1px',
              height: i % 5 === 0 ? '16px' : '8px'
            }}
          />
        ))}
      </motion.div>
    </div>
  );
}