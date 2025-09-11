'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, XCircle, RotateCcw, Minus, MoreHorizontal, Waves, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { Move, RotateCw, Pencil } from 'lucide-react';

// Composant de dessin unifié
function DrawingZone({ onComplete }: { onComplete: (success: boolean, type: string) => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [lineType, setLineType] = useState<'straight' | 'curved' | 'broken' | 'dotted'>('straight');
  const [mode, setMode] = useState<'move' | 'rotate' | 'draw'>('move');
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [rotation, setRotation] = useState(0);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tutorialStep, setTutorialStep] = useState<'move' | 'rotate' | 'draw' | null>('move');
  const [isPlayingDemo, setIsPlayingDemo] = useState(false);
  const [isPlayingVocalDemo, setIsPlayingVocalDemo] = useState(false);
  const demoCanvasRef = useRef<HTMLCanvasElement>(null);
  const demoTimeoutRef = useRef<NodeJS.Timeout>();
  const demoAudioRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Fonction pour jouer l'audio de la démo
  const playDemoAudio = (text: string): Promise<void> => {
    return new Promise((resolve) => {
      const synth = window.speechSynthesis;
      const voices = synth.getVoices();
      const frenchVoice = voices.find(voice => 
        voice.lang.startsWith('fr') && 
        (voice.name.includes('Thomas') || voice.name.includes('Amélie') || voice.name.includes('Daniel'))
      ) || voices.find(voice => voice.lang.startsWith('fr'));

      if (synth) {
        const utterance = new SpeechSynthesisUtterance(text);
        if (frenchVoice) {
          utterance.voice = frenchVoice;
        }
        utterance.rate = 0.9;
        utterance.pitch = 1;
        utterance.volume = 1;
        
        demoAudioRef.current = utterance;
        
        utterance.onend = () => {
          setIsPlayingVocalDemo(false);
          resolve();
        };
        
        utterance.onerror = () => {
          setIsPlayingVocalDemo(false);
          resolve();
        };
        
        setIsPlayingVocalDemo(true);
        synth.speak(utterance);
      } else {
        resolve();
      }
    });
  };
  
  // Fonction pour jouer la démonstration
  const playDemo = async () => {
    if (!demoCanvasRef.current || isPlayingDemo) return;
    setIsPlayingDemo(true);
      const ctx = demoCanvasRef.current.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    // Nettoyer le canvas
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    
    // Étape 1 : Déplacer la règle
    await playDemoAudio("D'abord, on place la règle où on veut tracer.");
    // Animation de la règle qui se déplace
    let rulerX = 50;
    const moveRuler = () => {
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      
      // Dessiner les contrôles
      ctx.fillStyle = '#3b82f6';
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      
      // Bouton déplacer (surligné)
      ctx.beginPath();
      ctx.arc(50, 50, 20, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#ffffff';
      ctx.font = '20px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('↔️', 50, 50);

      // Bouton rotation
      ctx.fillStyle = '#e5e7eb';
      ctx.beginPath();
      ctx.arc(100, 50, 20, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#4b5563';
      ctx.fillText('↻', 100, 50);

      // Bouton dessin
      ctx.fillStyle = '#e5e7eb';
      ctx.beginPath();
      ctx.arc(150, 50, 20, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#4b5563';
      ctx.fillText('✏️', 150, 50);

      // Dessiner la règle
      ctx.fillStyle = 'rgba(59, 130, 246, 0.2)';
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 2;
      ctx.fillRect(rulerX, 150, 400, 60);
      ctx.strokeRect(rulerX, 150, 400, 60);
      rulerX += 2;
      if (rulerX < 100) {
        demoTimeoutRef.current = setTimeout(moveRuler, 16);
      }
    };
    moveRuler();
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Étape 2 : Tourner la règle
    await playDemoAudio("Ensuite, on tourne la règle si besoin.");
    let angle = 0;
    let rotationStep = 0; // Pour suivre l'étape de rotation
    
    const rotateRuler = () => {
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      
      // Dessiner les contrôles
      ctx.fillStyle = '#e5e7eb';
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      
      // Bouton déplacer (inactif)
      ctx.beginPath();
      ctx.arc(50, 50, 20, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#9ca3af';
      ctx.font = '20px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('↔️', 50, 50);

      // Bouton rotation (actif avec animation)
      const rotationButtonColor = Math.sin(Date.now() / 200) > 0 ? '#3b82f6' : '#60a5fa';
      ctx.fillStyle = rotationButtonColor;
      ctx.beginPath();
      ctx.arc(100, 50, 20, 0, 2 * Math.PI);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.fillStyle = '#ffffff';
      ctx.fillText('↻', 100, 50);
      
      // Ajouter une flèche pointant vers le bouton de rotation
      ctx.beginPath();
      ctx.moveTo(100, 15);
      ctx.lineTo(100, 0);
      ctx.strokeStyle = rotationButtonColor;
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.fillStyle = rotationButtonColor;
      ctx.font = 'bold 14px sans-serif';
      ctx.fillText('Clique ici !', 100, -5);

      // Bouton dessin (inactif)
      ctx.fillStyle = '#e5e7eb';
      ctx.beginPath();
      ctx.arc(150, 50, 20, 0, 2 * Math.PI);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fillStyle = '#9ca3af';
      ctx.fillText('✏️', 150, 50);

      // Dimensions et positions
      const rulerWidth = 250; // Règle plus petite
      const rulerHeight = 50;
      const centerX = ctx.canvas.width / 2;
      const centerY = ctx.canvas.height / 2 - 50; // Décalage vers le haut

      // Dessiner les boutons de rotation de la règle
      if (rotationStep === 0) {
        const buttonColor = Math.sin(Date.now() / 200) > 0 ? '#22c55e' : '#16a34a';
        
        // Sauvegarder le contexte pour les boutons
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(angle * Math.PI / 180);
        
        // Bouton gauche
        ctx.fillStyle = buttonColor;
        ctx.beginPath();
        ctx.arc(-rulerWidth/2 - 30, 0, 20, 0, 2 * Math.PI);
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 20px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('↺', -rulerWidth/2 - 30, 0);
        
        // Bouton droit
        ctx.fillStyle = buttonColor;
        ctx.beginPath();
        ctx.arc(rulerWidth/2 + 30, 0, 20, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
        ctx.fillText('↻', rulerWidth/2 + 30, 0);
        
        // Texte d'instruction
        ctx.save();
        ctx.rotate(-angle * Math.PI / 180); // Désactiver la rotation pour le texte
        ctx.fillStyle = buttonColor;
        ctx.font = 'bold 16px sans-serif';
        ctx.fillText('Tourne la règle !', 0, -60);
        ctx.restore();
        
        ctx.restore();
      }

      // Dessiner la règle
      ctx.save();
      
      ctx.translate(centerX, centerY);
      ctx.rotate(angle * Math.PI / 180);
      ctx.fillStyle = 'rgba(59, 130, 246, 0.2)';
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 2;
      ctx.fillRect(-200, -30, 400, 60);
      ctx.strokeRect(-200, -30, 400, 60);
      ctx.restore();
      angle += 1;
      if (angle < 45) {
        demoTimeoutRef.current = setTimeout(rotateRuler, 16);
      }
    };
    rotateRuler();
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Étape 3 : Tracer
    await playDemoAudio("Enfin, on trace le long de la règle, en restant bien contre le bord.");
    let progress = 0;
    const drawLine = () => {
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      
      // Dessiner les contrôles
      ctx.fillStyle = '#e5e7eb';
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      
      // Bouton déplacer
      ctx.beginPath();
      ctx.arc(50, 50, 20, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#4b5563';
      ctx.font = '20px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('↔️', 50, 50);

      // Bouton rotation
      ctx.fillStyle = '#e5e7eb';
      ctx.beginPath();
      ctx.arc(100, 50, 20, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#4b5563';
      ctx.fillText('↻', 100, 50);

      // Bouton dessin (surligné)
      ctx.fillStyle = '#3b82f6';
      ctx.beginPath();
      ctx.arc(150, 50, 20, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#ffffff';
      ctx.fillText('✏️', 150, 50);

      // Dessiner la règle
      ctx.save();
      // Dimensions de la règle
      const rulerWidth = 250; // Règle plus petite
      const rulerHeight = 50;
      
      // Calculer le centre avec un décalage vers le haut
      const centerX = ctx.canvas.width / 2;
      const centerY = ctx.canvas.height / 2 - 50; // Décalage vers le haut
      
      ctx.translate(centerX, centerY);
      ctx.rotate(45 * Math.PI / 180);
      
      // Dessiner la règle
      ctx.fillStyle = 'rgba(59, 130, 246, 0.2)';
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 2;
      
      // Centrer la règle
      ctx.fillRect(-rulerWidth/2, -rulerHeight/2, rulerWidth, rulerHeight);
      ctx.strokeRect(-rulerWidth/2, -rulerHeight/2, rulerWidth, rulerHeight);
      
      // Dessiner le trait avec une couleur différente
      ctx.beginPath();
      ctx.strokeStyle = '#22c55e'; // Vert vif
      ctx.lineWidth = 3;
      // Tracer le long du bord supérieur de la règle
      ctx.moveTo(-rulerWidth/2, -rulerHeight/2);
      ctx.lineTo(-rulerWidth/2 + progress * rulerWidth, -rulerHeight/2);
      ctx.stroke();
      
      ctx.restore();

      progress += 0.02;
      if (progress <= 1) {
        demoTimeoutRef.current = setTimeout(drawLine, 16);
      } else {
        setIsPlayingDemo(false);
      }
    };
    drawLine();
  };
  const [currentPoint, setCurrentPoint] = useState<{ x: number; y: number } | null>(null);
  const [drawnPoints, setDrawnPoints] = useState<{ x: number; y: number }[]>([]);
  const [score, setScore] = useState(0);
  const [nearRuler, setNearRuler] = useState(false);
  const [targetLine, setTargetLine] = useState<{
    start: {x: number, y: number},
    end: {x: number, y: number},
    controlPoint1?: {x: number, y: number},
    controlPoint2?: {x: number, y: number},
    breakPoints?: {x: number, y: number}[]
  } | null>(null);
  const [rulerAligned, setRulerAligned] = useState(false);

  // Réinitialiser le canvas quand on change de type de ligne
  useEffect(() => {
    if (canvasRef.current && containerRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (ctx) {
        // Effacer le canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        if (lineType === 'straight') {
          // Dessiner une ligne droite pointillée
          if (targetLine) {
            ctx.setLineDash([5, 5]);
            ctx.beginPath();
            ctx.moveTo(targetLine.start.x, targetLine.start.y);
            ctx.lineTo(targetLine.end.x, targetLine.end.y);
            ctx.strokeStyle = '#94a3b8';
            ctx.stroke();
            ctx.setLineDash([]);
          }
        } else if (lineType === 'curved' || lineType === 'broken' || lineType === 'dotted') {
          const startX = canvas.width * 0.2;
          const startY = canvas.height * 0.5;
          const endX = canvas.width * 0.8;
          const endY = canvas.height * 0.5;

          if (lineType === 'curved') {
            // Dessiner une courbe de Bézier pointillée
            const cp1x = startX + (endX - startX) * 0.33;
            const cp1y = startY - 100;
            const cp2x = startX + (endX - startX) * 0.66;
            const cp2y = startY + 100;

            ctx.setLineDash([5, 5]);
            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, endX, endY);
            ctx.strokeStyle = '#94a3b8';
            ctx.stroke();
            ctx.setLineDash([]);

            // Stocker les points pour la validation
            setTargetLine({
              start: { x: startX, y: startY },
              end: { x: endX, y: endY },
              controlPoint1: { x: cp1x, y: cp1y },
              controlPoint2: { x: cp2x, y: cp2y }
            });
          } else if (lineType === 'broken') {
            // Dessiner une ligne brisée pointillée
            const midX1 = startX + (endX - startX) * 0.33;
            const midY1 = startY - 80;
            const midX2 = startX + (endX - startX) * 0.66;
            const midY2 = startY + 80;

            // Dessiner les points de repère
            const points = [
              { x: startX, y: startY },
              { x: midX1, y: midY1 },
              { x: midX2, y: midY2 },
              { x: endX, y: endY }
            ];

            // Dessiner la ligne pointillée
            ctx.setLineDash([5, 5]);
            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.lineTo(midX1, midY1);
            ctx.lineTo(midX2, midY2);
            ctx.lineTo(endX, endY);
            ctx.strokeStyle = '#94a3b8';
            ctx.stroke();
            ctx.setLineDash([]);

            // Dessiner les points
            points.forEach((point, index) => {
              ctx.beginPath();
              ctx.arc(point.x, point.y, 6, 0, Math.PI * 2);
              ctx.fillStyle = '#3b82f6';
              ctx.fill();
              
              // Ajouter un numéro à côté du point
              ctx.font = '16px Arial';
              ctx.fillStyle = '#1e40af';
              ctx.textAlign = 'center';
              ctx.textBaseline = 'bottom';
              ctx.fillText((index + 1).toString(), point.x, point.y - 10);
            });

            // Stocker les points pour la validation
            setTargetLine({
              start: { x: startX, y: startY },
              end: { x: endX, y: endY },
              breakPoints: points.slice(1, -1)
            });
          } else if (lineType === 'dotted') {
            // Calculer la distance totale
            const dx = endX - startX;
            const dy = endY - startY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            // Créer des points régulièrement espacés
            const spacing = 30; // Distance entre les points
            const numPoints = Math.floor(distance / spacing);
            const points = [];
            
            for (let i = 0; i <= numPoints; i++) {
              const t = i / numPoints;
              points.push({
                x: startX + dx * t,
                y: startY + dy * t
              });
            }

            // Dessiner les points avec des numéros
            points.forEach((point, index) => {
              // Point plus gros pour le début et la fin
              const radius = (index === 0 || index === points.length - 1) ? 6 : 4;
              
              ctx.beginPath();
              ctx.arc(point.x, point.y, radius, 0, Math.PI * 2);
              ctx.fillStyle = '#3b82f6';
              ctx.fill();
              
              // Numéroter tous les points
              ctx.font = '14px Arial';
              ctx.fillStyle = '#1e40af';
              ctx.textAlign = 'center';
              ctx.textBaseline = 'bottom';
              ctx.fillText((index + 1).toString(), point.x, point.y - 10);
            });

            // Stocker les points pour la validation
            setTargetLine({
              start: { x: startX, y: startY },
              end: { x: endX, y: endY },
              breakPoints: points.slice(1, -1)
            });
          }
        }
      }
    }
  }, [lineType]);

  // Initialiser le canvas et gérer le redimensionnement
  useEffect(() => {
    if (canvasRef.current && containerRef.current) {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      const rect = container.getBoundingClientRect();
      
      // Définir la taille du canvas pour correspondre à sa taille d'affichage
      canvas.width = rect.width;
      canvas.height = rect.height;
      
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (ctx) {
        ctx.strokeStyle = '#000000';  // Noir pour mieux détecter
        ctx.lineWidth = 3;  // Plus épais
        ctx.lineCap = 'round';

        // Créer une ligne modèle selon le type
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        // Coordonnées en pixels écran (pas en coordonnées canvas)
        const start = {
          x: rect.width * 0.2 + Math.random() * rect.width * 0.2,
          y: rect.height * 0.3 + Math.random() * rect.height * 0.4
        };
        
        let end;
        if (lineType === 'straight') {
          // Ligne droite : angle aléatoire entre -30 et 30 degrés
          const randomAngle = -30 + Math.floor(Math.random() * 61);
          console.log("Angle de la ligne générée:", randomAngle);
          const length = 200 + Math.random() * 100;
          end = {
            x: start.x + length * Math.cos(randomAngle * Math.PI / 180),
            y: start.y + length * Math.sin(randomAngle * Math.PI / 180)
          };
        } else if (lineType === 'curved') {
          // Ligne courbe : points de contrôle pour une courbe de Bézier
          const controlPoint1 = {
            x: start.x + 100,
            y: start.y - 50
          };
          const controlPoint2 = {
            x: start.x + 200,
            y: start.y + 50
          };
          end = {
            x: start.x + 300,
            y: start.y
          };
          
          // Dessiner la courbe pointillée
          ctx.setLineDash([5, 5]);
          ctx.beginPath();
          ctx.moveTo(start.x, start.y);
          ctx.bezierCurveTo(
            controlPoint1.x, controlPoint1.y,
            controlPoint2.x, controlPoint2.y,
            end.x, end.y
          );
          ctx.strokeStyle = '#94a3b8';
          ctx.stroke();
          ctx.setLineDash([]);
          return; // On sort car la courbe est déjà dessinée
        }

        if (end) {
          // Convertir en coordonnées canvas pour le dessin
          const canvasStart = {
            x: start.x * scaleX,
            y: start.y * scaleY
          };
          const canvasEnd = {
            x: end.x * scaleX,
            y: end.y * scaleY
          };

          // Stocker les coordonnées en pixels écran pour la validation
          setTargetLine({ start, end });

          // Dessiner la ligne pointillée
          ctx.setLineDash([5, 5]);
          ctx.beginPath();
          ctx.moveTo(start.x, start.y);
          ctx.lineTo(end.x, end.y);
          ctx.strokeStyle = '#94a3b8';
          ctx.stroke();
          ctx.setLineDash([]);
        }
      }
    }

    if (demoCanvasRef.current) {
      const canvas = demoCanvasRef.current;
      canvas.width = 600;
      canvas.height = 400;
      
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (ctx) {
        ctx.strokeStyle = '#2563eb';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
      }
    }

    // Cleanup des timeouts et audio
    return () => {
      if (demoTimeoutRef.current) {
        clearTimeout(demoTimeoutRef.current);
      }
      if (window.speechSynthesis && demoAudioRef.current) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleRulerDrag = (event: any, info: any) => {
    if (mode === 'move' && targetLine && canvasRef.current) {
      const newPosition = { x: info.point.x, y: info.point.y };
      setPosition(newPosition);

      // Calculer l'angle entre la règle et la ligne
      // Calculer l'angle de la ligne
      let targetAngle = Math.atan2(
        targetLine.end.y - targetLine.start.y,
        targetLine.end.x - targetLine.start.x
      ) * 180 / Math.PI;

      // Normaliser les angles entre -180 et 180
      while (targetAngle <= -180) targetAngle += 360;
      while (targetAngle > 180) targetAngle -= 360;

      let currentRotation = rotation;
      while (currentRotation <= -180) currentRotation += 360;
      while (currentRotation > 180) currentRotation -= 360;

      // Calculer la différence d'angle la plus courte
      let angleDiff = Math.abs(targetAngle - currentRotation);
      if (angleDiff > 180) angleDiff = 360 - angleDiff;

      console.log({
        targetAngle,
        currentRotation,
        angleDiff,
        targetStart: targetLine.start,
        targetEnd: targetLine.end,
        rulerPosition: position,
        rulerRotation: rotation
      });

      // Valider uniquement sur l'angle
      if (angleDiff < 3) {
        const ctx = canvasRef.current.getContext('2d', { willReadFrequently: true });
        if (ctx) {
          // Effet visuel de validation
          ctx.fillStyle = 'rgba(34, 197, 94, 0.2)';
          ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
          // Message de validation compact
          const messageBox = {
            x: ctx.canvas.width / 2,
            y: 40,
            width: 340,
            height: 50,
            padding: 15,
            borderRadius: 10
          };

          // Dessiner le fond
          ctx.fillStyle = 'rgba(34, 197, 94, 0.9)';
          ctx.beginPath();
          ctx.roundRect(
            messageBox.x - messageBox.width/2,
            messageBox.y - messageBox.height/2,
            messageBox.width,
            messageBox.height,
            messageBox.borderRadius
          );
          ctx.fill();
          
          // Texte
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 18px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('✨ Règle bien placée ! Trace maintenant ✏️', messageBox.x, messageBox.y);

          // Mettre en surbrillance le bouton Tracer
          setMode('draw');
        }
      }
    }
  };

  const getCanvasPoint = (event: React.MouseEvent) => {
    if (!canvasRef.current) return null;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (event.clientX - rect.left) * scaleX,
      y: (event.clientY - rect.top) * scaleY
    };
  };

  const handleDrawStart = (event: React.MouseEvent) => {
    if (!canvasRef.current || mode !== 'draw') return;
    const point = getCanvasPoint(event);
    if (!point) return;
    
    setIsDrawing(true);
    setCurrentPoint(point);
    
    const ctx = canvasRef.current.getContext('2d', { willReadFrequently: true });
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(point.x, point.y);
    }
  };

  const handleDrawMove = (event: React.MouseEvent) => {
    if (!isDrawing || !canvasRef.current || !currentPoint) return;
    const point = getCanvasPoint(event);
    if (!point) return;

    // Calculer les points de la règle
    const angle = rotation * Math.PI / 180;
    const rulerLength = 400;
    const rulerWidth = 50;
    
    // Calculer les quatre coins de la règle
    const rulerTopLeft = {
      x: position.x,
      y: position.y
    };
    const rulerTopRight = {
      x: position.x + rulerLength * Math.cos(angle),
      y: position.y + rulerLength * Math.sin(angle)
    };
    const rulerBottomLeft = {
      x: position.x + rulerWidth * Math.sin(angle),
      y: position.y - rulerWidth * Math.cos(angle)
    };
    const rulerBottomRight = {
      x: rulerTopRight.x + rulerWidth * Math.sin(angle),
      y: rulerTopRight.y - rulerWidth * Math.cos(angle)
    };

    // Vérifier si le point est à l'intérieur ou sur les bords de la règle
    const isInsideRuler = (px: number, py: number) => {
      const AM = { x: px - rulerTopLeft.x, y: py - rulerTopLeft.y };
      const AB = { x: rulerTopRight.x - rulerTopLeft.x, y: rulerTopRight.y - rulerTopLeft.y };
      const AD = { x: rulerBottomLeft.x - rulerTopLeft.x, y: rulerBottomLeft.y - rulerTopLeft.y };
      
      const amab = AM.x * AB.x + AM.y * AB.y;
      const abab = AB.x * AB.x + AB.y * AB.y;
      const amad = AM.x * AD.x + AM.y * AD.y;
      const adad = AD.x * AD.x + AD.y * AD.y;
      
      return amab >= 0 && amab <= abab && amad >= 0 && amad <= adad;
    };

    // Calculer la distance au bord supérieur de la règle
    const distanceToTopEdge = Math.abs(
      (rulerTopRight.y - rulerTopLeft.y) * point.x - 
      (rulerTopRight.x - rulerTopLeft.x) * point.y + 
      rulerTopRight.x * rulerTopLeft.y - 
      rulerTopRight.y * rulerTopLeft.x
    ) / Math.sqrt(
      Math.pow(rulerTopRight.y - rulerTopLeft.y, 2) + 
      Math.pow(rulerTopRight.x - rulerTopLeft.x, 2)
    );

    const isNearTopEdge = distanceToTopEdge < 10;
    const pointInsideRuler = isInsideRuler(point.x, point.y);
    
    setNearRuler(isNearTopEdge || pointInsideRuler);

    const ctx = canvasRef.current.getContext('2d', { willReadFrequently: true });
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(currentPoint.x, currentPoint.y);
      
      if (isNearTopEdge || pointInsideRuler) {
        // Projeter le point sur le bord supérieur de la règle
        const dx = rulerTopRight.x - rulerTopLeft.x;
        const dy = rulerTopRight.y - rulerTopLeft.y;
        const t = ((point.x - rulerTopLeft.x) * dx + (point.y - rulerTopLeft.y) * dy) / 
                 (dx * dx + dy * dy);
        const projectedX = rulerTopLeft.x + t * dx;
        const projectedY = rulerTopLeft.y + t * dy;
        
        // Tracer une ligne droite le long de la règle
        ctx.strokeStyle = '#22c55e'; // Vert pour montrer que c'est "magnétisé"
        ctx.lineWidth = 3;
        ctx.lineTo(projectedX, projectedY);
        setCurrentPoint({ x: projectedX, y: projectedY });
      } else {
        // Tracer une ligne libre
        ctx.strokeStyle = '#94a3b8'; // Gris pour montrer que ce n'est pas droit
        ctx.lineWidth = 2;
        ctx.lineTo(point.x, point.y);
        setCurrentPoint({ x: point.x, y: point.y });
      }
      
      ctx.stroke();
    }
  };

  const handleDrawEnd = () => {
    if (!isDrawing || !canvasRef.current || !currentPoint || !targetLine) return;
    setIsDrawing(false);
    setCurrentPoint(null);
    
    const ctx = canvasRef.current.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    // Récupérer les données du canvas
    const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
    const pixels = imageData.data;
    
    // Compter les pixels verts (notre trait) qui sont proches de la ligne cible
    let validPixels = 0;
    let totalGreenPixels = 0;

    for (let y = 0; y < ctx.canvas.height; y++) {
      for (let x = 0; x < ctx.canvas.width; x++) {
        const i = (y * ctx.canvas.width + x) * 4;
        
        // Si c'est un pixel vert (notre trait)
        if (pixels[i + 1] > 150 && pixels[i + 0] < 100 && pixels[i + 2] < 100) {
          totalGreenPixels++;
          
          // Calculer la distance à la ligne cible
          const distanceToLine = Math.abs(
            (targetLine.end.y - targetLine.start.y) * x -
            (targetLine.end.x - targetLine.start.x) * y +
            targetLine.end.x * targetLine.start.y -
            targetLine.end.y * targetLine.start.x
          ) / Math.sqrt(
            Math.pow(targetLine.end.y - targetLine.start.y, 2) +
            Math.pow(targetLine.end.x - targetLine.start.x, 2)
          );

          // Une grande tolérance (20 pixels)
          if (distanceToLine < 20) {
            validPixels++;
          }
        }
      }
    }

    // Si au moins 30% des pixels sont valides
    if (totalGreenPixels > 0 && validPixels / totalGreenPixels > 0.3) {
      setScore(prev => {
        const newScore = Math.min(prev + 25, 100);
        if (newScore >= 75) {
          onComplete(true, lineType);
        }
        return newScore;
      });

      // Afficher un message de félicitations
      ctx.fillStyle = 'rgba(34, 197, 94, 0.2)';
      ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      ctx.fillStyle = '#22c55e';
      ctx.font = 'bold 24px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('✨ Parfait ! La ligne est bien tracée !', ctx.canvas.width / 2, 50);
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg">
      <div className="flex flex-col gap-4 mb-4">
        {/* Étape actuelle */}
        <div className="bg-blue-50 rounded-lg p-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">
              {rulerAligned ? '2' : '1'}
            </div>
            <div>
              <div className="font-medium text-blue-900">
                {rulerAligned ? 'Trace le long de la règle' : 'Place la règle sur les pointillés'}
              </div>
              <div className="text-sm text-blue-700">
                {rulerAligned ? 'Clique sur ✏️ puis trace le long de la règle' : 'Déplace et tourne la règle pour l\'aligner'}
              </div>
            </div>
          </div>
          {rulerAligned && (
            <div className="bg-green-100 px-3 py-1 rounded-full text-green-700 font-medium flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Règle bien placée
            </div>
          )}
        </div>

        {/* Contrôles */}
        <div className="flex gap-2">
          {lineType === 'straight' ? (
            <>
              <div className="relative">
                <button
                  onClick={() => {
                    setMode('move');
                    if (tutorialStep === 'move') setTutorialStep('rotate');
                  }}
                  className={`flex-1 p-2 rounded-lg flex items-center justify-center gap-2 ${
                    mode === 'move' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-white text-blue-700 border-2 border-blue-200 hover:bg-blue-50'
                  } ${tutorialStep === 'move' ? 'ring-4 ring-green-400 animate-pulse' : ''}`}
                >
                  <Move className="w-5 h-5" />
                  <span className="font-medium">Déplacer</span>
                </button>
                {tutorialStep === 'move' && (
                  <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-green-100 text-green-800 px-4 py-2 rounded-lg shadow-lg text-sm font-medium whitespace-nowrap">
                    1️⃣ D'abord, clique ici pour déplacer la règle
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-4 h-4 bg-green-100"></div>
                  </div>
                )}
              </div>

              <div className="relative">
                <button
                  onClick={() => {
                    setMode('rotate');
                    if (tutorialStep === 'rotate') setTutorialStep('draw');
                  }}
                  className={`flex-1 p-2 rounded-lg flex items-center justify-center gap-2 ${
                    mode === 'rotate' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-white text-blue-700 border-2 border-blue-200 hover:bg-blue-50'
                  } ${tutorialStep === 'rotate' ? 'ring-4 ring-green-400 animate-pulse' : ''}`}
                >
                  <RotateCw className="w-5 h-5" />
                  <span className="font-medium">Tourner</span>
                </button>
                {tutorialStep === 'rotate' && (
                  <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-green-100 text-green-800 px-4 py-2 rounded-lg shadow-lg text-sm font-medium whitespace-nowrap">
                    2️⃣ Ensuite, clique ici et utilise les boutons pour tourner la règle
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-4 h-4 bg-green-100"></div>
                  </div>
                )}
              </div>
            </>
          ) : null}

          <div className="relative">
            <button
              onClick={() => {
                setMode('draw');
                if (tutorialStep === 'draw') setTutorialStep(null);
              }}
              className={`flex-1 p-2 rounded-lg flex items-center justify-center gap-2 ${
                mode === 'draw' || lineType === 'curved' || lineType === 'broken' || lineType === 'dotted'
                  ? 'bg-blue-500 text-white' 
                  : 'bg-white text-blue-700 border-2 border-blue-200 hover:bg-blue-50'
              } ${tutorialStep === 'draw' ? 'ring-4 ring-green-400 animate-pulse' : ''}`}
              disabled={lineType === 'curved' || lineType === 'broken' || lineType === 'dotted'}
            >
              <Pencil className="w-5 h-5" />
              <span className="font-medium">Tracer</span>
            </button>
            {tutorialStep === 'draw' && (
              <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-green-100 text-green-800 px-4 py-2 rounded-lg shadow-lg text-sm font-medium whitespace-nowrap">
                {lineType === 'straight' ? '3️⃣ Enfin, clique ici pour tracer le long de la règle' : 'Clique ici pour tracer la courbe'}
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-4 h-4 bg-green-100"></div>
              </div>
            )}
          </div>
        </div>

        {/* Types de lignes */}
        <div className="flex gap-2 bg-gray-50 p-2 rounded-lg">
          <button
            onClick={() => {
              setLineType('straight');
              setMode('move');
            }}
            className={`flex-1 p-2 rounded ${
              lineType === 'straight'
                ? 'bg-blue-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            📏 Droite
          </button>
          <button
            onClick={() => {
              setLineType('curved');
              setMode('draw');
            }}
            className={`flex-1 p-2 rounded ${
              lineType === 'curved'
                ? 'bg-blue-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            🌙 Courbe
          </button>
          <button
            onClick={() => {
              setLineType('broken');
              setMode('draw');
            }}
            className={`flex-1 p-2 rounded ${
              lineType === 'broken'
                ? 'bg-blue-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            ⚡ Brisée
          </button>
          <button
            onClick={() => {
              setLineType('dotted');
              setMode('draw');
            }}
            className={`flex-1 p-2 rounded ${
              lineType === 'dotted'
                ? 'bg-blue-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            👉 Pointillés
          </button>
        </div>
      </div>

      <div 
        ref={containerRef}
        className="relative bg-gray-50 rounded-lg h-[400px] select-none"
      >
        {/* Canvas pour le dessin */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full"
            style={{ touchAction: 'none' }}
            onMouseDown={handleDrawStart}
            onMouseMove={handleDrawMove}
            onMouseUp={handleDrawEnd}
            onMouseLeave={handleDrawEnd}
          />

        {/* Règle (visible seulement pour les lignes droites) */}
        {lineType === 'straight' && (
          <motion.div
            className="absolute select-none"
            style={{
              width: '400px',
              height: '50px',
              backgroundColor: rulerAligned ? 'rgba(34, 197, 94, 0.2)' : 'rgba(59, 130, 246, 0.2)',
              border: `2px solid ${rulerAligned ? '#22c55e' : '#3b82f6'}`,
              borderRadius: '4px',
              x: position.x,
              y: position.y,
              rotate: rotation,
              touchAction: 'none',
              transition: 'background-color 0.3s, border-color 0.3s'
            }}
            drag={mode === 'move'}
            dragMomentum={false}
            onDrag={handleRulerDrag}
          >
          {mode === 'rotate' && (
            <>
              <div className="absolute -left-12 top-1/2 transform -translate-y-1/2">
                <button
                  className="w-10 h-10 bg-blue-500 rounded-full text-white hover:bg-blue-600 transition-colors"
                  onClick={() => setRotation(prev => Math.max(-30, prev - 1))}
                >
                  ↺
                </button>
              </div>
              <div className="absolute -right-12 top-1/2 transform -translate-y-1/2">
                <button
                  className="w-10 h-10 bg-blue-500 rounded-full text-white hover:bg-blue-600 transition-colors"
                  onClick={() => setRotation(prev => Math.min(30, prev + 1))}
                >
                  ↻
                </button>
              </div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-blue-500 font-mono text-sm">
                {rotation}°
              </div>
            </>
          )}

          {mode === 'draw' && (
            <div className="absolute left-0 top-0 bottom-0 w-full bg-green-200 opacity-30 animate-pulse" />
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
        )}
      </div>

      <div className="mt-4 flex justify-between items-center">
        <div className="text-sm text-gray-600">Score : {score}%</div>
        <div className="flex gap-2">
          <button
            onClick={() => setTutorialStep('move')}
            className="px-4 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
          >
            Recommencer l'aide
          </button>
          <button
            onClick={() => {
              const ctx = canvasRef.current?.getContext('2d', { willReadFrequently: true });
              if (ctx && targetLine) {
                // Effacer tout
                ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
                
                // Redessiner la ligne pointillée
                ctx.setLineDash([5, 5]);
                ctx.beginPath();
                ctx.moveTo(targetLine.start.x, targetLine.start.y);
                ctx.lineTo(targetLine.end.x, targetLine.end.y);
                ctx.strokeStyle = '#94a3b8';
                ctx.stroke();
                ctx.setLineDash([]);
              }
            }}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
          >
            Effacer
          </button>
        </div>
      </div>
    </div>
  );
}

export default function LignesTraitsCP() {
  // États pour l'audio et animations
  const [isPlayingVocal, setIsPlayingVocal] = useState(false);
  const [isAnimationRunning, setIsAnimationRunning] = useState(false);
  const [highlightedElement, setHighlightedElement] = useState<string | null>(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [animatingStep, setAnimatingStep] = useState<string | null>(null);
  const [currentExample, setCurrentExample] = useState<number | null>(null);
  const [showingProcess, setShowingProcess] = useState<'preparation' | 'tracing' | 'result' | null>(null);
  const [animatingLine, setAnimatingLine] = useState(false);
  const [tracingProgress, setTracingProgress] = useState<number>(0);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [showingTool, setShowingTool] = useState<string | null>(null);
  
  // États pour les exercices
  const [showExercises, setShowExercises] = useState(false);
  const [currentExercise, setCurrentExercise] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [answeredCorrectly, setAnsweredCorrectly] = useState<Set<number>>(new Set());
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  
  // Refs pour gérer l'audio
  const stopSignalRef = useRef(false);
  const currentAudioRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Types de lignes à apprendre
  const lineTypes = [
    {
      name: 'ligne droite',
      emoji: '📏',
      icon: Minus,
      color: 'blue',
      story: 'Une ligne droite va toujours dans la même direction, comme un chemin tout droit',
      characteristics: [
        'Elle ne tourne jamais',
        'Elle est parfaitement droite',
        'On utilise une règle pour la tracer'
      ],
      examples: ['📏 règle', '🏗️ poutre', '🛣️ autoroute', '📐 côté de carré', '🎯 rayon'],
      tools: ['règle', 'crayon'],
      steps: ['poser la règle', 'tracer le long de la règle']
    },
    {
      name: 'ligne courbe',
      emoji: '🌙',
      icon: Waves,
      color: 'green',
      story: 'Une ligne courbe tourne doucement, comme un arc-en-ciel ou un sourire',
      characteristics: [
        'Elle tourne en douceur',
        'Elle n\'a pas de coins',
        'On la trace à main levée'
      ],
      examples: ['🌈 arc-en-ciel', '😊 sourire', '🌙 croissant', '🎢 toboggan', '🐍 serpent'],
      tools: ['crayon'],
      steps: ['choisir le sens', 'tracer en tournant doucement']
    },
    {
      name: 'ligne brisée',
      emoji: '⚡',
      icon: Zap,
      color: 'orange',
      story: 'Une ligne brisée est faite de plusieurs lignes droites qui se touchent',
      characteristics: [
        'Elle a des coins pointus',
        'Elle change de direction',
        'Chaque partie est droite'
      ],
      examples: ['⚡ éclair', '🏔️ montagne', '📊 graphique', '🎯 flèche', '🔺 triangle'],
      tools: ['règle', 'crayon'],
      steps: ['tracer premier segment', 'changer de direction', 'tracer segments suivants']
    },
    {
      name: 'ligne pointillée',
      emoji: '⋯',
      icon: MoreHorizontal,
      color: 'purple',
      story: 'Une ligne pointillée est faite de petits traits séparés, comme des pas sur le sable',
      characteristics: [
        'Elle a des espaces vides',
        'Les traits sont réguliers',
        'On peut la couper ou la déchirer facilement'
      ],
      examples: ['✂️ découpage', '🎫 ticket', '📋 formulaire', '🗺️ frontière', '🚗 route'],
      tools: ['règle', 'crayon'],
      steps: ['mesurer les espaces', 'tracer trait', 'laisser espace', 'répéter']
    }
  ];

  // Exercices sur les lignes et traits
  const exercises = [
    { 
      question: 'Une ligne droite...', 
      correctAnswer: 'ne tourne jamais',
      choices: ['tourne souvent', 'ne tourne jamais', 'a des coins'],
      hint: 'Pense à une règle...',
      demoType: 'straight-line'
    },
    { 
      question: 'Pour tracer une ligne droite, j\'utilise...', 
      correctAnswer: 'une règle',
      choices: ['mes doigts', 'une règle', 'une gomme'],
      hint: 'L\'outil qui aide à tracer droit...',
      demoType: 'straight-line-tool'
    },
    { 
      question: 'Une ligne courbe...', 
      correctAnswer: 'tourne en douceur',
      choices: ['est droite', 'tourne en douceur', 'a des coins pointus'],
      hint: 'Comme un sourire ou un arc-en-ciel...',
      demoType: 'curved-line'
    },
    { 
      question: 'Une ligne brisée est faite de...', 
      correctAnswer: 'segments droits',
      choices: ['courbes', 'segments droits', 'points'],
      hint: 'Comme un éclair ou une montagne...',
      demoType: 'broken-line'
    },
    { 
      question: 'Une ligne pointillée a...', 
      correctAnswer: 'des espaces vides',
      choices: ['des couleurs', 'des espaces vides', 'des formes'],
      hint: 'Comme les traits d\'un ticket à découper...',
      demoType: 'dotted-line'
    },
    { 
      question: 'Quel outil utilise-t-on pour une ligne droite parfaite ?', 
      correctAnswer: 'règle',
      choices: ['compas', 'règle', 'équerre'],
      hint: 'L\'outil le plus simple pour tracer droit...',
      demoType: 'tools'
    },
    { 
      question: 'Dans quelle direction va une ligne droite ?', 
      correctAnswer: 'toujours la même',
      choices: ['elle change', 'toujours la même', 'en rond'],
      hint: 'Comme une autoroute bien droite...',
      demoType: 'direction'
    },
    { 
      question: 'Comment trace-t-on une ligne courbe ?', 
      correctAnswer: 'à main levée',
      choices: ['avec une règle', 'à main levée', 'avec un compas'],
      hint: 'Sans outil, juste avec le crayon...',
      demoType: 'curved-technique'
    },
    { 
      question: 'Une ligne brisée change...', 
      correctAnswer: 'de direction',
      choices: ['de couleur', 'de direction', 'de taille'],
      hint: 'A chaque coin, elle va ailleurs...',
      demoType: 'broken-direction'
    },
    { 
      question: 'Les espaces dans une ligne pointillée sont...', 
      correctAnswer: 'réguliers',
      choices: ['différents', 'réguliers', 'colorés'],
      hint: 'Tous pareils, comme un rythme...',
      demoType: 'dotted-spacing'
    }
  ];

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Effet pour gérer les changements d'onglet
  useEffect(() => {
    stopAllVocalsAndAnimations();
  }, [showExercises]);

  // Fonction pour arrêter toutes les animations et vocaux
  const stopAllVocalsAndAnimations = () => {
    setIsAnimationRunning(false);
    setIsPlayingVocal(false);
    setHighlightedElement(null);
    setCurrentExample(null);
    setShowingProcess(null);
    setAnimatingLine(false);
    setTracingProgress(0);
    setCurrentStep(0);
    setShowingTool(null);
    
    // Arrêter la synthèse vocale
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    
    // Signaler l'arrêt
    stopSignalRef.current = true;
    
    // Nettoyer la référence audio
    if (currentAudioRef.current) {
      currentAudioRef.current = null;
    }
  };

  // Fonction pour jouer l'audio avec gestion des interruptions
  const playAudio = (text: string): Promise<void> => {
    return new Promise((resolve) => {
      if (stopSignalRef.current) {
        resolve();
        return;
      }

      // Choisir une voix française naturelle
      const synth = window.speechSynthesis;
      const voices = synth.getVoices();
      const frenchVoice = voices.find(voice => 
        voice.lang.startsWith('fr') && 
        (voice.name.includes('Thomas') || voice.name.includes('Amélie') || voice.name.includes('Daniel'))
      ) || voices.find(voice => voice.lang.startsWith('fr'));

      if (synth) {
        const utterance = new SpeechSynthesisUtterance(text);
        if (frenchVoice) {
          utterance.voice = frenchVoice;
        }
        utterance.rate = 0.9;
        utterance.pitch = 1;
        utterance.volume = 1;
        
        currentAudioRef.current = utterance;
        
        utterance.onend = () => {
          if (!stopSignalRef.current) {
            setIsPlayingVocal(false);
          }
          resolve();
        };
        
        utterance.onerror = () => {
          setIsPlayingVocal(false);
          resolve();
        };
        
        setIsPlayingVocal(true);
        synth.speak(utterance);
      } else {
        resolve();
      }
    });
  };

  // Fonction pour démarrer la leçon
  const startLesson = async () => {
    if (isAnimationRunning) {
      stopAllVocalsAndAnimations();
      return;
    }

    setHasStarted(true);
    setIsAnimationRunning(true);
    stopSignalRef.current = false;

    const steps = [
      {
        action: () => setHighlightedElement('introduction'),
        audio: "Bonjour petit artiste ! Aujourd'hui, nous allons apprendre à tracer les 4 types de lignes. C'est la base de tous les dessins !"
      },
      {
        action: () => {
          setHighlightedElement('lines-explanation');
          setCurrentExample(0);
        },
        audio: "Voici les 4 types de lignes magiques : la ligne droite, la ligne courbe, la ligne brisée et la ligne pointillée."
      },
      {
        action: () => {
          setCurrentExample(0);
          setShowingProcess('preparation');
          setAnimatingLine(true);
        },
        audio: "Commençons par la ligne droite. Elle va toujours dans la même direction, comme une autoroute bien droite !"
      },
      {
        action: () => {
          setShowingProcess('tracing');
          setShowingTool('règle');
          setTracingProgress(0);
          // Animation du tracé
          let progress = 0;
          const interval = setInterval(() => {
            if (stopSignalRef.current) {
              clearInterval(interval);
              return;
            }
            progress += 10;
            setTracingProgress(progress);
            if (progress >= 100) {
              clearInterval(interval);
              setShowingProcess('result');
            }
          }, 200);
        },
        audio: "On pose la règle et on trace le long de la règle. Regarde comme elle est parfaitement droite !"
      },
      {
        action: () => {
          setCurrentExample(1);
          setShowingProcess('preparation');
          setTracingProgress(0);
        },
        audio: "Maintenant la ligne courbe ! Elle tourne en douceur, comme un sourire ou un arc-en-ciel."
      },
      {
        action: () => {
          setShowingProcess('tracing');
          setShowingTool('crayon');
          let progress = 0;
          const interval = setInterval(() => {
            if (stopSignalRef.current) {
              clearInterval(interval);
              return;
            }
            progress += 10;
            setTracingProgress(progress);
            if (progress >= 100) {
              clearInterval(interval);
              setShowingProcess('result');
            }
          }, 200);
        },
        audio: "On la trace à main levée, en tournant doucement notre crayon. Pas de règle pour celle-ci !"
      },
      {
        action: () => {
          setCurrentExample(2);
          setShowingProcess('preparation');
          setTracingProgress(0);
        },
        audio: "Voici la ligne brisée ! Elle est faite de plusieurs segments droits qui se touchent, comme un éclair !"
      },
      {
        action: () => {
          setShowingProcess('tracing');
          let progress = 0;
          const interval = setInterval(() => {
            if (stopSignalRef.current) {
              clearInterval(interval);
              return;
            }
            progress += 20;
            setTracingProgress(progress);
            if (progress >= 100) {
              clearInterval(interval);
              setShowingProcess('result');
            }
          }, 300);
        },
        audio: "On trace le premier segment, puis on change de direction et on trace le suivant. Chaque partie est droite !"
      },
      {
        action: () => {
          setCurrentExample(3);
          setShowingProcess('preparation');
          setTracingProgress(0);
        },
        audio: "Enfin, la ligne pointillée ! Elle est faite de petits traits séparés, comme des pas sur le sable."
      },
      {
        action: () => {
          setShowingProcess('tracing');
          let progress = 0;
          const interval = setInterval(() => {
            if (stopSignalRef.current) {
              clearInterval(interval);
              return;
            }
            progress += 15;
            setTracingProgress(progress);
            if (progress >= 100) {
              clearInterval(interval);
              setShowingProcess('result');
            }
          }, 250);
        },
        audio: "On trace un petit trait, on laisse un espace, on trace un autre trait. Les espaces sont réguliers !"
      },
      {
        action: () => {
          setHighlightedElement('summary');
          setCurrentExample(null);
          setShowingProcess(null);
        },
        audio: "Parfait ! Maintenant tu connais les 4 types de lignes. Tu peux les utiliser pour tous tes dessins !"
      }
    ];

    for (let i = 0; i < steps.length && !stopSignalRef.current; i++) {
      steps[i].action();
      await playAudio(steps[i].audio);
      
      if (!stopSignalRef.current) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    if (!stopSignalRef.current) {
      setIsAnimationRunning(false);
      setHighlightedElement('exercises');
      await playAudio("Maintenant, teste tes connaissances avec les exercices !");
    }
  };

  // Fonctions pour les exercices
  const handleAnswerSelect = (answer: string) => {
    if (isCorrect !== null) return;
    
    setUserAnswer(answer);
    const correct = answer === exercises[currentExercise].correctAnswer;
    setIsCorrect(correct);
    
    if (correct) {
      setScore(score + 1);
      setAnsweredCorrectly(new Set(Array.from(answeredCorrectly).concat([currentExercise])));
      playAudio("Bravo ! C'est la bonne réponse !");
    } else {
      playAudio(`Pas tout à fait ! La bonne réponse était : ${exercises[currentExercise].correctAnswer}. ${exercises[currentExercise].hint}`);
    }
  };

  const nextExercise = () => {
    if (currentExercise < exercises.length - 1) {
      setCurrentExercise(currentExercise + 1);
      setUserAnswer('');
      setIsCorrect(null);
    } else {
      // Fin des exercices
      const finalScore = answeredCorrectly.size;
      setFinalScore(finalScore);
      setShowCompletionModal(true);
      
      if (finalScore >= 7) {
        playAudio("Félicitations ! Tu es maintenant un expert des lignes et des traits !");
      } else if (finalScore >= 5) {
        playAudio("Bon travail ! Tu comprends bien les lignes et les traits !");
      } else {
        playAudio("Continue à t'entraîner, tu vas y arriver !");
      }
    }
  };

  const resetExercises = () => {
    setCurrentExercise(0);
    setScore(0);
    setAnsweredCorrectly(new Set());
    setShowCompletionModal(false);
    setFinalScore(0);
    setUserAnswer('');
    setIsCorrect(null);
  };

  if (!isClient) {
    return <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-50 flex items-center justify-center">
      <div className="text-xl">Chargement...</div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/chapitre/cp-geometrie-espace" 
            onClick={stopAllVocalsAndAnimations}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour à la géométrie et espace</span>
          </Link>
          
          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              📏 Lignes et traits
            </h1>
            <p className="text-lg text-gray-600">
              Découvre les 4 types de lignes pour devenir un maître du trait !
            </p>
          </div>
        </div>

        {/* Navigation entre cours et exercices */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-1 shadow-md">
            <button
              onClick={() => {
                stopAllVocalsAndAnimations();
                setShowExercises(false);
              }}
              className={`px-6 py-3 rounded-lg font-bold transition-all ${
                !showExercises 
                  ? 'bg-green-500 text-white shadow-md' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              📚 Cours
            </button>
            <button
              onClick={() => {
                stopAllVocalsAndAnimations();
                setShowExercises(true);
              }}
              className={`px-6 py-3 rounded-lg font-bold transition-all ${
                showExercises 
                  ? 'bg-green-500 text-white shadow-md' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              ✏️ Exercices ({score}/{exercises.length})
            </button>
          </div>
        </div>

        {!showExercises ? (
          /* COURS */
          <div className="space-y-8">
            {/* Bouton COMMENCER */}
            <div className="text-center mb-6">
              <button
                onClick={startLesson}
                disabled={isAnimationRunning}
                className={`px-8 py-4 rounded-xl font-bold text-xl shadow-lg transition-all transform ${
                  isAnimationRunning 
                    ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-green-500 to-teal-500 text-white hover:shadow-xl hover:scale-105'
                }`}
                style={{
                  animationDuration: !hasStarted && !isAnimationRunning ? '2s' : 'none',
                  animationIterationCount: !hasStarted && !isAnimationRunning ? 'infinite' : 'none'
                }}
              >
                {isAnimationRunning ? '⏳ Animation en cours...' : '▶️ COMMENCER !'}
              </button>
            </div>

            {/* Explication du concept */}
            <div 
              id="concept-section"
              className={`bg-white rounded-xl p-8 shadow-lg transition-all duration-1000 ${
                highlightedElement === 'introduction' ? 'ring-4 ring-green-400 bg-green-50 scale-105' : ''
              }`}
            >
              <h2 className="text-2xl font-bold text-center mb-6 text-gray-900">
                ✏️ Qu'est-ce qu'une ligne ?
              </h2>
              
              <div className="bg-green-50 rounded-lg p-6 mb-6">
                <p className="text-lg text-center text-green-800 font-semibold mb-6">
                  Une ligne est un trait ! Il y a 4 types de lignes magiques pour dessiner !
                </p>
                
                  <div className="bg-white rounded-lg p-6">
                    <div className="text-center mb-6">
                      <div className="text-2xl font-bold text-green-600 mb-4">
                        {currentExample !== null ? 
                          `Découvrons : ${lineTypes[currentExample].name} ${lineTypes[currentExample].emoji}` 
                          : 'Les 4 types de lignes magiques ✏️'
                        }
                      </div>
                    </div>

                    {/* Zone de pratique interactive unifiée */}
                    <div className="mb-8">
                      <h3 className="text-xl font-bold text-green-800 mb-4 text-center">
                        ✏️ Zone de pratique
                      </h3>
                      
                      <DrawingZone onComplete={(success, type) => {
                        if (success) {
                          const lineType = lineTypes.find(lt => 
                            (lt.name === 'ligne droite' && type === 'straight') ||
                            (lt.name === 'ligne courbe' && type === 'curved') ||
                            (lt.name === 'ligne brisée' && type === 'broken') ||
                            (lt.name === 'ligne pointillée' && type === 'dotted')
                          );
                          if (lineType) {
                            playAudio(`Bravo ! Tu as parfaitement tracé la ${lineType.name} !`);
                          }
                        }
                      }} />

                      <div className="mt-6 grid grid-cols-2 gap-4">
                        {lineTypes.map((lineType, idx) => (
                          <div key={idx} className="bg-green-50 rounded-lg p-3">
                            <h5 className="font-bold text-green-800 mb-2 text-sm flex items-center gap-2">
                              {lineType.emoji} Comment tracer une {lineType.name} :
                            </h5>
                            <ul className="space-y-1">
                              {lineType.steps.map((step, stepIdx) => (
                                <li key={stepIdx} className="text-sm text-green-600 flex items-center gap-2">
                                  <span className="text-green-400">•</span> {step}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>

                  {/* Démonstrations des types de lignes */}
                  <div className={`grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6 transition-all duration-500 ${
                    highlightedElement === 'lines-explanation' ? 'ring-2 ring-green-400' : ''
                  }`}>
                    {lineTypes.map((lineType, index) => (
                      <div 
                        key={index} 
                        className={`bg-gray-100 rounded-xl p-4 text-center transition-all duration-500 ${
                          currentExample === index && animatingLine
                            ? 'ring-4 ring-green-400 bg-green-100 scale-110' 
                            : ''
                        }`}
                      >
                        <div className="text-3xl mb-2">{lineType.emoji}</div>
                        <h4 className="font-bold text-green-700 mb-1 text-sm sm:text-base">{lineType.name}</h4>
                        <p className="text-xs sm:text-sm text-green-600">{lineType.characteristics[0]}</p>
                        
                        {/* Zone d'animation pour chaque type de ligne */}
                        {currentExample === index && animatingLine && (
                          <div className="mt-4">
                            {/* Barre de progression du tracé */}
                            {showingProcess === 'tracing' && (
                              <div className="bg-gray-200 rounded-full h-2 mb-2">
                                <div 
                                  className="bg-green-500 h-2 rounded-full transition-all duration-500"
                                  style={{ width: `${tracingProgress}%` }}
                                />
                              </div>
                            )}
                            
                            {/* Outil utilisé */}
                            {showingTool && (
                              <div className="bg-green-100 rounded-lg p-2 mt-2">
                                <p className="text-xs font-bold text-green-800">
                                  Outil : {showingTool}
                                </p>
                              </div>
                            )}
                            
                            {/* Étapes */}
                            {showingProcess === 'result' && (
                              <div className="bg-green-100 rounded-lg p-3 mt-2">
                                <h5 className="font-bold text-green-800 mb-2 text-xs">Étapes :</h5>
                                <div className="space-y-1">
                                  {lineType.steps.map((step, stepIndex) => (
                                    <div key={stepIndex} className="text-xs text-green-600">
                                      {stepIndex + 1}. {step}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                            
                            {/* Exemples dans la vie */}
                            {showingProcess === 'result' && (
                              <div className="bg-blue-50 rounded-lg p-3 mt-2">
                                <h5 className="font-bold text-blue-800 mb-2 text-xs">Tu peux voir des {lineType.name}s :</h5>
                                <div className="flex flex-wrap gap-1">
                                  {lineType.examples.map((example, exIndex) => (
                                    <span
                                      key={exIndex}
                                      className="bg-white px-1 py-0.5 rounded text-xs text-blue-700"
                                    >
                                      {example}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Récapitulatif */}
                  <div className={`mt-6 p-4 rounded-xl transition-all duration-500 ${
                    highlightedElement === 'summary' ? 'bg-green-200 scale-110' : 'bg-gray-100'
                  }`}>
                    <p className="text-center font-medium text-green-800">
                      ✏️ <strong>Maintenant tu peux :</strong> Tracer tous les types de lignes !
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Conseils pratiques */}
            <div className="bg-gradient-to-r from-teal-100 to-green-100 rounded-xl p-6 shadow-lg">
              <h3 className="text-lg font-bold text-green-800 mb-4 text-center">
                🎁 Conseils pour bien tracer
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="bg-white/70 rounded-xl p-4">
                  <div className="text-2xl mb-2">📏</div>
                  <h4 className="font-bold text-green-700 mb-2">Utilise une règle</h4>
                  <p className="text-green-600">Pour les lignes droites et brisées</p>
                </div>
                <div className="bg-white/70 rounded-xl p-4">
                  <div className="text-2xl mb-2">✋</div>
                  <h4 className="font-bold text-green-700 mb-2">À main levée</h4>
                  <p className="text-green-600">Pour les lignes courbes, c'est plus joli</p>
                </div>
                <div className="bg-white/70 rounded-xl p-4">
                  <div className="text-2xl mb-2">👀</div>
                  <h4 className="font-bold text-green-700 mb-2">Regarde bien</h4>
                  <p className="text-green-600">Observe la direction de ta ligne</p>
                </div>
                <div className="bg-white/70 rounded-xl p-4">
                  <div className="text-2xl mb-2">🎨</div>
                  <h4 className="font-bold text-green-700 mb-2">Entraîne-toi</h4>
                  <p className="text-green-600">Plus tu traces, mieux tu deviens !</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* EXERCICES */
          <div className="bg-white rounded-xl p-8 shadow-lg">
            {!showCompletionModal ? (
              <>
                {/* En-tête de l'exercice */}
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    📝 Exercice {currentExercise + 1} sur {exercises.length}
                  </h2>
                  <div className="bg-gray-200 rounded-full h-3 mb-4">
                    <div 
                      className="bg-green-500 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${((currentExercise + 1) / exercises.length) * 100}%` }}
                    />
                  </div>
                  <p className="text-lg text-gray-700 mb-6">
                    {exercises[currentExercise].question}
                  </p>
                </div>

                {/* Zone de démonstration visuelle */}
                <div className="bg-gray-50 rounded-xl p-6 mb-6 text-center">
                  <div className="text-4xl mb-4">
                    {exercises[currentExercise].demoType === 'straight-line' && '📏'}
                    {exercises[currentExercise].demoType === 'curved-line' && '🌙'}
                    {exercises[currentExercise].demoType === 'broken-line' && '⚡'}
                    {exercises[currentExercise].demoType === 'dotted-line' && '⋯'}
                    {exercises[currentExercise].demoType === 'tools' && '🛠️'}
                  </div>
                  <p className="text-sm text-gray-600">
                    {exercises[currentExercise].hint}
                  </p>
                </div>

                {/* Options de réponse */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  {exercises[currentExercise].choices.map((choice, index) => (
                    <button
                      key={index}
                      onClick={() => handleAnswerSelect(choice)}
                      disabled={isCorrect !== null}
                      className={`p-4 rounded-xl font-medium transition-all transform hover:scale-105 ${
                        userAnswer === choice
                          ? isCorrect === true
                            ? 'bg-green-500 text-white shadow-lg'
                            : isCorrect === false
                            ? 'bg-red-500 text-white shadow-lg'
                            : 'bg-blue-500 text-white shadow-lg'
                          : isCorrect !== null && choice === exercises[currentExercise].correctAnswer
                          ? 'bg-green-200 text-green-800 shadow-lg'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {choice}
                    </button>
                  ))}
                </div>

                {/* Feedback et navigation */}
                {isCorrect !== null && (
                  <div className="text-center">
                    <div className={`inline-flex items-center px-6 py-3 rounded-xl font-bold text-lg mb-4 ${
                      isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {isCorrect ? (
                        <>
                          <CheckCircle className="w-6 h-6 mr-2" />
                          Bravo ! Bonne réponse !
                        </>
                      ) : (
                        <>
                          <XCircle className="w-6 h-6 mr-2" />
                          Bonne réponse : {exercises[currentExercise].correctAnswer}
                        </>
                      )}
                    </div>
                    
                    <button
                      onClick={nextExercise}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-xl font-bold transition-all hover:scale-105"
                    >
                      {currentExercise < exercises.length - 1 ? 'Exercice suivant' : 'Voir les résultats'}
                    </button>
                  </div>
                )}
              </>
            ) : (
              /* Modal de fin */
              <div className="text-center">
                <div className="text-6xl mb-6">
                  {finalScore >= 8 ? '🏆' : finalScore >= 6 ? '🎉' : '💪'}
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  {finalScore >= 8 ? 'Excellent !' : finalScore >= 6 ? 'Très bien !' : 'Continue tes efforts !'}
                </h2>
                <p className="text-xl text-gray-700 mb-8">
                  Tu as eu {finalScore} bonnes réponses sur {exercises.length} !
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={resetExercises}
                    className="flex items-center justify-center bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl font-bold transition-all hover:scale-105"
                  >
                    <RotateCcw className="w-5 h-5 mr-2" />
                    Recommencer
                  </button>
                  <Link
                    href="/chapitre/cp-geometrie-espace"
                    className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-xl font-bold transition-all inline-block"
                  >
                    Retour au chapitre
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 