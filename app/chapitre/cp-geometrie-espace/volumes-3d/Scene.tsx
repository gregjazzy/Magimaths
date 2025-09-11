'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';

// Composant pour le cube
function Cube({ position = [0, 0, 0], color = 'orange', scale = 1 }) {
  return (
    <mesh position={position} scale={scale}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}

// Composant pour la sphère
function Sphere({ position = [0, 0, 0], color = 'blue', scale = 1 }) {
  return (
    <mesh position={position} scale={scale}>
      <sphereGeometry args={[0.5, 32, 32]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}

// Composant pour le cylindre
function Cylinder({ position = [0, 0, 0], color = 'green', scale = 1 }) {
  return (
    <mesh position={position} scale={scale}>
      <cylinderGeometry args={[0.5, 0.5, 1, 32]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}

// Composant pour la pyramide (cône)
function Pyramid({ position = [0, 0, 0], color = 'red', scale = 1 }) {
  return (
    <mesh position={position} scale={scale}>
      <coneGeometry args={[0.5, 1, 4]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}

export default function Scene({ selectedShape, shapes }) {
  const shapeComponents = {
    cube: Cube,
    sphere: Sphere,
    cylinder: Cylinder,
    pyramid: Pyramid
  };

  return (
    <Canvas>
      <PerspectiveCamera makeDefault position={[0, 2, 5]} />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      {selectedShape && (() => {
        const ShapeComponent = shapeComponents[selectedShape];
        return <ShapeComponent 
          position={[0, 0, 0]} 
          color={shapes[selectedShape].color}
          scale={1.5}
        />;
      })()}
      <OrbitControls enableZoom={true} enablePan={false} />
    </Canvas>
  );
}
