'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function Scene3D() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Vérification basique
    if (!canvasRef.current) {
      console.error('Canvas not found');
      return;
    }

    console.log('Initializing Three.js');

    try {
      // Scène basique
      const scene = new THREE.Scene();
      console.log('Scene created');

      // Caméra simple
      const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
      camera.position.z = 5;
      console.log('Camera configured');

      // Renderer basique
      const renderer = new THREE.WebGLRenderer({
        canvas: canvasRef.current,
        antialias: false
      });
      renderer.setSize(400, 400);
      console.log('Renderer created');

      // Cube simple
      const geometry = new THREE.BoxGeometry(2, 2, 2);
      const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
      const cube = new THREE.Mesh(geometry, material);
      scene.add(cube);
      console.log('Cube added to scene');

      // Rendu unique
      renderer.render(scene, camera);
      console.log('First render complete');

    } catch (error) {
      console.error('Error in Three.js setup:', error);
    }
  }, []);

  return (
    <div style={{ padding: '20px', backgroundColor: '#f0f0f0', borderRadius: '8px' }}>
      <canvas
        ref={canvasRef}
        width={400}
        height={400}
        style={{
          border: '2px solid #ccc',
          backgroundColor: 'white'
        }}
      />
    </div>
  );
}