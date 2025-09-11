'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

interface Volume3DViewerProps {
  volumeType: 'cube' | 'pave' | 'sphere' | 'cylindre';
  width: number;
  height: number;
}

export default function Volume3DViewer({ volumeType, width, height }: Volume3DViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf8f8f8);

    // Camera
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 5;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    containerRef.current.innerHTML = '';
    containerRef.current.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    // Geometry and material
    let geometry: THREE.BufferGeometry;
    let material: THREE.Material;

    switch (volumeType) {
      case 'cube':
        geometry = new THREE.BoxGeometry(2, 2, 2);
        material = new THREE.MeshPhongMaterial({ 
          color: 0x3b82f6,
          transparent: true,
          opacity: 0.9
        });
        break;

      case 'pave':
        geometry = new THREE.BoxGeometry(3, 2, 1.5);
        material = new THREE.MeshPhongMaterial({ 
          color: 0xf59e0b,
          transparent: true,
          opacity: 0.9
        });
        break;

      case 'sphere':
        geometry = new THREE.SphereGeometry(1.5, 32, 32);
        material = new THREE.MeshPhongMaterial({ 
          color: 0x34d399,
          transparent: true,
          opacity: 0.9
        });
        break;

      case 'cylindre':
        geometry = new THREE.CylinderGeometry(1, 1, 3, 32);
        material = new THREE.MeshPhongMaterial({ 
          color: 0xe11d48,
          transparent: true,
          opacity: 0.9
        });
        break;

      default:
        geometry = new THREE.BoxGeometry(2, 2, 2);
        material = new THREE.MeshPhongMaterial({ color: 0x3b82f6 });
    }

    // Create mesh
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      mesh.rotation.y += 0.005;
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Cleanup
    return () => {
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      scene.clear();
    };
  }, [volumeType, width, height]);

  return <div ref={containerRef} />;
}