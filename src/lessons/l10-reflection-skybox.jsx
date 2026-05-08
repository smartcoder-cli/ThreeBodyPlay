import React, { useState, useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useThree } from '../hooks/useThree';
import { LessonLayout, ControlPanel, ControlGroup } from '../components/LessonLayout';

function ReflectionSkybox() {
  const [blur, setBlur] = useState(0);
  const meshRef = useRef(null);

  const { containerRef, canvasRef, isReady, scene } = useThree({
    onInit: ({ scene }) => {
      const loader = new THREE.CubeTextureLoader();
      loader.setPath('https://threejs.org/examples/textures/cube/Park2/');
      const texture = loader.load(['posx.jpg', 'negx.jpg', 'posy.jpg', 'negy.jpg', 'posz.jpg', 'negz.jpg']);
      
      scene.background = texture;
      scene.environment = texture;

      const geometry = new THREE.TorusKnotGeometry(1.2, 0.4, 128, 32);
      const material = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        metalness: 1,
        roughness: 0,
      });
      const mesh = new THREE.Mesh(geometry, material);
      meshRef.current = mesh;
      scene.add(mesh);
    },
    onAnimate: ({ clock }) => {
      if (meshRef.current) {
        meshRef.current.rotation.y = clock.getElapsedTime() * 0.5;
      }
    }
  });

  useEffect(() => {
    if (scene) scene.backgroundBlurriness = blur;
  }, [blur, scene]);

  const codeSnippet = `// 1. Load Cube Texture (Skybox)
const loader = new THREE.CubeTextureLoader();
loader.setPath('textures/cube/Park2/');
const texture = loader.load([
  'posx.jpg', 'negx.jpg', 
  'posy.jpg', 'negy.jpg', 
  'posz.jpg', 'negz.jpg'
]);

// 2. Set as Scene Background
scene.background = texture;
scene.backgroundBlurriness = ${blur};

// 3. Set as Environment for Reflections
scene.environment = texture;

// 4. Mesh with Reflective Material
const material = new THREE.MeshStandardMaterial({
  metalness: 1.0,
  roughness: 0.0, // Mirror-like
});`;

  return (
    <LessonLayout
      containerRef={containerRef}
      canvasRef={canvasRef}
      isReady={isReady}
      codeSnippet={codeSnippet}
      sidebar={
        <>
          <ControlPanel title="Environment">
            <ControlGroup label="Background Blur" valueDisplay={blur.toFixed(2)}>
              <input type="range" min="0" max="1" step="0.01" value={blur} onChange={(e) => setBlur(parseFloat(e.target.value))} />
            </ControlGroup>
          </ControlPanel>
          <ControlPanel title="Skybox Concept">
            <p style={{ fontSize: '0.8rem', color: '#888' }}>
              A Skybox is a cube that surrounds the scene. Using the same texture for environment lighting creates realistic reflections.
            </p>
          </ControlPanel>
        </>
      }
    />
  );
}

export default ReflectionSkybox;
