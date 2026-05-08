import React, { useState, useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useThree } from '../hooks/useThree';
import { LessonLayout, ControlPanel, ControlGroup } from '../components/LessonLayout';

function PBRTexturesLesson() {
  const [roughness, setRoughness] = useState(0.2);
  const [metalness, setMetalness] = useState(0.8);
  const [displacement, setDisplacement] = useState(0.2);
  const meshRef = useRef(null);

  const { containerRef, canvasRef, isReady } = useThree({
    onInit: ({ scene }) => {
      scene.background = new THREE.Color(0x050505);
      const textureLoader = new THREE.TextureLoader();
      
      // Using high-quality placeholder textures from Three.js examples
      const normalMap = textureLoader.load('https://threejs.org/examples/textures/golfball.jpg');
      
      const geometry = new THREE.IcosahedronGeometry(1.5, 64);
      const material = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness,
        metalness,
        normalMap: normalMap,
        displacementMap: normalMap,
        displacementScale: displacement
      });
      
      const mesh = new THREE.Mesh(geometry, material);
      meshRef.current = mesh;
      scene.add(mesh);

      // Stronger Lighting for PBR
      const light1 = new THREE.DirectionalLight(0x4ecdc4, 2);
      light1.position.set(2, 4, 5);
      scene.add(light1);

      const light2 = new THREE.DirectionalLight(0xff6b6b, 2);
      light2.position.set(-2, -4, 5);
      scene.add(light2);
      
      scene.add(new THREE.AmbientLight(0xffffff, 0.1));
    },
    onAnimate: ({ clock }) => {
      if (meshRef.current) {
        meshRef.current.rotation.y = clock.getElapsedTime() * 0.2;
      }
    }
  });

  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.material.roughness = roughness;
      meshRef.current.material.metalness = metalness;
      meshRef.current.material.displacementScale = displacement;
    }
  }, [roughness, metalness, displacement]);

  const codeSnippet = `// 1. Setup PBR Material with Textures
const textureLoader = new THREE.TextureLoader();
const normalMap = textureLoader.load('path/to/normal.jpg');

const material = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  metalness: ${metalness},
  roughness: ${roughness},
  normalMap: normalMap,
  displacementMap: normalMap, // Usually a separate height map
  displacementScale: ${displacement}
});

// 2. High Resolution Geometry 
// Displacement requires enough vertices to move
const geometry = new THREE.IcosahedronGeometry(1.5, 64);
const mesh = new THREE.Mesh(geometry, material);`;

  return (
    <LessonLayout
      containerRef={containerRef}
      canvasRef={canvasRef}
      isReady={isReady}
      codeSnippet={codeSnippet}
      sidebar={
        <>
          <ControlPanel title="PBR Properties">
            <ControlGroup label="Roughness" valueDisplay={roughness.toFixed(2)}>
              <input type="range" min="0" max="1" step="0.01" value={roughness} onChange={(e) => setRoughness(parseFloat(e.target.value))} />
            </ControlGroup>
            <ControlGroup label="Metalness" valueDisplay={metalness.toFixed(2)}>
              <input type="range" min="0" max="1" step="0.01" value={metalness} onChange={(e) => setMetalness(parseFloat(e.target.value))} />
            </ControlGroup>
            <ControlGroup label="Displacement" valueDisplay={displacement.toFixed(2)}>
              <input type="range" min="0" max="1" step="0.01" value={displacement} onChange={(e) => setDisplacement(parseFloat(e.target.value))} />
            </ControlGroup>
          </ControlPanel>
          <ControlPanel title="Concept">
            <p style={{ fontSize: '0.8rem', color: '#888' }}>
              PBR (Physically Based Rendering) simulates real-world physics. Displacement maps move vertices to create real 3D depth, not just visual trickery.
            </p>
          </ControlPanel>
        </>
      }
    />
  );
}

export default PBRTexturesLesson;
